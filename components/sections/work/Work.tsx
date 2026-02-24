"use client";

import { AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Project } from "@/types/content";
import projects from "@/content/projects.json";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailPanel } from "./ProjectDetailPanel";

export function Work() {
  const { selectedProjectId, selectProject } = useStore();
  const typedProjects = projects as Project[];
  const selected = typedProjects.find((p) => p.id === selectedProjectId) ?? null;

  return (
    <section aria-label="Work" className="px-6 sm:px-10 py-20 max-w-7xl mx-auto">
      <p className="font-mono text-sm text-accent mb-4">work</p>
      <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
        Systems I&apos;ve Built
      </h2>
      <p className="text-muted mb-10">
        Each project exists because something was broken, slow, or missing.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.6fr] gap-4">
        {/* Project list */}
        <div className="space-y-2">
          {typedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={project.id === selectedProjectId}
              onSelect={() =>
                selectProject(
                  project.id === selectedProjectId ? null : project.id
                )
              }
            />
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected && <ProjectDetailPanel key={selected.id} project={selected} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
