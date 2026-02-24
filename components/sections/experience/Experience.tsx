"use client";

import type { ExperienceEntry } from "@/types/content";
import experience from "@/content/experience.json";
import { VersionTimeline } from "./VersionTimeline";

export function Experience() {
  return (
    <section aria-label="Experience">
      <p className="font-mono text-sm text-accent mb-4">experience</p>
      <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
        Version History
      </h2>
      <p className="text-muted mb-10">
        Each chapter had a different constraint set.
      </p>
      <VersionTimeline entries={experience as ExperienceEntry[]} />
    </section>
  );
}
