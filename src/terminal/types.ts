/** Wire protocol shared with terminal-server (app/transports/websocket.py). */

export type Style =
  | "plain" | "heading" | "accent" | "muted" | "success" | "error" | "warn" | "key" | "value" | "link";

export interface Span {
  t: string;
  s: Style;
}
export type Line = Span[];

export type Mode = "command" | "contact";

export type ServerMessage =
  | { type: "ready"; session_id: string }
  | { type: "output"; data: string; lines: Line[] }
  | { type: "prompt"; data: string; mode: Mode }
  | { type: "clear" }
  | { type: "exit" }
  | { type: "error"; data: string }
  | { type: "complete"; completion: string; matches: string[] };

export type ClientMessage =
  | { type: "ready" }
  | { type: "input"; data: string }
  | { type: "complete"; data: string }
  | { type: "interrupt" }
  | { type: "resize"; cols: number; rows: number };

export type ConnectionStatus = "connecting" | "open" | "closed";

export type Entry =
  | { id: number; kind: "out"; lines: Line[] }
  | { id: number; kind: "in"; prompt: string; text: string }
  | { id: number; kind: "sys"; text: string; tone: "info" | "error" };

/** An entry before the terminal assigns it an id. */
export type NewEntry = Entry extends infer E ? (E extends unknown ? Omit<E, "id"> : never) : never;
