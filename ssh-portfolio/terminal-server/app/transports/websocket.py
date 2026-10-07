"""Browser adapter. JSON protocol over WebSocket; all logic lives in TerminalCore.

client -> server                         server -> client
  {"type":"ready"}                         {"type":"ready","session_id":..}
  {"type":"input","data":"projects"}       {"type":"output","data":"<plain>","lines":[[{"t","s"}]]}
  {"type":"resize","cols":120,"rows":30}   {"type":"prompt","data":"portfolio@abhay:~$ ","mode":"command|contact"}
  {"type":"complete","data":"pro"}         {"type":"complete","completion":"project","matches":[..]}
  {"type":"interrupt"}                     {"type":"clear"} | {"type":"exit"} | {"type":"error","data":".."}
"""
from __future__ import annotations

import asyncio
import json
from urllib.parse import urlparse

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from app.config import parse_rate
from app.security import audit
from app.security.rate_limit import SlidingWindowLimiter
from app.terminal.renderer import PlainRenderer, WebRenderer
from app.terminal.state import Result

_web, _plain = WebRenderer(), PlainRenderer()
MAX_INVALID = 5


def _origin_ok(ws: WebSocket, allowed: tuple[str, ...]) -> bool:
    if not allowed:
        return True
    origin = ws.headers.get("origin", "")
    if not origin:
        return False
    return origin.rstrip("/") in {a.rstrip("/") for a in allowed}


async def _send(ws: WebSocket, **msg) -> None:
    await ws.send_text(json.dumps(msg, ensure_ascii=False))


async def _send_result(ws: WebSocket, state, result: Result) -> None:
    if result.clear:
        await _send(ws, type="clear")
    if result.lines:
        await _send(ws, type="output", data=_plain.render(result.lines), lines=_web.render(result.lines))
    if result.exit:
        await _send(ws, type="exit")
    else:
        await _send(ws, type="prompt", data=state.prompt, mode=state.mode)


def register(app: FastAPI) -> None:
    settings = app.state.settings
    limit, window = parse_rate(settings.command_rate_limit)

    @app.websocket(settings.terminal_ws_path)
    async def terminal_ws(ws: WebSocket) -> None:
        from app.main import client_ip

        core = app.state.core
        ip = client_ip(ws, settings.trust_proxy)
        if not _origin_ok(ws, settings.allowed_origins):
            await ws.close(code=1008)
            audit.log_event("ws_rejected", transport="websocket", remote_ip=ip, reason="origin")
            return
        if app.state.ws_sessions >= settings.max_ws_sessions:
            await ws.close(code=1013)  # try again later
            audit.log_event("ws_rejected", transport="websocket", remote_ip=ip, reason="capacity")
            return
        await ws.accept()
        app.state.ws_sessions += 1
        state = core.new_state("websocket", ip)
        limiter = SlidingWindowLimiter(limit, window)
        ready, invalid = False, 0
        audit.log_event("connect", connection_id=state.session_id, transport="websocket", remote_ip=ip)
        try:
            while True:
                try:
                    msg = await asyncio.wait_for(ws.receive(), settings.idle_timeout_seconds)
                except asyncio.TimeoutError:
                    await _send(ws, type="error", data="Session timed out.")
                    await ws.close(code=1000)
                    break
                if msg["type"] == "websocket.disconnect":
                    break
                text = msg.get("text")
                if text is None:
                    await _send(ws, type="error", data="Binary frames are not supported.")
                    invalid += 1
                elif len(text.encode("utf-8", "ignore")) > settings.ws_max_message_bytes:
                    await _send(ws, type="error", data="Message too large.")
                    await ws.close(code=1009)
                    break
                else:
                    try:
                        payload = json.loads(text)
                        if not isinstance(payload, dict) or not isinstance(payload.get("type"), str):
                            raise ValueError
                    except ValueError:
                        await _send(ws, type="error", data="Invalid message.")
                        invalid += 1
                        payload = None
                    if payload is not None:
                        kind = payload["type"]
                        if kind == "ready":
                            ready = True
                            await _send(ws, type="ready", session_id=state.session_id)
                            await _send_result(ws, state, Result(core.banner(state)))
                        elif kind == "resize":
                            cols, rows = payload.get("cols"), payload.get("rows")
                            if isinstance(cols, int) and isinstance(rows, int) and 10 <= cols <= 500 and 3 <= rows <= 200:
                                state.terminal_size = (cols, rows)
                        elif not ready:
                            await _send(ws, type="error", data="Send 'ready' first.")
                            invalid += 1
                        elif kind == "input":
                            data = payload.get("data")
                            if not isinstance(data, str):
                                await _send(ws, type="error", data="Invalid input.")
                                invalid += 1
                            elif not limiter.allow(state.session_id):
                                await _send(ws, type="output", data="Slow down.\n",
                                            lines=[[{"t": "Slow down.", "s": "warn"}]])
                                await _send(ws, type="prompt", data=state.prompt, mode=state.mode)
                            else:
                                await _send_result(ws, state, await core.handle_line(state, data))
                        elif kind == "complete":
                            data = payload.get("data")
                            comp = core.complete(state, data if isinstance(data, str) else "")
                            await _send(ws, type="complete", completion=comp.buffer, matches=comp.matches)
                        elif kind == "interrupt":
                            await _send_result(ws, state, core.interrupt(state))
                        else:
                            await _send(ws, type="error", data="Unknown message type.")
                            invalid += 1
                if invalid >= MAX_INVALID:
                    await ws.close(code=1008)
                    break
        except WebSocketDisconnect:
            pass
        except Exception:  # never leak internals to the client
            audit.log_event("ws_error", connection_id=state.session_id, transport="websocket", remote_ip=ip)
            try:
                await ws.close(code=1011)
            except Exception:
                pass
        finally:
            app.state.ws_sessions -= 1
            audit.log_event("disconnect", connection_id=state.session_id, transport="websocket", remote_ip=ip)
