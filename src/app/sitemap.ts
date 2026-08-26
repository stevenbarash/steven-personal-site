import type { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/site';
import { publishedProjects } from '@/content/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.canonicalOrigin,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.canonicalOrigin}/resume`,
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.canonicalOrigin}/projects`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...publishedProjects.map(({ slug }) => ({
      url: `${siteConfig.canonicalOrigin}/projects/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.canonicalOrigin}/photos`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.canonicalOrigin}/contact`,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];
}
