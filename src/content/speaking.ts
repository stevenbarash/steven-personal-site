import {
  bfsiNexusSessionEvidence,
  type EvidenceLevel,
} from '@/content/public-evidence';
import { selectPublished, type PublicationStatus } from '@/content/site';

export type SpeakingDeliveryStatus = 'announced' | 'delivered';

export interface SpeakingEntry {
  slug: string;
  event: string;

  topic: string;
  audience: string;
  keyTopics: string[];

  deliveryStatus: SpeakingDeliveryStatus;
  publicationStatus: PublicationStatus;
  evidenceLevel: EvidenceLevel;
  sourceUrl: string;
  evidenceIds: string[];
}

export const speakingCatalog: SpeakingEntry[] = [
  {
    slug: 'bfsi-nexus-2026',
    event: 'BFSI Nexus Conference 2026',

    topic: 'Financial-grade identity for users and AI agents',
    audience: 'Financial-services identity and technology practitioners',
    keyTopics: ['FAPI', 'Strong MFA', 'B2B federation', 'AI agent identity'],

    deliveryStatus: 'delivered',
    publicationStatus: 'draft',
    evidenceLevel: bfsiNexusSessionEvidence.evidenceLevel,
    sourceUrl: bfsiNexusSessionEvidence.sourceUrl,
    evidenceIds: [bfsiNexusSessionEvidence.id],
  },
];

/** Kept as a dormant record; deliveryStatus records whether the talk occurred. */
export const publishedSpeaking = selectPublished(speakingCatalog);
