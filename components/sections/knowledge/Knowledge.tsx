"use client";

import type { KnowledgeCategory } from "@/types/content";
import knowledge from "@/content/knowledge.json";
import { KnowledgeMap } from "./KnowledgeMap";

export function Knowledge() {
  return (
    <section aria-label="Knowledge" className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-1">Knowledge Map</h2>
      <p className="text-muted text-sm mb-6">
        What I know, what I&apos;ve built with it, and where it shows up.
      </p>
      <KnowledgeMap categories={knowledge as KnowledgeCategory[]} />
    </section>
  );
}
