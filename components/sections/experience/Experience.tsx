"use client";

import { motion } from "framer-motion";
import type { Job } from "@/types/content";
import jobsData from "@/content/jobs.json";
import { JobTimeline } from "./JobTimeline";
import { duration, ease } from "@/lib/motion";

export function Experience() {
  return (
    <section aria-label="Experience">
      {/* Section header — stays inside the content column */}
      <div className="px-6 sm:px-10 pt-20 pb-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.medium, ease: ease.standard }}
        >
          <p className="font-mono text-sm text-accent mb-4">experience</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
            The Timeline
          </h2>
          <p className="text-muted">
            10+ years. Six companies. One thread running through all of it.
          </p>
        </motion.div>
      </div>

      {/* Timeline — full viewport width, no horizontal constraints */}
      <JobTimeline jobs={jobsData as Job[]} />
    </section>
  );
}
