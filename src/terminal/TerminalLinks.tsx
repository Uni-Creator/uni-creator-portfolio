import { useState } from "react";
import "./TerminalLinks.css";

const env = import.meta.env as Record<string, string | undefined>;

const SSH_HOST = env.VITE_SSH_HOST ?? "terminal.unicreator.dpdns.org";
const SSH_PORT = env.VITE_SSH_PORT ?? "2222";

export function OpenTerminalButton({ className = "" }: { className?: string }) {
  return (
    <a className={`tl-button ${className}`.trim()} href="/terminal">
      Open Terminal
    </a>
  );
}

export function SshCommand({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const command = `ssh portfolio@${SSH_HOST}${SSH_PORT === "22" ? "" : ` -p ${SSH_PORT}`}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const area = document.createElement("textarea");
      area.value = command;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`tl-ssh ${className}`.trim()}>
      <code>
        <span aria-hidden="true">$ </span>
        {command}
      </code>

      <button type="button" onClick={copy} aria-label="Copy SSH command">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}