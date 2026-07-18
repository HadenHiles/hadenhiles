"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Project } from "@/types/content";
import projects from "@/content/projects.json";
import { ProjectGridCard } from "./ProjectGridCard";
import { ProjectDetailPanel } from "./ProjectDetailPanel";
import { PhoneMockup, DesktopMockup } from "./DeviceMockup";
import { duration, ease } from "@/lib/motion";

// ─── Work section ─────────────────────────────────────────────────────────────

export function Work() {
  const { selectedProjectId, selectProject } = useStore();
  const typedProjects = projects as Project[];
  const selected = typedProjects.find((p) => p.id === selectedProjectId) ?? null;

  const detailRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const prevSelectedId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedProjectId) {
      // Delay past the card collapse animation (EXPAND_DURATION = 0.65s) so the
      // layout has settled before we scroll : prevents overshooting on expanded cards.
      const t = setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 700);
      prevSelectedId.current = selectedProjectId;
      return () => clearTimeout(t);
    } else if (prevSelectedId.current) {
      // Scroll back to the card that was just deselected
      const id = prevSelectedId.current;
      const t = setTimeout(() => {
        cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [selectedProjectId]);

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

      {/* ── Project masonry grid (CSS columns : cards keep natural aspect ratios) ── */}
      <motion.div layoutRoot className="columns-2 sm:columns-3 gap-3 sm:gap-4">
        {typedProjects.map((project, i) => (
          <motion.div
            key={project.id}
            ref={(el) => {
              if (el) cardRefs.current.set(project.id, el as HTMLElement);
              else cardRefs.current.delete(project.id);
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: duration.short,
              ease: ease.standard,
              delay: i * 0.04,
            }}
            className="break-inside-avoid mb-3 sm:mb-4"
          >
            <ProjectGridCard
              project={project}
              isSelected={selectedProjectId === project.id}
              onSelect={() =>
                selectProject(selectedProjectId === project.id ? null : project.id)
              }
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Expanded detail panel (below grid) ── */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            ref={detailRef}
            key={selected.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: duration.short, ease: ease.standard }}
            className="mt-6 pt-6 border-t border-border/40"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6 lg:gap-10 items-start">
              {/* Left: device mockup */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => selectProject(null)}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors w-fit"
                >
                  <span>←</span>
                  <span>close</span>
                </button>

                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-text text-base leading-tight">
                    {selected.title}
                  </h3>
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border shrink-0"
                    style={{
                      color: "rgba(138,92,255,0.75)",
                      borderColor: "rgba(138,92,255,0.22)",
                      background: "rgba(138,92,255,0.06)",
                    }}
                  >
                    {selected.demoTypeLabel ??
                      (selected.demoType === "mobile" ? "mobile app" : "web app")}
                  </span>
                </div>

                <div className="flex justify-center py-2">
                  {selected.demoType === "mobile" ? (
                    <PhoneMockup
                      src={selected.demoAsset}
                      alt={`${selected.title} demo`}
                    />
                  ) : (
                    <div className="w-full max-w-sm mx-auto">
                      <DesktopMockup
                        src={selected.demoAsset}
                        alt={`${selected.title} demo`}
                        srcs={selected.demoAssets ?? undefined}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right: detail panel */}
              <ProjectDetailPanel
                project={selected}
                onClose={() => selectProject(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
