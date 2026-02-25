"use client";

import { useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { KnowledgeCategory } from "@/types/content";
import { duration, ease } from "@/lib/motion";

interface SkillTileProps {
  name: string;
  logo: string;
  yearsExperience: number;
}

function SkillTile({ name, logo, yearsExperience }: SkillTileProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Animate the displayed number from 0 → yearsExperience on hover
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

  return (
    <motion.div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      aria-label={`${name} — ${yearsExperience} years`}
      className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-card border border-border bg-surface cursor-default outline-none focus-visible:ring-1 focus-visible:ring-accent/60"
      animate={{
        borderColor: hovered ? "rgba(138,92,255,0.45)" : "rgba(237,237,242,0.12)",
        backgroundColor: hovered ? "rgba(138,92,255,0.06)" : "rgba(30,30,38,1)",
      }}
      transition={{ duration: duration.micro, ease: ease.standard }}
    >
      {/* Logo */}
      <motion.div
        animate={{ scale: hovered ? 0.82 : 1 }}
        transition={{ duration: duration.micro, ease: ease.standard }}
        className="w-8 h-8 flex items-center justify-center shrink-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={name}
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
          onError={() => setImgError(true)}
        />
      </motion.div>

      {/* Overlay: years counter */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: duration.micro, ease: ease.standard }}
        className="flex flex-col items-center gap-0.5 pointer-events-none"
        aria-hidden="true"
      >
        <div className="flex items-baseline gap-0.5">
          <motion.span className="font-mono text-lg font-bold text-accent leading-none">
            {displayed}
          </motion.span>
          <span className="font-mono text-[10px] text-accent/70 leading-none">yr</span>
        </div>
      </motion.div>

      {/* Name — fades out on hover */}
      <motion.span
        animate={{ opacity: hovered ? 0 : 0.55 }}
        transition={{ duration: duration.micro }}
        className="font-mono text-[10px] text-muted text-center leading-tight pointer-events-none absolute bottom-2 left-1 right-1 truncate px-1"
      >
        {name}
      </motion.span>
    </motion.div>
  );
}

export function KnowledgeMap({ categories }: { categories: KnowledgeCategory[] }) {
  // Collect only logo skills with a yearsExperience value across all categories
  const logoSkills = categories.flatMap((cat) =>
    cat.skills.filter((s) => s.logo && s.yearsExperience != null)
  ) as Array<{ name: string; logo: string; yearsExperience: number }>;

  return (
    <motion.div
      className="grid gap-3"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
      }}
    >
      {logoSkills.map((skill, i) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: i * 0.025,
            duration: duration.short,
            ease: ease.standard,
          }}
        >
          <SkillTile
            name={skill.name}
            logo={skill.logo}
            yearsExperience={skill.yearsExperience}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
