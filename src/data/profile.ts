import { Linkedin, Github, Instagram, TwitterX } from 'react-bootstrap-icons';
import { ProfileData, SocialLink } from '@/types';

export const profileData: ProfileData = {
  name: "STEVEN BARASH",
  title: "Sr. Solutions Engineer",
  company: "DESCOPE",
  companyUrl: "https://www.descope.com",
  location: "Photographer • Brooklyn, NYC 🗽",
  description: "Sr. Solutions Engineer at Descope. Photography, tech, and languages (the human spoken kind) enthusiast. Brooklyn-based.",
  imageUrl: "/images/me.jpg"
};

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: Linkedin,
    content: "Connect with me professionally",
    link: "https://www.linkedin.com/in/stevenbarash"
  },
  {
    name: "GitHub",
    icon: Github,
    content: "Check out my code projects",
    link: "https://github.com/stevenbarash"
  },
  {
    name: "Instagram",
    icon: Instagram,
    content: "View my photography work",
    link: "https://www.instagram.com/steven.photography"
  },
  {
    name: "Twitter",
    icon: TwitterX,
    content: "Follow my thoughts and updates",
    link: "https://www.x.com/steven_barash"
  }
];

export const terminalCommands = [
  { command: "whoami", output: "steven" },
  { command: "pwd", output: "/home/steven" },
  { command: "cat about.txt", output: profileData.description }
]; 