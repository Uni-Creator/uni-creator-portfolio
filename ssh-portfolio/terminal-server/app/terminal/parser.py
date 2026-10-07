"""Tokenises a typed line. Pure string handling: nothing here can execute anything."""
from __future__ import annotations

import shlex
import unicodedata
from dataclasses import dataclass

MAX_COMMAND_LENGTH = 256


@dataclass(frozen=True)
class ParsedCommand:
    raw: str
    name: str = ""
    args: tuple[str, ...] = ()
    error: str = ""

    @property
    def empty(self) -> bool:
        return not self.name and not self.error

    @property
    def arg_text(self) -> str:
        return " ".join(self.args)


def parse_command(line: str) -> ParsedCommand:
    raw = (line or "").strip()
    if not raw:
        return ParsedCommand(raw="")
    if len(raw) > MAX_COMMAND_LENGTH:
        return ParsedCommand(raw=raw[:MAX_COMMAND_LENGTH], error="Input too long.")
    if any(unicodedata.category(c) in ("Cc", "Cf") for c in raw):
        return ParsedCommand(raw="", error="Input contains control characters.")
    try:
        tokens = shlex.split(raw)
    except ValueError:  # unbalanced quotes etc. -> plain whitespace split
        tokens = raw.split()
    if not tokens:
        return ParsedCommand(raw=raw)
    return ParsedCommand(raw=raw, name=tokens[0].lower(), args=tuple(tokens[1:]))
