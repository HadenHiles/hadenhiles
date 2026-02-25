"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { Job } from "@/types/content";
import { duration, ease } from "@/lib/motion";

// ─── Single card ─────────────────────────────────────────────────────────────

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: duration.medium,
        ease: ease.standard,
        delay: index * 0.07,
      }}
      className="relative flex-none w-64 sm:w-72"
    >
      <div
        className={`
          relative h-full rounded-card border overflow-hidden flex flex-col
          bg-surface transition-colors duration-200
          ${job.current ? "border-accent/40" : "border-border"}
        `}
      >
        {/* Cover photo — blurred accent, not a focus */}
        {job.coverImage && (
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={job.coverImage}
              alt=""
              className="w-full h-full object-cover opacity-[0.07] blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/40" />
          </div>
        )}

        <div className="relative flex flex-col gap-4 p-5 h-full">
          {/* Company logo — primary visual */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-9 flex items-center">
              {job.companyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  height={36}
                  className="h-7 w-auto max-w-[120px] object-contain"
                />
              ) : (
                <span className="font-semibold text-text text-sm leading-tight">
                  {job.company}
                </span>
              )}
            </div>
            {job.current && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 font-mono shrink-0">
                current
              </span>
            )}
          </div>

          {/* Role + date */}
          <div>
            <div className="text-sm font-medium text-text leading-snug">{job.role}</div>
            <div className="text-xs text-border font-mono mt-0.5">{job.dateRange}</div>
          </div>

          {/* Skills */}
          {job.primarySkills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {job.primarySkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent/80 border border-accent/15 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Timeline dot + year label ────────────────────────────────────────────────

function TimelineMark({ year, current }: { year: string; current?: boolean }) {
  return (
    <div className="flex-none flex flex-col items-center gap-1.5 w-64 sm:w-72">
      <div
        className={`
          w-2.5 h-2.5 rounded-full border-2 shrink-0
          ${current
            ? "bg-accent border-accent shadow-[0_0_8px_rgba(138,92,255,0.55)]"
            : "bg-surface border-border"
          }
        `}
      />
      <span
        className={`font-mono text-xs tracking-wider ${current ? "text-accent" : "text-muted"}`}
      >
        {year}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function JobTimeline({ jobs }: { jobs: Job[] }) {
  const sorted = [...jobs].sort((a, b) => {
    if (a.startYear !== b.startYear) return a.startYear - b.startYear;
    return (a.current ? 1 : 0) - (b.current ? 1 : 0);
  });

  // The sticky scroll container — pins while the inner track scrolls horizontally
  const stickyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress with a spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // Calculate total translateX travel: (cards + gaps) minus viewport
  // Each card is ~288px wide (w-72) + 20px gap; plus marks between each pair
  // We drive this purely via percentage of the scroll range → CSS translateX
  const CARD_W = 288; // w-72 = 18rem ≈ 288px
  const GAP = 20;
  const COUNT = sorted.length;
  // Extra space: marks before each card + "present" mark at end
  const MARK_W = 288; // same flex-none width as cards
  const totalWidth = (COUNT * CARD_W) + ((COUNT + 1) * MARK_W) + ((COUNT * 2) * GAP);
  // We subtract roughly one viewport width (approximated in the transform below)
  const translateX = useTransform(
    smoothProgress,
    [0, 1],
    ["0px", `-${totalWidth - CARD_W}px`]
  );

  return (
    /*
     * Outer sticky wrapper — its height controls how much vertical scroll
     * maps to horizontal motion. More height = slower, more deliberate travel.
     */
    <div
      ref={stickyRef}
      // Height = enough room to scroll through all entries comfortably
      style={{ height: `${COUNT * 420}px` }}
      className="relative"
    >
      {/* Sticky inner — stays in view while outer scrolls */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Horizontal rule + scroll track */}
        <div className="relative">
          {/* The spine line — full width of the track */}
          <div
            className="absolute left-0 right-0 top-[18px] h-px bg-border/50"
            aria-hidden="true"
          />

          {/* Scrolling track */}
          <motion.div
            style={{ x: translateX }}
            className="flex items-start gap-5 pl-6 pr-24 will-change-transform"
          >
            {sorted.map((job, i) => (
              <div key={job.slug} className="flex items-start gap-5">
                {/* Year mark before each card */}
                <TimelineMark
                  year={String(job.startYear)}
                  current={false}
                />
                <JobCard job={job} index={i} />
              </div>
            ))}

            {/* "Present" cap */}
            <TimelineMark year="present" current />
          </motion.div>
        </div>

        {/* Scroll hint — fades out once user starts scrolling */}
        <motion.div
          style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }}
          className="absolute bottom-10 left-6 flex items-center gap-2 pointer-events-none select-none"
        >
          <span className="font-mono text-xs text-muted/50">scroll to explore</span>
          <span className="text-muted/40 text-sm">→</span>
        </motion.div>
      </div>
    </div>
  );
}

