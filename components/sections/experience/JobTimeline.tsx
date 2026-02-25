"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { Job } from "@/types/content";
import knowledgeData from "@/content/knowledge.json";

// ─── Skill logo + emoji lookup (from knowledge.json) ─────────────────────────
const skillLogoMap: Record<string, string> = {};
const skillEmojiMap: Record<string, string> = {};
for (const category of knowledgeData as { skills: { name: string; logo?: string | null; emoji?: string | null }[] }[]) {
  for (const skill of category.skills) {
    if (skill.logo) skillLogoMap[skill.name] = skill.logo;
    if (skill.emoji) skillEmojiMap[skill.name] = skill.emoji;
  }
}

// ─── Dimensions ───────────────────────────────────────────────────────────────
const CARD_W = 320;
const CARD_H = 300;
const DETAIL_H = 64;
const DETAIL_OFFSET = 120;
const NODE_W = 72;
const GAP = 32;

const DEFAULT_CARD_OFFSET = 200;
const HEADER_H = 160;

const CARD_BG = "#18181f";

// ─── Expanded Job Card (modal overlay) ────────────────────────────────────────

function ExpandedJobCard({ job, onClose }: { job: Job; onClose: () => void }) {
  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: "min(720px, calc(100vw - 32px))",
          maxHeight: "min(88vh, 860px)",
          background: CARD_BG,
          border: job.current
            ? "1px solid rgba(138,92,255,0.38)"
            : "1px solid rgba(255,255,255,0.10)",
          boxShadow: job.current
            ? "0 0 0 1px rgba(138,92,255,0.15), 0 32px 80px rgba(0,0,0,0.75)"
            : "0 32px 80px rgba(0,0,0,0.75)",
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full"
          style={{
            width: 32,
            height: 32,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
            fontSize: 18,
            lineHeight: 1,
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* ── Scrollable container ── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(138,92,255,0.3) transparent",
          }}
        >
          {/* ── Cover photo — sticky so content scrolls up over it ── */}
          {job.coverImage && (
            <div
              style={{
                position: "sticky",
                top: 0,
                height: job.coverImageHeight ?? 200,
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.coverImage}
                alt={job.company}
                className="w-full h-full object-cover"
                style={{ objectPosition: job.coverImagePosition ?? "center" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(24,24,31,1) 0%, rgba(24,24,31,0.45) 50%, transparent 100%)" }}
              />
              {/* Logo pinned over gradient */}
              {job.companyLogo && (
                <div
                  className="absolute bottom-4 left-6 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.96)", padding: "6px 12px", borderRadius: 8, pointerEvents: "auto" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={job.companyLogo} alt={job.company} style={{ height: 75, maxWidth: 180, objectFit: "contain" }} />
                </div>
              )}
            </div>
          )}

          {/* ── Content — stacks above the sticky image as you scroll ── */}
          <div
            className="flex flex-col gap-5 p-6 sm:p-8"
            style={{
              position: "relative",
              zIndex: 1,
              background: CARD_BG,
            }}
          >
          {/* Logo row (when no cover photo) */}
          {!job.coverImage && job.companyLogo && (
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.96)", padding: "8px 14px", borderRadius: 10 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={job.companyLogo} alt={job.company} style={{ height: 36, maxWidth: 140, objectFit: "contain" }} />
              </div>
              {job.current && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono shrink-0 tracking-wide mt-1">
                  current
                </span>
              )}
            </div>
          )}

          {/* Role + company + date */}
          <div className="flex flex-col gap-1">
            {job.coverImage && job.current && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono w-fit tracking-wide mb-1">
                current
              </span>
            )}
            <h3 className="text-xl font-bold text-white/90 leading-snug">{job.role}</h3>
            {job.coverImage && (
              <p className="font-mono text-[11px] text-accent/65 tracking-widest uppercase">{job.company}</p>
            )}
            <p className="font-mono text-sm text-white/35 tracking-widest uppercase mt-0.5">{job.dateRange}</p>
          </div>

          {/* Summary */}
          {job.summary && (
            <p className="text-sm text-white/60 leading-relaxed">{job.summary}</p>
          )}

          <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

          {/* Responsibilities */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] text-accent/55 tracking-widest uppercase">Responsibilities</p>
            <ul className="flex flex-col gap-2.5">
              {job.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-accent/45 shrink-0 mt-[5px] text-[9px]">▸</span>
                  <span className="text-[13px] text-white/70 leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          {job.projects && job.projects.length > 0 && (
            <>
              <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[10px] text-accent/55 tracking-widest uppercase">Projects</p>
                <ul className="flex flex-col gap-2">
                  {job.projects.map((p, i) => {
                    const [name, ...rest] = p.split(" — ");
                    const desc = rest.join(" — ");
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-accent/45 shrink-0 mt-[5px] text-[9px]">▸</span>
                        <span className="text-[13px] text-white/70 leading-relaxed">
                          <span className="text-white/85 font-semibold">{name}</span>
                          {desc && <span className="text-white/50"> — {desc}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}

          {/* Tech & Skills — same visual style as KnowledgeMap SkillTile */}
          {job.primarySkills.length > 0 && (
            <>
              <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[10px] text-accent/55 tracking-widest uppercase">Tech & Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.primarySkills.map((skill) => {
                    const logo = skillLogoMap[skill];
                    const emoji = skillEmojiMap[skill];
                    return (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                        style={{
                          background: "rgba(21,21,32,1)",
                          borderColor: "rgba(237,237,242,0.10)",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset",
                          minWidth: 110,
                        }}
                      >
                        {(logo || emoji) && (
                          <div className="shrink-0 flex items-center justify-center" style={{ width: 22, height: 22 }}>
                            {logo ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={logo} alt={skill} style={{ width: 22, height: 22, objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden="true">{emoji}</span>
                            )}
                          </div>
                        )}
                        <span className="font-bold text-[11px] tracking-widest uppercase text-white/70 whitespace-nowrap leading-none">
                          {skill}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          </div> {/* end content wrapper */}
        </div> {/* end scroll container */}
      </motion.div>
    </motion.div>
  );
}

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

        {/* Flexible spacer */}
        <div className="flex-1" />

        {/* Date · role · divider · skills */}
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

        {/* Bottom row: flip hint */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-end pointer-events-none">
          <span className="font-mono text-[9px] select-none" style={{ color: "rgba(255,255,255,0.18)" }}>
            {job.coverImage ? "flip for photo" : "hover for details →"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Card Back ────────────────────────────────────────────────────────────────

function CardBack({ job }: { job: Job }) {
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
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.22) 55%, transparent 100%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-mono text-[10px] text-accent/85 tracking-widest uppercase mb-1">{job.company}</p>
          <p className="text-[13px] text-white/80 font-semibold leading-snug">{job.role}</p>
          <p className="font-mono text-[11px] text-white/45 mt-1">{job.dateRange}</p>
        </div>
      </div>
    );
  }

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
        <p className="text-[12px] text-white/65 leading-relaxed shrink-0">{job.summary}</p>
        <div className="h-px bg-white/[0.07] shrink-0" />
        <ul className="flex flex-col gap-1.5">
          {job.highlights.slice(0, 4).map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent/50 shrink-0 mt-[3px] text-[8px]">▸</span>
              <span className="text-[11px] text-white/60 leading-relaxed line-clamp-2">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Job Detail Panel ─────────────────────────────────────────────────────────

function JobDetailPanel({
  job,
  y,
  opacity,
  above,
  onExpand,
}: {
  job: Job;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  above: boolean;
  onExpand: () => void;
}) {
  const connectorH = DETAIL_OFFSET - DETAIL_H / 2;

  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, width: CARD_W, height: DETAIL_H, y, opacity }}
      className="relative select-none"
    >
      {/* Connector */}
      <div
        className="absolute left-1/2"
        style={{
          width: 1,
          height: connectorH + 8,
          ...(above
            ? { bottom: "100%", transform: "translateX(-50%)", background: "linear-gradient(0deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }
            : { top: "100%", transform: "translateX(-50%)", background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }),
        }}
        aria-hidden="true"
      />

      {/* CTA Button */}
      <button
        className="absolute inset-0 w-full h-full rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all"
        style={{
          background: job.current
            ? "linear-gradient(135deg, rgba(138,92,255,0.22) 0%, rgba(138,92,255,0.10) 100%)"
            : "linear-gradient(135deg, rgba(138,92,255,0.14) 0%, rgba(138,92,255,0.06) 100%)",
          border: job.current
            ? "1px solid rgba(138,92,255,0.45)"
            : "1px solid rgba(138,92,255,0.28)",
          boxShadow: job.current
            ? "0 0 24px rgba(138,92,255,0.18), 0 4px 24px rgba(0,0,0,0.45)"
            : "0 4px 24px rgba(0,0,0,0.35)",
        }}
        onClick={onExpand}
        aria-label={`View full details for ${job.company}`}
      >
        <span
          className="font-mono tracking-widest uppercase"
          style={{ fontSize: 11, color: "rgba(190,165,255,0.90)", letterSpacing: "0.12em" }}
        >
          View Full Details
        </span>
        <span style={{ color: "rgba(190,165,255,0.60)", fontSize: 14 }}>→</span>
      </button>
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
  isExpanded,
  onExpand,
}: {
  job: Job;
  index: number;
  count: number;
  progress: MotionValue<number>;
  cardOffset: number;
  isExpanded: boolean;
  onExpand: () => void;
}) {
  const above = index % 2 === 0;
  const centerProgress = count > 1 ? (index / (count - 1)) * 0.82 : 0;

  const enterEnd   = index === 0 ? 0    : Math.min(centerProgress, 0.95);
  const enterStart = index === 0 ? -0.1 : Math.max(0, enterEnd - 0.12);

  const cardOpacity = useTransform(progress, [enterStart, enterEnd], [0, 1]);
  const cardSlide   = useTransform(progress, [enterStart, enterEnd], [above ? -20 : 20, 0]);

  const baseCardY = above ? -(cardOffset + CARD_H / 2) : (cardOffset - CARD_H / 2);
  const cardY = useTransform(cardSlide, (s) => baseCardY + s);

  const detailStart = index === 0 ? -0.05 : Math.max(0, centerProgress - 0.04);
  const detailEnd   = index === 0 ?  0    : Math.min(1,  centerProgress + 0.06);

  const detailOpacity = useTransform(progress, [detailStart, detailEnd], [0, 1]);
  const detailSlide   = useTransform(progress, [detailStart, detailEnd], [above ? 12 : -12, 0]);

  const baseDetailY = above ? (DETAIL_OFFSET - DETAIL_H / 2) : -(DETAIL_OFFSET + DETAIL_H / 2);
  const detailY = useTransform(detailSlide, (s) => baseDetailY + s);

  return (
    // Zero-height anchor on the spine — both card and detail are absolutely positioned from here.
    // Animating opacity/scale on this wrapper fades/shrinks both toward the spine ("mesh" effect on expand).
    <motion.div
      style={{ position: "relative", width: CARD_W, height: 0, flexShrink: 0 }}
      animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.92 : 1 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
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
        onExpand={onExpand}
      />
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function JobTimeline({ jobs }: { jobs: Job[] }) {
  const sorted = [...jobs].sort((a, b) => {
    if (a.startYear !== b.startYear) return b.startYear - a.startYear;
    return (b.current ? 1 : 0) - (a.current ? 1 : 0);
  });

  const stickyRef = useRef<HTMLDivElement>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const expandedJob = expandedSlug ? sorted.find((j) => j.slug === expandedSlug) ?? null : null;

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

  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end start"],
  });

  const count = sorted.length;

  const WRAPPER_W = 5 * GAP + CARD_W + NODE_W;
  const CARD0_CENTER     = 60 + GAP + GAP + CARD_W / 2;
  const LAST_CARD_CENTER = 60 + (count - 1) * WRAPPER_W + GAP + GAP + CARD_W / 2;

  const xStart = `calc(50vw - ${CARD0_CENTER}px)`;
  const xEnd   = `calc(50vw - ${LAST_CARD_CENTER}px)`;
  const translateX = useTransform(scrollYProgress, [0, 0.82], [xStart, xEnd]);

  const hintOpacity    = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const headerOpacity  = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const timelineShiftY = useTransform(scrollYProgress, [0, 0.08], [HEADER_H / 2, 0]);

  const ORB_LEFT = 28;
  const [orbLabel, setOrbLabel] = useState(String(sorted[0].startYear));
  const activeIdxRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const vw = window.innerWidth;
    const p = Math.min(latest, 0.82);
    const tX = (vw / 2 - CARD0_CENTER) + (p / 0.82) * (CARD0_CENTER - LAST_CARD_CENTER);
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

  // Each card gets 700px of scroll budget to enter and settle.
  // 4200px tail gives the last card extended dwell time before the section unpins.
  const scrollBudgetH = count * 700 + 4800;

  return (
    <>
      <div ref={stickyRef} style={{ height: `${scrollBudgetH}px` }}>
        <div className="sticky top-0 h-screen">
          <div className="absolute inset-0 overflow-hidden">

            {/* ── Section header ── */}
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

            {/* ── Timeline area ── */}
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

              {/* NOW orb */}
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
                    <div style={{ width: GAP, height: 1, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
                    <AnimatedCard
                      job={job}
                      index={i}
                      count={count}
                      progress={scrollYProgress}
                      cardOffset={cardOffset}
                      isExpanded={expandedSlug === job.slug}
                      onExpand={() => setExpandedSlug(job.slug)}
                    />
                    <div style={{ width: GAP, height: 1, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
                    <TimelineNode
                      label={String(job.startYear)}
                      sublabel={job.endYear ? String(job.endYear) : undefined}
                    />
                  </div>
                ))}
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

      {/* Expanded job card — rendered outside sticky/transformed section so position:fixed works correctly */}
      <AnimatePresence>
        {expandedJob && (
          <ExpandedJobCard
            key={expandedJob.slug}
            job={expandedJob}
            onClose={() => setExpandedSlug(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
