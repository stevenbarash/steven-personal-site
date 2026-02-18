export type WindowState = 'normal' | 'minimized' | 'maximized' | 'closed';

export interface SocialLink {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  content: string;
  link: string;
}

export interface ProfileData {
  name: string;
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface TerminalCommand {
  command: string;
  output: string;
}

export interface Project {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  link: string;
  category: 'web' | 'mobile' | 'photography' | 'cli' | 'other';
  technologies?: string[];
  featured?: boolean;
}

export interface ResumeExperience {
  company: string;
  roles: {
    title: string;
    startDate: string;
    endDate: string;
    location: string;
  }[];
  bullets: string[];
  companyUrl?: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  dates: string;
}

export interface ResumeData {
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  languages: { name: string; proficiency: string }[];
  honors: string[];
  contact: {
    email: string;
    linkedin: string;
    website: string;
  };
}