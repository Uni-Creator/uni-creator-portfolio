"""Environment-driven configuration. Nothing here is secret-by-default; secrets only come from env."""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

try:  # optional, handy for local development
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # pragma: no cover
    pass

_UNITS = {
    "s": 1, "sec": 1, "second": 1, "seconds": 1,
    "m": 60, "min": 60, "minute": 60, "minutes": 60,
    "h": 3600, "hour": 3600, "hours": 3600,
    "d": 86400, "day": 86400, "days": 86400,
}


def parse_rate(spec: str) -> tuple[int, float]:
    """'3/hour' -> (3, 3600.0)."""
    count, _, unit = spec.partition("/")
    return int(count.strip()), float(_UNITS[(unit.strip().lower() or "hour")])


def _str(name: str, default: str = "") -> str:
    return os.environ.get(name, "").strip() or default


def _int(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    return int(raw) if raw else default


def _bool(name: str, default: bool) -> bool:
    raw = os.environ.get(name, "").strip().lower()
    return default if not raw else raw in {"1", "true", "yes", "on"}


def _csv(name: str) -> tuple[str, ...]:
    return tuple(p.strip() for p in os.environ.get(name, "").split(",") if p.strip())


@dataclass(frozen=True)
class Settings:
    # HTTP / WebSocket
    terminal_host: str = "127.0.0.1"
    terminal_port: int = 8000
    terminal_ws_path: str = "/ws/terminal"
    allowed_origins: tuple[str, ...] = ()  # empty = allow any Origin (dev only!)
    trust_proxy: bool = False  # honour X-Forwarded-For (only behind your own Nginx)
    ws_max_message_bytes: int = 8192
    max_ws_sessions: int = 50
    # SSH
    ssh_host: str = "0.0.0.0"
    ssh_port: int = 2222
    ssh_host_key: str = "/opt/portfolio-terminal/host_key"
    ssh_username: str = "portfolio"
    max_ssh_sessions: int = 20
    max_ssh_sessions_per_ip: int = 5
    # Sessions
    idle_timeout_seconds: int = 900
    command_rate_limit: str = "40/minute"
    # Contact
    contact_rate_limit: str = "3/hour"
    contact_max_message_length: int = 2000
    contact_max_name_length: int = 100
    contact_max_email_length: int = 254
    contact_session_limit: int = 2
    contact_timeout_seconds: float = 10.0
    contact_dry_run: bool = False
    contact_webhook_url: str = ""
    contact_webhook_format: str = "generic"  # generic | discord | slack
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    contact_to_email: str = ""
    # Data / logging
    portfolio_data_path: str = str(Path(__file__).parent / "data" / "portfolio.json")
    log_level: str = "INFO"

    @classmethod
    def from_env(cls) -> "Settings":
        d = cls()
        return cls(
            terminal_host=_str("TERMINAL_HOST", d.terminal_host),
            terminal_port=_int("TERMINAL_PORT", d.terminal_port),
            terminal_ws_path=_str("TERMINAL_WS_PATH", d.terminal_ws_path),
            allowed_origins=_csv("ALLOWED_ORIGINS"),
            trust_proxy=_bool("TRUST_PROXY", d.trust_proxy),
            ws_max_message_bytes=_int("WS_MAX_MESSAGE_BYTES", d.ws_max_message_bytes),
            max_ws_sessions=_int("MAX_WS_SESSIONS", d.max_ws_sessions),
            ssh_host=_str("SSH_HOST", d.ssh_host),
            ssh_port=_int("SSH_PORT", d.ssh_port),
            ssh_host_key=_str("SSH_HOST_KEY", d.ssh_host_key),
            ssh_username=_str("SSH_USERNAME", d.ssh_username),
            max_ssh_sessions=_int("MAX_SSH_SESSIONS", d.max_ssh_sessions),
            max_ssh_sessions_per_ip=_int("MAX_SSH_SESSIONS_PER_IP", d.max_ssh_sessions_per_ip),
            idle_timeout_seconds=_int("IDLE_TIMEOUT_SECONDS", d.idle_timeout_seconds),
            command_rate_limit=_str("COMMAND_RATE_LIMIT", d.command_rate_limit),
            contact_rate_limit=_str("CONTACT_RATE_LIMIT", d.contact_rate_limit),
            contact_max_message_length=_int("CONTACT_MAX_MESSAGE_LENGTH", d.contact_max_message_length),
            contact_max_name_length=_int("CONTACT_MAX_NAME_LENGTH", d.contact_max_name_length),
            contact_max_email_length=_int("CONTACT_MAX_EMAIL_LENGTH", d.contact_max_email_length),
            contact_session_limit=_int("CONTACT_SESSION_LIMIT", d.contact_session_limit),
            contact_timeout_seconds=float(_str("CONTACT_TIMEOUT_SECONDS", str(d.contact_timeout_seconds))),
            contact_dry_run=_bool("CONTACT_DRY_RUN", d.contact_dry_run),
            contact_webhook_url=_str("CONTACT_WEBHOOK_URL"),
            contact_webhook_format=_str("CONTACT_WEBHOOK_FORMAT", d.contact_webhook_format),
            smtp_host=_str("SMTP_HOST"),
            smtp_port=_int("SMTP_PORT", d.smtp_port),
            smtp_username=_str("SMTP_USERNAME"),
            smtp_password=os.environ.get("SMTP_PASSWORD", ""),
            contact_to_email=_str("CONTACT_TO_EMAIL"),
            portfolio_data_path=_str("PORTFOLIO_DATA_PATH", d.portfolio_data_path),
            log_level=_str("LOG_LEVEL", d.log_level),
        )
