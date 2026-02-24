"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useStore, useTuiState } from "@/lib/store";
import { useTuiKeyboard } from "@/lib/keyboard";
import { BootLog } from "./BootLog";
import { CommandLine } from "./CommandLine";
import { MENU_ITEMS } from "@/lib/routes";

export function TuiShell() {
  const { bootComplete, menuIndex, commandBuffer, history, currentPath } = useTuiState();
  const {
    runBootScript,
    setMenuIndex,
    setCommandBuffer,
    runTuiCommand,
    activateMenuItem,
    appendHistory,
    navigateToMode,
  } = useStore();

  // Track whether the terminal input has focus — controls which "cursor" blinks
  const [inputFocused, setInputFocused] = useState(false);

  // Blur input and return focus to menu navigation
  const blurToMenu = useCallback(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, []);

  // Focus the terminal input line
  const focusTerminalInput = useCallback(() => {
    (document.querySelector("[data-terminal-input]") as HTMLInputElement)?.focus();
  }, []);

  // Ref to the log+menu scroll container — shared for unified wheel handling
  const logScrollRef = useRef<HTMLDivElement>(null);
  // Keep latest values in refs so wheel callback never goes stale
  const menuIndexRef = useRef(menuIndex);
  menuIndexRef.current = menuIndex;
  const bootCompleteRef = useRef(bootComplete);
  bootCompleteRef.current = bootComplete;

  // Run boot sequence once on mount
  useEffect(() => {
    runBootScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation — arrow keys blur input so cursor moves to menu
  useTuiKeyboard({
    enabled: true,
    onUp: () => {
      if (inputFocused) {
        // ↑ from input returns cursor to the menu (no index change)
        blurToMenu();
      } else {
        blurToMenu();
        setMenuIndex(Math.max(0, menuIndex - 1));
      }
    },
    onDown: () => {
      if (!inputFocused && menuIndex === MENU_ITEMS.length - 1 && bootComplete) {
        // ↓ past last item focuses the terminal input
        focusTerminalInput();
      } else if (!inputFocused) {
        blurToMenu();
        setMenuIndex(Math.min(MENU_ITEMS.length - 1, menuIndex + 1));
      }
    },
    onEnter: () => activateMenuItem(menuIndex),
    onNumber: (n) => {
      const idx = n - 1;
      if (idx < MENU_ITEMS.length) {
        setMenuIndex(idx);
        activateMenuItem(idx);
      }
    },
    onCtrlC: () => {
      appendHistory({ type: "out", text: "^C  okay, okay. launching GUI..." });
      setTimeout(() => activateMenuItem(4), 1200);
    },
  });

  // Unified wheel: scroll log/menu first, then navigate menu at boundary
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const log = logScrollRef.current;
    const scrollingDown = e.deltaY > 0;

    if (log) {
      const atBottom = log.scrollTop + log.clientHeight >= log.scrollHeight - 2;
      const atTop = log.scrollTop <= 2;

      if (scrollingDown && !atBottom) {
        log.scrollTop += Math.abs(e.deltaY);
        return;
      }
      if (!scrollingDown && !atTop) {
        log.scrollTop -= Math.abs(e.deltaY);
        return;
      }
    }

    // At boundary — navigate menu (also blur input so cursor is on menu)
    if (!bootCompleteRef.current) return;
    (document.activeElement as HTMLElement)?.blur();
    if (scrollingDown) {
      setMenuIndex(Math.min(MENU_ITEMS.length - 1, menuIndexRef.current + 1));
    } else {
      setMenuIndex(Math.max(0, menuIndexRef.current - 1));
    }
  }, [setMenuIndex]);

  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div ref={shellRef} className="p-4 flex flex-col h-screen">
      {/* Header */}
      <div className="font-mono text-xs text-border/60 select-none mb-3 shrink-0 flex items-center justify-between">
        <span className="hidden sm:inline">hadensystem — ↑↓ navigate · [n] select · enter activate · type commands</span>
        <span className="sm:hidden">hadensystem</span>
        <button
          onClick={() => activateMenuItem(4)}
          className="
            ml-4 shrink-0 px-2.5 py-1 rounded
            border border-border/50 text-muted/70
            hover:border-accent/60 hover:text-accent
            transition-colors duration-150 cursor-default
          "
          aria-label="Switch to GUI site"
        >
          view site →
        </button>
      </div>

      {/* Log + menu — unified scrollable area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <BootLog
          history={history}
          scrollRef={logScrollRef}
          bootComplete={bootComplete}
          menuIndex={menuIndex}
          menuActive={!inputFocused}
          onMenuSelect={setMenuIndex}
          onMenuActivate={activateMenuItem}
          onAction={navigateToMode}
        />
      </div>

      {/* Command line — always at bottom */}
      <div className="shrink-0 mt-2">
        <CommandLine
          value={commandBuffer}
          onChange={setCommandBuffer}
          onSubmit={runTuiCommand}
          onEnterEmpty={() => activateMenuItem(menuIndex)}
          onFocusChange={setInputFocused}
          bootComplete={bootComplete}
          currentPath={currentPath}
        />
      </div>
    </div>
  );
}
