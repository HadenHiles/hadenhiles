"use client";

import { useRef, useCallback } from "react";
import { useStore } from "@/lib/store";

// Wraps the main scroll container and tracks scroll velocity.
// updateScrollVelocity in the store derives isExploringSlowly automatically.
export function ScrollIntent({ children }: { children: React.ReactNode }) {
  const updateScrollVelocity = useStore((s) => s.updateScrollVelocity);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const now = Date.now();
      const dt = now - lastTime.current;
      const dy = el.scrollTop - lastScrollY.current;

      if (dt > 0) {
        const velocity = (dy / dt) * 1000; // px/s
        updateScrollVelocity(velocity);
      }

      lastScrollY.current = el.scrollTop;
      lastTime.current = now;

      // Reset velocity to 0 after scroll stops
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updateScrollVelocity(0);
      });
    },
    [updateScrollVelocity]
  );

  return (
    <div
      onScroll={handleScroll}
      className="overflow-y-auto flex-1 scrollbar-thin"
    >
      {children}
    </div>
  );
}
