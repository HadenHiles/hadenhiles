export interface Job {
  slug: string;
  company: string;
  companyLogo?: string | null;
  coverImage?: string | null;
  role: string;
  dateRange: string;
  startYear: number;
  endYear: number | null;
  current: boolean;
  primarySkills: string[];
  summary: string;
  highlights: string[];
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
  videoUrl?: string | null;
  diagramAsset?: string | null;
  story: string;
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
