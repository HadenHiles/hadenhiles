"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { KnowledgeCategory } from "@/types/content";
import { duration, ease } from "@/lib/motion";

// ─── Coordinate system ───────────────────────────────────────────────────────
// Positions are in a 0–100 × 0–100 space mapped onto a 16:9 container.
// Each node is centred at (x %, y %).

interface Pt { x: number; y: number }

// Pre-calculated positions for the "all skills" view
const ALL_POSITIONS: Record<string, Pt> = {
  // Frontend cluster — top-left
  "Flutter / Dart":      { x: 8,  y: 28 },
  "React":               { x: 20, y: 16 },
  "Angular":             { x: 32, y: 20 },
  "TypeScript":          { x: 30, y: 36 },
  "JavaScript":          { x: 16, y: 46 },
  "WordPress":           { x: 4,  y: 46 },
  "CSS / SASS":          { x: 22, y: 56 },
  // Backend cluster — top-centre
  "Firebase / Firestore": { x: 44, y: 11 },
  "Node.js / Express":   { x: 55, y: 9  },
  "PHP":                 { x: 65, y: 14 },
  ".NET Core":           { x: 61, y: 26 },
  "REST API Design":     { x: 47, y: 24 },
  // Systems / Native — top-right
  "C++":                 { x: 77, y: 15 },
  "Bluetooth Beacons":   { x: 85, y: 9  },
  "Native iOS/Android":  { x: 85, y: 23 },
  // Databases — right
  "MySQL":               { x: 88, y: 34 },
  "MS SQL Server":       { x: 94, y: 45 },
  "Cloud Firestore":     { x: 80, y: 41 },
  "MongoDB":             { x: 92, y: 57 },
  "GraphQL":             { x: 84, y: 65 },
  "SQLite":              { x: 76, y: 55 },
  // DevOps — bottom-left
  "Git":                 { x: 14, y: 66 },
  "GitHub Actions":      { x: 26, y: 74 },
  "Docker":              { x: 16, y: 82 },
  "Linux":               { x: 36, y: 84 },
  "Production Infrastructure": { x: 4, y: 76 },
  "Backup & Recovery Systems": { x: 4, y: 87 },
  // Cloud — bottom-right
  "Firebase / GCP":      { x: 64, y: 74 },
  "AWS":                 { x: 73, y: 68 },
  "Azure":               { x: 81, y: 76 },
  "DigitalOcean":        { x: 70, y: 85 },
  // Product & UX — bottom-centre
  "UX Architecture":     { x: 44, y: 70 },
  "Content Architecture":{ x: 53, y: 80 },
  "Product Thinking":    { x: 46, y: 88 },
};

// Logical connections between skills (drawn as lines in "all" view)
const CONNECTIONS: [string, string][] = [
  ["React", "TypeScript"],
  ["React", "JavaScript"],
  ["TypeScript", "JavaScript"],
  ["React", "CSS / SASS"],
  ["Angular", "TypeScript"],
  ["Flutter / Dart", "Firebase / Firestore"],
  ["Flutter / Dart", "C++"],
  ["Flutter / Dart", "Native iOS/Android"],
  ["C++", "Native iOS/Android"],
  ["Firebase / Firestore", "Cloud Firestore"],
  ["Firebase / Firestore", "Firebase / GCP"],
  ["Cloud Firestore", "Firebase / GCP"],
  ["Node.js / Express", "MongoDB"],
  ["Node.js / Express", "GraphQL"],
  ["Node.js / Express", "REST API Design"],
  ["PHP", "MySQL"],
  ["PHP", "WordPress"],
  [".NET Core", "MS SQL Server"],
  ["Git", "GitHub Actions"],
  ["GitHub Actions", "Docker"],
  ["Docker", "Linux"],
  ["Firebase / GCP", "AWS"],
  ["AWS", "Azure"],
  ["UX Architecture", "Product Thinking"],
  ["UX Architecture", "Content Architecture"],
  ["React", "Node.js / Express"],
  ["Flutter / Dart", "Firebase / GCP"],
];

// Focused layout for a single category (radial, centred at 50 %, 50 %)
function getFocusedPosition(index: number, total: number): Pt {
  if (total === 1) return { x: 50, y: 50 };
  if (total === 2) return { x: [35, 65][index], y: 50 };
  const radius = total <= 4 ? 26 : 32;
  const angleOffset = -Math.PI / 2; // start at top
  const angle = angleOffset + (index / total) * 2 * Math.PI;
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * 0.65 * Math.sin(angle), // compress y for 16:9
  };
}

// ─── Node component ───────────────────────────────────────────────────────────
interface NodeData {
  name: string;
  logo: string | null;
  category: string;
}

