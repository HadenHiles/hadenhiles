"use client";

import { useEffect, useRef } from "react";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { Hero } from "@/components/sections/hero/Hero";
import { Work } from "@/components/sections/work/Work";
import { Experience } from "@/components/sections/experience/Experience";
import { Knowledge } from "@/components/sections/knowledge/Knowledge";
import { About } from "@/components/sections/about/About";
import { useStore, useMode } from "@/lib/store";
import type { AppMode } from "@/lib/routes";

const SECTION_MODES: { id: string; mode: AppMode }[] = [
  { id: "section-hero",       mode: "home"       },
  { id: "section-knowledge",  mode: "knowledge"  },
  { id: "section-work",       mode: "work"       },
  { id: "section-experience", mode: "experience" },
  { id: "section-about",      mode: "about"      },
];

/** On first mount, scroll to the active section (handles TUI → section handoff). */
function InitialScrollEffect() {
  const mode = useMode();

  useEffect(() => {
    if (mode === "home") return; // Already at top — no scroll needed
    const sectionId = `section-${mode}`;
    // Delay so Framer Motion's entry transition completes first
    const timer = setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);
    return () => clearTimeout(timer);
  // Only run once on mount — intentionally omitting mode from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [];

  return null;
}

/** Watches scroll position and keeps the active nav mode in sync with the visible section. */
function SectionObserver() {
  const { setMode } = useStore();
  const lastModeRef = useRef<AppMode | null>(null);

  useEffect(() => {
    // Trigger line: ~80px sticky header + 60px breathing room.
    // The last section whose top is at or above this line is the active one.
    const TRIGGER = 80 + 60;

    function update() {
      const sections = SECTION_MODES
        .map(({ id, mode: sectionMode }) => ({ el: document.getElementById(id), mode: sectionMode }))
        .filter((s): s is { el: HTMLElement; mode: AppMode } => s.el !== null);

      let active: AppMode = sections[0].mode;
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= TRIGGER) {
          active = s.mode;
        }
      }

      if (active !== lastModeRef.current) {
        lastModeRef.current = active;
        setMode(active);
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update(); // sync on mount
    return () => window.removeEventListener("scroll", update);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function SiteShell() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main id="main-content" className="flex-1">
        <InitialScrollEffect />
        <SectionObserver />

        {/* Hero — full viewport landing */}
        <div id="section-hero">
          <Hero />
        </div>

        {/* Knowledge */}
        <div id="section-knowledge" className="scroll-mt-16 border-t border-border/40">
          <div className="px-6 sm:px-10 py-20 max-w-7xl mx-auto">
            <Knowledge />
          </div>
        </div>

        {/* Projects */}
        <div id="section-work" className="scroll-mt-16 border-t border-border/40">
          <Work />
        </div>

        {/* Experience — header inside container, timeline full-bleed */}
        <div id="section-experience" className="scroll-mt-16 border-t border-border/40">
          <Experience />
        </div>

        {/* About */}
        <div id="section-about" className="scroll-mt-16 border-t border-border/40">
          <div className="px-6 sm:px-10 py-20 max-w-7xl mx-auto">
            <About />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
