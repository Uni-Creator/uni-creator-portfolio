"""Structured JSON audit logging. Sensitive keys are dropped, never logged."""
from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any

FORBIDDEN_KEYS = frozenset({
    "email", "message", "password", "smtp_password", "token", "cookie", "cookies",
    "authorization", "secret", "webhook_url", "body", "name",
})

_logger = logging.getLogger("portfolio.audit")


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = getattr(record, "audit", None)
        if payload is None:
            payload = {"timestamp": datetime.now(timezone.utc).isoformat(), "event": "log",
                       "level": record.levelname, "msg": record.getMessage()}
        return json.dumps(payload, default=str, separators=(",", ":"))


def configure_logging(level: str = "INFO") -> None:
    if not _logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JsonFormatter())
        _logger.addHandler(handler)
        _logger.propagate = False
    _logger.setLevel(level.upper())


def clean_fields(fields: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in fields.items() if k.lower() not in FORBIDDEN_KEYS}


def log_event(event: str, **fields: Any) -> dict[str, Any]:
    payload = {"timestamp": datetime.now(timezone.utc).isoformat(), "event": event, **clean_fields(fields)}
    _logger.info(event, extra={"audit": payload})
    return payload
