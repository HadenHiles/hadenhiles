import type { HistoryEntry } from "@/lib/store";
import type { Project, Job, KnowledgeCategory, AboutContent } from "@/types/content";
import projectsData from "@/content/projects.json";
import jobsData from "@/content/jobs.json";
import knowledgeData from "@/content/knowledge.json";
import aboutData from "@/content/about.json";
import experienceData from "@/content/experience.json";

const projects = projectsData as Project[];
const jobs = jobsData as Job[];
const knowledge = knowledgeData as KnowledgeCategory[];
const about = aboutData as AboutContent;

// Derive coding start year from the oldest experience entry
const CODING_START_YEAR: number = (experienceData as Array<{ dateRange: string }>)
  .map((e) => parseInt(e.dateRange.split(/[-–]/)[0].trim(), 10))
  .filter((y) => !isNaN(y))
  .reduce((min, y) => Math.min(min, y), 9999);

function out(text: string): HistoryEntry {
  return { type: "out", text };
}

function dim(text: string): HistoryEntry {
  return { type: "log", level: "dim", text };
}

function pad(str: string, len: number): string {
  return str.padEnd(len, " ");
}

// ── Section: Specs ────────────────────────────────────────────────────────────
interface GitHubStats {
  repos: number;
  commitsAllTime: number;
  commitsThisYear: number;
  commitsThisMonth: number;
}

function formatStat(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${n}+`;
}

export function buildSpecs(stats: GitHubStats | null): HistoryEntry[] {
  const yearsCount = new Date().getFullYear() - CODING_START_YEAR;
  const rows: HistoryEntry[] = [
    out(""),
    out("specs/"),
    dim("────────────────────────────────────────────────────────────────"),
    { type: "img", text: "", src: "/images/purple-bg-new.jpg", alt: "Haden Hiles" },
    out(""),
    out("  Haden Hiles"),
    out("  full stack engineer · ux first"),
    out(""),
    out('  "I build software people love to use."'),
    out(""),
    dim("  ── github ─────────────────────────────────────────────────────────"),
  ];

  if (stats) {
    const label = (l: string, w: number) => l.padEnd(w, " ");
    rows.push(out(`  ${label("repos",          14)}${stats.repos}`));
    rows.push(out(`  ${label("commits",        14)}${formatStat(stats.commitsAllTime)}   all time`));
    rows.push(out(`  ${label("commits / yr",   14)}${formatStat(stats.commitsThisYear)}   past 12 months`));
    rows.push(out(`  ${label("commits / mo",   14)}${stats.commitsThisMonth}   this month`));
  } else {
    rows.push(out("  (stats unavailable — check github.com/HadenHiles)"));
  }

  rows.push(dim("  ───────────────────────────────────────────────────────────────"));
  rows.push(out(`  ${yearsCount} yrs coding   · since ${CODING_START_YEAR}`));
  rows.push(out(""));
  return rows;
}

// ── Section: Projects ────────────────────────────────────────────────────────
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

// ── Section 1: Experience ─────────────────────────────────────────────────────
// Shows individual company folders — use `cd experience/<slug>` to explore each one.
function buildExperience(): HistoryEntry[] {
  const companyWidth = Math.max(...jobs.map((j) => j.company.length)) + 2;
  const rows: HistoryEntry[] = [
    out(""),
    out("experience/"),
    dim("────────────────────────────────────────────────────────────────"),
  ];
  for (const j of jobs) {
    if (j.tui) {
      rows.push(out(j.tui));
    } else {
      rows.push(out(`${pad(j.company, companyWidth)}${j.company} · ${j.role} · ${j.dateRange}`));
    }
    rows.push(out(""));
  }
  rows.push(out("tip: cd experience/<slug> then cat role.txt / highlights.txt / stack.txt"));
  rows.push(out(""));
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

// Specs (index 0) is handled async in store.ts via buildSpecs()
export const SECTION_CONTENT: Record<number, HistoryEntry[]> = {
  1: buildKnowledge(),   // "Knowledge"  → menu index 1
  2: buildProjects(),    // "Projects"   → menu index 2
  3: buildExperience(),  // "Experience" → menu index 3
  4: buildAbout(),       // "About"      → menu index 4
};
