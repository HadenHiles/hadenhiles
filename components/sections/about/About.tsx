"use client";

import type { AboutContent } from "@/types/content";
import about from "@/content/about.json";
import { ValuePillarCard } from "./ValuePillarCard";

export function About() {
  const { pillars } = about as AboutContent;

  return (
    <section aria-label="About" className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-1">What Actually Matters</h2>
      <p className="text-muted text-sm mb-6">
        Three things that shape how I build and why.
      </p>
      <div className="space-y-3">
        {pillars.map((pillar) => (
          <ValuePillarCard key={pillar.name} pillar={pillar} />
        ))}
      </div>
    </section>
  );
}
