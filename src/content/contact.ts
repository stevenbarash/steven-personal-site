import { siteConfig } from '@/constants/site';

export type ContactKind = 'linkedin' | 'github' | 'instagram' | 'x';

export interface ContactEntry {
  kind: ContactKind;
  label: string;
  description: string;
  url: string;
}

export const contactCatalog: ContactEntry[] = [
  {
    kind: 'linkedin',
    label: 'LinkedIn',
    description: 'Work history and updates',
    url: siteConfig.linkedinUrl,
  },
  {
    kind: 'github',
    label: 'GitHub',
    description: 'Code and projects',
    url: siteConfig.githubUrl,
  },
  {
    kind: 'instagram',
    label: 'Instagram',
    description: 'Photography',
    url: siteConfig.instagramUrl,
  },
  {
    kind: 'x',
    label: 'X',
    description: 'Short posts and updates',
    url: siteConfig.xUrl,
  },
];

export const contactContent = {
  description: `Contact ${siteConfig.personName} by email, LinkedIn, GitHub, Instagram, or X.`,
  introduction: 'For work inquiries or technical questions, email me. I’m based in Brooklyn, New York.',
  emailDisplay: siteConfig.emailDisplay,
  socialLinks: contactCatalog,
} as const;
