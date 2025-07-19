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