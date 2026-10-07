import json

import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app.config import Settings
from app.main import create_app
from tests.conftest import DATA, Sink


def drain_until(ws, kind):
    while True:
        msg = ws.receive_json()
        if msg["type"] == kind:
            return msg


def test_connect_ready_and_banner(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        assert ws.receive_json()["type"] == "ready"
        out = ws.receive_json()
        assert out["type"] == "output" and "ABHAY SINGH" in out["data"]
        prompt = ws.receive_json()
        assert prompt == {"type": "prompt", "data": "portfolio@abhay:~$ ", "mode": "command"}


def test_command_output_is_structured(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        drain_until(ws, "prompt")
        ws.send_json({"type": "input", "data": "projects"})
        msg = ws.receive_json()
        assert msg["type"] == "output" and "PROJECTS" in msg["data"]
        spans = [s for line in msg["lines"] for s in line]
        assert all(set(s) == {"t", "s"} for s in spans)
        assert ws.receive_json()["type"] == "prompt"


def test_unknown_and_attack_commands(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        drain_until(ws, "prompt")
        for cmd in ("rm -rf /", "bash", "cat /etc/passwd"):
            ws.send_json({"type": "input", "data": cmd})
            assert "not a Linux shell" in ws.receive_json()["data"]
            drain_until(ws, "prompt")


def test_clear_exit_and_complete(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        drain_until(ws, "prompt")
        ws.send_json({"type": "complete", "data": "p"})
        assert ws.receive_json() == {"type": "complete", "completion": "project", "matches": ["projects", "project"]}
        ws.send_json({"type": "input", "data": "clear"})
        assert ws.receive_json()["type"] == "clear"
        drain_until(ws, "prompt")
        ws.send_json({"type": "input", "data": "exit"})
        drain_until(ws, "exit")


def test_contact_flow_over_websocket(app, sink):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        drain_until(ws, "prompt")
        ws.send_json({"type": "input", "data": "contact"})
        assert drain_until(ws, "prompt")["mode"] == "contact"
        for line in ("Ada", "ada@example.com", "hello from the browser", "y"):
            ws.send_json({"type": "input", "data": line})
            last = drain_until(ws, "prompt")
        assert last["mode"] == "command" and sink.sent[0][0] == "Ada"


def test_interrupt_cancels_contact(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        drain_until(ws, "prompt")
        ws.send_json({"type": "input", "data": "contact"})
        drain_until(ws, "prompt")
        ws.send_json({"type": "interrupt"})
        assert drain_until(ws, "prompt")["mode"] == "command"


def test_resize_sets_banner_width(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "resize", "cols": 40, "rows": 20})
        ws.send_json({"type": "ready"})
        ws.receive_json()
        assert "╔" not in ws.receive_json()["data"]


def test_input_before_ready_is_refused(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "input", "data": "help"})
        assert ws.receive_json()["type"] == "error"


@pytest.mark.parametrize("raw", ["not json", "[]", '{"type":5}', '{"nope":1}', '{"type":"bogus"}'])
def test_invalid_messages_get_errors_not_crashes(app, raw):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        drain_until(ws, "prompt")
        ws.send_text(raw)
        assert ws.receive_json()["type"] == "error"
        ws.send_json({"type": "input", "data": "whoami"})
        assert "portfolio" in ws.receive_json()["data"]


def test_repeated_invalid_messages_close_connection(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        with pytest.raises(WebSocketDisconnect):
            for _ in range(10):
                ws.send_text("garbage")
                ws.receive_json()
            ws.receive_json()


def test_oversized_message_closes(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_text(json.dumps({"type": "input", "data": "x" * 20000}))
        assert ws.receive_json()["type"] == "error"
        with pytest.raises(WebSocketDisconnect) as exc:
            ws.receive_json()
        assert exc.value.code == 1009


def test_binary_frames_rejected(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_bytes(b"\x00\x01")
        assert ws.receive_json()["type"] == "error"


def test_command_rate_limit():
    app = create_app(Settings(portfolio_data_path=DATA, command_rate_limit="3/minute", contact_dry_run=True), Sink())
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        drain_until(ws, "prompt")
        seen = []
        for _ in range(5):
            ws.send_json({"type": "input", "data": "whoami"})
            seen.append(ws.receive_json()["data"].strip())
            ws.receive_json()
        assert "Slow down." in seen


def test_origin_allowlist():
    app = create_app(Settings(portfolio_data_path=DATA, allowed_origins=("https://me.dev",)), Sink())
    c = TestClient(app)
    with pytest.raises(WebSocketDisconnect):
        with c.websocket_connect("/ws/terminal", headers={"origin": "https://evil.example"}):
            pass
    with c.websocket_connect("/ws/terminal", headers={"origin": "https://me.dev"}) as ws:
        ws.send_json({"type": "ready"})
        assert ws.receive_json()["type"] == "ready"


def test_capacity_limit_and_counter_released():
    app = create_app(Settings(portfolio_data_path=DATA, max_ws_sessions=1), Sink())
    c = TestClient(app)
    with c.websocket_connect("/ws/terminal") as first:
        first.send_json({"type": "ready"})
        first.receive_json()
        with pytest.raises(WebSocketDisconnect) as exc:
            with c.websocket_connect("/ws/terminal"):
                pass
        assert exc.value.code == 1013
    assert app.state.ws_sessions == 0
    with c.websocket_connect("/ws/terminal") as ws:  # slot freed after disconnect
        ws.send_json({"type": "ready"})
        assert ws.receive_json()["type"] == "ready"


def test_disconnect_releases_session(app):
    with TestClient(app).websocket_connect("/ws/terminal") as ws:
        ws.send_json({"type": "ready"})
        ws.receive_json()
    assert app.state.ws_sessions == 0
