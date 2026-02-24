import type { HistoryEntry } from "@/lib/store";

function out(text: string): HistoryEntry {
  return { type: "out", text };
}

function dim(text: string): HistoryEntry {
  return { type: "log", level: "dim", text };
}

// ── Section 0: Projects ──────────────────────────────────────────────────────
const PROJECTS: HistoryEntry[] = [
  out(""),
  out("projects/"),
  dim("────────────────────────────────────────────────────────────────"),
  out("TenThousandShotChallenge  — Shot-logging mobile app (Flutter/Firebase)."),
  out("                            Log a session in under 10s, see cumulative progress."),
  out(""),
  out("The Pond                  — WordPress membership platform (LearnDash/MemberPress)."),
  out("                            Content hierarchy first, zero admin friction."),
  out(""),
  out("Group of Seven Trail App  — Trail companion app (Flutter/C++)."),
  out("                            Bluetooth beacons surface context at the right moment."),
  out(""),
  out("NextShift                 — Real-time feature voting platform (Firebase)."),
  out("                            Idea to ranked result in under 20 seconds."),
  out(""),
  out("Skill Drills              — Customizable training tracker (Flutter/C++)."),
  out("                            User-defined routines and metrics, no rigid structure."),
  out(""),
  out("timmies-helper            — Fork + Value Over Replacement for Tim's Hockey Challenge."),
  out("                            Best pick in each tier, immediately visible."),
  out(""),
  out("VideoScraper              — URL-in, file-out download utility (React/Node.js)."),
  out("                            Strict frontend/backend separation, zero friction."),
  out(""),
];

// ── Section 1: Experience ────────────────────────────────────────────────────
const EXPERIENCE: HistoryEntry[] = [
  out(""),
  out("experience/"),
  dim("────────────────────────────────────────────────────────────────"),
  out("v1.0  Foundations       — Software Developer @ How To Hockey"),
  out("                          First hire, shipped across web + mobile from day one."),
  out(""),
  out("v2.0  Building Products — Software Engineer"),
  out("                          Full-stack product ownership: The Pond,"),
  out("                          TenThousandShotChallenge, Group of Seven Trail App."),
  out(""),
  out("v3.0  Owning the Stack  — Principal Software Engineer"),
  out("                          Added DevOps ownership. Shipped NextShift."),
  out("                          Codified: design like a user, build like an engineer."),
  out(""),
  out("v4.0  UX-First          — Principal Software & DevOps Engineer  [present]"),
  out("                          Full ownership: frontend, backend, mobile, infra."),
  out("                          Every decision anchored to: what would the user expect?"),
  out(""),
];

// ── Section 2: Knowledge ─────────────────────────────────────────────────────
const KNOWLEDGE: HistoryEntry[] = [
  out(""),
  out("knowledge/"),
  dim("────────────────────────────────────────────────────────────────"),
  out("Frontend      Flutter/Dart · React · TypeScript · WordPress · CSS/UI Design"),
  out("Backend       Firebase/Firestore · Node.js/Express · PHP · LearnDash/MemberPress"),
  out("DevOps        CI/CD Pipelines · Production Infrastructure · Docker · Vite"),
  out("Systems       C++ · Bluetooth Beacons · Native iOS/Android Integrations"),
  out("Craft         UX Architecture · Content Architecture · Product Thinking"),
  out(""),
  out("The common thread: every tool chosen to solve a specific problem."),
  out("Nothing added for the sake of it."),
  out(""),
];

// ── Section 3: About ─────────────────────────────────────────────────────────
const ABOUT: HistoryEntry[] = [
  out(""),
  out("about/"),
  dim("────────────────────────────────────────────────────────────────"),
  out("Family  Shannon + Harvey (golden retriever)"),
  out("        Married Jul '25 · first house Oct '25"),
  out("        Best time of year: cottage country, Harvey off the dock."),
  out(""),
  out("Craft   \"Simplicity beats cleverness."),
  out("         If it needs a manual, it probably needs a redesign.\""),
  out(""),
  out("        Every flow, button, color, API, and deployment decision"),
  out("        starts from: as a user, what would I expect right here?"),
  out(""),
  out("Play    Hockey · Golf · Squash · Guitar"),
  out("        LOTR · GOT · Mr. Robot (IYKYK)"),
  out("        Weekends: house projects, Plex homelab, cottage with family."),
  out(""),
];

export const SECTION_CONTENT: Record<number, HistoryEntry[]> = {
  0: PROJECTS,
  1: EXPERIENCE,
  2: KNOWLEDGE,
  3: ABOUT,
};
