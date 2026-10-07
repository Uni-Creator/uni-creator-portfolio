import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import "./Terminal.css";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";
import TerminalPrompt from "./TerminalPrompt";
import { TerminalClient, defaultWsUrl } from "./terminalClient";
import type { ConnectionStatus, Entry, Mode, NewEntry, ServerMessage } from "./types";

const DEFAULT_PROMPT = "portfolio@abhay:~$ ";
const MAX_ENTRIES = 1500;
const MAX_HISTORY = 200;

export default function Terminal({ url }: { url?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [mode, setMode] = useState<Mode>("command");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [ended, setEnded] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const client = useRef<TerminalClient | null>(null);
  const nextId = useRef(1);
  const history = useRef<string[]>([]);
  const historyIdx = useRef(0);
  const draft = useRef("");
  const pendingComplete = useRef<string | null>(null);
  const size = useRef({ cols: 0, rows: 0 });
  const stateRef = useRef({ prompt, mode, value, status, ended });
  stateRef.current = { prompt, mode, value, status, ended };

  const push = useCallback((items: NewEntry[]) => {
    setEntries((prev) => {
      const added = items.map((it) => ({ ...it, id: nextId.current++ }) as Entry);
      const merged = prev.concat(added);
      return merged.length > MAX_ENTRIES ? merged.slice(-MAX_ENTRIES) : merged;
    });
  }, []);

  const sendSize = useCallback(() => {
    const { cols, rows } = size.current;
    if (cols > 0) client.current?.send({ type: "resize", cols, rows });
  }, []);

  const onMessage = useCallback(
    (msg: ServerMessage) => {
      switch (msg.type) {
        case "ready":
          sendSize();
          break;
        case "output":
          push([{ kind: "out", lines: msg.lines }]);
          break;
        case "prompt":
          setPrompt(msg.data);
          setMode(msg.mode);
          break;
        case "clear":
          setEntries([]);
          break;
        case "error":
          push([{ kind: "sys", text: msg.data, tone: "error" }]);
          break;
        case "exit":
          setEnded(true);
          client.current?.close();
          setStatus("closed");
          push([{ kind: "sys", text: "Session ended. Returning to homepage...", tone: "info" }]);
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
          break;
        case "complete": {
          const before = pendingComplete.current ?? "";
          pendingComplete.current = null;
          if (msg.matches.length > 1) {
            push([
              { kind: "in", prompt: stateRef.current.prompt, text: before },
              { kind: "sys", text: msg.matches.join("   "), tone: "info" },
            ]);
          }
          setValue(msg.completion);
          break;
        }
      }
    },
    [push, sendSize],
  );

  const connect = useCallback(() => {
    client.current?.connect();
  }, []);

  const handleClose = useCallback(() => {
    window.location.href = "/";
  }, []);

  // Connection lifecycle
  useEffect(() => {
    const c = new TerminalClient(url ?? defaultWsUrl(), {
      onMessage,
      onStatus: (s, reason) => {
        setStatus(s);
        if (s === "closed" && reason === "lost") {
          push([
            { kind: "sys", text: "Connection lost.", tone: "error" },
            { kind: "sys", text: "Reconnect? Press Enter (or tap Reconnect).", tone: "info" },
          ]);
        }
      },
    });
    client.current = c;
    c.connect();
    return () => c.close();
  }, [url, onMessage, push]);

  // Keep the newest output in view
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, value, prompt]);

  // Report terminal size (cols/rows) so the server can pick a banner that fits
  useEffect(() => {
    const el = scroller.current;
    const probe = measure.current;
    if (!el || !probe) return;
    let timer: number | undefined;
    const compute = () => {
      const cw = probe.getBoundingClientRect().width / 10;
      const lh = probe.getBoundingClientRect().height;
      if (!cw || !lh) return;
      const cs = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const next = { cols: Math.max(10, Math.floor(w / cw)), rows: Math.max(3, Math.floor(h / lh)) };
      if (next.cols !== size.current.cols || next.rows !== size.current.rows) {
        size.current = next;
        sendSize();
      }
    };
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(compute, 150);
    });
    ro.observe(el);
    compute();
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [sendSize]);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  const reconnect = useCallback(() => {
    setEnded(false);
    push([{ kind: "sys", text: "Connecting...", tone: "info" }]);
    connect();
  }, [connect, push]);

  const submit = useCallback(() => {
    const { value: text, prompt: p, mode: m, status: st, ended: done } = stateRef.current;
    const trimmed = text.trim().toLowerCase();
    if (m === "command" && (trimmed === "exit" || trimmed === "quit")) {
      push([{ kind: "in", prompt: p, text }]);
      push([{ kind: "sys", text: "Goodbye! Returning to homepage...", tone: "info" }]);
      client.current?.send({ type: "input", data: text });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
    if (st !== "open") {
      if (st === "closed" || done) reconnect();
      return;
    }
    push([{ kind: "in", prompt: p, text }]);
    if (m === "command" && text.trim()) {
      history.current.push(text);
      if (history.current.length > MAX_HISTORY) history.current.shift();
    }
    historyIdx.current = history.current.length;
    draft.current = "";
    setValue("");
    client.current?.send({ type: "input", data: text });
  }, [push, reconnect]);

  const interrupt = useCallback(() => {
    const { value: text, prompt: p } = stateRef.current;
    push([{ kind: "in", prompt: p, text: text + "^C" }]);
    setValue("");
    client.current?.send({ type: "interrupt" });
  }, [push]);

  const complete = useCallback(() => {
    const { value: text, mode: m } = stateRef.current;
    if (m !== "command" || !text) return;
    pendingComplete.current = text;
    client.current?.send({ type: "complete", data: text });
  }, []);

  const recall = useCallback((dir: -1 | 1) => {
    if (stateRef.current.mode !== "command" || history.current.length === 0) return;
    if (historyIdx.current === history.current.length) draft.current = stateRef.current.value;
    const idx = Math.min(history.current.length, Math.max(0, historyIdx.current + dir));
    historyIdx.current = idx;
    setValue(idx === history.current.length ? draft.current : history.current[idx]);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      return;
    }
    const ctrl = e.ctrlKey && !e.metaKey && !e.altKey;
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      recall(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      recall(1);
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      complete();
    } else if (ctrl && e.key.toLowerCase() === "c") {
      const el = e.currentTarget;
      const selecting = el.selectionStart !== el.selectionEnd || !!window.getSelection()?.toString();
      if (!selecting) {
        e.preventDefault();
        interrupt();
      } // otherwise let the browser copy the selection
    } else if (ctrl && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
    }
  };

  const onBodyClick = () => {
    if (!window.getSelection()?.toString()) focusInput();
  };

  const closed = status === "closed";
  const statusLabel = useMemo(
    () => ({ connecting: "connecting", open: "connected", closed: ended ? "ended" : "offline" })[status],
    [status, ended],
  );

  return (
    <div className="term-page">
      <div className="term-window" role="application" aria-label="Interactive terminal portfolio">
        <header className="term-bar">
          <span className="term-dots">
            <button
              type="button"
              className="dot dot-r"
              onClick={handleClose}
              title="Close terminal (Esc)"
              aria-label="Close terminal and return to homepage"
            />
            <button
              type="button"
              className="dot dot-y"
              onClick={() => setEntries([])}
              title="Clear screen"
              aria-label="Clear screen"
            />
            <button
              type="button"
              className="dot dot-g"
              onClick={reconnect}
              title="Reconnect"
              aria-label="Reconnect"
            />
          </span>
          <span className="term-title">portfolio@abhay</span>
          <div className="term-bar-right">
            <span className={`term-status st-${status}`}>{statusLabel}</span>
            <button
              type="button"
              className="term-close-btn"
              onClick={handleClose}
              title="Close terminal (Esc)"
              aria-label="Close terminal and return to homepage"
            >
              <span className="term-close-x">✕</span>
              <span className="term-close-text">Close</span>
            </button>
          </div>
        </header>

        <div className="term-body" ref={scroller} onClick={onBodyClick} role="log" aria-live="polite">
          <span className="term-measure" ref={measure} aria-hidden="true">MMMMMMMMMM</span>
          <TerminalOutput entries={entries} />
          <div className="t-line t-input-row">
            <TerminalPrompt prompt={prompt} />
            <TerminalInput
              ref={inputRef}
              value={value}
              maxLength={2100}
              disabled={status === "connecting"}
              onChange={setValue}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>

        <footer className="term-keys" aria-label="Terminal keys">
          {closed ? (
            <button type="button" className="key key-wide" onPointerDown={(e) => e.preventDefault()} onClick={reconnect}>
              Reconnect
            </button>
          ) : (
            <>
              <button type="button" className="key" onPointerDown={(e) => e.preventDefault()} onClick={complete}>Tab</button>
              <button type="button" className="key" onPointerDown={(e) => e.preventDefault()} onClick={() => recall(-1)} aria-label="Previous command">↑</button>
              <button type="button" className="key" onPointerDown={(e) => e.preventDefault()} onClick={() => recall(1)} aria-label="Next command">↓</button>
              <button type="button" className="key" onPointerDown={(e) => e.preventDefault()} onClick={interrupt}>Ctrl+C</button>
              <button type="button" className="key" onPointerDown={(e) => e.preventDefault()} onClick={() => setEntries([])}>Clear</button>
            </>
          )}
          <button
            type="button"
            className="key key-close"
            onClick={handleClose}
            onPointerDown={(e) => e.preventDefault()}
            title="Close terminal and return to homepage"
          >
            ✕ Close
          </button>
        </footer>
      </div>
    </div>
  );
}
