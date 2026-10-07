"""Command registry. Every command is a pure function over static portfolio data.

Nothing in this module touches the OS: no subprocess, no filesystem, no network.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Callable

from app.data import PortfolioData
from app.terminal.renderer import BLANK, L, Line, bullets, box, wrap
from app.terminal.state import Result, TerminalState


@dataclass
class Context:
    state: TerminalState
    data: PortfolioData
    args: tuple[str, ...]
    width: int
    registry: dict[str, "Command"]

    @property
    def arg_text(self) -> str:
        return " ".join(self.args)


@dataclass(frozen=True)
class Command:
    name: str
    summary: str
    handler: Callable[[Context], Result]
    usage: str = ""
    public: bool = False  # safe for non-interactive use (curl, `ssh host <cmd>`)


def _kv(key: str, value: str, pad: int = 10) -> Line:
    return L(("  " + key.ljust(pad), "key"), (value, "value"))


def _link(label: str, url: str, pad: int = 10) -> Line:
    return L(("  " + label.ljust(pad), "key"), (url, "link"))


def cmd_help(ctx: Context) -> Result:
    rows: list[Line] = [L(("Available commands:", "heading")), BLANK]
    for c in ctx.registry.values():
        rows.append(L(("  " + (c.usage or c.name).ljust(22), "accent"), c.summary))
    return Result(rows + [BLANK])


def cmd_about(ctx: Context) -> Result:
    lines: list[Line] = []
    for para in ctx.data.about:
        lines += wrap(para, ctx.width) + [BLANK]
    return Result(lines, title="ABOUT")


def cmd_projects(ctx: Context) -> Result:
    lines: list[Line] = []
    for i, p in enumerate(ctx.data.projects, 1):
        lines.append(L((f"[{i}] ", "accent"), (p.title, "heading")))
        lines.append(L("    ", (p.subtitle, "muted")))
        lines.append(BLANK)
    lines.append(L(("Type ", "muted"), ("project <name>", "accent"), (" for details, e.g. ", "muted"),
                   (f"project {ctx.data.projects[0].cli_name}" if ctx.data.projects else "project <name>", "accent")))
    return Result(lines, title="PROJECTS")


def cmd_project(ctx: Context) -> Result:
    if not ctx.args:
        return Result([L(("Usage: project <name>", "warn")), L(("Type `projects` to list them.", "muted"))], ok=False)
    p = ctx.data.find_project(ctx.arg_text)
    if p is None:
        return Result([L((f"Project not found: {ctx.arg_text[:40]}", "error")),
                       L(("Type `projects` to list them.", "muted"))], ok=False)
    w, lines = ctx.width, []
    if p.subtitle:
        lines.append(L((p.subtitle, "muted")))
        lines.append(BLANK)
    lines += wrap(p.description, w) + [BLANK]
    if p.tech:
        lines += [L(("Stack:", "heading"))] + [L("  ", t) for t in p.tech] + [BLANK]
    if p.architecture:
        lines += [L(("Pipeline:", "heading")), L("  ", (" → ".join(p.architecture), "value"))] if len(
            " → ".join(p.architecture)) < w - 2 else [L(("Pipeline:", "heading"))] + bullets(p.architecture, w)
        lines.append(BLANK)
    for label, text in (("Problem", p.problem), ("Solution", p.solution), ("Result", p.result)):
        if text:
            lines += [L((label + ":", "heading"))] + wrap(text, w, indent=2) + [BLANK]
    links = [(k, v) for k, v in (("GitHub", p.github), ("Demo", p.demo), ("Live", p.live)) if v]
    if links:
        lines.append(L(("Links:", "heading")))
        lines += [_link(k + ":", v, 8) for k, v in links]
        lines.append(BLANK)
    return Result(lines, title=p.title.upper())


def cmd_skills(ctx: Context) -> Result:
    lines: list[Line] = []
    for g in ctx.data.skills:
        lines.append(L((g.title, "heading")))
        if g.summary:
            lines += wrap(g.summary, ctx.width, indent=2, style="muted")
        lines += wrap(", ".join(g.items), ctx.width, indent=2)
        lines.append(BLANK)
    return Result(lines, title="SKILLS")


def _timeline(entries, width: int) -> list[Line]:
    lines: list[Line] = []
    for e in entries:
        lines.append(L((e.title, "heading")))
        where = " · ".join(x for x in (e.subtitle, e.location) if x)
        if where:
            lines.append(L((where, "accent")))
        lines.append(L((e.period, "muted")))
        lines += bullets(e.details, width) + [BLANK]
    return lines


def cmd_experience(ctx: Context) -> Result:
    return Result(_timeline(ctx.data.experience, ctx.width), title="EXPERIENCE")


def cmd_education(ctx: Context) -> Result:
    return Result(_timeline(ctx.data.education, ctx.width), title="EDUCATION")


def cmd_resume(ctx: Context) -> Result:
    return Result([L(("Resume:", "key")), L("  ", (ctx.data.resume_url, "link")), BLANK], title="RESUME")


def _social(name: str, label: str):
    def handler(ctx: Context) -> Result:
        url = ctx.data.links.get(name, "")
        if not url:
            return Result([L((f"{label} link not available.", "warn"))], ok=False)
        return Result([L((label + ":", "key")), L("  ", (url, "link")), BLANK], title=label.upper())
    return handler


def cmd_whoami(ctx: Context) -> Result:
    return Result([L(ctx.state.username)])


def cmd_date(ctx: Context) -> Result:
    return Result([L(datetime.now().astimezone().strftime("%a %b %d %H:%M:%S %Z %Y"))])


def cmd_history(ctx: Context) -> Result:
    if not ctx.state.history:
        return Result([L(("No history yet.", "muted"))])
    return Result([L((f"{i:>4}  ", "muted"), h) for i, h in enumerate(ctx.state.history, 1)])


def cmd_clear(ctx: Context) -> Result:
    return Result(clear=True)


def cmd_exit(ctx: Context) -> Result:
    return Result([L(("Thanks for stopping by. Goodbye!", "success"))], exit=True)


_ART = [
    r"    ___    ___    ",
    r"   /   |  / __|   ",
    r"  / /| |  \__ \   ",
    r" / ___ | |___/    ",
    r"/_/  |_|          ",
]


def cmd_neofetch(ctx: Context) -> Result:
    d, s = ctx.data, ctx.state
    edu = d.education[0] if d.education else None
    exp = d.experience[0] if d.experience else None
    uptime = int(__import__("time").time() - s.started_at)
    info: list[Line] = [
        L((f"{s.username}@{s.hostname}", "heading")),
        L(("─" * (len(s.username) + len(s.hostname) + 1), "muted")),
        L(("Name      ", "key"), d.name.title()),
        L(("Role      ", "key"), d.headline.title() if d.headline else "-"),
        L(("Focus     ", "key"), d.tagline),
        L(("Location  ", "key"), d.location),
    ]
    if edu:
        info.append(L(("Education ", "key"), f"{edu.title}, {edu.subtitle}"))
    if exp:
        info.append(L(("Latest    ", "key"), f"{exp.title}, {exp.subtitle}"))
    info += [
        L(("Projects  ", "key"), str(len(d.projects))),
        L(("Shell     ", "key"), "portfolio-sh (not a real shell)"),
        L(("Transport ", "key"), s.transport),
        L(("Uptime    ", "key"), f"{uptime // 60}m {uptime % 60}s"),
    ]
    show_art = ctx.width >= 60
    out: list[Line] = []
    for i, row in enumerate(info):
        art = _ART[i] if show_art and i < len(_ART) else (" " * len(_ART[0]) if show_art else "")
        out.append(L((art, "accent"), "  " if show_art else "", *row))
    return Result([BLANK] + out + [BLANK])


def build_registry() -> dict[str, Command]:
    cmds = [
        Command("about", "About me", cmd_about, public=True),
        Command("projects", "List projects", cmd_projects, public=True),
        Command("project", "Open project", cmd_project, usage="project <name>", public=True),
        Command("skills", "Technical skills", cmd_skills, public=True),
        Command("experience", "Experience", cmd_experience, public=True),
        Command("education", "Education", cmd_education, public=True),
        Command("resume", "Resume", cmd_resume, public=True),
        Command("github", "GitHub", _social("github", "GitHub"), public=True),
        Command("linkedin", "LinkedIn", _social("linkedin", "LinkedIn"), public=True),
        Command("contact", "Contact me", lambda ctx: Result(), ),  # replaced by core (needs contact flow)
        Command("neofetch", "System-style portfolio summary", cmd_neofetch, public=True),
        Command("clear", "Clear terminal", cmd_clear),
        Command("history", "Command history", cmd_history),
        Command("help", "Show this help", cmd_help, public=True),
        Command("whoami", "Current user", cmd_whoami),
        Command("date", "Current date and time", cmd_date),
        Command("exit", "Exit terminal", cmd_exit),
    ]
    return {c.name: c for c in cmds}
