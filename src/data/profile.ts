import { ProfileData, SocialLink, Project } from "@/types";
import { siteConfig } from "@/constants/site";

export const profileData: ProfileData = {
  name: siteConfig.personName.toUpperCase(),
  title: "Senior Solutions Engineer",
  company: "DESCOPE",
  companyUrl: "https://www.descope.com",
  location: "Brooklyn, New York",
  description:
    "Senior Solutions Engineer at Descope, formerly at Okta/Auth0 and ID.me. I help teams decide how customers sign in and what they can access, then build demos and workshops to test the design.",
  imageUrl: "/images/profile-portrait.png",
};

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: "network",
    content: "Work history and updates",
    link: siteConfig.linkedinUrl,
  },
  {
    name: "GitHub",
    icon: "folderOpen",
    content: "Code and projects",
    link: siteConfig.githubUrl,
  },
  {
    name: "Instagram",
    icon: "camera",
    content: "Photos",
    link: siteConfig.instagramUrl,
  },
  {
    name: "Twitter",
    icon: "mail",
    content: "Posts and updates",
    link: siteConfig.xUrl,
  },
];

export const terminalCommands = [
  { command: "whoami", output: "steven" },
  { command: "pwd", output: "/home/steven" },
  {
    command: "cat about.txt",
    output:
      "Senior Solutions Engineer at Descope. I help teams decide how customers sign in and what they can access, then build demos and workshops to test the design.",
  },
];

export const projects: Project[] = [
  {
    name: "Personal Website",
    description:
      "This Windows 95-themed portfolio built with Next.js and TypeScript",
    icon: "url",
    link: `${siteConfig.githubUrl}/steven-personal-site`,
    category: "web",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    featured: true,
  },
  {
    name: "Pult",
    description:
      "Swift Google TV remote app built after losing the physical remote and getting tired of ad-heavy or paid alternatives. Pult (пульт) is 'remote' in Russian",
    icon: "mediaPlayer",
    link: `${siteConfig.githubUrl}/pult`,
    category: "mobile",
    technologies: ["Swift"],
    featured: true,
  },
  {
    name: "bike-cli",
    description:
      "Cycling utility CLI for weather guidance, Strava integration, training recommendations, and maintenance tracking",
    icon: "msDos",
    link: `${siteConfig.githubUrl}/bike-cli`,
    category: "cli",
    technologies: ["Node.js", "JavaScript", "Strava API"],
    featured: true,
  },
  {
    name: "Photography Portfolio",
    description:
      "Collection of street photography and urban landscapes from NYC",
    icon: "camera",
    link: siteConfig.instagramUrl,
    category: "photography",
    featured: false,
  },
];
