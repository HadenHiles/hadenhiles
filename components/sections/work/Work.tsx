"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Project } from "@/types/content";
import projects from "@/content/projects.json";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailPanel } from "./ProjectDetailPanel";
import { PhoneMockup, DesktopMockup } from "./DeviceMockup";
import { duration, ease } from "@/lib/motion";

// ─── Demo view (left column when project is selected) ─────────────────────────

function DemoView({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors w-fit"
      >
        <span>←</span>
        <span>all projects</span>
      </button>

      {/* Title row */}
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="font-semibold text-text text-base leading-tight">{project.title}</h3>
        <span
          className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border shrink-0"
          style={{
            color: "rgba(138,92,255,0.75)",
            borderColor: "rgba(138,92,255,0.22)",
            background: "rgba(138,92,255,0.06)",
          }}
        >
          {project.demoType === "mobile" ? "mobile app" : "web app"}
        </span>
      </div>

      {/* Device mockup */}
      <div className="flex justify-center py-3">
        {project.demoType === "mobile" ? (
          <PhoneMockup src={project.demoAsset} alt={`${project.title} demo`} />
        ) : (
          <div className="w-full max-w-sm mx-auto">
            <DesktopMockup
              src={project.demoAsset}
              alt={`${project.title} demo`}
              srcs={project.demoAssets ?? undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Work section ─────────────────────────────────────────────────────────────

export function Work() {
  const { selectedProjectId, selectProject } = useStore();
  const typedProjects = projects as Project[];
  const selected = typedProjects.find((p) => p.id === selectedProjectId) ?? null;

  return (
    <section aria-label="Work" className="px-6 sm:px-10 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: duration.medium, ease: ease.standard }}
      >
        <p className="font-mono text-sm text-accent mb-4">work</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
          Systems I&apos;ve Built
        </h2>
        <p className="text-muted mb-10">
          Each project exists because something was broken, slow, or missing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.6fr] gap-4 lg:gap-6 lg:items-start">
        {/* ── Left column: project list ↔ demo view ── */}
        <AnimatePresence mode="wait" initial={false}>
          {!selected ? (
            <motion.div
              key="project-list"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: duration.short, ease: ease.standard }}
              className="space-y-2"
            >
              {typedProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: duration.short,
                    ease: ease.standard,
                    delay: i * 0.05,
                  }}
                >
                  <ProjectCard
                    project={project}
                    isSelected={false}
                    onSelect={() => selectProject(project.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`demo-${selected.id}`}
              initial={{ opacity: 0, scale: 0.93, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 10 }}
              transition={{ duration: duration.short, ease: ease.standard, delay: 0.1 }}
            >
              <DemoView project={selected} onBack={() => selectProject(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Right column: detail panel or empty hint ── */}
        <AnimatePresence mode="wait">
          {selected ? (
            <ProjectDetailPanel
              key={selected.id}
              project={selected}
              onClose={() => selectProject(null)}
            />
          ) : (
            <motion.div
              key="empty-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.short }}
              className="hidden lg:flex items-center justify-center rounded-card border border-dashed border-border/40 min-h-[220px]"
            >
              <p className="font-mono text-xs text-white/20 text-center leading-loose">
                select a project<br />to see details →
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
