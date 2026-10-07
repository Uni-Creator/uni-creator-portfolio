import asyncio
import os

import asyncssh
import pytest

from app.config import Settings
from app.main import build_core
from app.api.contact import ContactService
from app.transports.ssh import LineEditor, start_ssh_server
from tests.conftest import DATA, Sink


@pytest.fixture
async def server(tmp_path):
    sink = Sink()
    settings = Settings(portfolio_data_path=DATA, ssh_host="127.0.0.1", ssh_host_key=str(tmp_path / "hk"),
                        contact_dry_run=True, max_ssh_sessions=2, max_ssh_sessions_per_ip=2,
                        idle_timeout_seconds=30)
    core = build_core(settings, ContactService(settings, sink))
    srv = await start_ssh_server(core, settings, port=0)
    srv.sink = sink
    srv.port = srv.sockets[0].getsockname()[1]
    yield srv
    srv.close()
    await srv.wait_closed()


def connect(server, user="portfolio"):
    return asyncssh.connect("127.0.0.1", server.port, username=user, known_hosts=None, client_keys=None)


async def read_until(proc, needle, timeout=3):
    buf = ""
    async def _go():
        nonlocal buf
        while needle not in buf:
            chunk = await proc.stdout.read(4096)
            if not chunk:
                break
            buf += chunk
    await asyncio.wait_for(_go(), timeout)
    return buf


async def test_connection_and_host_key_created(server, tmp_path):
    async with connect(server) as conn:
        assert conn is not None
    assert os.path.exists(tmp_path / "hk") and oct(os.stat(tmp_path / "hk").st_mode)[-3:] == "600"


async def test_interactive_shell_banner_and_command(server):
    async with connect(server) as conn:
        proc = await conn.create_process(term_type="xterm", term_size=(100, 30))
        banner = await read_until(proc, "portfolio")
        assert "ABHAY SINGH" in banner and "\x1b[" in banner  # ANSI colours over SSH
        proc.stdin.write("projects\r")
        out = await read_until(proc, "NeuralDrive")
        assert "PROJECTS" in out
        proc.stdin.write("exit\r")
        assert "Goodbye" in await read_until(proc, "Goodbye")
        await proc.wait_closed()


async def test_interactive_contact_flow(server):
    async with connect(server) as conn:
        proc = await conn.create_process(term_type="xterm")
        await read_until(proc, "$ ")
        for line, expect in (("contact", "Name: "), ("Ada", "Email: "), ("ada@example.com", "Message: "),
                             ("hi from ssh", "Send message?"), ("y", "sent successfully")):
            proc.stdin.write(line + "\r")
            await read_until(proc, expect)
        assert server.sink.sent and server.sink.sent[0][3] == "ssh"


async def test_unknown_interactive_command_is_not_executed(server):
    async with connect(server) as conn:
        proc = await conn.create_process(term_type="xterm")
        await read_until(proc, "$ ")
        proc.stdin.write("cat /etc/passwd\r")
        out = await read_until(proc, "not a Linux shell")
        assert "root:" not in out


async def test_non_pty_line_mode(server):
    async with connect(server) as conn:
        proc = await conn.create_process()  # no pty (ssh -T)
        proc.stdin.write("whoami\nexit\n")
        proc.stdin.write_eof()
        out = await asyncio.wait_for(proc.stdout.read(), 3)
        assert "portfolio" in out and "\x1b[" not in out


async def test_exec_known_command(server):
    async with connect(server) as conn:
        r = await conn.run("skills")
        assert r.exit_status == 0 and "SKILLS" in r.stdout


@pytest.mark.parametrize("cmd", ["rm -rf /", "bash", "sh -c id", "cat /etc/passwd", "python3 -c 'print(1)'"])
async def test_exec_unknown_command_rejected(server, cmd):
    async with connect(server) as conn:
        r = await conn.run(cmd)
        assert r.exit_status == 1 and r.stderr.strip() == "Unknown portfolio command."
        assert r.stdout == ""


async def test_exec_does_not_expose_interactive_only_commands(server):
    async with connect(server) as conn:
        for cmd in ("contact", "exit", "history"):
            assert (await conn.run(cmd)).exit_status == 1


async def test_wrong_username_rejected(server):
    with pytest.raises(asyncssh.PermissionDenied):
        await connect(server, user="root")
    with pytest.raises(asyncssh.PermissionDenied):
        await connect(server, user="admin")


