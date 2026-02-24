"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, useMode } from "@/lib/store";
import type { AppMode } from "@/lib/routes";
import { duration, ease } from "@/lib/motion";

const NAV_TABS: { label: string; mode: AppMode; sectionId: string }[] = [
  { label: "Work",       mode: "work",       sectionId: "section-work"       },
  { label: "Experience", mode: "experience", sectionId: "section-experience" },
  { label: "Knowledge",  mode: "knowledge",  sectionId: "section-knowledge"  },
  { label: "About",      mode: "about",      sectionId: "section-about"      },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Hamburger line variants — morph three lines into an X
const lineTransition = { duration: duration.short, ease: ease.standard };

const topVariant    = { closed: { rotate: 0,   y: 0  }, open: { rotate: 45,   y: 6  } };
const midVariant    = { closed: { opacity: 1, scaleX: 1 }, open: { opacity: 0, scaleX: 0 } };
const bottomVariant = { closed: { rotate: 0,   y: 0  }, open: { rotate: -45,  y: -6 } };

export function TopNav() {
  const mode = useMode();
  const { setMode, setContactOpen } = useStore();
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Add backdrop shadow + shrink header once user scrolls
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on mode change
  useEffect(() => {
    setMobileOpen(false);
  }, [mode]);

  const handleTab = (tab: typeof NAV_TABS[number]) => {
    setMode(tab.mode);
    scrollTo(tab.sectionId);
    setMobileOpen(false);
  };

  return (
    <header
      className={`
        relative flex items-center justify-between
        px-5 sm:px-8
        border-b border-border sticky top-0 z-20
        transition-all duration-300
        ${scrolled
          ? "py-2 bg-bg/95 backdrop-blur-md shadow-sm"
          : "py-4 bg-bg/80 backdrop-blur-sm"
        }
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

      {/* Desktop mode tabs */}
      <nav className="hidden sm:flex gap-0.5" aria-label="Site sections">
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
          className="hidden sm:block px-3 py-1.5 text-sm text-muted hover:text-text border border-border hover:border-accent/40 rounded-lg transition-colors font-mono"
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

        {/* Mobile hamburger — three lines morph into X */}
        <motion.button
          onClick={() => setMobileOpen((o) => !o)}
          className="sm:hidden p-1.5 text-muted hover:text-accent transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          animate={mobileOpen ? "open" : "closed"}
        >
          <div className="w-5 h-3.5 flex flex-col justify-between">
            <motion.span
              className="block h-px bg-current origin-center"
              variants={topVariant}
              transition={lineTransition}
            />
            <motion.span
              className="block h-px bg-current origin-center"
              variants={midVariant}
              transition={lineTransition}
            />
            <motion.span
              className="block h-px bg-current origin-center"
              variants={bottomVariant}
              transition={lineTransition}
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile dropdown — TUI-themed with staggered entrance */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: duration.short, ease: ease.standard }}
            className="sm:hidden absolute top-full left-0 right-0 overflow-hidden border-b border-border bg-bg/98 backdrop-blur-md"
          >
            {/* Terminal-style top rule */}
            <div className="mx-5 pt-3 pb-1 font-mono text-xs text-border/50 select-none">
              navigation/
            </div>

            {NAV_TABS.map((tab, i) => {
              const isActive = mode === tab.mode;
              return (
                <motion.button
                  key={tab.mode}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.045,
                    duration: duration.micro,
                    ease: ease.standard,
                  }}
                  onClick={() => handleTab(tab)}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    w-full flex items-center gap-3 px-5 py-3 font-mono text-sm text-left
                    transition-colors select-none
                    ${isActive ? "text-text" : "text-muted hover:text-text/80"}
                  `}
                >
                  {/* Block cursor — matches TUI menu */}
                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: duration.micro }}
                    className="text-accent text-base leading-none select-none shrink-0 cursor-blink"
                    aria-hidden="true"
                  >
                    ▌
                  </motion.span>
                  <span className={`${isActive ? "font-medium" : ""} -ml-1`}>
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}

            {/* Divider + Terminal option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: NAV_TABS.length * 0.045, duration: duration.micro }}
            >
              <div className="mx-5 my-1 border-t border-border/30" />
              <button
                onClick={() => { setMode("tui"); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-5 py-3 font-mono text-sm text-left text-muted hover:text-accent transition-colors"
              >
                <span className="text-base leading-none select-none shrink-0 opacity-0 pointer-events-none" aria-hidden="true">▌</span>
                <span className="-ml-1">&gt;_ Terminal</span>
              </button>
            </motion.div>

            <div className="pb-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
