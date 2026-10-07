import { forwardRef } from "react";
import type { KeyboardEvent } from "react";

interface Props {
  value: string;
  disabled?: boolean;
  maxLength: number;
  onChange(value: string): void;
  onKeyDown(e: KeyboardEvent<HTMLInputElement>): void;
}

/** A real <input>: gives native caret, Home/End/Backspace/selection and the mobile virtual keyboard. */
const TerminalInput = forwardRef<HTMLInputElement, Props>(function TerminalInput(
  { value, disabled, maxLength, onChange, onKeyDown },
  ref,
) {
  return (
    <input
      ref={ref}
      className="t-input"
      value={value}
      disabled={disabled}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      type="text"
      name="terminal-input"
      aria-label="Terminal input"
      autoFocus
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      enterKeyHint="send"
      inputMode="text"
      data-lpignore="true"
      data-form-type="other"
    />
  );
});

export default TerminalInput;
