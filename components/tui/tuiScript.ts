export type BootLevel = "info" | "ok" | "warn" | "banner" | "dim";

export interface BootLine {
  delayMs: number; // ms after the previous line (NOT cumulative)
  level: BootLevel;
  text: string;
}

// ASCII banner — Standard figlet font, "HADEN HILES"
const BANNER_LINES: BootLine[] = [
  { delayMs: 0,   level: "banner", text: "" },
  { delayMs: 0,   level: "banner", text: " _   _    _    ____  _____  _   _   _   _ ___ _     _____  ____  " },
  { delayMs: 0,   level: "banner", text: "| | | |  / \\  |  _ \\| ____|| \\ | | | | | |_ _| |   | ____/ ___| " },
  { delayMs: 0,   level: "banner", text: "| |_| | / _ \\ | | | |  _|  |  \\| | | |_| || || |   |  _|  \\___ \\ " },
  { delayMs: 0,   level: "banner", text: "|  _  |/ ___ \\| |_| | |___ | |\\  | |  _  || || |___| |___ ___) |" },
  { delayMs: 0,   level: "banner", text: "|_| |_/_/   \\_\\____/|_____||_| \\_| |_| |_|___|_____|_____|____/ " },
  { delayMs: 0,   level: "banner", text: "" },
  { delayMs: 0,   level: "dim",    text: "  full stack engineer · ux first · hadenhiles.com" },
  { delayMs: 0,   level: "banner", text: "" },
];

// 15 lines, ~3.5s total. Techy, tasteful, not hacker cosplay.
export const BOOT_SCRIPT: BootLine[] = [
  ...BANNER_LINES,
  { delayMs: 0,   level: "info", text: "hadensystem v4.0 — initializing runtime..." },
  { delayMs: 200, level: "info", text: "loading content manifests..." },
  { delayMs: 240, level: "ok",   text: "content/projects.json         [7 projects indexed]" },
  { delayMs: 160, level: "ok",   text: "content/experience.json       [4 versions loaded]" },
  { delayMs: 140, level: "ok",   text: "content/knowledge.json        [5 categories mapped]" },
  { delayMs: 160, level: "ok",   text: "content/about.json            [pillars: 3]" },
  { delayMs: 240, level: "info", text: "applying theme tokens..." },
  { delayMs: 180, level: "ok",   text: "accent: #8A5CFF               [from logo]" },
  { delayMs: 200, level: "info", text: "warming motion engine..." },
  { delayMs: 160, level: "ok",   text: "easing: mechanical            [no spring, no bounce]" },
  { delayMs: 200, level: "info", text: "checking accessibility preferences..." },
  { delayMs: 160, level: "ok",   text: "reduced-motion: following system preference" },
  { delayMs: 220, level: "info", text: "preparing gui fallback..." },
  { delayMs: 200, level: "ok",   text: "guiRenderer: standby" },
  { delayMs: 300, level: "ok",   text: "boot complete. welcome." },
];
