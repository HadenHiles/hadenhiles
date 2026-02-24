"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMode } from "@/lib/store";
import { fadeSlideUp, duration, ease } from "@/lib/motion";
import { Work } from "@/components/sections/work/Work";
import { Experience } from "@/components/sections/experience/Experience";
import { Knowledge } from "@/components/sections/knowledge/Knowledge";
import { About } from "@/components/sections/about/About";

const SECTION_MAP = {
  work:       <Work />,
  experience: <Experience />,
  knowledge:  <Knowledge />,
  about:      <About />,
} as const;

export function OrchestratedView() {
  const mode = useMode();
  const section = SECTION_MAP[mode as keyof typeof SECTION_MAP];

  // Fallback: if mode is "tui" somehow (shouldn't happen), show Work
  const content = section ?? <Work />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        variants={fadeSlideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: duration.short, ease: ease.standard }}
        className="px-5 py-8"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
