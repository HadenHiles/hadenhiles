"use client";

import type { KnowledgeCategory } from "@/types/content";
import knowledge from "@/content/knowledge.json";
import { KnowledgeMap } from "./KnowledgeMap";

export function Knowledge() {
  return (
    <section aria-label="Knowledge">
      <p className="font-mono text-sm text-accent mb-4">knowledge</p>
      <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
        Knowledge Map
      </h2>
      <p className="text-muted mb-10">
        What I know, what I&apos;ve built with it, and where it shows up.
      </p>
      <KnowledgeMap categories={knowledge as KnowledgeCategory[]} />
    </section>
  );
}
