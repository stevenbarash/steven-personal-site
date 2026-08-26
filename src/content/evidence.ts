import {
  bfsiNexusSessionEvidence,
  type EvidenceLevel,
} from './public-evidence.ts';

export type { EvidenceLevel } from './public-evidence.ts';

export interface EvidenceRecord {
  id: string;
  claim: string;
  evidenceLevel: EvidenceLevel;
  publicationStatus: 'approved';
  sourceUrls: string[];
  publicContext?: string;
}

/**
 * Deployable evidence is intentionally limited to approved public records.
 * Private editorial notes and claims awaiting approval must never be added here.
 */
export const evidenceRecords: EvidenceRecord[] = [
  {
    id: 'public-role-timeline',
    claim: 'Steven Barash’s public LinkedIn profile lists Descope (January 2025–present), ID.me (January 2024–January 2025), and Okta (June 2020–January 2024); his public GitHub bio also identifies former Auth0 affiliation.',
    evidenceLevel: 'self-reported',
    publicationStatus: 'approved',
    sourceUrls: [
      'https://www.linkedin.com/in/stevenbarash',
      'https://github.com/stevenbarash',
    ],
    publicContext: 'Self-reported public profiles. LinkedIn supplies the dated roles; no separate Auth0 date range is asserted.',
  },
  {
    id: 'okta-developer-lab-2023',
    claim: 'Steven Barash publicly announced that he would lead an Okta developer lab in Pittsburgh on December 5, 2023, focused on authentication and login flows using Okta Customer Identity Cloud powered by Auth0.',
    evidenceLevel: 'self-reported',
    publicationStatus: 'approved',
    sourceUrls: ['https://www.linkedin.com/posts/stevenbarash_q4-devcamp-roadshow-pittsburgh-activity-7133868963368706051-MIyd'],
    publicContext: 'Announcement of the planned lab; it does not independently confirm attendance or completion.',
  },
  {
    id: 'okta-se-of-year-fy23',
    claim: 'Steven Barash publicly reported being recognized as Okta’s Specialist Solutions Engineer of the Year for FY23.',
    evidenceLevel: 'self-reported',
    publicationStatus: 'approved',
    sourceUrls: [
      'https://www.linkedin.com/posts/stevenbarash_salesengineer-sales-se-activity-7042579305045864448-vbOq',
      'https://www.linkedin.com/in/stevenbarash',
    ],
    publicContext: 'Public self-report and profile record of internal employer recognition.',
  },
  {
    id: 'okta-presidents-club-2022-2023',
    claim: 'Steven Barash’s public LinkedIn profile lists Okta President’s Club recognition in 2022 and 2023, and his March 2023 post describes the latter as his second consecutive year.',
    evidenceLevel: 'self-reported',
    publicationStatus: 'approved',
    sourceUrls: [
      'https://www.linkedin.com/posts/stevenbarash_salesengineer-okta-salesengineer-activity-7036795909233332224-KgjB',
      'https://www.linkedin.com/in/stevenbarash',
    ],
    publicContext: 'Public self-report of internal employer recognition; not an independently published Okta award list.',
  },
  {
    id: 'descope-cli-authentication-pr',
    claim: 'Steven Barash authored an open pull request to the public Descope CLI authentication sample adding OAuth 2.0 PKCE support, validation commands, tests, and error-handling improvements.',
    evidenceLevel: 'first-party',
    publicationStatus: 'approved',
    sourceUrls: ['https://github.com/descope-sample-apps/cli-authentication/pull/37'],
    publicContext: 'The pull request is public and open; this record does not claim the changes were merged or released.',
  },
  {
    id: 'pitt-challenge-vitallogs-first-place',
    claim: 'Steven Barash publicly identified VitalLog as the project built by his first-place PittChallenge hackathon team; his Devpost portfolio lists VitalLogs as a winner.',
    evidenceLevel: 'self-reported',
    publicationStatus: 'approved',
    sourceUrls: [
      'https://www.linkedin.com/posts/stevenbarash_honored-to-have-been-a-part-of-the-1st-place-activity-6366692816709521408-IQEb',
      'https://devpost.com/stevenbarash',
    ],
    publicContext: 'Public participant post corroborated by the project’s winner label on the author’s Devpost portfolio.',
  },
  {
    id: 'pitt-blast-furnace-papr-plane-second-place',
    claim: 'The University of Pittsburgh Innovation Institute reported that Papr Plane, whose team included Steven Barash, finished second at Blast Furnace Demo Day.',
    evidenceLevel: 'independent',
    publicationStatus: 'approved',
    sourceUrls: ['https://blog.innovation.pitt.edu/aeronics-makes-sweep-blast-furnace-demo-day'],
    publicContext: 'University-published event recap.',
  },
  {
    id: bfsiNexusSessionEvidence.id,
    claim: 'Steven delivered a BFSI Nexus Conference 2026 session about financial-grade identity for users and AI agents, including FAPI, strong MFA, and B2B federation.',
    evidenceLevel: bfsiNexusSessionEvidence.evidenceLevel,
    publicationStatus: 'approved',
    sourceUrls: [bfsiNexusSessionEvidence.sourceUrl],
    publicContext: 'The public source is the session announcement; delivery and subject matter were confirmed directly by Steven Barash on 2026-08-23.',
  },

  {
    id: 'pult-project',
    claim: 'Pult implements Android TV Remote Service v2 with mTLS, pairing on port 6467, commands on port 6466, hand-rolled protobuf encoding, and per-TV physical-device validation documented in its public repository.',
    evidenceLevel: 'first-party',
    publicationStatus: 'approved',
    sourceUrls: ['https://github.com/stevenbarash/pult'],
    publicContext: 'Repository README reviewed 2026-08-23. Mutable activity and physical-device compatibility status reflect that date.',
  },
  {
    id: 'uptick-zed-project',
    claim: 'Uptick combines a thin Zed extension with a Rust language server that analyzes six manifest formats using package registries plus OSV and CVSS vulnerability context; public releases ran through v0.6.2 when reviewed.',
    evidenceLevel: 'first-party',
    publicationStatus: 'approved',
    sourceUrls: ['https://github.com/stevenbarash/uptick-zed'],
    publicContext: 'Repository README and releases reviewed 2026-08-23. Mutable development and release status reflect that date.',
  },
  {
    id: 'bike-cli-project',
    claim: 'bike-cli documents ride weather guidance, Strava activity and statistics, maintenance, personalized training recommendations, local configuration and data, and terminal, JSON, and CSV output in its public repository.',
    evidenceLevel: 'first-party',
    publicationStatus: 'approved',
    sourceUrls: ['https://github.com/stevenbarash/bike-cli'],
    publicContext: 'Repository README reviewed 2026-08-23. Mutable experimental and repository status reflect that date.',
  },
  {
    id: 'personal-site-project',
    claim: 'This public personal-site repository implements a Next.js App Router site with typed project content, conventional public routes, an optional Windows 95 desktop interface, compatibility routing for older query and hash links, and Playwright regression coverage.',
    evidenceLevel: 'first-party',
    publicationStatus: 'approved',
    sourceUrls: ['https://github.com/stevenbarash/steven-personal-site'],
    publicContext: 'Repository README and working implementation reviewed 2026-08-23. Mutable maintenance and implementation status reflect that date.',
  },
];
