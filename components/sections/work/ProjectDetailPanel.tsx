"use client";

import { motion } from "framer-motion";
import type { Project } from "@/types/content";
import { fadeSlideUp, duration, ease } from "@/lib/motion";

const META_FIELDS: { key: keyof Project; label: string }[] = [
  { key: "purpose",     label: "purpose" },
  { key: "constraints", label: "constraints" },
  { key: "decisions",   label: "decisions" },
  { key: "impact",      label: "impact" },
];

export function ProjectDetailPanel({ project, onClose }: { project: Project; onClose?: () => void }) {
  return (
    <motion.aside
      variants={fadeSlideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: duration.short, ease: ease.standard }}
      className="p-6 bg-surface border border-border rounded-card lg:sticky lg:top-4 lg:self-start"
      aria-label={`${project.title} detail`}
    >
      {/* Title + tagline */}
      <h3 className="text-xl font-semibold text-text">{project.title}</h3>
      <p className="text-muted text-sm mt-1">{project.tagline}</p>

      {/* Story */}
      <p className="mt-4 text-text text-sm leading-relaxed">{project.story}</p>

      {/* Metadata */}
      <dl className="mt-5 space-y-2.5 text-sm">
        {META_FIELDS.map(({ key, label }) => (
          <div key={label} className="flex gap-3">
            <dt className="text-muted font-mono text-xs w-24 shrink-0 pt-px capitalize">
              {label}
            </dt>
            <dd className="text-text">{project[key] as string}</dd>
          </div>
        ))}
      </dl>

      {/* Tech stack — staggered fade */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 + i * 0.05, duration: duration.micro }}
            className="px-2 py-0.5 text-xs font-mono bg-surface2 border border-border rounded text-text"
          >
            {t}
          </motion.span>
        ))}
      </div>

      {/* Links */}
      <div className="mt-5 flex gap-2 flex-wrap">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm border border-border rounded-lg text-muted hover:text-text transition-colors"
          >
            GitHub →
          </a>
        )}
        {project.videoUrl && (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm border border-border rounded-lg text-muted hover:text-text transition-colors"
          >
            Video →
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm font-medium text-bg bg-accent hover:bg-accent/90 rounded-lg transition-colors"
          >
            Live Demo →
          </a>
        )}
      </div>

      {/* Mobile back button */}
      <div className="mt-4 lg:hidden">
        <button
          onClick={onClose}
          className="text-sm text-muted hover:text-text transition-colors"
        >
          ← Back to projects
        </button>
      </div>
    </motion.aside>
  );
}
