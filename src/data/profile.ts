import { ProfileData } from "@/types";
import { profileContent } from "@/content/profile";

export const profileData: ProfileData = {
  name: profileContent.name.toUpperCase(),
  title: profileContent.role,
  company: profileContent.company.toUpperCase(),
  companyUrl: "https://www.descope.com",
  location: profileContent.location,
  description: profileContent.background,
  imageUrl: profileContent.portraitUrl,
};


export const terminalCommands = [
  { command: "whoami", output: "steven" },
  { command: "pwd", output: "/home/steven" },
  {
    command: "cat about.txt",
    output: [
      `${profileContent.name} · ${profileContent.role} at ${profileContent.company} · ${profileContent.location}`,
      profileContent.headline,
      profileContent.background,
      profileContent.protocols,
      profileContent.interests,
      profileContent.prototyping,
      profileContent.personal,
      profileContent.languages,
    ].join('\n\n'),
  },
];

