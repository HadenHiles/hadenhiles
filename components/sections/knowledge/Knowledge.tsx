"use client";

import { motion } from "framer-motion";
import type { KnowledgeCategory } from "@/types/content";
import knowledge from "@/content/knowledge.json";
import { KnowledgeMap } from "./KnowledgeMap";
import { duration, ease } from "@/lib/motion";

export function Knowledge() {
  return (
    <section aria-label="Knowledge">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: duration.medium, ease: ease.standard }}
      >
        <p className="font-mono text-sm text-accent mb-4">knowledge</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
          Tech Stack
        </h2>
        <p className="text-muted mb-8">
          Hover any logo to see years of experience.
        </p>
      </motion.div>
      <KnowledgeMap categories={knowledge as KnowledgeCategory[]} />
    </section>
  );
}

