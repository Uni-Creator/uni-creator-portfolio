import { memo } from "react";

const PROMPT_RE = /^([^@\s]+)@([^:\s]+):(.*)\$ $/;

/** `portfolio@abhay:~$ ` gets the classic colours; flow prompts (`Name: `) are shown plainly. */
function TerminalPrompt({ prompt }: { prompt: string }) {
  const m = PROMPT_RE.exec(prompt);
  if (!m) return <span className="s-accent t-prompt">{prompt}</span>;
  return (
    <span className="t-prompt">
      <span className="p-user">{m[1]}@{m[2]}</span>
      <span className="p-sep">:</span>
      <span className="p-path">{m[3]}</span>
      <span className="p-sep">$ </span>
    </span>
  );
}

export default memo(TerminalPrompt);
