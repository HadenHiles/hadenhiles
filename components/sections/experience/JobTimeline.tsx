"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { Job } from "@/types/content";

// ─── Card dimensions ──────────────────────────────────────────────────────────
const CARD_W = 320;
const CARD_H = 300;
const NODE_W = 72;
const GAP = 32;

// How many pixels above/below the spine center to place cards
// Card center sits ±CARD_OFFSET from spine; card edge is ±(CARD_OFFSET - CARD_H/2) from spine
const CARD_OFFSET = 188; // 188 - 150 = 38px gap between spine and card edge

// ─── Job Card (flip card) ─────────────────────────────────────────────────────

function JobCard({
  job,
  scrollOpacity,
  scrollY,
  above,
}: {
  job: Job;
  scrollOpacity: MotionValue<number>;
  scrollY: MotionValue<number>;
  above: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  // Connector line runs from card edge to spine
  const connectorH = CARD_OFFSET - CARD_H / 2; // 38px gap

  return (
    <motion.div
      style={{ opacity: scrollOpacity, y: scrollY }}
      className="relative flex-none"
      // y is handled externally for alternating, override here
    >
      {/* Connector line */}
      <div
        className="absolute left-1/2 pointer-events-none"
        style={{
          width: 1,
          height: connectorH + 20,
          background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
          ...(above
            ? { top: "100%", transform: "translateX(-50%)" }
            : { bottom: "100%", transform: "translateX(-50%)", background: "linear-gradient(0deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }),
        }}
        aria-hidden="true"
      />

      {/* Flip hint */}
      <div
        className="absolute pointer-events-none select-none z-20"
        style={{
          ...(above ? { bottom: "100%", marginBottom: connectorH + 26 } : { top: "100%", marginTop: connectorH + 26 }),
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          {flipped ? "← back" : "hover details →"}
        </span>
      </div>

      {/* Perspective wrapper */}
      <div style={{ perspective: 1000, width: CARD_W, height: CARD_H }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
          onClick={() => setFlipped((f) => !f)}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            cursor: "pointer",
          }}
        >
          {/* ── FRONT ── */}
          <CardFront job={job} />
          {/* ── BACK ── */}
          <CardBack job={job} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Card Front ───────────────────────────────────────────────────────────────

function CardFront({ job }: { job: Job }) {
  return (
    <div
      className={`absolute inset-0 rounded-2xl border overflow-hidden flex flex-col bg-[#0d0d12]`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        boxShadow: job.current
          ? "0 0 0 1px rgba(138,92,255,0.18), 0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        borderColor: job.current ? "rgba(138,92,255,0.35)" : "rgba(255,255,255,0.07)",
      }}
    >
      {/* Cover texture */}
      {job.coverImage && (
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-[0.07] scale-110"
            style={{ filter: "blur(2px) saturate(0.4)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(13,13,18,0.45) 0%, rgba(13,13,18,0.9) 60%, rgba(13,13,18,1) 100%)",
            }}
          />
        </div>
      )}

      <div className="relative flex flex-col gap-4 p-6 h-full">
        {/* Logo row */}
        <div className="flex items-start justify-between gap-3 min-h-[52px]">
          {job.companyLogo ? (
            <div
              className="shrink-0 flex items-center justify-center rounded-xl"
              style={{
                background: "rgba(255,255,255,0.96)",
                padding: "8px 14px",
                borderRadius: 10,
                maxWidth: 160,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.companyLogo}
                alt={job.company}
                className="object-contain"
                style={{ height: 36, maxWidth: 140 }}
              />
            </div>
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
        <div className="font-mono text-[11px] text-white/30 tracking-widest uppercase">
          {job.dateRange}
        </div>

        {/* Role */}
        <div className="text-sm font-semibold text-white/85 leading-snug">
          {job.role}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Skills */}
        {job.primarySkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {job.primarySkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2 py-0.5 rounded font-mono tracking-wide"
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

        {/* Flip hint overlay */}
        <div className="absolute bottom-3 right-4 pointer-events-none select-none">
          <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.18)" }}>
            hover to flip
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Card Back ────────────────────────────────────────────────────────────────

function CardBack({ job }: { job: Job }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl border overflow-hidden flex flex-col"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        background: job.current
          ? "linear-gradient(140deg, rgba(138,92,255,0.12) 0%, rgba(13,13,18,1) 50%)"
          : "linear-gradient(140deg, rgba(30,30,50,0.8) 0%, rgba(13,13,18,1) 50%)",
        borderColor: job.current ? "rgba(138,92,255,0.3)" : "rgba(255,255,255,0.1)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex flex-col gap-3 p-6 h-full overflow-hidden">
        {/* Company name header */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <span className="font-mono text-[11px] text-accent/80 tracking-widest uppercase">
            {job.company}
          </span>
          {job.current && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono tracking-wide">
              current
            </span>
          )}
        </div>

        {/* Summary */}
        <p className="text-[11px] text-white/60 leading-relaxed shrink-0">
          {job.summary}
        </p>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] shrink-0" />

        {/* Highlights */}
        <ul className="flex flex-col gap-1.5 overflow-hidden min-h-0">
          {job.highlights.slice(0, 4).map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent/50 shrink-0 mt-[3px] text-[8px]">▸</span>
              <span className="text-[10px] text-white/50 leading-relaxed line-clamp-2">{h}</span>
            </li>
          ))}
        </ul>
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
    <div
      className="flex-none flex flex-col items-center gap-2 select-none"
      style={{ width: NODE_W }}
    >
      <div
        className="relative z-10 shrink-0"
        style={{
          width: cap ? 14 : 10,
          height: cap ? 14 : 10,
          borderRadius: "50%",
          background: accent ? "rgb(138,92,255)" : "rgb(30,30,42)",
          border: accent
            ? "2px solid rgb(138,92,255)"
            : "2px solid rgba(255,255,255,0.15)",
          boxShadow: accent
            ? "0 0 14px rgba(138,92,255,0.6), 0 0 4px rgba(138,92,255,0.8)"
            : undefined,
        }}
      />
      <span
        className={`font-mono text-[10px] tracking-widest text-center leading-tight ${
          accent ? "text-accent" : "text-white/30"
        }`}
      >
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

// ─── Animated card with per-card scroll entrance ──────────────────────────────

function AnimatedCard({
  job,
  index,
  count,
  smoothProgress,
}: {
  job: Job;
  index: number;
  count: number;
  smoothProgress: MotionValue<number>;
}) {
  const above = index % 2 === 0;

  // Card 0 starts partially visible the moment the section pins (enterStart < 0).
  // Later cards fade in progressively as the track scrolls.
  const enterStart = index === 0 ? -0.08 : Math.max(0, (index / count) * 0.88 - 0.05);
  const enterEnd = Math.min(1, enterStart + 0.2);

  const opacity = useTransform(smoothProgress, [enterStart, enterEnd], [0, 1]);
  const slideY = useTransform(
    smoothProgress,
    [enterStart, enterEnd],
    [above ? -20 : 20, 0]
  );

  // Alternating vertical offset: even cards above spine, odd below
  const verticalOffset = above ? -CARD_OFFSET : CARD_OFFSET;

  // Combine the entrance slide with the alternating static offset
  const combinedY = useTransform(
    slideY,
    (slide) => verticalOffset + slide
  );

  return (
    <JobCard
      job={job}
      scrollOpacity={opacity}
      scrollY={combinedY}
      above={above}
    />
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

  const count = sorted.length;

  // Track width calculation
  // layout: [node] [gap] [spacer] [card] [spacer] [gap] [node] ... per entry
  const totalTrack =
    NODE_W +
    count * (GAP + CARD_W + GAP + NODE_W) +
    NODE_W;

  const xEnd = `calc(-${totalTrack}px + 100vw - 80px)`;
  const translateX = useTransform(smoothProgress, [0, 1], ["0px", xEnd]);

  const hintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  // Increase scroll budget to give alternating layout room and smooth travel
  const scrollBudgetH = count * 560;

  return (
    // No overflow on this div — overflow: clip/hidden on a sticky's parent
    // creates a containing-block boundary that breaks position:sticky in Chromium.
    <div ref={stickyRef} style={{ height: `${scrollBudgetH}px` }}>
      <div className="sticky top-0 h-screen">
        {/* Clipping wrapper lives INSIDE the sticky element so it doesn't
            affect the sticky's scroll-container chain */}
        <div className="absolute inset-0 overflow-hidden flex flex-col justify-center">

        {/* Spine line — full width */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 5%, rgba(255,255,255,0.07) 95%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Scrolling track — items-center keeps nodes on the spine */}
        <motion.div
          style={{ x: translateX, paddingLeft: 60, paddingRight: 60 }}
          className="flex items-center will-change-transform"
        >
          {/* "Now" node — leftmost since newest-first */}
          <TimelineNode label="NOW" accent cap />

          {sorted.map((job, i) => (
            <div
              key={job.slug}
              className="flex items-center"
              style={{ gap: GAP }}
            >
              {/* Pre-card spine spacer */}
              <div
                style={{
                  width: GAP,
                  height: 1,
                  background: "rgba(255,255,255,0.07)",
                  flexShrink: 0,
                }}
              />

              <AnimatedCard
                job={job}
                index={i}
                count={count}
                smoothProgress={smoothProgress}
              />

              {/* Post-card spine spacer */}
              <div
                style={{
                  width: GAP,
                  height: 1,
                  background: "rgba(255,255,255,0.07)",
                  flexShrink: 0,
                }}
              />

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
          <span
            className="font-mono text-xs"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            scroll to travel back in time
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
