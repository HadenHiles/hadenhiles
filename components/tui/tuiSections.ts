import type { HistoryEntry } from "@/lib/store";
import type { Project, ExperienceEntry, KnowledgeCategory, AboutContent } from "@/types/content";
import projectsData from "@/content/projects.json";
import experienceData from "@/content/experience.json";
import knowledgeData from "@/content/knowledge.json";
import aboutData from "@/content/about.json";

const projects = projectsData as Project[];
const experience = experienceData as ExperienceEntry[];
const knowledge = knowledgeData as KnowledgeCategory[];
const about = aboutData as AboutContent;

function out(text: string): HistoryEntry {
  return { type: "out", text };
}

function dim(text: string): HistoryEntry {
  return { type: "log", level: "dim", text };
}

function pad(str: string, len: number): string {
  return str.padEnd(len, " ");
}

// ── Section 0: Projects ──────────────────────────────────────────────────────
function buildProjects(): HistoryEntry[] {
  const titleWidth = Math.max(...projects.map((p) => p.title.length)) + 2;
  const rows: HistoryEntry[] = [
    out(""),
    out("projects/"),
    dim("────────────────────────────────────────────────────────────────"),
  ];
  for (const p of projects) {
    rows.push(out(`${pad(p.title, titleWidth)}— ${p.tui ?? p.tagline}`));
    rows.push(out(""));
  }
  return rows;
}

// ── Section 1: Experience ────────────────────────────────────────────────────
function buildExperience(): HistoryEntry[] {
  const rows: HistoryEntry[] = [
    out(""),
    out("experience/"),
    dim("────────────────────────────────────────────────────────────────"),
  ];
  for (const e of experience) {
    rows.push(out(e.tui ?? `${e.version} · ${e.title} · ${e.role}`));
    rows.push(out(""));
  }
  return rows;
}

// ── Section 2: Knowledge ─────────────────────────────────────────────────────
function buildKnowledge(): HistoryEntry[] {
  const catWidth = Math.max(...knowledge.map((k) => k.category.length)) + 2;
  const rows: HistoryEntry[] = [
    out(""),
    out("knowledge/"),
    dim("────────────────────────────────────────────────────────────────"),
  ];
  for (const k of knowledge) {
    rows.push(out(`${pad(k.category, catWidth)}${k.tui ?? k.skills.map((s) => s.name).join(" · ")}`));
  }
  rows.push(out(""));
  rows.push(out("The common thread: every tool chosen to solve a specific problem."));
  rows.push(out("Nothing added for the sake of it."));
  rows.push(out(""));
  return rows;
}

// ── Section 3: About ─────────────────────────────────────────────────────────
function buildAbout(): HistoryEntry[] {
  const tui = about.tui;
  const familyLine = tui?.family ?? about.pillars.find((p) => p.name === "Family")?.story ?? "";
  const craftLine = tui?.craft ?? about.pillars.find((p) => p.name === "Craft")?.shapeWork ?? "";
  const playLine = tui?.play ?? about.pillars.find((p) => p.name === "Play")?.story ?? "";

  return [
    out(""),
    out("about/"),
    dim("────────────────────────────────────────────────────────────────"),
    out(`Family  ${familyLine}`),
    out(""),
    out(`Craft   ${craftLine}`),
    out(""),
    out(`Play    ${playLine}`),
    out(""),
  ];
}

export const SECTION_CONTENT: Record<number, HistoryEntry[]> = {
  0: buildProjects(),
  1: buildExperience(),
  2: buildKnowledge(),
  3: buildAbout(),
};
