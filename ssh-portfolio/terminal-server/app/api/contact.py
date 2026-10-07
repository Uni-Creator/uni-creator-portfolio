"""Contact delivery service + POST /api/contact (shared by terminal flow and HTTP)."""
from __future__ import annotations

import asyncio
import hashlib
import smtplib
import ssl
import time
from email.message import EmailMessage
from typing import Awaitable, Callable

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict

from app.config import Settings, parse_rate
from app.security import audit
from app.security.rate_limit import SlidingWindowLimiter
from app.security.validation import ContactValidationError, detect_spam, validate_contact


class ContactRateLimited(Exception):
    def __init__(self, retry_after: float) -> None:
        super().__init__("rate limited")
        self.retry_after = retry_after


class ContactUnavailable(Exception):
    """Delivery failed or is not configured. Message is internal only."""


class SpamRejected(Exception):
    pass


Deliverer = Callable[[Settings, str, str, str, str], Awaitable[None]]


async def _send_webhook(settings: Settings, name: str, email: str, message: str, source: str) -> None:
    text = f"New portfolio message ({source})\nFrom: {name} <{email}>\n\n{message}"
    fmt = settings.contact_webhook_format.lower()
    if fmt == "discord":
        payload = {"content": text[:1900]}
    elif fmt == "slack":
        payload = {"text": text}
    else:
        payload = {"name": name, "email": email, "message": message, "source": source}
    async with httpx.AsyncClient(timeout=settings.contact_timeout_seconds) as client:
        resp = await client.post(settings.contact_webhook_url, json=payload)
        resp.raise_for_status()


def _smtp_blocking(settings: Settings, name: str, email: str, message: str, source: str) -> None:
    msg = EmailMessage()
    safe_name = name.replace("\r", " ").replace("\n", " ")
    msg["Subject"] = f"Portfolio message from {safe_name}"[:200]
    msg["From"] = settings.smtp_username or settings.contact_to_email
    msg["To"] = settings.contact_to_email
    msg["Reply-To"] = email  # already validated: no CR/LF possible
    msg.set_content(f"Source: {source}\nName: {name}\nEmail: {email}\n\n{message}\n")
    timeout = settings.contact_timeout_seconds
    if settings.smtp_port == 465:
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=timeout,
                              context=ssl.create_default_context()) as s:
            if settings.smtp_username:
                s.login(settings.smtp_username, settings.smtp_password)
            s.send_message(msg)
    else:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=timeout) as s:
            s.starttls(context=ssl.create_default_context())
            if settings.smtp_username:
                s.login(settings.smtp_username, settings.smtp_password)
            s.send_message(msg)


async def default_deliver(settings: Settings, name: str, email: str, message: str, source: str) -> None:
    if settings.contact_webhook_url:
        await _send_webhook(settings, name, email, message, source)
    elif settings.smtp_host and settings.contact_to_email:
        await asyncio.to_thread(_smtp_blocking, settings, name, email, message, source)
    elif settings.contact_dry_run:
        audit.log_event("contact_dry_run", source=source)
    else:
        raise ContactUnavailable("no delivery backend configured")


class ContactService:
    def __init__(self, settings: Settings, deliver: Deliverer = default_deliver) -> None:
        self.settings, self._deliver = settings, deliver
        limit, window = parse_rate(settings.contact_rate_limit)
        self.limiter = SlidingWindowLimiter(limit, window)
        self._recent: dict[str, float] = {}  # sha256(ip|message) -> time, for duplicate suppression

    async def submit(self, name: str, email: str, message: str, *, remote_ip: str = "-", source: str = "http") -> None:
        clean = validate_contact(name, email, message, self.settings)  # raises ContactValidationError
        if reason := detect_spam(clean):
            audit.log_event("contact_rejected", transport=source, remote_ip=remote_ip, reason=reason)
            raise SpamRejected(reason)
        digest = hashlib.sha256(f"{remote_ip}|{clean.message}".encode()).hexdigest()
        now = time.monotonic()
        self._recent = {k: t for k, t in self._recent.items() if now - t < 3600}
        if digest in self._recent:
            raise SpamRejected("duplicate")
        if not self.limiter.allow(remote_ip):
            audit.log_event("contact_rate_limited", transport=source, remote_ip=remote_ip)
            raise ContactRateLimited(self.limiter.retry_after(remote_ip))
        start = time.perf_counter()
        try:
            await asyncio.wait_for(self._deliver(self.settings, clean.name, clean.email, clean.message, source),
                                   timeout=self.settings.contact_timeout_seconds)
        except Exception as exc:
            self.limiter.release(remote_ip)  # our failure should not burn the visitor's quota
            audit.log_event("contact_failed", transport=source, remote_ip=remote_ip, error=type(exc).__name__,
                            duration_ms=round((time.perf_counter() - start) * 1000, 2))
            raise ContactUnavailable(type(exc).__name__) from exc
        self._recent[digest] = now
        audit.log_event("contact_sent", transport=source, remote_ip=remote_ip,
                        duration_ms=round((time.perf_counter() - start) * 1000, 2))


# ---------------------------------------------------------------- HTTP API
router = APIRouter()


class ContactBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    email: str
    message: str


def _resp(status: int, success: bool, message: str, **extra) -> JSONResponse:
    return JSONResponse({"success": success, "message": message, **extra}, status_code=status)


@router.post("/api/contact")
async def post_contact(body: ContactBody, request: Request):
    from app.main import client_ip  # lazy to avoid import cycle

    service: ContactService = request.app.state.contact_service
    ip = client_ip(request, request.app.state.settings.trust_proxy)
    try:
        await service.submit(body.name, body.email, body.message, remote_ip=ip, source="http")
    except ContactValidationError as exc:
        return _resp(422, False, "Validation failed", errors=exc.errors)
    except SpamRejected:
        return _resp(400, False, "Message rejected")
    except ContactRateLimited as exc:
        resp = _resp(429, False, "Too many messages. Please try again later.")
        resp.headers["Retry-After"] = str(int(exc.retry_after) + 1)
        return resp
    except ContactUnavailable:
        return _resp(503, False, "Unable to send your message right now.")
    return _resp(200, True, "Message sent successfully")
