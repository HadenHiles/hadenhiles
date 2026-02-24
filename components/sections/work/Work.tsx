"use client";

import { AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Project } from "@/types/content";
import projects from "@/content/projects.json";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailPanel } from "./ProjectDetailPanel";
import { Hero } from "@/components/sections/hero/Hero";

export function Work() {
  const { selectedProjectId, selectProject } = useStore();
  const typedProjects = projects as Project[];
  const selected = typedProjects.find((p) => p.id === selectedProjectId) ?? null;

  return (
    <div>
      {/* Hero — landing view for the GUI */}
      <Hero />

      {/* Divider */}
      <div className="border-t border-border mb-8" />

      {/* Projects */}
      <section aria-label="Work" className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-1">Systems I&apos;ve Built</h2>
        <p className="text-muted text-sm mb-6">
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
    </div>
  );
}
