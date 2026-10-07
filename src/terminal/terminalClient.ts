import type { ClientMessage, ConnectionStatus, ServerMessage } from "./types";

export interface TerminalClientHandlers {
  onMessage(msg: ServerMessage): void;
  onStatus(status: ConnectionStatus, reason?: "lost" | "closed-by-server"): void;
}

const KNOWN = new Set(["ready", "output", "prompt", "clear", "exit", "error", "complete"]);

export function defaultWsUrl(): string {
  const configured = (import.meta.env as Record<string, string | undefined>).VITE_TERMINAL_WS_URL;
  if (configured) return configured;
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.host}/ws/terminal`;
}

/** Thin WebSocket wrapper. Events from a replaced/closed socket are ignored (safe under StrictMode). */
export class TerminalClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private readonly handlers: TerminalClientHandlers;

  constructor(url: string, handlers: TerminalClientHandlers) {
    this.url = url;
    this.handlers = handlers;
  }

  get isOpen(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  connect(): void {
    this.close();
    this.handlers.onStatus("connecting");
    const ws = new WebSocket(this.url);
    this.ws = ws;
    ws.onopen = () => {
      if (this.ws !== ws) return;
      this.handlers.onStatus("open");
      this.send({ type: "ready" });
    };
    ws.onmessage = (ev) => {
      if (this.ws !== ws || typeof ev.data !== "string") return;
      try {
        const msg = JSON.parse(ev.data);
        if (msg && typeof msg.type === "string" && KNOWN.has(msg.type)) this.handlers.onMessage(msg as ServerMessage);
      } catch {
        /* ignore malformed frames */
      }
    };
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      this.handlers.onStatus("closed", "lost");
    };
    ws.onerror = () => {
      /* onclose always follows; nothing to add */
    };
  }

  send(msg: ClientMessage): boolean {
    if (!this.isOpen) return false;
    this.ws!.send(JSON.stringify(msg));
    return true;
  }

  /** Close deliberately (no "connection lost" notification). */
  close(): void {
    const ws = this.ws;
    this.ws = null;
    if (ws && ws.readyState <= WebSocket.OPEN) ws.close(1000);
  }
}
