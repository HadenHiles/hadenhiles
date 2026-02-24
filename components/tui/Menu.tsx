"use client";

import { motion } from "framer-motion";
import { MENU_ITEMS } from "@/lib/routes";
import { duration, ease } from "@/lib/motion";

interface MenuProps {
  activeIndex: number;
  bootComplete: boolean;
  onSelect: (index: number) => void;
  onActivate: (index: number) => void;
}

export function Menu({ activeIndex, bootComplete, onSelect, onActivate }: MenuProps) {
  return (
    <nav aria-label="Main navigation" className="mt-5 space-y-0.5">
      {MENU_ITEMS.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: bootComplete ? 1 : 0.2, x: 0 }}
            transition={{
              duration: duration.short,
              ease: ease.standard,
              delay: bootComplete ? i * 0.04 : 0,
            }}
            onClick={() => {
              onSelect(i);
              onActivate(i);
            }}
            onMouseEnter={() => onSelect(i)}
            aria-current={isActive ? "page" : undefined}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left
              font-mono text-sm transition-colors
              ${isActive ? "text-text" : "text-muted hover:text-text"}
            `}
          >
            {/* Purple > — only visible when active */}
            <span
              className={`text-accent font-bold select-none transition-opacity w-3 shrink-0 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              &gt;
            </span>

            {/* Number hint */}
            <span className="text-border select-none w-4 text-xs shrink-0">
              {item.number}.
            </span>

            <span>{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
