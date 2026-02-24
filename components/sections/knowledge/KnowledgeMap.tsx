"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { KnowledgeCategory } from "@/types/content";
import type { Project } from "@/types/content";
import { duration, ease } from "@/lib/motion";
import projects from "@/content/projects.json";

function SkillLogo({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      title={name}
      width={20}
      height={20}
      className="w-5 h-5 object-contain shrink-0"
      onError={() => setError(true)}
    />
  );
}

export function KnowledgeMap({ categories }: { categories: KnowledgeCategory[] }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const typedProjects = projects as Project[];

  return (
    <div className="space-y-2">
      {categories.map((cat) => {
        const isOpen = openCategory === cat.category;
        const logoSkills = cat.skills.filter((s) => s.logo);

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
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-medium text-text shrink-0">{cat.category}</span>
                {/* Logo pill strip — shown when collapsed */}
                {!isOpen && logoSkills.length > 0 && (
                  <div className="hidden sm:flex items-center gap-1.5 overflow-hidden">
                    {logoSkills.slice(0, 6).map((s) => (
                      <span key={s.name} className="opacity-50">
                        <SkillLogo src={s.logo!} name={s.name} />
                      </span>
                    ))}
                    {logoSkills.length > 6 && (
                      <span className="text-muted font-mono text-xs opacity-50">+{logoSkills.length - 6}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted font-mono text-xs hidden sm:block">
                  {cat.skills.length} {cat.skills.length === 1 ? "skill" : "skills"}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: duration.micro }}
                  className="text-muted text-lg leading-none select-none shrink-0"
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
                  <div className="border-t border-border px-5 pb-4">
                    {/* Logo grid — shown when expanded */}
                    {logoSkills.length > 0 && (
                      <div className="flex flex-wrap gap-3 py-4 border-b border-border/50 mb-4">
                        {logoSkills.map((s, i) => (
                          <motion.div
                            key={s.name}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: i * 0.03,
                              duration: duration.micro,
                              ease: ease.standard,
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface2 border border-border/60"
                            title={s.name}
                          >
                            <SkillLogo src={s.logo!} name={s.name} />
                            <span className="text-xs font-mono text-muted">{s.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Skill detail list */}
                    <div className="space-y-3 pt-0.5">
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
                          <div className="flex items-center gap-2 w-40 shrink-0">
                            {skill.logo && (
                              <span className="opacity-70">
                                <SkillLogo src={skill.logo} name={skill.name} />
                              </span>
                            )}
                            <span className="font-mono text-sm text-text">{skill.name}</span>
                          </div>
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
