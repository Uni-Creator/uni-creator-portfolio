"""Server-side validation for contact submissions (shared by terminal flow and HTTP API)."""
from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass

from app.config import Settings

_EMAIL_RE = re.compile(
    r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@"
    r"[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
    r"(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$"
)
_URL_RE = re.compile(r"(?:https?://|www\.)\S+", re.I)
_REPEAT_RE = re.compile(r"(.)\1{19,}")
_SPAM_PHRASES = (
    "viagra", "casino", "crypto giveaway", "seo services", "backlinks", "buy followers",
    "click here", "earn money fast", "work from home", "loan offer", "porn", "forex signals",
)


class FieldError(ValueError):
    """A single field failed validation; str(e) is user-safe."""


class ContactValidationError(ValueError):
    def __init__(self, errors: dict[str, str]) -> None:
        super().__init__("; ".join(errors.values()))
        self.errors = errors


@dataclass(frozen=True)
class CleanContact:
    name: str
    email: str
    message: str


def _has_control(text: str, allow: str = "") -> bool:
    return any(unicodedata.category(c) in ("Cc", "Cf") and c not in allow for c in text)


def validate_name(value: object, settings: Settings) -> str:
    if not isinstance(value, str):
        raise FieldError("Name is required.")
    name = " ".join(unicodedata.normalize("NFC", value).split())
    if not name:
        raise FieldError("Name is required.")
    if len(name) > settings.contact_max_name_length:
        raise FieldError(f"Name must be at most {settings.contact_max_name_length} characters.")
    if _has_control(name):
        raise FieldError("Name contains invalid characters.")
    return name


def validate_email(value: object, settings: Settings) -> str:
    if not isinstance(value, str) or not value.strip():
        raise FieldError("Email is required.")
    email = value.strip()
    if len(email) > settings.contact_max_email_length:
        raise FieldError(f"Email must be at most {settings.contact_max_email_length} characters.")
    local = email.rpartition("@")[0]
    if _has_control(email) or " " in email or len(local) > 64 or not _EMAIL_RE.match(email) or ".." in email:
        raise FieldError("Enter a valid email address.")
    return email


def validate_message(value: object, settings: Settings) -> str:
    if not isinstance(value, str):
        raise FieldError("Message is required.")
    message = unicodedata.normalize("NFC", value).replace("\r\n", "\n").strip()
    if not message:
        raise FieldError("Message is required.")
    if len(message) > settings.contact_max_message_length:
        raise FieldError(f"Message must be at most {settings.contact_max_message_length} characters.")
    if _has_control(message, allow="\n\t"):
        raise FieldError("Message contains invalid characters.")
    return message


def validate_contact(name: object, email: object, message: object, settings: Settings) -> CleanContact:
    errors: dict[str, str] = {}
    cleaned: dict[str, str] = {}
    for key, fn, raw in (("name", validate_name, name), ("email", validate_email, email),
                         ("message", validate_message, message)):
        try:
            cleaned[key] = fn(raw, settings)
        except FieldError as exc:
            errors[key] = str(exc)
    if errors:
        raise ContactValidationError(errors)
    return CleanContact(**cleaned)


def detect_spam(contact: CleanContact) -> str | None:
    """Cheap heuristics; returns an internal reason string or None."""
    text = f"{contact.name} {contact.message}".lower()
    if len(_URL_RE.findall(contact.message)) > 2:
        return "too_many_links"
    if any(p in text for p in _SPAM_PHRASES):
        return "spam_phrase"
    if _REPEAT_RE.search(contact.message):
        return "repeated_characters"
    letters = [c for c in contact.message if c.isalpha()]
    if len(letters) > 40 and sum(c.isupper() for c in letters) / len(letters) > 0.8:
        return "shouting"
    if _URL_RE.search(contact.name):
        return "link_in_name"
    return None
