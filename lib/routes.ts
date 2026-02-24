export const ROUTES = {
  tui:            "/",
  tuiExplicit:    "/tui",
  site:           "/site",
  siteWork:       "/site?mode=work",
  siteExperience: "/site?mode=experience",
  siteKnowledge:  "/site?mode=knowledge",
  siteAbout:      "/site?mode=about",
} as const;

export type SiteMode = "work" | "experience" | "knowledge" | "about";
export type AppMode  = "tui" | SiteMode;

export const VALID_SITE_MODES: SiteMode[] = [
  "work",
  "experience",
  "knowledge",
  "about",
];

export const MENU_ITEMS = [
  { label: "Projects",   mode: "work"       as AppMode, number: 1 },
  { label: "Experience", mode: "experience" as AppMode, number: 2 },
  { label: "Knowledge",  mode: "knowledge"  as AppMode, number: 3 },
  { label: "About",      mode: "about"      as AppMode, number: 4 },
  { label: "Use GUI",    mode: "work"       as AppMode, number: 5, isHandoff: true },
  { label: "Contact",    mode: null,                    number: 6, isContact: true },
] as const;

export type MenuItem = (typeof MENU_ITEMS)[number];
