"use client";

import { useRef, useEffect } from "react";

interface CommandLineProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (cmd: string) => void;
  bootComplete: boolean;
}

export function CommandLine({
  value,
  onChange,
  onSubmit,
  bootComplete,
}: CommandLineProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when boot completes
  useEffect(() => {
    if (bootComplete) inputRef.current?.focus();
  }, [bootComplete]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) onSubmit(value.trim());
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
