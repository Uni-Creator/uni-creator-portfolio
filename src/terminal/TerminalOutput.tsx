import { memo } from "react";
import type { Entry, Line } from "./types";
import TerminalPrompt from "./TerminalPrompt";

function safeHref(text: string): string | null {
  try {
    const url = new URL(text.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

/** Everything is rendered as React text nodes: no dangerouslySetInnerHTML, nothing to sanitise away. */
function LineView({ line }: { line: Line }) {
  if (line.length === 0 || line.every((s) => s.t === "")) return <div className="t-line">{"\u00A0"}</div>;
  return (
    <div className="t-line">
      {line.map((span, i) => {
        const href = span.s === "link" ? safeHref(span.t) : null;
        return href ? (
          <a key={i} className="s-link" href={href} target="_blank" rel="noopener noreferrer">
            {span.t}
          </a>
        ) : (
          <span key={i} className={`s-${span.s}`}>{span.t}</span>
        );
      })}
    </div>
  );
}

const EntryView = memo(function EntryView({ entry }: { entry: Entry }) {
  switch (entry.kind) {
    case "out":
      return <>{entry.lines.map((line, i) => <LineView key={i} line={line} />)}</>;
    case "in":
      return (
        <div className="t-line">
          <TerminalPrompt prompt={entry.prompt} />
          <span>{entry.text}</span>
        </div>
      );
    case "sys":
      return <div className={`t-line ${entry.tone === "error" ? "s-error" : "s-muted"}`}>{entry.text}</div>;
  }
});

export default function TerminalOutput({ entries }: { entries: Entry[] }) {
  return (
    <>
      {entries.map((e) => (
        <EntryView key={e.id} entry={e} />
      ))}
    </>
  );
}
