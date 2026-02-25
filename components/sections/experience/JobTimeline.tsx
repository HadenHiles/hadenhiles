"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { Job } from "@/types/content";

// ─── Dimensions ───────────────────────────────────────────────────────────────
const CARD_W = 320;
const CARD_H = 300;
// Detail panel appears opposite the card across the spine when the card arrives at center
const DETAIL_H = 175;
const DETAIL_OFFSET = 120; // distance from spine to detail panel center
const NODE_W = 72;
const GAP = 32;

const DEFAULT_CARD_OFFSET = 200;
const HEADER_H = 160;

// Slightly lighter than site bg (#0B0B0E) and surface (#101018) so cards visually pop
const CARD_BG = "#18181f";

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({
  job,
  y,
  opacity,
  above,
  cardOffset,
}: {
  job: Job;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  above: boolean;
  cardOffset: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  const connectorH = cardOffset - CARD_H / 2;

  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, width: CARD_W, height: CARD_H, y, opacity }}
      className="relative"
    >
      {/* Connector line (card edge → spine) */}
      <div
        className="absolute left-1/2 pointer-events-none"
        style={{
          width: 1,
          height: connectorH + 20,
          ...(above
            ? { top: "100%", transform: "translateX(-50%)", background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }
            : { bottom: "100%", transform: "translateX(-50%)", background: "linear-gradient(0deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }),
        }}
        aria-hidden="true"
      />

      {/* Perspective / flip wrapper */}
      <div style={{ perspective: 1000, width: CARD_W, height: CARD_H }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
          onPointerDown={(e) => { pointerDownRef.current = { x: e.clientX, y: e.clientY }; }}
          onClick={(e) => {
            const start = pointerDownRef.current;
            pointerDownRef.current = null;
            if (!start) return;
            if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) {
              setFlipped((f) => !f);
            }
          }}
          style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", cursor: "pointer" }}
        >
          <CardFront job={job} />
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
      className="absolute inset-0 rounded-2xl border overflow-hidden flex flex-col"
      style={{
        backgroundColor: CARD_BG,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        boxShadow: job.current
          ? "0 0 0 1px rgba(138,92,255,0.22), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        borderColor: job.current ? "rgba(138,92,255,0.38)" : "rgba(255,255,255,0.10)",
      }}
    >
      {/* Subtle cover texture */}
      {job.coverImage && (
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-[0.09] scale-110"
            style={{ filter: "blur(2px) saturate(0.4)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(24,24,31,0.4) 0%, rgba(24,24,31,0.88) 60%, rgba(24,24,31,1) 100%)" }}
          />
        </div>
      )}

      <div className="relative flex flex-col p-6 h-full">
        {/* Logo / company name + current badge */}
        <div className="flex items-start justify-between gap-3 min-h-[52px]">
          {job.companyLogo ? (
            <div
              className="shrink-0 flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.96)", padding: "8px 14px", borderRadius: 10, maxWidth: 160 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={job.companyLogo} alt={job.company} className="object-contain" style={{ height: 36, maxWidth: 140 }} />
            </div>
          ) : (
            <span className="font-semibold text-text/90 text-base leading-tight">{job.company}</span>
          )}
          {job.current && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono shrink-0 tracking-wide">
              current
            </span>
          )}
        </div>

        {/* Flexible spacer — pushes date/role/skills cluster to the bottom */}
        <div className="flex-1" />

        {/* Date · role · divider · skills — tightly grouped, no large gap between role and tags */}
        <div className="flex flex-col gap-2">
          <div className="font-mono text-[11px] text-white/45 tracking-widest uppercase">
            {job.dateRange}
          </div>
          <div className="text-sm font-semibold text-white/85 leading-snug">
            {job.role}
          </div>
          <div className="h-px bg-white/[0.08]" />
          {job.primarySkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.primarySkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-2 py-0.5 rounded font-mono tracking-wide"
                  style={{
                    background: "rgba(138,92,255,0.10)",
                    color: "rgba(190,165,255,0.85)",
                    border: "1px solid rgba(138,92,255,0.22)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Flip hint */}
        <div className="absolute bottom-3 right-4 pointer-events-none select-none">
          <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.20)" }}>
            {job.coverImage ? "flip for photo" : "hover details →"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Card Back ────────────────────────────────────────────────────────────────

function CardBack({ job }: { job: Job }) {
  // Photo back: full-bleed cover image with gradient label overlay
  if (job.coverImage) {
    return (
      <div
        className="absolute inset-0 rounded-2xl border overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderColor: job.current ? "rgba(138,92,255,0.3)" : "rgba(255,255,255,0.10)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.65)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={job.coverImage}
          alt={job.company}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Darkening gradient — bottom-heavy for label legibility */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.22) 55%, transparent 100%)" }}
        />
        {/* Label overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-mono text-[10px] text-accent/85 tracking-widest uppercase mb-1">{job.company}</p>
          <p className="text-[12px] text-white/80 font-semibold leading-snug">{job.role}</p>
          <p className="font-mono text-[10px] text-white/45 mt-1">{job.dateRange}</p>
        </div>
      </div>
    );
  }

  // Text fallback when no cover image
  return (
    <div
      className="absolute inset-0 rounded-2xl border overflow-hidden flex flex-col"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        background: job.current
          ? "linear-gradient(140deg, rgba(138,92,255,0.12) 0%, rgba(24,24,31,1) 50%)"
          : "linear-gradient(140deg, rgba(30,30,50,0.8) 0%, rgba(24,24,31,1) 50%)",
        borderColor: job.current ? "rgba(138,92,255,0.3)" : "rgba(255,255,255,0.10)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex flex-col gap-3 p-6 h-full"
        style={{ overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "thin", scrollbarColor: "rgba(138,92,255,0.3) transparent" }}
      >
        <div className="flex items-center justify-between gap-2 shrink-0">
          <span className="font-mono text-[11px] text-accent/80 tracking-widest uppercase">{job.company}</span>
          {job.current && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono tracking-wide">current</span>
          )}
        </div>
        <p className="text-[11px] text-white/65 leading-relaxed shrink-0">{job.summary}</p>
        <div className="h-px bg-white/[0.07] shrink-0" />
        <ul className="flex flex-col gap-1.5">
          {job.highlights.slice(0, 4).map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent/50 shrink-0 mt-[3px] text-[8px]">▸</span>
              <span className="text-[10px] text-white/60 leading-relaxed line-clamp-2">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Job Detail Panel ─────────────────────────────────────────────────────────
// Snaps in on the opposite side of the spine from the card when the card reaches center.

function JobDetailPanel({
  job,
  y,
  opacity,
  above,
}: {
  job: Job;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  above: boolean;
}) {
  // Gap between the spine and the near edge of the detail panel
  const connectorH = DETAIL_OFFSET - DETAIL_H / 2;

  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, width: CARD_W, height: DETAIL_H, y, opacity }}
      className="relative pointer-events-none select-none"
    >
      {/* Connector: bridges gap from panel edge to spine */}
      <div
        className="absolute left-1/2"
        style={{
          width: 1,
          height: connectorH + 8,
          ...(above
            // detail is below spine → connector exits top of panel, pointing upward
            ? { bottom: "100%", transform: "translateX(-50%)", background: "linear-gradient(0deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }
            // detail is above spine → connector exits bottom of panel, pointing downward
            : { top: "100%", transform: "translateX(-50%)", background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }),
        }}
        aria-hidden="true"
      />

      {/* Panel surface */}
      <div
        className="absolute inset-0 rounded-xl border overflow-hidden flex flex-col p-4 gap-2"
        style={{
          background: job.current
            ? "linear-gradient(145deg, rgba(138,92,255,0.07) 0%, rgba(24,24,31,0.96) 60%)"
            : "rgba(24,24,31,0.95)",
          borderColor: job.current ? "rgba(138,92,255,0.20)" : "rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
        }}
      >
        <p className="font-mono text-[9px] text-accent/65 tracking-widest uppercase shrink-0">
          {job.company} · highlights
        </p>
        <ul className="flex flex-col gap-1.5">
          {job.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent/45 shrink-0 mt-[2px] text-[8px]">▸</span>
              <span className="text-[10px] text-white/65 leading-relaxed line-clamp-2">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
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
    <div className="flex-none flex flex-col items-center gap-2 select-none" style={{ width: NODE_W }}>
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
      <span className={`font-mono text-[10px] tracking-widest text-center leading-tight ${accent ? "text-accent" : "text-white/45"}`}>
        {label}
      </span>
      {sublabel && (
        <span className="font-mono text-[9px] text-white/30 text-center leading-tight -mt-1">
          {sublabel}
        </span>
      )}
    </div>
  );
}

// ─── Animated card + detail panel ─────────────────────────────────────────────

function AnimatedCard({
  job,
  index,
  count,
  progress,
  cardOffset,
}: {
  job: Job;
  index: number;
  count: number;
  progress: MotionValue<number>;
  cardOffset: number;
}) {
  const above = index % 2 === 0;

  // Fraction at which this card is horizontally centered in the viewport
  const centerProgress = count > 1 ? (index / (count - 1)) * 0.88 : 0;

  // ── Card entrance ──────────────────────────────────────────────────────────
  const enterEnd   = index === 0 ? 0    : Math.min(centerProgress, 0.95);
  const enterStart = index === 0 ? -0.1 : Math.max(0, enterEnd - 0.12);

  const cardOpacity = useTransform(progress, [enterStart, enterEnd], [0, 1]);
  const cardSlide   = useTransform(progress, [enterStart, enterEnd], [above ? -20 : 20, 0]);

  // Card center sits at ±cardOffset from spine.
  // The anchor wrapper has height:0 (top = spine), so we shift by -(CARD_H/2) to center the card.
  const baseCardY = above ? -(cardOffset + CARD_H / 2) : (cardOffset - CARD_H / 2);
  const cardY = useTransform(cardSlide, (s) => baseCardY + s);

  // ── Detail panel entrance (snaps in as card arrives at center) ─────────────
  const detailStart = index === 0 ? -0.05 : Math.max(0, centerProgress - 0.02);
  const detailEnd   = index === 0 ?  0    : Math.min(1,  centerProgress + 0.06);

  const detailOpacity = useTransform(progress, [detailStart, detailEnd], [0, 1]);
  const detailSlide   = useTransform(progress, [detailStart, detailEnd], [above ? 12 : -12, 0]);

  // Detail panel on the opposite side of the spine from the card.
  // anchor top = spine; shift by -(DETAIL_H/2) to center the panel around detailY.
  const baseDetailY = above ? (DETAIL_OFFSET - DETAIL_H / 2) : -(DETAIL_OFFSET + DETAIL_H / 2);
  const detailY = useTransform(detailSlide, (s) => baseDetailY + s);

  return (
    // Zero-height flex item — serves as the spine-level anchor.
    // Both card and detail panel are absolutely positioned relative to it.
    <div style={{ position: "relative", width: CARD_W, height: 0, flexShrink: 0 }}>
      <JobCard
        job={job}
        y={cardY}
        opacity={cardOpacity}
        above={above}
        cardOffset={cardOffset}
      />
      <JobDetailPanel
        job={job}
        y={detailY}
        opacity={detailOpacity}
        above={above}
      />
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

  // Responsive card offset: clamp so top/bottom cards clear both the header (when visible)
  // and the bottom edge of the viewport, with a 12px minimum gap.
  const [cardOffset, setCardOffset] = useState(DEFAULT_CARD_OFFSET);
  useEffect(() => {
    function update() {
      const availH = window.innerHeight - HEADER_H;
      const maxOffset = Math.floor(availH / 2 - CARD_H / 2 - 12);
      setCardOffset(Math.min(DEFAULT_CARD_OFFSET, Math.max(80, maxOffset)));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Use scrollYProgress directly (no spring) for a 1:1 scroll feel.
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end start"],
  });

  const count = sorted.length;

  // Each job entry in the flex track occupies:
  //   spacer(GAP) · gap · card(CARD_W) · gap · spacer(GAP) · gap · node(NODE_W) = 5·GAP + CARD_W + NODE_W
  const WRAPPER_W = 5 * GAP + CARD_W + NODE_W; // 552px

  // Card 0 center from the track's motion origin:
  //   paddingLeft(60) + spacer(GAP) + gap(GAP) + halfCard(CARD_W/2)
  const CARD0_CENTER     = 60 + GAP + GAP + CARD_W / 2;           // 284
  const LAST_CARD_CENTER = 60 + (count - 1) * WRAPPER_W + GAP + GAP + CARD_W / 2;

  // Map xEnd to progress=0.88 so the last card reaches center before the budget is
  // exhausted, leaving a comfortable dwell period before the section unpins.
  const xStart = `calc(50vw - ${CARD0_CENTER}px)`;
  const xEnd   = `calc(50vw - ${LAST_CARD_CENTER}px)`;
  const translateX = useTransform(scrollYProgress, [0, 0.88], [xStart, xEnd]);

  const hintOpacity    = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const headerOpacity  = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  // Shift the whole timeline area down while the header is visible so cards don't overlap it
  const timelineShiftY = useTransform(scrollYProgress, [0, 0.08], [HEADER_H / 2, 0]);

  // Dynamic year label on the NOW orb
  const ORB_LEFT = 28;
  const [orbLabel, setOrbLabel] = useState(String(sorted[0].startYear));
  const activeIdxRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const vw = window.innerWidth;
    const p = Math.min(latest, 0.88);
    const tX = (vw / 2 - CARD0_CENTER) + (p / 0.88) * (CARD0_CENTER - LAST_CARD_CENTER);
    let orbIdx = 0;
    for (let i = 0; i < count; i++) {
      const nodeVPx = (576 + i * WRAPPER_W) + tX;
      if (nodeVPx <= ORB_LEFT + NODE_W / 2) orbIdx = i;
    }
    if (orbIdx !== activeIdxRef.current) {
      activeIdxRef.current = orbIdx;
      setOrbLabel(String(sorted[orbIdx].startYear));
    }
  });

  // Budget: each card gets 700px of vertical scroll to enter, settle, and be readable.
  // 1400px tail buffer gives dwell time with the last card centered before unpinning.
  const scrollBudgetH = count * 700 + 1400;

  return (
    <div ref={stickyRef} style={{ height: `${scrollBudgetH}px` }}>
      <div className="sticky top-0 h-screen">
        <div className="absolute inset-0 overflow-hidden">

          {/* ── Section header ────────────────────────────────────────────────── */}
          <motion.div
            style={{
              opacity: headerOpacity,
              background: "linear-gradient(to bottom, rgba(13,13,18,0.97) 72%, transparent 100%)",
            }}
            className="absolute top-0 left-0 right-0 z-20 px-10 pt-10 pb-8 pointer-events-none select-none"
          >
            <p className="font-mono text-sm text-accent mb-2">experience</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-2">
              The Timeline
            </h2>
            <p className="text-muted text-sm">
              10+ years. Six companies. One thread running through all of it.
            </p>
          </motion.div>

          {/* ── Timeline area — full height, spine shifts down while header visible ── */}
          <motion.div
            className="absolute inset-0 flex items-center"
            style={{ y: timelineShiftY }}
          >

            {/* Spine line */}
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

            {/* NOW orb — pinned at left, year label updates as timeline scrolls */}
            <div
              className="absolute z-10 pointer-events-none select-none flex flex-col items-center gap-2"
              style={{ left: 28, top: "50%", transform: "translateY(-50%)" }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "rgb(138,92,255)",
                  border: "2px solid rgb(138,92,255)",
                  boxShadow: "0 0 14px rgba(138,92,255,0.6), 0 0 4px rgba(138,92,255,0.8)",
                }}
              />
              <span className="font-mono text-[10px] tracking-widest text-accent">{orbLabel}</span>
            </div>

            {/* Scrolling track */}
            <motion.div
              style={{ x: translateX, paddingLeft: 60, paddingRight: 60 }}
              className="flex items-center will-change-transform"
            >
              {sorted.map((job, i) => (
                <div key={job.slug} className="flex items-center" style={{ gap: GAP }}>
                  {/* Pre-card spine spacer */}
                  <div style={{ width: GAP, height: 1, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

                  <AnimatedCard
                    job={job}
                    index={i}
                    count={count}
                    progress={scrollYProgress}
                    cardOffset={cardOffset}
                  />

                  {/* Post-card spine spacer */}
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
              <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                scroll to travel back in time
              </span>
              <span style={{ color: "rgba(255,255,255,0.28)" }}>→</span>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
