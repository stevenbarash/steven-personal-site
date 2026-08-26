import type { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.siteName} | Products, Demos, and Technical Systems`,
    short_name: siteConfig.siteName,
    description: 'Complex technical systems turned into working products, demos, and decisions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f8f6',
    theme_color: '#034cfc',
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