async def test_port_forwarding_rejected(server):
    async with connect(server) as conn:
        with pytest.raises(asyncssh.ChannelOpenError):
            await conn.open_connection("example.com", 80)  # direct-tcpip (ssh -L)
        with pytest.raises(Exception):
            await conn.forward_remote_port("", 0, "localhost", 80)  # tcpip-forward (ssh -R)


async def test_sftp_scp_and_subsystems_rejected(server):
    async with connect(server) as conn:
        with pytest.raises(asyncssh.ChannelOpenError):
            await conn.start_sftp_client()
        with pytest.raises(asyncssh.ChannelOpenError):
            await conn.create_process(subsystem="sftp")
        try:  # unknown subsystems either fail to open or are closed immediately by our handler
            proc = await conn.create_process(subsystem="netconf")
            res = await asyncio.wait_for(proc.wait(), 3)
            assert res.exit_status == 1 and "not supported" in res.stderr and res.stdout == ""
        except asyncssh.ChannelOpenError:
            pass
    async with connect(server) as conn:
        with pytest.raises(Exception):
            await asyncssh.scp((conn, "/etc/passwd"), "/tmp/pwned")


async def test_unix_socket_forwarding_rejected(server):
    async with connect(server) as conn:
        with pytest.raises(asyncssh.ChannelOpenError):
            await conn.open_unix_connection("/var/run/docker.sock")


async def test_session_limit(server):
    async with connect(server) as c1, connect(server) as c2:
        p1 = await c1.create_process(term_type="xterm")
        p2 = await c2.create_process(term_type="xterm")
        await read_until(p1, "$ ")
        await read_until(p2, "$ ")
        async with connect(server) as c3:
            p3 = await c3.create_process(term_type="xterm")
            assert "busy" in await asyncio.wait_for(p3.stdout.read(), 3)


async def test_terminal_resize_does_not_break_session(server):
    async with connect(server) as conn:
        proc = await conn.create_process(term_type="xterm", term_size=(100, 30))
        await read_until(proc, "$ ")
        proc.change_terminal_size(50, 20)
        await asyncio.sleep(0.2)
        proc.stdin.write("whoami\r")
        assert "portfolio" in await read_until(proc, "portfolio\r\n")


async def test_disconnect_releases_slot(server):
    for _ in range(4):  # more connections than max_ssh_sessions=2, sequentially
        async with connect(server) as conn:
            proc = await conn.create_process(term_type="xterm")
            await read_until(proc, "$ ")
        await asyncio.sleep(0.1)


# ---------------------------------------------------------------- line editor (pure)
def test_editor_basic_editing():
    e = LineEditor()
    assert e.feed("helo") == []
    e.feed("\x1b[D")      # left
    e.feed("l")
    assert e.text == "hello"
    assert e.feed("\r") == [("line", "hello")] and e.text == ""


def test_editor_keys():
    e = LineEditor()
    e.feed("abc\x7f")
    assert e.text == "ab"
    e.feed("\x1b[H")      # home
    e.feed("X")
    assert e.text == "Xab"
    e.feed("\x1b[F")      # end
    e.feed("Y")
    assert e.text == "XabY"
    e.feed("\x1b[H\x1b[3~")  # delete
    assert e.text == "abY"
    e.feed("\x15")        # ctrl-u from end? cursor at start -> nothing removed before it
    assert e.text == "abY"
    e.feed("\x1b[F\x15")
    assert e.text == ""


def test_editor_events_and_split_escape_sequences():
    e = LineEditor()
    assert e.feed("\x1b") == [] and e.feed("[") == [] and e.feed("A") == [("up", "")]
    assert e.feed("\t") == [("tab", "")]
    assert e.feed("\x0c") == [("clear", "")]
    e.feed("abc")
    assert e.feed("\x03") == [("interrupt", "")] and e.text == ""
    assert e.feed("\x04") == [("eof", "")]
    e.feed("x")
    assert e.feed("\x04") == []  # ctrl-d with text does not exit


def test_editor_crlf_counts_once_and_max_len():
    e = LineEditor(max_len=5)
    assert e.feed("hi\r\n") == [("line", "hi")]
    e.feed("abcdefgh")
    assert e.text == "abcde"


def test_editor_ignores_alt_keys_and_unknown_sequences():
    e = LineEditor()
    e.feed("\x1bf")
    e.feed("\x1b[99;99Z")
    assert e.text == ""
