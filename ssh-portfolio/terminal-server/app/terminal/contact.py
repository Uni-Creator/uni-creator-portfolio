"""Contact flow state machine: name -> email -> message -> confirm -> send.

Transport-independent. Delivery is injected as an async callable so this module never
knows about SMTP / webhooks / HTTP.
"""
from __future__ import annotations

from typing import Awaitable, Callable, Protocol

from app.config import Settings
from app.data import PortfolioData
from app.security.validation import FieldError, validate_email, validate_message, validate_name
from app.terminal.renderer import BLANK, L, rule
from app.terminal.state import ContactState, Result, TerminalState

CANCEL_WORDS = {"cancel", "/cancel", "quit-contact"}


class Submitter(Protocol):
    async def __call__(self, name: str, email: str, message: str, *, remote_ip: str, source: str) -> None: ...


class ContactFlow:
    def __init__(self, settings: Settings, data: PortfolioData, submit: Submitter) -> None:
        self.settings, self.data, self._submit = settings, data, submit

    # -- entry points ---------------------------------------------------
    def start(self, state: TerminalState) -> Result:
        if state.contact_submissions >= self.settings.contact_session_limit:
            return Result([L(("You've reached the message limit for this session.", "warn")),
                           L(("Please reach out via ", "muted"), (self.data.email, "link"), (" instead.", "muted"))],
                          ok=False)
        state.contact_state = ContactState()
        return Result([L(("Type ", "muted"), ("cancel", "accent"), (" at any step to abort.", "muted")), BLANK],
                      title="CONTACT")

    def interrupt(self, state: TerminalState) -> Result:
        if state.contact_state:
            state.contact_state = None
            return Result([L(("Cancelled.", "warn"))])
        return Result()

    async def step(self, state: TerminalState, line: str) -> Result:
        cs = state.contact_state
        assert cs is not None
        text = line.strip()
        if text.lower() in CANCEL_WORDS:
            return self.interrupt(state)

        if cs.step == "name":
            try:
                cs.name = validate_name(text, self.settings)
            except FieldError as exc:
                return Result([L((str(exc), "error"))], ok=False)
            cs.step = "email"
            return Result()
        if cs.step == "email":
            try:
                cs.email = validate_email(text, self.settings)
            except FieldError as exc:
                return Result([L((str(exc), "error"))], ok=False)
            cs.step = "message"
            return Result()
        if cs.step == "message":
            try:
                cs.message = validate_message(text, self.settings)
            except FieldError as exc:
                return Result([L((str(exc), "error"))], ok=False)
            cs.step = "confirm"
            return Result([BLANK, rule(), BLANK,
                           L(("Name:    ", "key"), (cs.name, "value")),
                           L(("Email:   ", "key"), (cs.email, "value")),
                           L(("Message: ", "key"), (cs.message, "value")), BLANK])
        # confirm
        if text.lower() not in {"y", "yes"}:
            state.contact_state = None
            return Result([L(("Cancelled. Nothing was sent.", "warn"))])
        return await self._send(state, cs)

    # -- delivery ---------------------------------------------------------
    async def _send(self, state: TerminalState, cs: ContactState) -> Result:
        from app.api.contact import ContactRateLimited, ContactUnavailable, SpamRejected  # lazy: avoids cycle
        from app.security.validation import ContactValidationError

        state.contact_state = None
        lines = [L(("Sending...", "muted"))]
        try:
            await self._submit(cs.name, cs.email, cs.message, remote_ip=state.remote_ip, source=state.transport)
        except ContactRateLimited as exc:
            mins = max(1, int(exc.retry_after // 60) + 1)
            return Result(lines + [L(("Too many messages from your network. ", "error"),
                                     (f"Try again in about {mins} minute(s).", "muted"))], ok=False)
        except ContactValidationError as exc:
            return Result(lines + [L((m, "error")) for m in exc.errors.values()], ok=False)
        except SpamRejected:
            return Result(lines + [L(("Your message was flagged as spam and was not sent.", "error"))], ok=False)
        except (ContactUnavailable, Exception):  # never leak internals
            return Result(lines + self.failure_lines(), ok=False)
        state.contact_submissions += 1
        return Result(lines + [L(("✓ Message sent successfully.", "success")), BLANK])

    def failure_lines(self):
        out = [L(("Unable to send your message right now.", "error")), BLANK,
               L(("Please try again later or use:", "muted"))]
        if self.data.email:
            out.append(L(("Email:  ", "key"), (self.data.email, "link")))
        if gh := self.data.links.get("github"):
            out.append(L(("GitHub: ", "key"), (gh, "link")))
        return out + [BLANK]
