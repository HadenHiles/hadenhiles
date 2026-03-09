export interface Job {
  slug: string;
  company: string;
  companyLogo?: string | null;
  coverImage?: string | null;
  /** CSS object-position value for the cover photo, e.g. "center", "top", "50% 20%" */
  coverImagePosition?: string | null;
  /** Cover photo banner height in pixels. Defaults to 200. */
  coverImageHeight?: number | null;
  role: string;
  dateRange: string;
  startYear: number;
  endYear: number | null;
  current: boolean;
  primarySkills: string[];
  summary: string;
  highlights: string[];
  projects?: string[];
  tui?: string;
}

export interface Project {
  id: string;
  title: string;
  tui?: string;
  tagline: string;
  purpose: string;
  constraints: string;
  decisions: string;
  impact: string;
  tech: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  demoUrlLabel?: string | null;
  videoUrl?: string | null;
  diagramAsset?: string | null;
  story: string;
  /** "mobile" renders a phone frame, "desktop" renders a monitor frame */
  demoType: "mobile" | "desktop";
  /** Optional label override for the demo type badge (e.g. "web app" on a mobile-framed project) */
  demoTypeLabel?: string | null;
  /** Path or URL to a gif/image/video for the demo preview */
  demoAsset: string | null;
  /** Optional list of assets to cycle through (desktop). When provided, plays each in sequence and loops. */
  demoAssets?: string[] | null;
}

export interface ExperienceEntry {
  version: string;
  title: string;
  tui?: string;
  dateRange: string;
  role: string;
  company?: string | null;
  companies?: string[];
  companyLogos?: (string | null)[];
  coverImage?: string | null;
  primarySkills?: string[];
  summary: string;
  highlights: string[];
}

export interface KnowledgeSkill {
  name: string;
  logo?: string | null;
  emoji?: string | null;
  yearsExperience?: number | null;
  usedFor: string;
  proofProjectIds: string[];
}

export interface KnowledgeCategory {
  category: string;
  tui?: string;
  skills: KnowledgeSkill[];
}

export interface Pillar {
  name: string;
  story: string;
  image?: string | null;
  shapeWork: string;
}

export interface AboutContent {
  tui?: {
    family: string;
    craft: string;
    play: string;
  };
  pillars: Pillar[];
  contact: {
    email: string;
    linkedin: string;
    github?: string;
  };
}
