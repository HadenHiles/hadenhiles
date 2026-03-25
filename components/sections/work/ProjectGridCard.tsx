"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types/content";

const HOLD_DELAY = 1500; // ms before preview reveals
const EXPAND_EASE = [0.22, 1, 0.36, 1] as const;
const EXPAND_DURATION = 0.65;

// SVG ring circumference for r=16
const RING_R = 16;
const RING_C = 2 * Math.PI * RING_R;

function isVideo(src: string) {
  return /\.(mp4|mov|webm|ogg)$/i.test(src);
}

interface Props {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProjectGridCard({ project, isSelected, onSelect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hovering = mouse is currently over the card
  // revealed = hold delay elapsed, preview expanded
  const [hovering, setHovering] = useState(false);
  const [revealed, setRevealed] = useState(false);
  // measured on each mouse-enter so the slide-down y is always accurate
  const [thumbHeight, setThumbHeight] = useState(0);

  function handleMouseEnter() {
    if (thumbnailRef.current) setThumbHeight(thumbnailRef.current.offsetHeight);
    setHovering(true);
    timerRef.current = setTimeout(() => {
      setRevealed(true);
      videoRef.current?.play().catch(() => {});
    }, HOLD_DELAY);
  }

  function handleMouseLeave() {
    setHovering(false);
    setRevealed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = project.thumbnailTime ?? 0;
    }
  }

  // Collapse back to 16:9 as soon as the card gets selected (click after hover-expand)
  useEffect(() => {
    if (isSelected) {
      setHovering(false);
      setRevealed(false);
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = project.thumbnailTime ?? 0;
      }
    }
  }, [isSelected, project.thumbnailTime]);

  // Clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const hasSrc = Boolean(project.demoAsset);
  const isVideoSrc = hasSrc && isVideo(project.demoAsset!);

  return (
    <motion.button
      layout
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{ duration: EXPAND_DURATION, ease: EXPAND_EASE }}
      aria-pressed={isSelected}
      className={`
        w-full text-left rounded-card border overflow-hidden transition-colors group
        ${isSelected
          ? "border-accent/60 ring-1 ring-accent/30 bg-surface"
          : "border-border bg-surface hover:border-border/80"
        }
      `}
    >
      {/* Thumbnail — 16:9 at rest, expands to natural aspect once revealed */}
      <motion.div
        ref={thumbnailRef}
        layout
        transition={{ duration: EXPAND_DURATION, ease: EXPAND_EASE }}
        className="relative overflow-hidden bg-black"
        style={{ aspectRatio: revealed ? undefined : "16 / 9" }}
      >
        {isVideoSrc ? (
          <video
            ref={videoRef}
            src={project.demoAsset!}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={() => {
              if (videoRef.current)
                videoRef.current.currentTime = project.thumbnailTime ?? 0;
            }}
            className="w-full"
            style={{
              height: revealed ? "auto" : "100%",
              objectFit: revealed ? "unset" : "cover",
              objectPosition: revealed ? undefined : (project.thumbnailPosition ?? "50% 50%"),
              display: "block",
            }}
          />
        ) : hasSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.demoAsset!}
            alt={`${project.title} preview`}
            className="w-full"
            style={{
              height: revealed ? "auto" : "100%",
              objectFit: revealed ? "unset" : "cover",
              objectPosition: revealed ? undefined : (project.thumbnailPosition ?? "50% 50%"),
              display: "block",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-xs text-muted/30">no preview</span>
          </div>
        )}

        {/* Dimmer + ring + label — single overlay during hover countdown */}
        <AnimatePresence>
          {hovering && !revealed && (() => {
            // y that places text just below ring center; clamp so tiny cards don't go negative
            const textInitialY = Math.min(0, 54 - thumbHeight / 2);
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                {/* Dimmer — fades in linearly alongside the ring */}
                <motion.div
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  transition={{ duration: HOLD_DELAY / 1000, ease: "linear" }}
                />

                {/* Ring — centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    width={RING_R * 2 + 8}
                    height={RING_R * 2 + 8}
                    viewBox={`0 0 ${RING_R * 2 + 8} ${RING_R * 2 + 8}`}
                    style={{ overflow: "visible" }}
                  >
                    <circle
                      cx={RING_R + 4}
                      cy={RING_R + 4}
                      r={RING_R}
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth={2.5}
                    />
                    <motion.circle
                      cx={RING_R + 4}
                      cy={RING_R + 4}
                      r={RING_R}
                      fill="none"
                      stroke="rgba(138,92,255,0.9)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeDasharray={RING_C}
                      initial={{ strokeDashoffset: RING_C, rotate: -90 }}
                      animate={{ strokeDashoffset: 0, rotate: -90 }}
                      transition={{ duration: HOLD_DELAY / 1000, ease: "linear" }}
                      style={{ transformOrigin: `${RING_R + 4}px ${RING_R + 4}px` }}
                    />
                  </svg>
                </div>

                {/* Text — snaps to below-ring position, slides linearly to bottom */}
                <motion.span
                  className="absolute inset-x-0 text-center font-mono tracking-widest uppercase whitespace-nowrap"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "0.5625rem",
                    bottom: "1.25rem",
                    y: textInitialY,
                  }}
                  animate={{ y: 0 }}
                  transition={{ duration: HOLD_DELAY / 1000, ease: "linear" }}
                >
                  click anywhere · view details
                </motion.span>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Gradient + label at bottom — shown once revealed */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 bottom-0 pointer-events-none flex items-end justify-center pb-5"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
                height: "50%",
              }}
            >
              <span
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                click anywhere · view details
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected accent tint */}
        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{ background: "rgba(138,92,255,1)" }}
          />
        )}

        {/* Demo type badge */}
        <span
          className="absolute bottom-2 right-2 font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded"
          style={{
            color: "#f5f5f5",
            background: "rgba(138,92,255,0.85)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            border: "1px solid rgba(138,92,255,0.22)",
          }}
        >
          {project.demoTypeLabel ?? (project.demoType === "mobile" ? "mobile" : "web")}
        </span>
      </motion.div>

      {/* Card body */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text text-sm leading-snug">{project.title}</h3>
          {isSelected && (
            <span className="text-accent text-[10px] font-mono shrink-0 mt-0.5">▼</span>
          )}
        </div>
        <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">{project.tagline}</p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[10px] font-mono bg-surface2 border border-border rounded text-muted"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-surface2 border border-border rounded text-muted">
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
