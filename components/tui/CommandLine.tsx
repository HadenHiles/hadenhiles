"use client";

import { useRef, useEffect } from "react";

interface CommandLineProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (cmd: string) => void;
  onEnterEmpty?: () => void;
  bootComplete: boolean;
}

export function CommandLine({
  value,
  onChange,
  onSubmit,
  onEnterEmpty,
  bootComplete,
}: CommandLineProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when boot completes
  useEffect(() => {
    if (bootComplete) inputRef.current?.focus();
  }, [bootComplete]);

  // Global keypress capture — typing anywhere focuses the terminal input
  useEffect(() => {
    if (!bootComplete) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const input = inputRef.current;
      if (!input) return;

      // If the input already has focus, let its own handler manage everything
      if (document.activeElement === input) return;

      // Ignore modifier-only combos and special browser shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Printable characters — focus input and let the char land naturally
      if (e.key.length === 1) {
        input.focus();
        // The keydown fires before input value updates, so the char will
        // be appended by the browser normally once focus is set.
        return;
      }

      // Backspace — focus and trim last char manually
      if (e.key === "Backspace") {
        e.preventDefault();
        input.focus();
        onChange(value.slice(0, -1));
        return;
      }

      // Enter — focus input so its own onKeyDown fires
      if (e.key === "Enter") {
        input.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [bootComplete, value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value.trim());
      } else {
        onEnterEmpty?.();
      }
    }
  };

  return (
    <div className="flex items-center gap-2 font-mono text-sm mt-4 border-t border-border pt-3">
      <span className="text-accent select-none shrink-0">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!bootComplete}
        aria-label="Terminal command input"
        placeholder={bootComplete ? "type a command  (try: help)" : ""}
        className="
          flex-1 bg-transparent text-text placeholder-border
          outline-none caret-accent
          disabled:opacity-0
        "
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
}
