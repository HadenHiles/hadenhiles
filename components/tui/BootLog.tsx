"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEntry } from "@/lib/store";
import { duration, ease } from "@/lib/motion";

const levelColor: Record<string, string> = {
  info: "text-muted",
  ok:   "text-text",
  warn: "text-yellow-400",
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
};

export function BootLog({ history }: { history: HistoryEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history.length]);

  return (
    <div
      className="overflow-y-auto max-h-52 font-mono text-sm space-y-0.5 pr-1 scrollbar-thin"
      aria-live="polite"
      aria-label="Boot log"
    >
      <AnimatePresence initial={false}>
        {history.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.micro, ease: ease.standard }}
            className={`leading-relaxed ${
              entry.type === "log"
                ? levelColor[entry.level ?? "info"]
                : typeStyle[entry.type]
            }`}
          >
            {entry.type === "log" && (
              <span className="text-border mr-2 select-none w-3 inline-block">
                {levelIcon[entry.level ?? "info"]}
              </span>
            )}
            {entry.text}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
