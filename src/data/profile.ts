import { ProfileData, SocialLink, Project } from "@/types";

export const profileData: ProfileData = {
  name: "STEVEN BARASH",
  title: "Sr. Solutions Engineer",
  company: "DESCOPE",
  companyUrl: "https://www.descope.com",
  location: "Photographer • Brooklyn, NYC 🗽",
  description:
    "Sr. Solutions Engineer at Descope. Photography, tech, and languages (the human spoken kind) enthusiast. Brooklyn-based.",
  imageUrl: "/images/me.jpg",
};

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: "network",
    content: "Connect with me professionally",
    link: "https://www.linkedin.com/in/stevenbarash",
  },
  {
    name: "GitHub",
    icon: "folderOpen",
    content: "Check out my code projects",
    link: "https://github.com/stevenbarash",
  },
  {
    name: "Instagram",
    icon: "camera",
    content: "View my photography work",
    link: "https://www.instagram.com/steven.photography",
  },
  {
    name: "Twitter",
    icon: "mail",
    content: "Follow my thoughts and updates",
    link: "https://www.x.com/stevenbarash",
  },
];

export const terminalCommands = [
  { command: "whoami", output: "steven" },
  { command: "pwd", output: "/home/steven" },
  {
    command: "cat about.txt",
    output:
      "Sr. Solutions Engineer at Descope. Photography, tech, and languages (the human spoken kind) enthusiast. Brooklyn-based.",
  },
];

export const projects: Project[] = [
  {
    name: "DialectFlow",
    description:
      "LLM-powered tool that translates text into regional dialects and slang variations",
    icon: "globe",
    link: "https://dialectflow.com",
    category: "web",
    technologies: [
      "AI",
      "Next.js",
      "TypeScript",
      "Node.js",
      "React",
      "Descope",
    ],
    featured: true,
  },
  {
    name: "Personal Website",
    description:
      "This Windows 95-themed portfolio built with Next.js and TypeScript",
    icon: "url",
    link: "https://github.com/stevenbarash/steven-personal-site",
    category: "web",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    featured: true,
  },
  {
    name: "Pult",
    description:
      "Swift Google TV remote app built after losing the physical remote and getting tired of ad-heavy or paid alternatives. Pult (пульт) is 'remote' in Russian",
    icon: "mediaPlayer",
    link: "https://github.com/stevenbarash/pult",
    category: "mobile",
    technologies: ["Swift"],
    featured: true,
  },
  {
    name: "bike-cli",
    description:
      "Cycling utility CLI for weather guidance, Strava integration, training recommendations, and maintenance tracking",
    icon: "msDos",
    link: "https://github.com/stevenbarash/bike-cli",
    category: "cli",
    technologies: ["Node.js", "JavaScript", "Strava API"],
    featured: true,
  },
  {
    name: "Photography Portfolio",
    description:
      "Collection of street photography and urban landscapes from NYC",
    icon: "camera",
    link: "https://www.instagram.com/steven.photography",
    category: "photography",
    featured: false,
  },
  {
    name: "Open Source Contributions",
    description: "Various contributions to open source projects on GitHub",
    icon: "folderOpen",
    link: "https://github.com/stevenbarash",
    category: "other",
    technologies: ["JavaScript", "Python", "React"],
    featured: false,
  },
];
