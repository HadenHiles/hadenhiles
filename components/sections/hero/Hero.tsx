"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { duration, ease } from "@/lib/motion";

const stats = [
  { value: "10+", label: "years building" },
  { value: "30+", label: "technologies mastered" },
  { value: "6",   label: "products shipped" },
];

export function Hero() {
  const { setMode, setContactOpen } = useStore();

  return (
    <section
      id="section-home"
      aria-label="Hero"
      className="relative min-h-[92vh] flex items-center overflow-hidden"
    >
      {/* Subtle radial glow behind photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 w-[55%] h-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 80% 40%, #8A5CFF, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* ── Left: text ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, ease: ease.standard }}
        >
          {/* Eyebrow */}
          <p className="font-mono text-sm text-accent mb-6 tracking-wide">
            full stack engineer · ux first
          </p>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text leading-[0.95] tracking-tight mb-10">
            I build software
            <br />
            <span className="text-muted">people love</span>
            <br />
            to use.
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12 py-8 border-y border-border/40">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-bold text-text tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs text-muted mt-1 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setMode("work");
                setTimeout(() => {
                  document.getElementById("section-work")?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="px-6 py-3 text-sm font-semibold text-bg bg-accent hover:bg-accent/90 rounded-xl transition-colors"
            >
              View Projects
            </button>
            <button
              onClick={() => setContactOpen(true)}
              className="px-6 py-3 text-sm text-muted hover:text-text border border-border hover:border-border/60 rounded-xl transition-colors"
            >
              Get in touch
            </button>
            <button
              onClick={() => setMode("tui")}
              className="px-5 py-3 text-sm text-muted hover:text-text font-mono transition-colors"
              aria-label="Open terminal view"
            >
              &gt; terminal
            </button>
          </div>
        </motion.div>

        {/* ── Right: photo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration.medium, ease: ease.standard, delay: 0.1 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Decorative tilted card behind */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[32px] bg-accent/15 border border-accent/20 rotate-3 scale-105"
            />
            {/* Photo container */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] rounded-[28px] overflow-hidden border border-border/40">
              <Image
                src="/images/purple-bg-new.jpg"
                alt="Haden Hiles"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 420px"
              />
            </div>
            {/* Floating accent badge */}
            <div className="absolute -bottom-4 -left-4 bg-surface border border-border rounded-xl px-4 py-2.5 shadow-lg">
              <p className="font-mono text-xs text-accent">v4.0 · present</p>
              <p className="text-xs text-text font-medium mt-0.5">UX-first engineering</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: duration.short }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <span className="font-mono text-xs text-border">scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-border to-transparent"
        />
      </motion.div>
    </section>
  );
}
