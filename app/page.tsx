"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMode } from "@/lib/store";
import { TuiHandoff } from "@/components/tui/TuiHandoff";
import { TuiShell } from "@/components/tui/TuiShell";
import { SiteShell } from "@/components/shell/SiteShell";
import { ContactModal } from "@/components/shell/ContactModal";
import { MotionPreferenceSync } from "@/components/shell/MotionPreferenceSync";
import { duration, ease } from "@/lib/motion";

// Single root component — TUI and GUI share the same React tree so that
// Framer Motion's layoutId="handoff-shell" can animate across the transition.
// URL is updated as a side effect via window.history.pushState in the store.
export default function PortfolioRoot() {
  const mode = useMode();
  const isTUI = mode === "tui";

  return (
    <LayoutGroup>
      {/* Sync prefers-reduced-motion to store on mount */}
      <MotionPreferenceSync />
      <main
        className={`
          min-h-screen flex
          ${isTUI
            ? "items-center justify-center p-4 sm:p-8"
            : "flex-col"
          }
        `}
      >
        <TuiHandoff isTUI={isTUI}>
          <AnimatePresence mode="wait">
            {isTUI ? (
              <motion.div
                key="tui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.short, ease: ease.standard }}
              >
                <TuiShell />
              </motion.div>
            ) : (
              <motion.div
                key="gui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.short, ease: ease.standard }}
              >
                <SiteShell />
              </motion.div>
            )}
          </AnimatePresence>
        </TuiHandoff>
      </main>

      {/* ContactModal is mounted globally so TUI and GUI both trigger it */}
      <ContactModal />
    </LayoutGroup>
  );
}
