export interface Project {
  id: string;
  title: string;
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
  dateRange: string;
  role: string;
  company?: string | null;
  summary: string;
  highlights: string[];
}

export interface KnowledgeSkill {
  name: string;
  usedFor: string;
  proofProjectIds: string[];
}

export interface KnowledgeCategory {
  category: string;
  skills: KnowledgeSkill[];
}

export interface Pillar {
  name: string;
  story: string;
  image?: string | null;
  shapeWork: string;
}

export interface AboutContent {
  pillars: Pillar[];
  contact: {
    email: string;
    linkedin: string;
    github?: string;
  };
}
