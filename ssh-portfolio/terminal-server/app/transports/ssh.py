"""SSH adapter (AsyncSSH). There is NO OS shell anywhere in this module.

SSH -> AsyncSSH -> TerminalCore.  No subprocess, no os.system, no shell=True.
Only the configured username (default: portfolio) may connect; no authentication is required,
but every other capability (forwarding, SFTP/SCP, agent/X11, subsystems) is refused.
"""
from __future__ import annotations

import asyncio
import os
import signal
from collections import defaultdict
from typing import Callable

import asyncssh

from app.config import Settings
from app.security import audit
from app.terminal.core import UNKNOWN_SSH_COMMAND, TerminalCore
from app.terminal.renderer import PlainRenderer, SSHRenderer
from app.terminal.state import Result, TerminalState

_ansi, _plain = SSHRenderer(), PlainRenderer()
CLEAR = "\x1b[2J\x1b[H"


# --------------------------------------------------------------------- line editor
class LineEditor:
    """Minimal readline: edit buffer, cursor keys, home/end, kill keys. Pure (no I/O) so it is testable.

    `feed()` returns a list of (action, payload) events:
    line | interrupt | eof | clear | tab | up | down
    """

    def __init__(self, max_len: int = 512) -> None:
        self.buf: list[str] = []
        self.pos = 0
        self.max_len = max_len
        self._esc = ""
        self._last_cr = False

    @property
    def text(self) -> str:
        return "".join(self.buf)

    def set_text(self, text: str) -> None:
        self.buf = list(text[: self.max_len])
        self.pos = len(self.buf)

    def reset(self) -> None:
        self.buf, self.pos, self._esc = [], 0, ""

    def _insert(self, ch: str) -> None:
        if len(self.buf) < self.max_len:
            self.buf.insert(self.pos, ch)
            self.pos += 1

    def _csi(self, seq: str) -> str | None:
        final = seq[-1]
        return {"A": "up", "B": "down"}.get(final) or {
            "C": "right", "D": "left", "H": "home", "F": "end"}.get(final) or {
            "3~": "delete", "1~": "home", "7~": "home", "4~": "end", "8~": "end"}.get(seq[2:] if seq[1] == "[" else "")

    def feed(self, data: str) -> list[tuple[str, str]]:
        events: list[tuple[str, str]] = []
        for ch in data:
            if self._esc:
                self._esc += ch
                if len(self._esc) == 2 and ch not in "[O":
                    self._esc = ""  # Alt+key: ignore
                elif len(self._esc) >= 3 and 0x40 <= ord(ch) <= 0x7E:
                    action = self._csi(self._esc)
                    self._esc = ""
                    if action in ("up", "down"):
                        events.append((action, ""))
                    elif action == "left":
                        self.pos = max(0, self.pos - 1)
                    elif action == "right":
                        self.pos = min(len(self.buf), self.pos + 1)
                    elif action == "home":
                        self.pos = 0
                    elif action == "end":
                        self.pos = len(self.buf)
                    elif action == "delete" and self.pos < len(self.buf):
                        del self.buf[self.pos]
                elif len(self._esc) > 8:
                    self._esc = ""
                continue
            if ch == "\n" and self._last_cr:
                self._last_cr = False
                continue
            self._last_cr = ch == "\r"
            if ch == "\x1b":
                self._esc = ch
            elif ch in "\r\n":
                events.append(("line", self.text))
                self.reset()
            elif ch == "\x03":
                self.reset()
                events.append(("interrupt", ""))
            elif ch == "\x04":
                if not self.buf:
                    events.append(("eof", ""))
                elif self.pos < len(self.buf):
                    del self.buf[self.pos]
            elif ch == "\x0c":
                events.append(("clear", ""))
            elif ch == "\t":
                events.append(("tab", ""))
            elif ch in "\x7f\x08":
                if self.pos > 0:
                    del self.buf[self.pos - 1]
                    self.pos -= 1
            elif ch == "\x01":
                self.pos = 0
            elif ch == "\x05":
                self.pos = len(self.buf)
            elif ch == "\x15":
                del self.buf[: self.pos]
                self.pos = 0
            elif ch == "\x0b":
                del self.buf[self.pos:]
            elif ch == "\x17":
                i = self.pos
                while i > 0 and self.buf[i - 1] == " ":
                    i -= 1
                while i > 0 and self.buf[i - 1] != " ":
                    i -= 1
                del self.buf[i:self.pos]
                self.pos = i
            elif ch >= " " and ch != "\x7f":
                self._insert(ch)
        return events

    def repaint(self, prompt_ansi: str) -> str:
        back = len(self.buf) - self.pos
        return "\r\x1b[2K" + prompt_ansi + self.text + (f"\x1b[{back}D" if back else "")


