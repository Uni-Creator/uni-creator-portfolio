"""FastAPI application: WebSocket terminal, contact API, plain-text curl endpoints."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse, PlainTextResponse

from app.api import contact as contact_api
from app.api import portfolio as portfolio_api
from app.config import Settings
from app.data import load_portfolio
from app.security.audit import configure_logging
from app.terminal.core import TerminalCore
from app.transports import websocket as ws_transport

MAX_BODY_BYTES = 16 * 1024


def client_ip(conn: Request | WebSocket, trust_proxy: bool) -> str:
    """Remote address. X-Forwarded-For is honoured ONLY when TRUST_PROXY=true (i.e. behind your Nginx)."""
    if trust_proxy:
        fwd = conn.headers.get("x-real-ip") or conn.headers.get("x-forwarded-for", "").split(",")[0].strip()
        if fwd:
            return fwd[:64]
    return conn.client.host if conn.client else "-"


def build_core(settings: Settings, service: contact_api.ContactService) -> TerminalCore:
    return TerminalCore(load_portfolio(settings.portfolio_data_path), settings, service.submit)


def create_app(settings: Settings | None = None, deliver=None) -> FastAPI:
    settings = settings or Settings.from_env()
    configure_logging(settings.log_level)
    service = contact_api.ContactService(settings, deliver) if deliver else contact_api.ContactService(settings)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        yield

    app = FastAPI(title="Portfolio Terminal", docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan)
    app.state.settings = settings
    app.state.contact_service = service
    app.state.core = build_core(settings, service)
    app.state.ws_sessions = 0

    @app.middleware("http")
    async def limit_body(request: Request, call_next):
        length = request.headers.get("content-length")
        if length and length.isdigit() and int(length) > MAX_BODY_BYTES:
            return JSONResponse({"success": False, "message": "Request too large"}, status_code=413)
        return await call_next(request)

    @app.exception_handler(Exception)
    async def hide_errors(request: Request, exc: Exception):  # no stack traces to clients
        return JSONResponse({"success": False, "message": "Internal error"}, status_code=500)

    @app.get("/healthz")
    async def healthz():
        return {"ok": True, "ws_sessions": app.state.ws_sessions}

    app.include_router(contact_api.router)
    app.include_router(portfolio_api.router)
    ws_transport.register(app)
    return app


app = create_app()


if __name__ == "__main__":  # python -m app.main  (dev convenience; production uses uvicorn via systemd/Docker)
    import uvicorn

    uvicorn.run(app, host=app.state.settings.terminal_host, port=app.state.settings.terminal_port)
