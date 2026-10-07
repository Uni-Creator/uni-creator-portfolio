"""Transport-independent output model + renderers.

Commands produce `Line`s made of styled `Span`s (never raw ANSI, never HTML).
  SSHRenderer   -> ANSI escape sequences (CRLF line endings)
  PlainRenderer -> plain text (curl / non-pty SSH / WebSocket `data` fallback)
  WebRenderer   -> JSON-safe structured spans; React renders them as text nodes
All renderers strip control characters, so user-supplied text can never inject escapes.
"""
from __future__ import annotations

import textwrap
import unicodedata
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Iterable, Sequence

STYLES = ("plain", "heading", "accent", "muted", "success", "error", "warn", "key", "value", "link")


@dataclass(frozen=True)
class Span:
    text: str
    style: str = "plain"


Line = tuple[Span, ...]
Part = "str | tuple[str, str] | Span"


def sanitize(text: str) -> str:
    """Remove ESC and other control characters (keeps printable text)."""
    return "".join(c for c in text if c == "\t" or unicodedata.category(c) not in ("Cc", "Cf", "Cs"))


def L(*parts: object) -> Line:
    """Build a line from str | (text, style) | Span parts."""
    spans: list[Span] = []
    for p in parts:
        if isinstance(p, Span):
            spans.append(p)
        elif isinstance(p, tuple):
            spans.append(Span(p[0], p[1]))
        else:
            spans.append(Span(str(p)))
    return tuple(spans)


BLANK: Line = ()


def rule(width: int = 56, char: str = "─") -> Line:
    return L((char * width, "muted"))


def wrap(text: str, width: int, indent: int = 0, style: str = "plain") -> list[Line]:
    pad = " " * indent
    chunks = textwrap.wrap(text, max(20, width - indent), break_long_words=True) or [""]
    return [L(pad, (c, style)) for c in chunks]


def bullets(items: Iterable[str], width: int, indent: int = 2) -> list[Line]:
    out: list[Line] = []
    for item in items:
        wrapped = textwrap.wrap(item, max(20, width - indent - 2), break_long_words=True) or [""]
        out.append(L(" " * indent, ("• ", "accent"), wrapped[0]))
        out.extend(L(" " * (indent + 2), w) for w in wrapped[1:])
    return out


def box(rows: Sequence[str], width: int = 70, style: str = "heading") -> list[Line]:
    inner = width - 2
    top, bottom = "╔" + "═" * inner + "╗", "╚" + "═" * inner + "╝"
    out = [L((top, style))]
    for r in rows:
        out.append(L(("║", style), (r.center(inner)[:inner], "plain" if r else "plain"), ("║", style)))
    out.append(L((bottom, style)))
    return out


class Renderer(ABC):
    @abstractmethod
    def render(self, lines: Sequence[Line]): ...


_ANSI = {
    "plain": "", "heading": "\x1b[1;36m", "accent": "\x1b[1;33m", "muted": "\x1b[90m",
    "success": "\x1b[1;32m", "error": "\x1b[1;31m", "warn": "\x1b[33m", "key": "\x1b[36m",
    "value": "", "link": "\x1b[4;34m",
}
RESET = "\x1b[0m"


class SSHRenderer(Renderer):
    def render_line(self, line: Line) -> str:
        out = []
        for s in line:
            code = _ANSI.get(s.style, "")
            text = sanitize(s.text)
            out.append(f"{code}{text}{RESET}" if code else text)
        return "".join(out)

    def render(self, lines: Sequence[Line]) -> str:
        return "".join(self.render_line(l) + "\r\n" for l in lines)

    @staticmethod
    def prompt(prompt: str) -> str:
        """Colourise `user@host:~$ ` prompts; leave flow prompts (`Name: `) in accent."""
        if prompt.endswith("$ ") and "@" in prompt:
            user, _, rest = prompt.partition("@")
            host, _, tail = rest.partition(":")
            return f"\x1b[1;32m{sanitize(user)}@{sanitize(host)}{RESET}:\x1b[1;34m{sanitize(tail[:-2])}{RESET}$ "
        return f"\x1b[1;33m{sanitize(prompt)}{RESET}"


class PlainRenderer(Renderer):
    def render(self, lines: Sequence[Line]) -> str:
        return "".join("".join(sanitize(s.text) for s in l) + "\n" for l in lines)


class WebRenderer(Renderer):
    def render(self, lines: Sequence[Line]) -> list[list[dict[str, str]]]:
        return [[{"t": sanitize(s.text), "s": s.style if s.style in STYLES else "plain"} for s in l] for l in lines]