# --------------------------------------------------------------------- server
class SessionLimits:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.total = 0
        self.per_ip: dict[str, int] = defaultdict(int)

    def acquire(self, ip: str) -> bool:
        if self.total >= self.settings.max_ssh_sessions or self.per_ip[ip] >= self.settings.max_ssh_sessions_per_ip:
            return False
        self.total += 1
        self.per_ip[ip] += 1
        return True

    def release(self, ip: str) -> None:
        self.total = max(0, self.total - 1)
        self.per_ip[ip] = max(0, self.per_ip[ip] - 1)
        if not self.per_ip[ip]:
            self.per_ip.pop(ip, None)


class PortfolioSSHServer(asyncssh.SSHServer):
    """Connection policy. All forwarding is refused; only `allowed_user` may log in (without credentials)."""

    def __init__(self, allowed_user: str) -> None:
        self.allowed_user = allowed_user

    def begin_auth(self, username: str) -> bool:
        return username != self.allowed_user  # False => no auth needed; True => auth required (and impossible)

    # Every credential method is unsupported, so any other username can never log in.
    def password_auth_supported(self) -> bool:
        return False

    def public_key_auth_supported(self) -> bool:
        return False

    def kbdint_auth_supported(self) -> bool:
        return False

    def connection_requested(self, dest_host, dest_port, orig_host, orig_port):  # direct-tcpip (-L)
        return False

    def server_requested(self, listen_host, listen_port):  # tcpip-forward (-R)
        return False

    def unix_connection_requested(self, dest_path):
        return False

    def unix_server_requested(self, listen_path):
        return False


def _remote_ip(process: asyncssh.SSHServerProcess) -> str:
    peer = process.get_extra_info("peername")
    return peer[0] if peer else "-"


def make_process_handler(core: TerminalCore, settings: Settings, limits: SessionLimits):
    async def handle(process: asyncssh.SSHServerProcess) -> None:
        ip = _remote_ip(process)
        # Subsystems (sftp etc.) are never offered.
        if process.subsystem:
            process.stderr.write("Subsystems are not supported.\n")
            process.exit(1)
            return
        # `ssh host <command>`: read-only portfolio commands only; nothing is ever executed.
        if process.command is not None:
            state = core.new_state("ssh-exec", ip)
            result = core.run_public(process.command, state)
            if result.ok:
                process.stdout.write(_plain.render(result.lines))
                process.exit(0)
            else:
                process.stderr.write(UNKNOWN_SSH_COMMAND + "\n")
                process.exit(1)
            return
        if not limits.acquire(ip):
            process.stdout.write("Server is busy. Please try again later.\r\n")
            process.exit(1)
            return
        state = core.new_state("ssh", ip)
        audit.log_event("connect", connection_id=state.session_id, transport="ssh", remote_ip=ip)
        try:
            await _interactive(process, core, settings, state)
        except (asyncssh.Error, ConnectionError, asyncio.CancelledError, BrokenPipeError):
            pass
        except Exception:
            audit.log_event("ssh_error", connection_id=state.session_id, transport="ssh", remote_ip=ip)
        finally:
            limits.release(ip)
            audit.log_event("disconnect", connection_id=state.session_id, transport="ssh", remote_ip=ip)
            try:
                process.exit(0)
            except Exception:
                pass

    return handle


