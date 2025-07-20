export interface FileSystemItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  content: string;
  link: string;
}

export interface FileSystem {
  [key: string]: FileSystemItem;
}

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
  category: 'web' | 'mobile' | 'photography' | 'other';
  technologies?: string[];
  featured?: boolean;
}

// Global gtag function for analytics
declare global {
  interface Window {
    gtag: (
      command: 'event',
      eventName: string,
      parameters: {
        value?: number;
        event_category?: string;
        [key: string]: any;
      }
    ) => void;
  }
} 