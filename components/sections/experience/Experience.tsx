"use client";

import { motion } from "framer-motion";
import type { Job } from "@/types/content";
import jobsData from "@/content/jobs.json";
import { JobTimeline } from "./JobTimeline";
import { duration, ease } from "@/lib/motion";

export function Experience() {
  return (
    <section aria-label="Experience">
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
        <p className="text-muted mb-10">
          10+ years. Six companies. One thread running through all of it.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: duration.medium, ease: ease.standard, delay: 0.1 }}
      >
        <JobTimeline jobs={jobsData as Job[]} />
      </motion.div>
    </section>
  );
}
