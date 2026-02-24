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
          Knowledge Map
        </h2>
        <p className="text-muted mb-10">
          What I know, what I&apos;ve built with it, and where it shows up.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: duration.medium, ease: ease.standard, delay: 0.1 }}
      >
        <KnowledgeMap categories={knowledge as KnowledgeCategory[]} />
      </motion.div>
    </section>
  );
}
