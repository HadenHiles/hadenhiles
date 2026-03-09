export const ROUTES = {
  tui:            "/",
  tuiExplicit:    "/tui",
  site:           "/site",
  siteHome:       "/site",
  siteKnowledge:  "/site?mode=knowledge",
  siteWork:       "/site?mode=work",
  siteExperience: "/site?mode=experience",
  siteAbout:      "/site?mode=about",
} as const;

export type SiteMode = "home" | "knowledge" | "work" | "experience" | "about";
export type AppMode  = "tui" | SiteMode;

export const VALID_SITE_MODES: SiteMode[] = [
  "home",
  "knowledge",
  "work",
  "experience",
  "about",
];

export const MENU_ITEMS = [
  { label: "Home",       mode: "home"       as AppMode, number: 1 },
  { label: "Knowledge",  mode: "knowledge"  as AppMode, number: 2 },
  { label: "Projects",   mode: "work"       as AppMode, number: 3 },
  { label: "Experience", mode: "experience" as AppMode, number: 4 },
  { label: "About",      mode: "about"      as AppMode, number: 5 },
  { label: "Use GUI (view site)",    mode: "work"       as AppMode, number: 6, isHandoff: true },
  { label: "Contact",    mode: null,                    number: 7, isContact: true },
] as const;

export type MenuItem = (typeof MENU_ITEMS)[number];
