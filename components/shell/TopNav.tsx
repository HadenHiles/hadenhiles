"use client";

import { useStore, useMode } from "@/lib/store";
import type { AppMode } from "@/lib/routes";

const NAV_TABS: { label: string; mode: AppMode }[] = [
  { label: "Work",       mode: "work" },
  { label: "Experience", mode: "experience" },
  { label: "Knowledge",  mode: "knowledge" },
  { label: "About",      mode: "about" },
];

export function TopNav() {
  const mode = useMode();
  const { setMode, setContactOpen } = useStore();

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Logo slot — replace with <Image src="/logo/logo.png" ... /> once asset is ready */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg bg-surface2 border border-border flex items-center justify-center"
          aria-label="Haden Hiles logo"
        >
          <span className="font-mono text-xs font-bold text-accent select-none">HH</span>
        </div>
        <span className="font-mono text-sm text-muted hidden sm:block select-none">
          haden hiles
        </span>
      </div>

      {/* Mode tabs */}
      <nav className="flex gap-0.5" aria-label="Site sections">
        {NAV_TABS.map((tab) => {
          const isActive = mode === tab.mode;
          return (
            <button
              key={tab.mode}
              onClick={() => setMode(tab.mode)}
              aria-current={isActive ? "page" : undefined}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                transition-colors select-none
                ${isActive
                  ? "text-text bg-surface2 border border-border/60"
                  : "text-muted hover:text-text hover:bg-surface2/60"
                }
              `}
            >
              {tab.label}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode("tui")}
          className="px-3 py-1.5 text-sm text-muted hover:text-text border border-border hover:border-accent/40 rounded-lg transition-colors hidden sm:block"
          aria-label="Launch terminal"
        >
          Terminal
        </button>
        <button
          onClick={() => setContactOpen(true)}
          className="px-3 py-1.5 text-sm font-medium text-bg bg-accent hover:bg-accent/90 rounded-lg transition-colors"
        >
          Contact
        </button>
      </div>
    </header>
  );
}
