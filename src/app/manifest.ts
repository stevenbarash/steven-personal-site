import type { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/site';
import { profileContent } from '@/content/profile';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.siteName} | ${profileContent.professionalLabel}`,
    short_name: siteConfig.siteName,
    description: profileContent.headline,
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b0b',
    theme_color: '#0b0b0b',
    scope: '/',
    lang: 'en-US',
    categories: ['business', 'productivity', 'photography'],
    icons: [
      {
        src: '/images/sb-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [],
  };
}
