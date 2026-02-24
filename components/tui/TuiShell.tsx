"use client";

import { useEffect } from "react";
import { useStore, useTuiState } from "@/lib/store";
import { useTuiKeyboard } from "@/lib/keyboard";
import { BootLog } from "./BootLog";
import { Menu } from "./Menu";
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

  // Run boot sequence once on mount
  useEffect(() => {
    runBootScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation (only when TUI is active)
  useTuiKeyboard({
    enabled: true,
    onUp: () => setMenuIndex(Math.max(0, menuIndex - 1)),
    onDown: () =>
      setMenuIndex(Math.min(MENU_ITEMS.length - 1, menuIndex + 1)),
    onEnter: () => activateMenuItem(menuIndex),
    onNumber: (n) => {
      const idx = n - 1;
      if (idx < MENU_ITEMS.length) {
        setMenuIndex(idx);
        activateMenuItem(idx);
      }
    },
    onCtrlC: () => {
      appendHistory({
        type: "out",
        text: "^C  okay, okay. launching GUI...",
      });
      setTimeout(() => activateMenuItem(4), 1200);
    },
  });

  return (
    <div className="p-6 flex flex-col gap-2 min-h-[440px]">
      {/* Header */}
      <div className="font-mono text-xs text-border select-none mb-1">
        hadensystem — arrow keys · number shortcuts · type commands
      </div>

      {/* Boot log */}
      <BootLog history={history} />

      {/* Menu — appears after boot */}
      {bootComplete && (
        <Menu
          activeIndex={menuIndex}
          bootComplete={bootComplete}
          onSelect={setMenuIndex}
          onActivate={activateMenuItem}
        />
      )}

      {/* Command line */}
      <div className="mt-auto">
        <CommandLine
          value={commandBuffer}
          onChange={setCommandBuffer}
          onSubmit={runTuiCommand}
          bootComplete={bootComplete}
        />
      </div>
    </div>
  );
}
