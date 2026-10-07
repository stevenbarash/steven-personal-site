import { siteConfig } from '@/constants/site';

export type ContactKind = 'linkedin' | 'github' | 'instagram' | 'x' | 'website';

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
    description: 'Photos',
    url: siteConfig.instagramUrl,
  },
  {
    kind: 'x',
    label: 'X',
    description: 'Posts and updates',
    url: siteConfig.xUrl,
  },
  {
    kind: 'website',
    label: 'Website',
    description: 'Open the canonical site',
    url: siteConfig.canonicalOrigin,
  },
];

export const contactContent = {
  description: `Email and social links for ${siteConfig.personName}.`,
  introduction: 'For work inquiries or technical questions, email me.',
  emailDisplay: siteConfig.emailDisplay,
  socialLinks: contactCatalog,
} as const;
