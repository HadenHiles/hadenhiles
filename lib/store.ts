import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { devtools } from "zustand/middleware";
import type { AppMode } from "./routes";
import { MENU_ITEMS } from "./routes";

export interface HistoryEntry {
  type: "log" | "cmd" | "out" | "err" | "action" | "img";
  level?: "info" | "ok" | "warn" | "banner" | "dim";
  text: string;
  actionMode?: string; // for "action" type: AppMode to navigate to
  src?: string;        // for "img" type: image URL
  alt?: string;        // for "img" type: alt text
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
  bootStarted: boolean;
  menuIndex: number;
  commandBuffer: string;
  history: HistoryEntry[];
  hiddenOptionsUnlocked: boolean;
  currentPath: string;
  sudoPending: boolean;
  pendingSudoCommand: string | null;

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
  setCurrentPath: (path: string) => void;
  unlockHiddenOptions: () => void;
  runTuiCommand: (cmd: string) => void;
  runBootScript: () => void;
  activateMenuItem: (index: number) => void;
  navigateToMode: (mode: string) => void;
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
      bootStarted: false,
      menuIndex: 0,
      commandBuffer: "",
      history: [],
      hiddenOptionsUnlocked: false,
      currentPath: "~",
      sudoPending: false,
      pendingSudoCommand: null,

      // ── GUI actions ────────────────────────────────────────────────────────
      setMode: (mode) => {
        const prev = get().mode;
        set({ mode });
        if (typeof window !== "undefined") {
          let url: string;
          if (mode === "tui") {
            url = "/";
          } else if (mode === "home") {
            url = "/site";
          } else {
            url = `/site?mode=${mode}`;
          }
          // pushState for TUI ↔ GUI transitions (meaningful nav),
          // replaceState for section changes (scroll-driven, avoid spamming history)
          const isModeSwitch = (prev === "tui") !== (mode === "tui");
          if (isModeSwitch) {
            window.history.pushState({}, "", url);
          } else {
            window.history.replaceState({}, "", url);
          }
        }
      },

      selectProject: (id) => {
        set({ selectedProjectId: id });
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          if (id) {
            url.searchParams.set("mode", "work");
            url.searchParams.set("project", id);
          } else {
            url.searchParams.delete("project");
          }
          window.history.replaceState({}, "", url.toString());
        }
      },

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

      setCurrentPath: (path) => set({ currentPath: path }),

      unlockHiddenOptions: () => set({ hiddenOptionsUnlocked: true }),

      activateMenuItem: (index) => {
        const item = MENU_ITEMS[index];
        if (!item) return;

        // Contact — open modal
        if ("isContact" in item && item.isContact) {
          get().appendHistory({ type: "out", text: "opening contact..." });
          set({ isContactOpen: true });
          return;
        }

        // "Use GUI" handoff — navigate directly without showing section content
        if ("isHandoff" in item && item.isHandoff) {
          get().appendHistory({
            type: "log",
            level: "ok",
            text: "handoff: guiRenderer engaged → site",
          });
          setTimeout(() => get().setMode(item.mode as AppMode), 340);
          return;
        }

        // Specs (index 0) — async: fetch GitHub stats then display
        if (index === 0) {
          get().appendHistory({ type: "log", level: "info", text: "fetching stats..." });
          Promise.all([
            import("@/components/tui/tuiSections"),
            fetch("/api/github").then((r) => r.json()).catch(() => null),
          ]).then(([{ buildSpecs }, data]) => {
            const stats = data && !data.error ? data : null;
            const lines = buildSpecs(stats);
            lines.forEach((line) => get().appendHistory(line));
            get().appendHistory({
              type: "action",
              text: `→ open ${item.label.toLowerCase()} in site`,
              actionMode: item.mode as string,
            });
          });
          return;
        }

        // Content sections — show condensed TUI content then offer navigation
        import("@/components/tui/tuiSections").then(({ SECTION_CONTENT }) => {
          const lines = SECTION_CONTENT[index];
          if (lines) lines.forEach((line) => get().appendHistory(line));
          get().appendHistory({
            type: "action",
            text: `→ open ${item.label.toLowerCase()} in site`,
            actionMode: item.mode as string,
          });
        });
      },

      navigateToMode: (mode) => {
        get().appendHistory({
          type: "log",
          level: "ok",
          text: `handoff: guiRenderer engaged → ${mode}`,
        });
        setTimeout(() => get().setMode(mode as AppMode), 340);
      },

      runBootScript: () => {
        // Guard against double-fire from React Strict Mode
        if (get().bootStarted) return;
        set({ bootStarted: true });

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
        const cmd = rawCmd.trim();
        const { appendHistory, clearHistory, unlockHiddenOptions, activateMenuItem, setCurrentPath } =
          get();

        set({ commandBuffer: "" });

        // ── Sudo password entry ───────────────────────────────────────────────
        if (get().sudoPending) {
          const masked = "•".repeat(Math.max(cmd.length, 6));
          appendHistory({ type: "cmd", text: `[sudo] password: ${masked}` });
          if (cmd === "DogsRule123") {
            const savedCmd = get().pendingSudoCommand!;
            set({ sudoPending: false, pendingSudoCommand: null });
            appendHistory({ type: "out", text: "authentication successful" });
            import("@/components/tui/tuiCommands").then(({ handleCommand }) => {
              handleCommand(savedCmd, {
                appendHistory,
                unlockHiddenOptions,
                activateMenuItem,
                currentPath: get().currentPath,
                setCurrentPath,
              });
            });
          } else {
            set({ sudoPending: false, pendingSudoCommand: null });
            appendHistory({ type: "err", text: "sudo: sorry, try again" });
          }
          return;
        }

        // Handle clear before delegating to command module
        if (cmd.toLowerCase() === "clear") {
          clearHistory();
          return;
        }

        appendHistory({ type: "cmd", text: `$ ${rawCmd}` });

        // ── Sudo prompt — intercept before tuiCommands so password is always required
        const cmdLower = cmd.toLowerCase();
        if (cmdLower.startsWith("sudo ") && cmd.trim().split(/\s+/).length > 1) {
          appendHistory({ type: "out", text: "[sudo] password for visitor: " });
          appendHistory({
            type: "log",
            level: "dim",
            text: "hint: careful not to leak your password in any commits ;)",
          });
          set({ sudoPending: true, pendingSudoCommand: cmd });
          return;
        }

        // Lazy import to avoid circular deps
        import("@/components/tui/tuiCommands").then(({ handleCommand }) => {
          handleCommand(cmd, {
            appendHistory,
            unlockHiddenOptions,
            activateMenuItem,
            currentPath: get().currentPath,
            setCurrentPath,
          });
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
    currentPath:          s.currentPath,
  })));

export const useReducedMotion = () => useStore((s) => s.reducedMotion);

export const useScrollIntent = () =>
  useStore(useShallow((s) => ({
    scrollVelocity:    s.scrollVelocity,
    isExploringSlowly: s.isExploringSlowly,
  })));