async def _interactive(process, core: TerminalCore, settings: Settings, state: TerminalState) -> None:
    pty = process.get_terminal_type() is not None
    w, h, _, _ = process.get_terminal_size()
    if w and h:
        state.terminal_size = (w, h)
    out = process.stdout
    render: Callable[[list], str] = (lambda lines: _ansi.render(lines)) if pty else (lambda lines: _plain.render(lines))
    show_prompt = (lambda: out.write(_ansi.prompt(state.prompt))) if pty else (lambda: out.write(state.prompt))

    out.write(render(core.banner(state)))
    show_prompt()
    editor = LineEditor(core.max_input_length(state))

    async def run_line(text: str) -> bool:
        """Returns False when the session should end."""
        if pty:
            out.write("\r\n")
        result: Result = await core.handle_line(state, text)
        if result.clear:
            out.write(CLEAR)
        if result.lines:
            out.write(render(result.lines))
        if result.exit:
            return False
        editor.max_len = core.max_input_length(state)
        show_prompt()
        return True

    while True:
        try:
            if pty:
                data = await asyncio.wait_for(process.stdin.read(1024), settings.idle_timeout_seconds)
            else:
                data = await asyncio.wait_for(process.stdin.readline(), settings.idle_timeout_seconds)
        except asyncssh.TerminalSizeChanged as exc:
            state.terminal_size = (exc.width, exc.height)
            continue
        except asyncio.TimeoutError:
            out.write("\r\nSession timed out.\r\n")
            return
        if not data:
            return
        if not pty:  # plain line mode (ssh -T / piped input)
            if not await run_line(data.rstrip("\r\n")):
                return
            continue
        for action, text in editor.feed(data):
            if action == "line":
                if not await run_line(text):
                    return
            elif action == "interrupt":
                out.write("^C\r\n")
                result = core.interrupt(state)
                if result.lines:
                    out.write(render(result.lines))
                editor.max_len = core.max_input_length(state)
                show_prompt()
            elif action == "eof":
                out.write("\r\nlogout\r\n")
                return
            elif action == "clear":
                out.write(CLEAR)
                show_prompt()
                out.write(editor.text)
            elif action == "up":
                prev = core.history_prev(state)
                if prev is not None:
                    editor.set_text(prev)
            elif action == "down":
                nxt = core.history_next(state)
                if nxt is not None:
                    editor.set_text(nxt)
            elif action == "tab":
                comp = core.complete(state, editor.text)
                if comp.matches:
                    out.write("\r\n" + "  ".join(comp.matches) + "\r\n")
                editor.set_text(comp.buffer)
                out.write(_ansi.prompt(state.prompt) + editor.text)
                continue
        out.write(editor.repaint(_ansi.prompt(state.prompt)))


# --------------------------------------------------------------------- bootstrap
def ensure_host_key(path: str) -> str:
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        key = asyncssh.generate_private_key("ssh-ed25519")
        key.write_private_key(path)
        os.chmod(path, 0o600)
    return path


async def start_ssh_server(core: TerminalCore, settings: Settings, port: int | None = None):
    limits = SessionLimits(settings)
    return await asyncssh.listen(
        settings.ssh_host,
        settings.ssh_port if port is None else port,
        server_factory=lambda: PortfolioSSHServer(settings.ssh_username),
        server_host_keys=[ensure_host_key(settings.ssh_host_key)],
        process_factory=make_process_handler(core, settings, limits),
        encoding="utf-8",
        line_editor=False,       # we run our own editor over the TerminalCore
        sftp_factory=None,
        allow_scp=False,
        agent_forwarding=False,
        x11_forwarding=False,
        login_timeout=30,
        keepalive_interval=30,
        keepalive_count_max=3,
    )


async def _main() -> None:
    from app.main import build_core
    from app.api.contact import ContactService
    from app.security.audit import configure_logging

    settings = Settings.from_env()
    configure_logging(settings.log_level)
    core = build_core(settings, ContactService(settings))
    server = await start_ssh_server(core, settings)
    audit.log_event("ssh_listening", host=settings.ssh_host, port=settings.ssh_port)
    stop = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop.set)
    await stop.wait()
    server.close()
    await server.wait_closed()


if __name__ == "__main__":
    asyncio.run(_main())
