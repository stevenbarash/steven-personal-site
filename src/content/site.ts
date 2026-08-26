import { siteConfig } from '@/constants/site';

export type PublicationStatus = 'published' | 'draft';

export interface PublishableEntry {
  publicationStatus: PublicationStatus;
}

export function selectPublished<T extends PublishableEntry>(entries: readonly T[]): T[] {
  return entries.filter(({ publicationStatus }) => publicationStatus === 'published');
}

/** Canonical site identity remains owned by siteConfig. */
export const siteContent = siteConfig;
