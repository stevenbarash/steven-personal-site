export const siteConfig = {
  personName: 'Steven Barash',
  siteName: 'Steven Barash',
  canonicalOrigin: 'https://barash.me',
  emailDisplay: 'steven@barash.me',
  xHandle: '@stevenbarash',
  xUrl: 'https://x.com/stevenbarash',
  linkedinUrl: 'https://www.linkedin.com/in/stevenbarash',
  githubUrl: 'https://github.com/stevenbarash',
  instagramUrl: 'https://www.instagram.com/steven.photography',
} as const;

export const createTwitterMetadata = (title: string, description: string) => ({
  card: 'summary_large_image' as const,
  title,
  description,
  creator: siteConfig.xHandle,
  site: siteConfig.xHandle,
});
