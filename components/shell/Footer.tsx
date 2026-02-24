"use client";

import { useStore, useReducedMotion } from "@/lib/store";

export function Footer() {
  const reducedMotion = useReducedMotion();
  const { setReducedMotion } = useStore();

  return (
    <footer className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-muted font-mono mt-auto">
      <span>haden hiles</span>

      <div className="flex items-center gap-4">
        {/* Reduced motion toggle */}
        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          className="hover:text-text transition-colors"
          aria-label={`${reducedMotion ? "Enable" : "Disable"} animations`}
          title={`${reducedMotion ? "Enable" : "Disable"} animations`}
        >
          {reducedMotion ? "motion: off" : "motion: on"}
        </button>
      </div>
    </footer>
  );
}
