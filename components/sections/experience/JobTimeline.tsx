"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { Job } from "@/types/content";
import { duration, ease } from "@/lib/motion";

// ─── Card ─────────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  return (
    <div
      className={`
        relative w-80 flex-none rounded-2xl border overflow-hidden flex flex-col
        bg-[#0d0d12]
        ${job.current ? "border-accent/40" : "border-white/[0.07]"}
      `}
      style={{
        boxShadow: job.current
          ? "0 0 0 1px rgba(138,92,255,0.15), 0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Cover photo — very faint atmospheric texture */}
      {job.coverImage && (
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-[0.06] scale-110"
            style={{ filter: "blur(2px) saturate(0.4)" }}
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(160deg, rgba(13,13,18,0.5) 0%, rgba(13,13,18,0.92) 60%, rgba(13,13,18,1) 100%)"
          }} />
        </div>
      )}

      <div className="relative flex flex-col gap-5 p-7 h-full">
        {/* Logo row */}
        <div className="flex items-start justify-between gap-3 min-h-[40px]">
          {job.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.companyLogo}
              alt={job.company}
              className="h-8 w-auto max-w-[140px] object-contain"
              style={{ filter: "brightness(0) invert(1) opacity(0.85)" }}
            />
          ) : (
            <span className="font-semibold text-text/90 text-base leading-tight">
              {job.company}
            </span>
          )}
          {job.current && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono shrink-0 tracking-wide">
              current
            </span>
          )}
        </div>

        {/* Date */}
        <div className="font-mono text-xs text-white/30 tracking-widest uppercase">
          {job.dateRange}
        </div>

        {/* Role */}
        <div className="text-base font-medium text-white/80 leading-snug">
          {job.role}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Skills */}
        {job.primarySkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {job.primarySkills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2.5 py-1 rounded-md font-mono tracking-wide"
                style={{
                  background: "rgba(138,92,255,0.08)",
                  color: "rgba(180,150,255,0.75)",
                  border: "1px solid rgba(138,92,255,0.18)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Timeline node ────────────────────────────────────────────────────────────

function TimelineNode({
  label,
  sublabel,
  accent,
  cap,
}: {
  label: string;
  sublabel?: string;
  accent?: boolean;
  cap?: boolean;
}) {
  return (
    <div className="flex-none flex flex-col items-center gap-2 select-none" style={{ width: 72 }}>
      {/* Dot */}
      <div
        className="relative z-10 shrink-0"
        style={{
          width: cap ? 14 : 10,
          height: cap ? 14 : 10,
          borderRadius: "50%",
          background: accent ? "rgb(138,92,255)" : "rgb(30,30,42)",
          border: accent ? "2px solid rgb(138,92,255)" : "2px solid rgba(255,255,255,0.15)",
          boxShadow: accent ? "0 0 14px rgba(138,92,255,0.6), 0 0 4px rgba(138,92,255,0.8)" : undefined,
        }}
      />
      <span className={`font-mono text-[10px] tracking-widest text-center leading-tight ${accent ? "text-accent" : "text-white/30"}`}>
        {label}
      </span>
      {sublabel && (
        <span className="font-mono text-[9px] text-white/20 text-center leading-tight -mt-1">
          {sublabel}
        </span>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function JobTimeline({ jobs }: { jobs: Job[] }) {
  // Newest first
  const sorted = [...jobs].sort((a, b) => {
    if (a.startYear !== b.startYear) return b.startYear - a.startYear;
    return (b.current ? 1 : 0) - (a.current ? 1 : 0);
  });

  const stickyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.001,
  });

  // Card = w-80 = 320px, node = 72px, gap = 32px
  // Track: [node-start] [node] [gap] [card] [gap] [node] [gap] [card] ... [node-end]
  const CARD_W = 320;
  const NODE_W = 72;
  const GAP = 32;
  const count = sorted.length;
  // Total: leading node + (card + trailing node + gap)*count  – but we interleave:
  // start-node  (gap card gap node) * count  end-node
  const totalTrack =
    NODE_W +
    count * (GAP + CARD_W + GAP + NODE_W) +
    NODE_W; // oldest cap

  // How far we travel = totalTrack minus one full viewport width (100vw)
  // We use a CSS calc() string so it's responsive
  const xEnd = `calc(-${totalTrack}px + 100vw - 80px)`;

  const translateX = useTransform(smoothProgress, [0, 1], ["0px", xEnd]);

  // Fade hint out quickly
  const hintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  return (
    <div
      ref={stickyRef}
      // Scroll budget: generous per entry so motion feels relaxed
      style={{ height: `${count * 480}px` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center" style={{ overflow: "hidden" }}>

        {/* Spine line — full width */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 5%, rgba(255,255,255,0.07) 95%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Scrolling track */}
        <motion.div
          style={{ x: translateX }}
          className="flex items-center will-change-transform"
          // Extra left padding so the first node has breathing room from the edge
          // Extra right padding handled by xEnd calc
          style2={{ paddingLeft: 60, paddingRight: 60 }}
        >
          {/* "Now" cap — leftmost since newest-first */}
          <TimelineNode label="NOW" accent cap />

          {sorted.map((job) => (
            <div key={job.slug} className="flex items-center" style={{ gap: GAP }}>
              {/* Spine spacer */}
              <div style={{ width: GAP, height: 1, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
              <JobCard job={job} />
              <div style={{ width: GAP, height: 1, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
              <TimelineNode
                label={String(job.startYear)}
                sublabel={job.endYear ? String(job.endYear) : undefined}
              />
            </div>
          ))}

          {/* Trailing spacer */}
          <div style={{ width: 80, flexShrink: 0 }} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 right-10 flex items-center gap-2 pointer-events-none select-none"
        >
          <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            scroll to travel back
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
        </motion.div>
      </div>
    </div>
  );
}
