"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ExperienceEntry } from "@/types/content";
import { fadeSlideUp, duration, ease } from "@/lib/motion";

export function VersionTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const lastVersion = entries[entries.length - 1]?.version ?? "";
  const [activeVersion, setActiveVersion] = useState(lastVersion);
  const active = entries.find((e) => e.version === activeVersion) ?? entries[0];

  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden md:flex gap-8">
        {/* Left rail */}
        <nav
          className="flex flex-col w-52 shrink-0"
          aria-label="Version history"
        >
          {entries.map((entry, i) => {
            const isActive = entry.version === activeVersion;
            return (
              <div key={entry.version} className="relative flex items-start gap-3 pb-6">
                {/* Connecting line */}
                {i < entries.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
                )}

                <button
                  onClick={() => setActiveVersion(entry.version)}
                  aria-current={isActive ? "step" : undefined}
                  className="relative flex flex-col items-center mt-1 shrink-0"
                >
                  <span
                    className={`
                      w-3.5 h-3.5 rounded-full border-2 transition-all
                      ${isActive
                        ? "bg-accent border-accent shadow-[0_0_8px_rgba(138,92,255,0.4)]"
                        : "bg-surface border-border hover:border-muted"
                      }
                    `}
                  />
                </button>

                <button
                  onClick={() => setActiveVersion(entry.version)}
                  className={`text-left transition-colors ${
                    isActive ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  <div className="font-mono text-xs text-accent">{entry.version}</div>
                  <div className="text-sm font-medium leading-tight mt-0.5">
                    {entry.title}
                  </div>
                  <div className="text-xs text-border mt-0.5">{entry.dateRange}</div>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Right panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVersion}
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: duration.short, ease: ease.standard }}
            className="flex-1 p-6 bg-surface border border-border rounded-card"
          >
            <VersionDetail entry={active} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: accordion */}
      <div className="md:hidden space-y-2">
        {entries.map((entry) => {
          const isOpen = entry.version === activeVersion;
          return (
            <div
              key={entry.version}
              className="border border-border rounded-card overflow-hidden"
            >
              <button
                onClick={() => setActiveVersion(isOpen ? "" : entry.version)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <span className="font-mono text-xs text-accent mr-2">
                    {entry.version}
                  </span>
                  <span className="font-medium text-text text-sm">{entry.title}</span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: duration.micro }}
                  className="text-muted text-lg leading-none select-none"
                >
                  ›
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: duration.short, ease: ease.standard }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-border">
                      <VersionDetail entry={entry} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

function VersionDetail({ entry }: { entry: ExperienceEntry }) {
  return (
    <>
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono text-sm text-accent">{entry.version}</span>
        <h3 className="text-lg font-semibold text-text">{entry.title}</h3>
      </div>
      <div className="text-sm text-muted mb-0.5">
        {entry.role}
        {entry.company && <span> — {entry.company}</span>}
      </div>
      <div className="text-xs text-border mb-4">{entry.dateRange}</div>
      <p className="text-text text-sm leading-relaxed mb-4">{entry.summary}</p>
      <ul className="space-y-1.5">
        {entry.highlights.map((h, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted">
            <span className="text-accent select-none mt-0.5 shrink-0">·</span>
            {h}
          </li>
        ))}
      </ul>
    </>
  );
}
