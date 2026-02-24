"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useStore, useMode } from "@/lib/store";
import type { AppMode } from "@/lib/routes";

const NAV_TABS: { label: string; mode: AppMode; sectionId: string }[] = [
  { label: "Work",       mode: "work",       sectionId: "section-work"       },
  { label: "Experience", mode: "experience", sectionId: "section-experience" },
  { label: "Knowledge",  mode: "knowledge",  sectionId: "section-knowledge"  },
  { label: "About",      mode: "about",      sectionId: "section-about"      },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function TopNav() {
  const mode = useMode();
  const { setMode, setContactOpen } = useStore();
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add backdrop shadow once user scrolls
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleTab = (tab: typeof NAV_TABS[number]) => {
    setMode(tab.mode);
    scrollTo(tab.sectionId);
  };

  return (
    <header
      className={`
        flex items-center justify-between px-5 sm:px-8 py-3.5
        border-b border-border sticky top-0 z-20 transition-all
        ${scrolled ? "bg-bg/90 backdrop-blur-md shadow-sm" : "bg-bg/80 backdrop-blur-sm"}
      `}
    >
      {/* Logo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-3 shrink-0"
        aria-label="Back to top"
      >
        <div className="h-7 w-auto flex items-center" aria-label="Haden Hiles logo">
          {logoError ? (
            <span className="font-mono text-sm font-bold text-accent select-none">HH</span>
          ) : (
            <Image
              src="/images/logo/logo_color.png"
              alt="Haden Hiles"
              width={90}
              height={28}
              className="object-contain h-7 w-auto"
              onError={() => setLogoError(true)}
              priority
            />
          )}
        </div>
      </button>

      {/* Mode tabs */}
      <nav className="flex gap-0.5" aria-label="Site sections">
        {NAV_TABS.map((tab) => {
          const isActive = mode === tab.mode;
          return (
            <button
              key={tab.mode}
              onClick={() => handleTab(tab)}
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
          className="px-3 py-1.5 text-sm text-muted hover:text-text border border-border hover:border-accent/40 rounded-lg transition-colors hidden sm:block font-mono"
          aria-label="Launch terminal"
        >
          &gt;_
        </button>
        <button
          onClick={() => setContactOpen(true)}
          className="px-4 py-1.5 text-sm font-medium text-bg bg-accent hover:bg-accent/90 rounded-lg transition-colors"
        >
          Contact
        </button>
      </div>
    </header>
  );
}
