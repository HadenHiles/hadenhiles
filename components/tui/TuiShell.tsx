"use client";

import { useEffect, useRef, useCallback } from "react";
import { useStore, useTuiState } from "@/lib/store";
import { useTuiKeyboard } from "@/lib/keyboard";
import { BootLog } from "./BootLog";
import { CommandLine } from "./CommandLine";
import { MENU_ITEMS } from "@/lib/routes";

export function TuiShell() {
  const { bootComplete, menuIndex, commandBuffer, history } = useTuiState();
  const {
    runBootScript,
    setMenuIndex,
    setCommandBuffer,
    runTuiCommand,
    activateMenuItem,
    appendHistory,
  } = useStore();

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

  // Keyboard navigation
  useTuiKeyboard({
    enabled: true,
    onUp: () => setMenuIndex(Math.max(0, menuIndex - 1)),
    onDown: () => setMenuIndex(Math.min(MENU_ITEMS.length - 1, menuIndex + 1)),
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

    // At boundary — navigate menu
    if (!bootCompleteRef.current) return;
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
      <div className="font-mono text-xs text-border/60 select-none mb-3 shrink-0">
        hadensystem — ↑↓ navigate · [n] select · enter activate · type commands
      </div>

      {/* Log + menu — unified scrollable area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <BootLog
          history={history}
          scrollRef={logScrollRef}
          bootComplete={bootComplete}
          menuIndex={menuIndex}
          onMenuSelect={setMenuIndex}
          onMenuActivate={activateMenuItem}
        />
      </div>

      {/* Command line — always at bottom */}
      <div className="shrink-0 mt-2">
        <CommandLine
          value={commandBuffer}
          onChange={setCommandBuffer}
          onSubmit={runTuiCommand}
          onEnterEmpty={() => activateMenuItem(menuIndex)}
          bootComplete={bootComplete}
        />
      </div>
    </div>
  );
}
