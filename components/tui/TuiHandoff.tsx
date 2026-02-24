"use client";

import { motion } from "framer-motion";
import { duration, ease } from "@/lib/motion";

interface TuiHandoffProps {
  children: React.ReactNode;
  isTUI: boolean;
}

// The morph container. Both TUI and GUI render inside this element.
// layoutId="handoff-shell" anchors Framer Motion's FLIP animation across
// state changes. Both branches must render this same component to get the
// morphing effect — never put it inside AnimatePresence.
export function TuiHandoff({ children, isTUI }: TuiHandoffProps) {
  return (
    <motion.div
      layoutId="handoff-shell"
      layout
      className={`
        bg-surface border border-border overflow-hidden
        transition-[border-radius]
        ${isTUI
          ? "rounded-modal w-full max-w-2xl mx-auto"
          : "rounded-card w-full min-h-screen"
        }
      `}
      transition={{
        layout: { duration: duration.medium, ease: ease.inOut },
      }}
    >
      {children}
    </motion.div>
  );
}
