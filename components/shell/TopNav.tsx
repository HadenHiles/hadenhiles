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

      {/* Mobile full-screen menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.short, ease: ease.standard }}
            className="sm:hidden fixed inset-0 z-50 bg-bg flex flex-col"
          >
            {/* Top bar with logo + close */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <button
                onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }}
                className="flex items-center gap-3 shrink-0"
                aria-label="Back to top"
              >
                <div className="h-7 w-auto flex items-center">
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
                    />
                  )}
                </div>
              </button>

              {/* Close button */}
              <motion.button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-muted hover:text-accent transition-colors"
                aria-label="Close menu"
                animate="open"
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

            {/* Centered nav items */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-2" aria-label="Site sections">
              {NAV_TABS.map((tab, i) => {
                const isActive = mode === tab.mode;
                return (
                  <motion.button
                    key={tab.mode}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: duration.short,
                      ease: ease.standard,
                    }}
                    onClick={() => handleTab(tab)}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      w-full max-w-xs flex items-center justify-center gap-3
                      px-6 py-4 rounded-card text-xl font-medium
                      transition-colors select-none
                      ${isActive
                        ? "text-accent bg-accent/10 border border-accent/20"
                        : "text-text hover:text-accent hover:bg-surface2/60"
                      }
                    `}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                    )}
                  </motion.button>
                );
              })}

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: NAV_TABS.length * 0.06 + 0.05, duration: duration.micro }}
                className="w-full max-w-xs"
              >
                <div className="my-3 border-t border-border/30" />
                <button
                  onClick={() => { setMode("tui"); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-card text-base text-muted hover:text-accent hover:bg-surface2/60 transition-colors font-mono"
                >
                  &gt;_ Terminal
                </button>
              </motion.div>
            </nav>

            {/* Bottom label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: duration.micro }}
              className="pb-8 text-center font-mono text-xs text-border/50 select-none"
            >
              hadenhiles.com
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
