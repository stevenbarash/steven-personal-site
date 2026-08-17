export type WindowState = 'normal' | 'minimized' | 'maximized' | 'closed';

export type Win95IconName =
  | 'computer'
  | 'user'
  | 'folder'
  | 'folderOpen'
  | 'explorer'
  | 'camera'
  | 'msDos'
  | 'notepad'
  | 'help'
  | 'powerOff'
  | 'globe'
  | 'network'
  | 'mail'
  | 'url'
  | 'mediaPlayer';

export interface SocialLink {
  name: string;
  icon: Win95IconName;
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
  icon: Win95IconName;
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

export interface PhotoItem {
  id: string;
  title: string;
  src: string;
  alt: string;
  album: string;
  takenAt: string;
  location: string;
  camera: string;
  width: number;
  height: number;
}
