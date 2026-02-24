"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEntry } from "@/lib/store";
import { MENU_ITEMS } from "@/lib/routes";
import { duration, ease } from "@/lib/motion";

const levelColor: Record<string, string> = {
  info:   "text-muted",
  ok:     "text-text",
  warn:   "text-yellow-400",
  banner: "text-accent",
  dim:    "text-muted/40",
};

const typeStyle: Record<string, string> = {
  log: "",
  cmd: "text-accent font-mono",
  out: "text-text",
  err: "text-red-400",
};

const levelIcon: Record<string, string> = {
  info: "·",
  ok:   "✓",
  warn: "⚠",
  // banner and dim have no icon prefix
};

interface BootLogProps {
  history: HistoryEntry[];
  scrollRef: React.RefObject<HTMLDivElement>;
  bootComplete: boolean;
  menuIndex: number;
  menuActive: boolean;
  onMenuSelect: (i: number) => void;
  onMenuActivate: (i: number) => void;
  onAction: (mode: string) => void;
}

export function BootLog({
  history,
  scrollRef,
  bootComplete,
  menuIndex,
  menuActive,
  onMenuSelect,
  onMenuActivate,
  onAction,
}: BootLogProps) {
  // Scroll to bottom when new entries appear or when menu first renders
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history.length, bootComplete, scrollRef]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto overflow-x-hidden font-mono text-sm pr-1 scrollbar-thin"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {/* Boot log entries */}
      <AnimatePresence initial={false}>
        {history.map((entry, i) => {
          // Action entries — styled as a clickable link/button
          if (entry.type === "action") {
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.micro, ease: ease.standard }}
                onClick={() => onAction(entry.actionMode!)}
                className="block w-full text-left leading-relaxed mt-1 mb-1 text-accent font-mono hover:underline cursor-default select-none"
              >
                {entry.text}
              </motion.button>
            );
          }

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.micro, ease: ease.standard }}
              className={`leading-relaxed ${
                entry.type === "log"
                  ? levelColor[entry.level ?? "info"]
                  : typeStyle[entry.type as keyof typeof typeStyle] ?? ""
              } ${entry.type === "log" && (entry.level === "banner" || entry.level === "dim") ? "whitespace-pre" : ""}`}
            >
              {entry.type === "log" && entry.level !== "banner" && entry.level !== "dim" && (
                <span className="text-border mr-2 select-none w-3 inline-block">
                  {levelIcon[entry.level ?? "info"]}
                </span>
              )}
              {entry.text}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Inline menu — appears after boot, baked into the terminal output */}
      {bootComplete && (
        <div className="mt-3 mb-1" role="menu" aria-label="Navigation">
          {/* Visual separator */}
          <div className="text-border/50 mb-2 select-none">────────────────</div>

          {MENU_ITEMS.map((item, i) => {
            const isActive = i === menuIndex;
            return (
              <motion.button
                key={item.label}
                role="menuitem"
                aria-current={isActive ? "true" : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: duration.short,
                  ease: ease.standard,
                  delay: i * 0.04,
                }}
                onClick={() => {
                  onMenuSelect(i);
                  onMenuActivate(i);
                }}
                onMouseEnter={() => onMenuSelect(i)}
                className={`
                  w-full flex items-center text-left leading-7
                  transition-colors cursor-default select-none
                  ${isActive ? "text-text" : "text-muted hover:text-text/80"}
                `}
              >
                {/* Block cursor — blinks when menu is active, static+dim when input is focused */}
                <span
                  className={`w-4 shrink-0 text-accent select-none ${
                    isActive
                      ? menuActive
                        ? "cursor-blink"
                        : "opacity-20"
                      : "opacity-0"
                  }`}
                  aria-hidden="true"
                >
                  ▌
                </span>

                {/* Number hint */}
                <span
                  className={`w-5 shrink-0 text-xs select-none ${
                    isActive ? "text-accent/60" : "text-muted/30"
                  }`}
                >
                  {item.number}
                </span>

                {/* Label */}
                <span className={isActive ? "font-medium" : ""}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
