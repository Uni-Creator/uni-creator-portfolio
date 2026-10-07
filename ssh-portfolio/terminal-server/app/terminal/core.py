"""Terminal core: the ONE place where portfolio commands are interpreted.

SSH, WebSocket and HTTP/curl are thin adapters around this class. It never executes OS commands,
never touches the filesystem and knows nothing about transports.
"""
from __future__ import annotations

import dataclasses
import time
from dataclasses import dataclass
from typing import Callable

from app.config import Settings
from app.data import PortfolioData, slugify
from app.security import audit
from app.terminal.commands import Command, Context, build_registry
from app.terminal.contact import ContactFlow, Submitter
from app.terminal.parser import ParsedCommand, parse_command
from app.terminal.renderer import BLANK, L, Line, box, rule, sanitize
from app.terminal.state import Result, TerminalState

MAX_HISTORY = 200
MAX_COMMAND_INPUT = 512
UNKNOWN_SSH_COMMAND = "Unknown portfolio command."


@dataclass
class Completion:
    buffer: str
    matches: list[str]


class TerminalCore:
    def __init__(self, data: PortfolioData, settings: Settings, submit: Submitter,
                 log: Callable[..., object] = audit.log_event) -> None:
        self.data, self.settings, self._log = data, settings, log
        self.contact = ContactFlow(settings, data, submit)
        self.registry: dict[str, Command] = build_registry()
        self.registry["contact"] = dataclasses.replace(
            self.registry["contact"], handler=lambda ctx: self.contact.start(ctx.state))

    # -- sessions ---------------------------------------------------------
    def new_state(self, transport: str, remote_ip: str = "-", size: tuple[int, int] = (80, 24)) -> TerminalState:
        return TerminalState(transport=transport, remote_ip=remote_ip, terminal_size=size)

    def max_input_length(self, state: TerminalState) -> int:
        if state.contact_state and state.contact_state.step == "message":
            return self.settings.contact_max_message_length + 64  # let validation report "too long"
        return MAX_COMMAND_INPUT

    @staticmethod
    def _width(state: TerminalState) -> int:
        return max(40, min(state.terminal_size[0], 78)) - 2

    # -- banner -------------------------------------------------------------
    def banner(self, state: TerminalState) -> list[Line]:
        d, cols = self.data, state.terminal_size[0]
        welcome = "Welcome to my interactive terminal portfolio."
        hint = ("Type ", ("help", "accent"), " to see available commands.")
        if cols < 72:
            return [BLANK, L((d.name, "heading")), L((d.headline, "accent")), L((d.tagline, "muted")), BLANK,
                    L(welcome), L(*hint), BLANK]
        w, inner = 70, 68
        line = lambda text="", style="plain": L(("║", "heading"), (text.center(inner), style), ("║", "heading"))
        return [
            L(("╔" + "═" * inner + "╗", "heading")), line(),
            line(d.name, "heading"), line(), line(d.headline, "accent"), line(), line(d.tagline, "muted"), line(),
            L(("╠" + "═" * inner + "╣", "heading")), line(),
            L(("║", "heading"), ("  " + welcome).ljust(inner), ("║", "heading")),
            L(("║", "heading"), "  ", *hint, " " * (inner - 2 - sum(len(s) if isinstance(s, str) else len(s[0]) for s in hint)),
              ("║", "heading")),
            line(), L(("╚" + "═" * inner + "╝", "heading")), BLANK,
        ]

    # -- command handling -------------------------------------------------------
    def _with_title(self, result: Result, state: TerminalState, style: str = "rule") -> Result:
        if result.title:
            width = self._width(state)
            if style == "box":
                head = box([result.title], min(width, 60), "heading") + [BLANK]
            else:
                head = [BLANK, L((result.title, "heading")), rule(min(width, 56)), BLANK]
            result = dataclasses.replace(result, lines=head + list(result.lines), title="")
        return result

    def _unknown(self, name: str) -> Result:
        shown = sanitize(name)[:40]
        return Result([L((f"Command not found: {shown}", "error")), BLANK,
                       L("This is a portfolio terminal, not a Linux shell."),
                       L("Type ", ("`help`", "accent"), " to see available commands."), BLANK], ok=False)

    def _run(self, parsed: ParsedCommand, state: TerminalState, public_only: bool = False) -> Result:
        if parsed.error:
            return Result([L((parsed.error, "error"))], ok=False)
        cmd = self.registry.get(parsed.name)
        if cmd is None or (public_only and not cmd.public):
            return self._unknown(parsed.name)
        ctx = Context(state, self.data, parsed.args, self._width(state), self.registry)
        return cmd.handler(ctx)

    async def handle_line(self, state: TerminalState, line: str) -> Result:
        start = time.perf_counter()
        if state.contact_state:
            step = state.contact_state.step
            result = await self.contact.step(state, line)
            label, ok = f"contact:{step}", result.ok
        else:
            if len(line) > MAX_COMMAND_INPUT:
                line = line[:MAX_COMMAND_INPUT + 1]
            parsed = parse_command(line)
            if parsed.empty:
                return Result()
            if parsed.raw and not parsed.error:
                state.history.append(parsed.raw)
                del state.history[:-MAX_HISTORY]
            state.history_index = len(state.history)
            result = self._with_title(self._run(parsed, state), state)
            label = parsed.name if parsed.name in self.registry else "unknown"
            ok = result.ok
        self._log("command", connection_id=state.session_id, transport=state.transport,
                  remote_ip=state.remote_ip, command=label, ok=ok,
                  duration_ms=round((time.perf_counter() - start) * 1000, 2))
        return result

    def run_public(self, line: str, state: TerminalState | None = None, style: str = "rule") -> Result:
        """Non-interactive execution (curl, `ssh host <cmd>`): read-only commands only."""
        state = state or self.new_state("http")
        start = time.perf_counter()
        parsed = parse_command(line)
        result = self._with_title(self._run(parsed, state, public_only=True), state, style)
        self._log("command", connection_id=state.session_id, transport=state.transport, remote_ip=state.remote_ip,
                  command=parsed.name if parsed.name in self.registry else "unknown", ok=result.ok,
                  duration_ms=round((time.perf_counter() - start) * 1000, 2), mode="public")
        return result

    def interrupt(self, state: TerminalState) -> Result:
        return self.contact.interrupt(state)

    # -- history navigation (used by the SSH line editor) ---------------------
    def history_prev(self, state: TerminalState) -> str | None:
        if state.contact_state or not state.history:
            return None
        state.history_index = max(0, state.history_index - 1)
        return state.history[state.history_index]

    def history_next(self, state: TerminalState) -> str | None:
        if state.contact_state:
            return None
        if state.history_index >= len(state.history) - 1:
            state.history_index = len(state.history)
            return ""
        state.history_index += 1
        return state.history[state.history_index]

    # -- tab completion --------------------------------------------------------
    def complete(self, state: TerminalState, buffer: str) -> Completion:
        if state.contact_state:
            return Completion(buffer, [])
        head, sep, rest = buffer.lstrip().partition(" ")
        if not sep:  # completing the command name
            if not head:
                return Completion(buffer, [])
            matches = [n for n in self.registry if n.startswith(head.lower())]
            return self._finish(buffer, "", head, matches, " ")
        if head.lower() != "project":
            return Completion(buffer, [])
        typed = rest.lstrip()
        pre = slugify(typed)
        matches = [p.cli_name for p in self.data.projects if slugify(p.cli_name).startswith(pre)]
        return self._finish(buffer, head + " ", typed, matches, "")

    @staticmethod
    def _finish(original: str, lead: str, typed: str, matches: list[str], suffix: str) -> Completion:
        if not matches:
            return Completion(original, [])
        if len(matches) == 1:
            return Completion(lead + matches[0] + suffix, [])
        common = _common_prefix(matches)
        return Completion(lead + (common if len(common) > len(typed) else typed), matches)


def _common_prefix(items: list[str]) -> str:
    first = items[0]
    n = 0
    while n < len(first) and all(len(i) > n and i[n].lower() == first[n].lower() for i in items):
        n += 1
    return first[:n]
