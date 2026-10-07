"""Portfolio data loader. Reads the JSON exported from src/constants/*.ts."""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

_TAG_RE = re.compile(r"<[^>]+>")


def strip_html(text: str) -> str:
    return _TAG_RE.sub("", text or "")


def slugify(text: str) -> str:
    """Lowercase alphanumerics only, for forgiving matching ('Sign Bridge' == 'signbridge')."""
    return re.sub(r"[^a-z0-9]", "", (text or "").lower())


@dataclass(frozen=True)
class Project:
    cli_name: str          # what users type / tab-complete
    title: str
    subtitle: str
    description: str
    category: str = ""
    tech: tuple[str, ...] = ()
    architecture: tuple[str, ...] = ()
    problem: str = ""
    solution: str = ""
    result: str = ""
    github: str = ""
    demo: str = ""
    live: str = ""
    parent: str = ""

    def matches(self, query: str) -> bool:
        q = slugify(query)
        return bool(q) and q in {slugify(self.cli_name), slugify(self.title)}


@dataclass(frozen=True)
class Entry:  # experience / education
    period: str
    title: str
    subtitle: str
    location: str
    details: tuple[str, ...]


@dataclass(frozen=True)
class SkillGroup:
    title: str
    summary: str
    items: tuple[str, ...]


@dataclass(frozen=True)
class PortfolioData:
    name: str
    headline: str
    tagline: str
    location: str
    email: str
    resume_url: str
    links: dict[str, str]
    about: tuple[str, ...]
    projects: tuple[Project, ...]
    skills: tuple[SkillGroup, ...]
    experience: tuple[Entry, ...]
    education: tuple[Entry, ...]
    raw: dict = field(default_factory=dict, repr=False, compare=False)

    def find_project(self, query: str) -> Project | None:
        query = query.strip()
        if query.isdigit():
            idx = int(query) - 1
            return self.projects[idx] if 0 <= idx < len(self.projects) else None
        return next((p for p in self.projects if p.matches(query)), None)


def _cli_name(title: str) -> str:
    return title if not re.search(r"\s", title) else re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def _project(raw: dict, parent: str = "") -> Project:
    td = raw.get("technicalDetails") or raw.get("details") or raw.get("projectDetails") or {}
    tech = raw.get("techStack") or td.get("techStack") or ""
    return Project(
        cli_name=_cli_name(raw["title"]),
        title=raw["title"],
        subtitle=raw.get("subtitle", ""),
        description=raw.get("description", ""),
        category=raw.get("category", ""),
        tech=tuple(t.strip() for t in tech.split(",") if t.strip()),
        architecture=tuple(raw.get("architecture") or ()),
        problem=td.get("problem", ""), solution=td.get("solution", ""), result=td.get("result", ""),
        github=raw.get("githubLink") or td.get("githubLink", ""),
        demo=raw.get("demoLink") or td.get("demoLink", ""),
        live=raw.get("liveLink") or td.get("liveLink", ""),
        parent=parent,
    )


def _flatten_projects(raw_projects: list[dict]) -> list[Project]:
    out: list[Project] = []
    for raw in raw_projects:
        comps = raw.get("components")
        if comps:  # umbrella project -> list each component as its own project
            out.extend(_project(c, parent=raw["title"]) for c in comps.values() if c)
        else:
            out.append(_project(raw))
    return out


def _entries(items: list[dict]) -> tuple[Entry, ...]:
    return tuple(
        Entry(i.get("period", ""), i.get("title", ""), i.get("subtitle", ""), i.get("location", ""),
              tuple(strip_html(d) for d in i.get("details", [])))
        for i in items
    )


def _skills(raw: list[dict], projects: list[Project]) -> tuple[SkillGroup, ...]:
    groups = tuple(
        SkillGroup(s.get("title", ""), s.get("summary", ""),
                   tuple(f.get("title", "") for f in s.get("features", []) if f.get("title")))
        for s in raw
    )
    if groups:
        return groups
    # Fallback until `export_portfolio_data.ts` is run: derive from project tech stacks.
    seen: dict[str, None] = {}
    for p in projects:
        for t in p.tech:
            seen.setdefault(t, None)
    return (SkillGroup("Tech used across projects", "", tuple(seen)),)


def load_portfolio(path: str | Path) -> PortfolioData:
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    projects = _flatten_projects(raw.get("projects", []))
    contact = raw.get("contact", {})
    profile = raw.get("profile", {})
    links = {k: v for k, v in (contact.get("socialLinks") or {}).items() if v}
    return PortfolioData(
        name=profile.get("name", "PORTFOLIO"),
        headline=profile.get("headline", ""),
        tagline=profile.get("tagline", ""),
        location=contact.get("location", ""),
        email=contact.get("email", ""),
        resume_url=contact.get("resumeUrls", ""),
        links=links,
        about=tuple(raw.get("about", {}).get("paragraphs", [])),
        projects=tuple(projects),
        skills=_skills(raw.get("skills", []), projects),
        experience=_entries(raw.get("experience", [])),
        education=_entries(raw.get("education", [])),
        raw=raw,
    )
