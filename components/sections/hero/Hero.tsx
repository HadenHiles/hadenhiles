"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore, useScrollIntent } from "@/lib/store";
import { getSubtext } from "@/components/orchestrator/AttentionSignals";
import { duration, ease } from "@/lib/motion";

export function Hero() {
  const { setMode, setContactOpen } = useStore();
  const { isExploringSlowly } = useScrollIntent();
  const subtext = getSubtext(isExploringSlowly);

  return (
    <section
      aria-label="Hero"
      className="max-w-3xl mx-auto py-12 sm:py-20"
    >
      {/* Eyebrow */}
      <p className="font-mono text-sm text-accent mb-4">
        principal engineer · how to hockey
      </p>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl font-semibold text-text leading-tight mb-3">
        I design and build software
        <br />
        <span className="text-muted">from the user down.</span>
      </h1>

      {/* Adaptive subtext */}
      <div className="h-6 relative mb-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={subtext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.short, ease: ease.standard }}
            className="text-muted text-sm absolute inset-0"
          >
            {subtext}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setMode("work")}
          className="px-5 py-2.5 text-sm font-medium text-bg bg-accent hover:bg-accent/90 rounded-lg transition-colors"
        >
          View Projects
        </button>
        <button
          onClick={() => setContactOpen(true)}
          className="px-5 py-2.5 text-sm text-muted hover:text-text border border-border hover:border-border/60 rounded-lg transition-colors"
        >
          Get in touch
        </button>
        <button
          onClick={() => setMode("tui")}
          className="px-5 py-2.5 text-sm text-muted hover:text-text font-mono transition-colors"
          aria-label="Open terminal view"
        >
          &gt; terminal
        </button>
      </div>
    </section>
  );
}
