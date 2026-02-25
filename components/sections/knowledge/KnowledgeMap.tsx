"use client";

import { useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { KnowledgeCategory } from "@/types/content";
import { duration, ease } from "@/lib/motion";

// ─── Seeded pseudo-random (deterministic per-index) ──────────────────────────

function seededRand(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ─── Skill Tile ───────────────────────────────────────────────────────────────

interface SkillTileProps {
  name: string;
  logo: string;
  yearsExperience: number;
  tileIndex: number;
}

function SkillTile({ name, logo, yearsExperience, tileIndex }: SkillTileProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Animate years counter on hover
  const spring = useSpring(0, { stiffness: 80, damping: 18 });
  const displayed = useTransform(spring, (v) => Math.round(v));

  const handleEnter = () => {
    setHovered(true);
    spring.set(yearsExperience);
  };
  const handleLeave = () => {
    setHovered(false);
    spring.set(0);
  };

  if (imgError) return null;

  // Deterministic scatter transform per tile
  const rotation = (seededRand(tileIndex, 1) * 20) - 10; // -10 to +10 deg
  const marginTop = seededRand(tileIndex, 2) * 28;        // 0 to 28px
  const marginLeft = seededRand(tileIndex, 3) * 12;       // 0 to 12px

  return (
    // Outer wrapper handles entrance reveal
    <motion.div
      initial={{ opacity: 0, scale: 0.88, rotate: rotation * 0.5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        delay: tileIndex * 0.03,
        duration: duration.short,
        ease: ease.standard,
      }}
      style={{
        marginTop,
        marginLeft,
        width: "fit-content",
        transformOrigin: "center",
      }}
    >
    {/* Inner wrapper handles hover states */}
    <motion.div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      aria-label={`${name} — ${yearsExperience} years`}
      animate={{
        borderColor: hovered ? "rgba(138,92,255,0.5)" : "rgba(237,237,242,0.1)",
        backgroundColor: hovered ? "rgba(138,92,255,0.08)" : "rgba(21,21,32,1)",
        boxShadow: hovered
          ? "0 4px 24px rgba(138,92,255,0.18), 0 1px 0 rgba(255,255,255,0.05) inset"
          : "0 2px 12px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset",
        scale: hovered ? 1.06 : 1,
      }}
      transition={{ duration: duration.micro, ease: ease.standard }}
      className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-default outline-none focus-visible:ring-1 focus-visible:ring-accent/60 select-none"
      style={{
        minWidth: 110,
        transformOrigin: "center",
      }}
    >
      {/* Logo */}
      <motion.div
        animate={{ scale: hovered ? 0.88 : 1 }}
        transition={{ duration: duration.micro }}
        className="flex items-center justify-center shrink-0"
        style={{ width: 22, height: 22 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={name}
          width={22}
          height={22}
          className="object-contain"
          style={{ width: 22, height: 22 }}
          onError={() => setImgError(true)}
        />
      </motion.div>

      {/* Name */}
      <motion.span
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: duration.micro }}
        className="font-bold text-[11px] tracking-widest uppercase leading-none text-white/70 whitespace-nowrap"
      >
        {name}
      </motion.span>

      {/* Years overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
        transition={{ duration: duration.micro, ease: ease.standard }}
        className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none rounded-xl"
        aria-hidden="true"
      >
        <motion.span className="font-mono text-base font-bold text-accent leading-none">
          {displayed}
        </motion.span>
        <span className="font-mono text-[10px] text-accent/70 leading-none">yr</span>
      </motion.div>
    </motion.div>
    </motion.div>
  );
}

// ─── Knowledge Map ────────────────────────────────────────────────────────────

export function KnowledgeMap({ categories }: { categories: KnowledgeCategory[] }) {
  const logoSkills = categories.flatMap((cat) =>
    cat.skills.filter((s) => s.logo && s.yearsExperience != null)
  ) as Array<{ name: string; logo: string; yearsExperience: number }>;

  return (
    <div
      className="flex flex-wrap gap-2.5"
      style={{ alignItems: "flex-start" }}
    >
      {logoSkills.map((skill, i) => (
        <SkillTile
          key={skill.name}
          name={skill.name}
          logo={skill.logo}
          yearsExperience={skill.yearsExperience}
          tileIndex={i}
        />
      ))}
    </div>
  );
}
