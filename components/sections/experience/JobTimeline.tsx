"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Job } from "@/types/content";
import { duration, ease } from "@/lib/motion";

function JobCard({ job, index }: { job: Job; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: duration.short, ease: ease.standard, delay: index * 0.06 }}
      className="relative ml-10 sm:ml-14"
    >
      {/* Card */}
      <div className="border border-border rounded-card bg-surface overflow-hidden">
        {/* Cover photo — proper aspect ratio so nothing gets cut */}
        {job.coverImage && (
          <div className="w-full aspect-[16/7] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={job.coverImage}
              alt={job.company}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        <div className="p-5">
          {/* Company header row */}
          <div className="flex items-start gap-3 mb-3">
            {job.companyLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.companyLogo}
                alt={job.company}
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-md shrink-0 mt-0.5"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-semibold text-text text-base leading-tight">{job.company}</span>
                {job.current && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 font-mono shrink-0">
                    current
                  </span>
                )}
              </div>
              <div className="text-sm text-muted">{job.role}</div>
              <div className="text-xs text-border font-mono mt-0.5">{job.dateRange}</div>
            </div>
          </div>

          {/* Primary skills */}
          {job.primarySkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.primarySkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors font-mono"
          >
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: duration.micro }}
              className="text-base leading-none select-none"
            >
              ›
            </motion.span>
            {expanded ? "hide details" : "show details"}
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: duration.short, ease: ease.standard }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-border/50 mt-3">
                  <p className="text-sm text-text leading-relaxed mb-3">{job.summary}</p>
                  <ul className="space-y-1.5">
                    {job.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted">
                        <span className="text-accent select-none mt-0.5 shrink-0">·</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export function JobTimeline({ jobs }: { jobs: Job[] }) {
  // Sort ascending by start year, then by current status (current last within same year)
  const sorted = [...jobs].sort((a, b) => {
    if (a.startYear !== b.startYear) return a.startYear - b.startYear;
    return (a.current ? 1 : 0) - (b.current ? 1 : 0);
  });

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3 sm:left-5 top-0 bottom-0 w-px bg-border/60" />

      <div className="space-y-8">
        {sorted.map((job, i) => {
          const prevJob = sorted[i - 1];
          const showYear = !prevJob || prevJob.startYear !== job.startYear;

          return (
            <div key={job.slug}>
              {/* Year label + dot */}
              <div className="relative flex items-center mb-3">
                {/* Dot on timeline */}
                <div
                  className={`
                    relative z-10 w-3 h-3 rounded-full border-2 shrink-0 ml-1.5 sm:ml-3.5
                    transition-all
                    ${job.current
                      ? "bg-accent border-accent shadow-[0_0_8px_rgba(138,92,255,0.5)]"
                      : "bg-surface border-border"
                    }
                  `}
                />
                {showYear && (
                  <span className="ml-4 font-mono text-xs text-accent tracking-wider">
                    {job.startYear}
                    {job.current && " →"}
                  </span>
                )}
              </div>

              <JobCard job={job} index={i} />
            </div>
          );
        })}

        {/* Present marker */}
        <div className="relative flex items-center">
          <div className="relative z-10 w-3 h-3 rounded-full bg-accent border-2 border-accent ml-1.5 sm:ml-3.5 shadow-[0_0_12px_rgba(138,92,255,0.6)]" />
          <span className="ml-4 font-mono text-xs text-accent tracking-wider">present</span>
        </div>
      </div>
    </div>
  );
}
