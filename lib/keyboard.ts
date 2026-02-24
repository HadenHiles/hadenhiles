"use client";

import { useEffect } from "react";

interface TuiKeyboardOptions {
  onUp:     () => void;
  onDown:   () => void;
  onEnter:  () => void;
  onNumber: (n: number) => void;
  onCtrlC:  () => void;
  enabled:  boolean;
}

export function useTuiKeyboard(opts: TuiKeyboardOptions) {
  const { onUp, onDown, onEnter, onNumber, onCtrlC, enabled } = opts;

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // Ctrl+C always works — even when typing
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        onCtrlC();
        return;
      }

      if (isTyping) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          onDown();
          break;
        case "Enter":
          e.preventDefault();
          onEnter();
          break;
        default: {
          const n = parseInt(e.key, 10);
          if (!isNaN(n) && n >= 1 && n <= 9) {
            onNumber(n);
          }
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onUp, onDown, onEnter, onNumber, onCtrlC, enabled]);
}
