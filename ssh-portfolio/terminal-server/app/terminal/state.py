from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field


@dataclass
class ContactState:
    step: str = "name"  # name -> email -> message -> confirm
    name: str = ""
    email: str = ""
    message: str = ""

    @property
    def prompt(self) -> str:
        return {"name": "Name: ", "email": "Email: ", "message": "Message: ",
                "confirm": "Send message? [y/N]: "}[self.step]


@dataclass
class TerminalState:
    """Per-session state. `current_directory` is purely cosmetic: there is NO filesystem."""

    transport: str = "unknown"
    remote_ip: str = "-"
    username: str = "portfolio"
    hostname: str = "abhay"
    current_directory: str = "~"
    session_id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    history: list[str] = field(default_factory=list)
    history_index: int = 0
    authenticated: bool = False
    contact_state: ContactState | None = None
    terminal_size: tuple[int, int] = (80, 24)  # (cols, rows)
    contact_submissions: int = 0
    started_at: float = field(default_factory=time.time)

    @property
    def main_prompt(self) -> str:
        return f"{self.username}@{self.hostname}:{self.current_directory}$ "

    @property
    def prompt(self) -> str:
        return self.contact_state.prompt if self.contact_state else self.main_prompt

    @property
    def mode(self) -> str:
        return "contact" if self.contact_state else "command"


@dataclass
class Result:
    """What a command (or contact step) produced. Transports turn this into bytes/JSON."""

    lines: list = field(default_factory=list)  # list[Line]
    title: str = ""        # optional heading; core renders it as rule-style or box-style
    clear: bool = False
    exit: bool = False
    ok: bool = True