function SkillNode({
  node,
  position,
  visible,
  focused,
  hovered,
  onHover,
}: {
  node: NodeData;
  position: Pt;
  visible: boolean;
  focused: boolean;
  hovered: boolean;
  onHover: (name: string | null) => void;
}) {
  return (
    <motion.div
      layout
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.4,
      }}
      transition={{
        opacity: { duration: duration.short },
        scale: { duration: duration.short, ease: ease.standard },
        left: { duration: duration.medium, ease: ease.standard },
        top: { duration: duration.medium, ease: ease.standard },
      }}
      onMouseEnter={() => onHover(node.name)}
      onMouseLeave={() => onHover(null)}
      style={{ transform: "translate(-50%, -50%)" }}
      className="absolute flex flex-col items-center gap-1 cursor-default"
    >
      <div
        className={`
          flex items-center justify-center rounded-xl transition-all
          ${focused ? "w-12 h-12 bg-surface border border-border shadow-lg" : "w-8 h-8 bg-surface/80 border border-border/60"}
          ${hovered ? "border-accent/60 shadow-[0_0_12px_rgba(138,92,255,0.25)]" : ""}
        `}
      >
        {node.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.logo}
            alt={node.name}
            width={focused ? 28 : 20}
            height={focused ? 28 : 20}
            className={`object-contain ${focused ? "w-7 h-7" : "w-5 h-5"}`}
          />
        ) : (
          <span className={`font-mono text-muted font-bold ${focused ? "text-xs" : "text-[9px]"}`}>
            {node.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      {/* Label — shown when focused or hovered */}
      <AnimatePresence>
        {(focused || hovered) && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: duration.micro }}
            className="text-[10px] font-mono text-text whitespace-nowrap bg-bg/90 px-1.5 py-0.5 rounded border border-border/50 pointer-events-none"
          >
            {node.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const ALL_LABEL = "All";

export function KnowledgeMindMap({ categories }: { categories: KnowledgeCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Flatten all skills into a single list with category metadata
  const allNodes: NodeData[] = categories.flatMap((cat) =>
    cat.skills.map((s) => ({ name: s.name, logo: s.logo ?? null, category: cat.category }))
  );

  const categoryNames = [ALL_LABEL, ...categories.map((c) => c.category)];
  const isAll = activeCategory === ALL_LABEL;

  // Build focused positions for the selected category
  const focusedCategorySkills = isAll
    ? []
    : (categories.find((c) => c.category === activeCategory)?.skills ?? []);

  function getPosition(node: NodeData): Pt {
    if (isAll) {
      return ALL_POSITIONS[node.name] ?? { x: 50, y: 50 };
    }
    const idx = focusedCategorySkills.findIndex((s) => s.name === node.name);
    if (idx === -1) return ALL_POSITIONS[node.name] ?? { x: 50, y: 50 };
    return getFocusedPosition(idx, focusedCategorySkills.length);
  }

  function isVisible(node: NodeData): boolean {
    if (isAll) return true;
    return node.category === activeCategory;
  }

  function isFocused(node: NodeData): boolean {
    return !isAll && node.category === activeCategory;
  }

  return (
    <div className="select-none">
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              text-xs px-3 py-1.5 rounded-full border font-mono transition-all
              ${activeCategory === cat
                ? "bg-accent text-bg border-accent shadow-[0_0_10px_rgba(138,92,255,0.3)]"
                : "bg-surface border-border text-muted hover:text-text hover:border-border/60"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mind-map canvas */}
      <div className="relative w-full aspect-video bg-surface/40 border border-border/50 rounded-card overflow-hidden">
        {/* SVG connection lines — shown in "all" view */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {CONNECTIONS.map(([from, to]) => {
            const fromPos = ALL_POSITIONS[from];
            const toPos = ALL_POSITIONS[to];
            if (!fromPos || !toPos) return null;
            const fromNode = allNodes.find((n) => n.name === from);
            const toNode = allNodes.find((n) => n.name === to);
            const bothVisible = fromNode && toNode && isVisible(fromNode) && isVisible(toNode);
            const isHoveredLine =
              hoveredNode === from || hoveredNode === to;

            return (
              <motion.line
                key={`${from}—${to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={isHoveredLine ? "#8A5CFF" : "#EDEDF2"}
                strokeWidth={isHoveredLine ? 0.4 : 0.2}
                animate={{
                  opacity: bothVisible && isAll ? (isHoveredLine ? 0.7 : 0.15) : 0,
                }}
                transition={{ duration: duration.short }}
              />
            );
          })}
        </svg>

        {/* Skill nodes */}
        {allNodes.map((node) => (
          <SkillNode
            key={node.name}
            node={node}
            position={getPosition(node)}
            visible={isVisible(node)}
            focused={isFocused(node)}
            hovered={hoveredNode === node.name}
            onHover={setHoveredNode}
          />
        ))}

        {/* Focused category: show connections between same-category nodes */}
        {!isAll && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {CONNECTIONS.filter(([from, to]) => {
              const fn = allNodes.find((n) => n.name === from);
              const tn = allNodes.find((n) => n.name === to);
              return fn?.category === activeCategory && tn?.category === activeCategory;
            }).map(([from, to]) => {
              const fromIdx = focusedCategorySkills.findIndex((s) => s.name === from);
              const toIdx = focusedCategorySkills.findIndex((s) => s.name === to);
              if (fromIdx === -1 || toIdx === -1) return null;
              const fp = getFocusedPosition(fromIdx, focusedCategorySkills.length);
              const tp = getFocusedPosition(toIdx, focusedCategorySkills.length);
              const isHoveredLine = hoveredNode === from || hoveredNode === to;
              return (
                <motion.line
                  key={`focused-${from}—${to}`}
                  x1={fp.x} y1={fp.y}
                  x2={tp.x} y2={tp.y}
                  stroke={isHoveredLine ? "#8A5CFF" : "#EDEDF2"}
                  strokeWidth={isHoveredLine ? 0.5 : 0.3}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHoveredLine ? 0.8 : 0.3 }}
                  transition={{ duration: duration.short, delay: 0.2 }}
                />
              );
            })}
          </svg>
        )}

        {/* Empty state hint */}
        {isAll && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="font-mono text-[10px] text-border/60">
              hover a node · select a category above
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
