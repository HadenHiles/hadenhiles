import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { devtools } from "zustand/middleware";
import type { AppMode } from "./routes";
import { MENU_ITEMS } from "./routes";

export interface HistoryEntry {
  type: "log" | "cmd" | "out" | "err";
  level?: "info" | "ok" | "warn";
  text: string;
}

interface AppState {
  // ─── GUI state ────────────────────────────────────────────────────────────
  mode: AppMode;
  selectedProjectId: string | null;
  reducedMotion: boolean;
  scrollVelocity: number;
  isExploringSlowly: boolean;
  isContactOpen: boolean;

  // ─── TUI state ────────────────────────────────────────────────────────────
  bootComplete: boolean;
  menuIndex: number;
  commandBuffer: string;
  history: HistoryEntry[];
  hiddenOptionsUnlocked: boolean;

  // ─── GUI actions ──────────────────────────────────────────────────────────
  setMode: (mode: AppMode) => void;
  selectProject: (id: string | null) => void;
  setReducedMotion: (v: boolean) => void;
  updateScrollVelocity: (v: number) => void;
  setContactOpen: (v: boolean) => void;

  // ─── TUI actions ──────────────────────────────────────────────────────────
  appendHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  setMenuIndex: (i: number) => void;
  setCommandBuffer: (s: string) => void;
  unlockHiddenOptions: () => void;
  runTuiCommand: (cmd: string) => void;
  runBootScript: () => void;
  activateMenuItem: (index: number) => void;
}

export const useStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      mode: "tui",
      selectedProjectId: null,
      reducedMotion: false,
      scrollVelocity: 0,
      isExploringSlowly: true,
      isContactOpen: false,

      bootComplete: false,
      menuIndex: 0,
      commandBuffer: "",
      history: [],
      hiddenOptionsUnlocked: false,

      // ── GUI actions ────────────────────────────────────────────────────────
      setMode: (mode) => {
        set({ mode });
        if (typeof window !== "undefined") {
          const url = mode === "tui" ? "/" : `/site?mode=${mode}`;
          window.history.pushState({}, "", url);
        }
      },

      selectProject: (id) => set({ selectedProjectId: id }),

      setReducedMotion: (v) => set({ reducedMotion: v }),

      updateScrollVelocity: (v) => {
        const isExploringSlowly = Math.abs(v) < 600;
        set({ scrollVelocity: v, isExploringSlowly });
      },

      setContactOpen: (v) => set({ isContactOpen: v }),

      // ── TUI actions ────────────────────────────────────────────────────────
      appendHistory: (entry) =>
        set((s) => ({ history: [...s.history, entry] })),

      clearHistory: () => set({ history: [] }),

      setMenuIndex: (i) => set({ menuIndex: i }),

      setCommandBuffer: (s) => set({ commandBuffer: s }),

      unlockHiddenOptions: () => set({ hiddenOptionsUnlocked: true }),

      activateMenuItem: (index) => {
        const item = MENU_ITEMS[index];
        if (!item) return;

        if ("isContact" in item && item.isContact) {
          get().appendHistory({ type: "out", text: "opening contact..." });
          set({ isContactOpen: true });
          return;
        }

        get().appendHistory({
          type: "log",
          level: "ok",
          text: `handoff: guiRenderer engaged → ${item.label.toLowerCase()}`,
        });

        // Small delay so the user sees the log line before the morph begins
        setTimeout(() => {
          get().setMode(item.mode as AppMode);
        }, 340);
      },

      runBootScript: () => {
        // Lazy import to avoid circular deps — tuiScript has no store imports
        import("@/components/tui/tuiScript").then(({ BOOT_SCRIPT }) => {
          let cumulative = 0;
          BOOT_SCRIPT.forEach((line, i) => {
            cumulative += line.delayMs;
            setTimeout(() => {
              get().appendHistory({
                type: "log",
                level: line.level,
                text: line.text,
              });
              if (i === BOOT_SCRIPT.length - 1) {
                set({ bootComplete: true });
              }
            }, cumulative);
          });
        });
      },

      runTuiCommand: (rawCmd) => {
        const cmd = rawCmd.trim().toLowerCase();
        const { appendHistory, clearHistory, unlockHiddenOptions, activateMenuItem } =
          get();

        set({ commandBuffer: "" });

        // Handle clear before delegating to command module
        if (cmd === "clear") {
          clearHistory();
          return;
        }

        appendHistory({ type: "cmd", text: `> ${rawCmd}` });

        // Lazy import to avoid circular deps
        import("@/components/tui/tuiCommands").then(({ handleCommand }) => {
          handleCommand(cmd, { appendHistory, unlockHiddenOptions, activateMenuItem });
        });
      },
    }),
    { name: "portfolio-store" }
  )
);

// ─── Selector hooks ─────────────────────────────────────────────────────────
// Use these instead of raw useStore() to avoid 60fps scroll re-renders.

export const useMode = () => useStore((s) => s.mode);

export const useTuiState = () =>
  useStore(useShallow((s) => ({
    bootComplete:         s.bootComplete,
    menuIndex:            s.menuIndex,
    commandBuffer:        s.commandBuffer,
    history:              s.history,
    hiddenOptionsUnlocked: s.hiddenOptionsUnlocked,
  })));

export const useReducedMotion = () => useStore((s) => s.reducedMotion);

export const useScrollIntent = () =>
  useStore(useShallow((s) => ({
    scrollVelocity:    s.scrollVelocity,
    isExploringSlowly: s.isExploringSlowly,
  })));
