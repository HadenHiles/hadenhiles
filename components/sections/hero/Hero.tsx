"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { duration, ease } from "@/lib/motion";
import about from "@/content/about.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GitHubStats {
  repos: number;
  commitsAllTime: number;
  commitsThisYear: number;
  commitsThisMonth: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${n}+`;
}

function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setStats(data as GitHubStats);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}

// ─── Social links ─────────────────────────────────────────────────────────────

const githubUrl = about.contact.github ?? "https://github.com/HadenHiles";
const linkedinUrl = about.contact.linkedin;

const socialLinks = [
  {
    label: "GitHub",
    href: githubUrl,
    download: false,
    mobileColor: "#1b1f24",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: linkedinUrl,
    download: false,
    mobileColor: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    download: true,
    mobileColor: "#8A5CFF",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 shrink-0"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 18 15 15" />
      </svg>
    ),
  },
];

// ─── Animation variants ────────────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
  exit: { opacity: 0, transition: { duration: duration.short, ease: ease.standard } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.short, ease: ease.out } },
};

// ─── Shared cursor badge wrapper ──────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

export function Hero() {
  const { setMode, setContactOpen, selectProject } = useStore();
  const { stats, loading, error } = useGitHubStats();

  // Photo tilt spring
  const photoRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 90, damping: 16, mass: 1.4 });
  const springY = useSpring(rawY, { stiffness: 90, damping: 16, mass: 1.4 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);

  const [isRevealed, setIsRevealed] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = photoRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const statItems = [
    {
      value: loading ? null : stats ? `${stats.repos}` : "—",
      label: "repos (public + private)",
    },
    {
      value: loading ? null : stats ? formatCount(stats.commitsAllTime) : "—",
      label: "commits all time",
    },
    {
      value: loading ? null : stats ? formatCount(stats.commitsThisYear) : "—",
      label: "commits past year",
    },
    {
      value: loading ? null : stats ? `${stats.commitsThisMonth}` : "—",
      label: "commits this month",
    },
  ];

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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-20 flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:gap-y-0">
        {/* ── Headline (mobile: 1st, desktop: col-1 row-1) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, ease: ease.standard }}
          className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end lg:pb-8"
        >
          {/* Eyebrow */}
          <p className="font-mono text-sm text-accent mb-6 tracking-wide">
            full stack engineer · ux first
          </p>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text leading-[0.95] tracking-tight">
            I build software
            <br />
            <span className="text-muted">people love</span>
            <br />
            to use.
          </h1>
        </motion.div>

        {/* ── Stats + CTAs (mobile: 3rd, desktop: col-1 row-2) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, ease: ease.standard, delay: 0.15 }}
          className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start"
        >
          {/* Stats — or GitHub activity fallback */}
          {error ? (
            <div className="py-8 mb-12 border-y border-border/40">
              <a
                href={`${githubUrl}?tab=overview`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-text border border-border hover:border-accent/40 rounded-xl transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View GitHub activity
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 py-8 border-y border-border/40">
              {statItems.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-text tabular-nums">
                    {s.value === null ? (
                      <span className="inline-block w-12 h-7 rounded bg-border/40 animate-pulse" />
                    ) : (
                      s.value
                    )}
                  </div>
                  <div className="text-xs text-muted mt-1 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                selectProject(null);
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

        {/* ── Photo (mobile: 2nd, desktop: col-2 row-1 span-2) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration.medium, ease: ease.standard, delay: 0.1 }}
          className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex flex-col items-center lg:justify-end lg:items-end"
        >
          {/* Mouse-tracking wrapper */}
          <div
            ref={photoRef}
            className="relative select-none cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsRevealed((v) => !v)}
          >
            {/* 3D-tilt layer */}
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 900 }}
              className="relative"
            >
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

                {/* Desktop reveal overlay */}
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      variants={overlayVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-bg/92 via-bg/40 to-transparent"
                    >
                      <div className="w-full flex gap-2.5">
                        {socialLinks.map((link) => (
                          <motion.a
                            key={link.label}
                            variants={linkVariants}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...(link.download ? { download: true } : {})}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-surface/80 border border-border/60 hover:border-accent/50 hover:bg-surface text-muted hover:text-text transition-colors cursor-pointer"
                          >
                            {link.icon}
                            <span className="text-[11px] font-medium leading-none">{link.label}</span>
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Mobile social links — always visible below photo on small screens */}
          <div className="flex gap-5 justify-center mt-10 lg:hidden">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                {...(link.download ? { download: true } : {})}
                className="flex flex-col items-center gap-2.5"
              >
                <span
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg [&>svg]:!w-6 [&>svg]:!h-6 [&>svg]:!shrink-0 transition-opacity hover:opacity-80 active:opacity-60"
                  style={{ background: link.mobileColor }}
                >
                  {link.icon}
                </span>
                <span className="text-xs text-muted font-medium tracking-wide">{link.label}</span>
              </a>
            ))}
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
