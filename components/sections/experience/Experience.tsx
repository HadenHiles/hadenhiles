"use client";

import type { ExperienceEntry } from "@/types/content";
import experience from "@/content/experience.json";
import { VersionTimeline } from "./VersionTimeline";

export function Experience() {
  return (
    <section aria-label="Experience" className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-1">Version History</h2>
      <p className="text-muted text-sm mb-6">
        Each chapter had a different constraint set.
      </p>
      <VersionTimeline entries={experience as ExperienceEntry[]} />
    </section>
  );
}
