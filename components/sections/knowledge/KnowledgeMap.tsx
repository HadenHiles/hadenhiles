"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { KnowledgeCategory } from "@/types/content";
import type { Project } from "@/types/content";
import { duration, ease } from "@/lib/motion";
import projects from "@/content/projects.json";

export function KnowledgeMap({ categories }: { categories: KnowledgeCategory[] }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const typedProjects = projects as Project[];

  return (
    <div className="space-y-2">
      {categories.map((cat) => {
        const isOpen = openCategory === cat.category;

        return (
          <div
            key={cat.category}
            className="border border-border rounded-card overflow-hidden"
          >
            <button
              onClick={() => setOpenCategory(isOpen ? null : cat.category)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface2/60 transition-colors"
            >
              <span className="font-medium text-text">{cat.category}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted font-mono text-xs hidden sm:block">
                  {cat.skills.length} {cat.skills.length === 1 ? "skill" : "skills"}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: duration.micro }}
                  className="text-muted text-lg leading-none select-none"
                >
                  ›
                </motion.span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: duration.short, ease: ease.standard }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border px-5 pb-4 pt-3 space-y-3">
                    {cat.skills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.04,
                          duration: duration.micro,
                          ease: ease.standard,
                        }}
                        className="flex items-start gap-4 flex-wrap sm:flex-nowrap"
                      >
                        <span className="font-mono text-sm text-text w-36 shrink-0">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted flex-1 min-w-0">
                          {skill.usedFor}
                        </span>
                        {/* Proof chips */}
                        {skill.proofProjectIds.length > 0 && (
                          <div className="flex gap-1 flex-wrap shrink-0">
                            {skill.proofProjectIds.map((pid) => {
                              const proj = typedProjects.find((p) => p.id === pid);
                              return proj ? (
                                <span
                                  key={pid}
                                  className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 font-mono"
                                >
                                  {proj.title}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
