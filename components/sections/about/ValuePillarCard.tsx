"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Pillar } from "@/types/content";
import { duration, ease } from "@/lib/motion";

export function ValuePillarCard({ pillar }: { pillar: Pillar }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      aria-expanded={expanded}
      className="w-full text-left p-5 bg-surface border border-border rounded-card hover:border-border/70 transition-colors"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text text-lg">{pillar.name}</h3>
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: duration.micro }}
          className="text-muted text-xl leading-none select-none"
        >
          +
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.short, ease: ease.standard }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-muted text-sm leading-relaxed">{pillar.story}</p>
            <p className="mt-3 text-sm font-medium italic">
              <span className="text-border">&ldquo;</span>
              <span className="text-accent">{pillar.shapeWork}</span>
              <span className="text-border">&rdquo;</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
