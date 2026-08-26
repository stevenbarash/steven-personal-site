export type EvidenceLevel = 'independent' | 'first-party' | 'self-reported';

export interface PublicEvidenceReference {
  id: string;
  evidenceLevel: EvidenceLevel;
  sourceUrl: string;
}

/** Minimal, client-safe evidence metadata for the delivered BFSI Nexus session. */
export const bfsiNexusSessionEvidence: PublicEvidenceReference = {
  id: 'bfsi-nexus-2026-session',
  evidenceLevel: 'self-reported',
  sourceUrl: 'https://www.linkedin.com/posts/stevenbarash_excited-to-be-speaking-at-nexus-conference-activity-7451960923336036352-KOS5',
};
