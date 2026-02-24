"use client";

import { motion } from "framer-motion";
import type { Project } from "@/types/content";
import { duration } from "@/lib/motion";

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
}

const CHIP_LABELS: (keyof Project)[] = ["purpose", "constraints", "decisions", "impact"];

export function ProjectCard({ project, isSelected, onSelect }: ProjectCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
      transition={{ duration: duration.micro }}
      aria-pressed={isSelected}
      className={`
        w-full text-left p-4 rounded-card border transition-colors
        ${isSelected
          ? "border-accent/40 bg-surface2"
          : "border-border bg-surface hover:border-border/80"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-text truncate">{project.title}</h3>
          <p className="text-sm text-muted mt-0.5 line-clamp-2">{project.tagline}</p>
        </div>
        {isSelected && (
          <span className="text-accent text-xs font-mono shrink-0 mt-0.5">[open]</span>
        )}
      </div>

      {/* Attribute chips */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {CHIP_LABELS.map((chip) => (
          <span
            key={chip as string}
            className="px-2 py-0.5 text-xs rounded font-mono bg-surface2 text-muted border border-border capitalize"
          >
            {chip as string}
          </span>
        ))}
      </div>
    </motion.button>
  );
}
