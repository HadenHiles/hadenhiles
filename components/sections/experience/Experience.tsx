"use client";

import type { Job } from "@/types/content";
import jobsData from "@/content/jobs.json";
import { JobTimeline } from "./JobTimeline";

export function Experience() {
  return (
    <section aria-label="Experience">
      {/* Timeline owns its own header — it lives inside the sticky panel
          so the section pins before the header scrolls away. */}
      <JobTimeline jobs={jobsData as Job[]} />
    </section>
  );
}
