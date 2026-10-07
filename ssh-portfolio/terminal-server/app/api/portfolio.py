"""Read-only portfolio JSON + plain-text endpoints for curl."""
from __future__ import annotations

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, PlainTextResponse

from app.security.rate_limit import SlidingWindowLimiter
from app.terminal.renderer import PlainRenderer

router = APIRouter()
_http_limiter = SlidingWindowLimiter(60, 60)  # 60 curl requests / minute / IP


def _text(body: str, status: int = 200) -> PlainTextResponse:
    return PlainTextResponse(body, status_code=status, headers={"Cache-Control": "no-store"})


@router.get("/api/portfolio")
async def portfolio_json(request: Request):
    raw = request.app.state.core.data.raw
    return JSONResponse({k: raw.get(k) for k in ("profile", "projects", "about", "skills", "experience", "education")})


@router.get("/terminal/")
@router.get("/terminal/{command}")
@router.get("/terminal/{command}/{arg:path}")
async def curl_command(request: Request, command: str = "help", arg: str = ""):
    from app.main import client_ip

    core = request.app.state.core
    ip = client_ip(request, request.app.state.settings.trust_proxy)
    if not _http_limiter.allow(ip):
        return _text("Too many requests.\n", 429)
    state = core.new_state("http", ip, size=(80, 24))
    result = core.run_public(f"{command} {arg}".strip(), state, style="box")
    body = PlainRenderer().render(result.lines)
    return _text(body, 200 if result.ok else 404)
