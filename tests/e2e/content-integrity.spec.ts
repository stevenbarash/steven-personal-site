import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/constants/site';
import { contactCatalog } from '../../src/content/contact';
import { evidenceRecords } from '../../src/content/evidence';

import { projectCatalog, publishedProjects } from '../../src/content/projects';
import { profileContent } from '../../src/content/profile';
import { selectPublished, siteContent } from '../../src/content/site';
import { publishedSpeaking, speakingCatalog } from '../../src/content/speaking';
import { resumeData } from '../../src/data/resume';
import { projects } from '../../src/data/profile';

test('evidence ledger contains the defensible Phase 0 public records', () => {
  const ids = new Set(evidenceRecords.map((record) => record.id));
  for (const id of [
    'public-role-timeline',
    'okta-developer-lab-2023',
    'okta-se-of-year-fy23',
    'okta-presidents-club-2022-2023',
    'descope-cli-authentication-pr',
    'pitt-challenge-vitallogs-first-place',
    'pitt-blast-furnace-papr-plane-second-place',
  ]) {
    expect(ids, id).toContain(id);
  }
});

test('unsafe and unapproved claim IDs are absent from deployable evidence', () => {
  const ids = evidenceRecords.map((record) => record.id);
  expect(ids).not.toEqual(expect.arrayContaining([
    'descope-se-of-year-fy26',
    'idme-se-of-year-fy25',
    'dialectflow-project',
    'okta-arr-rank-fy23',
    'okta-largest-commercial-deal',
    'idme-largest-sled-deal',
    'confidential-customer-names',
    'confidential-revenue-amounts',
  ]));
});

test('unsupported claims are absent from deployable resume and profile data', () => {
  const deployedContent = JSON.stringify({ resumeData, projects });
  for (const unsupported of [
    'largest deal closed in the SLED',
    'Ranked #1 in segment by ARR',
    'Ranked #5 globally',
    'largest Commercial segment deal',
    'Solutions Engineer of the Year FY26',
    'Solutions Engineer of the Year FY25',
    'DialectFlow',
    'dialectflow.com',
    'Open Source Contributions',
    'Various contributions to open source projects',
  ]) {
    expect(deployedContent, unsupported).not.toContain(unsupported);
  }
});

test('BFSI Nexus is recorded as a delivered, user-confirmed financial-grade identity session', () => {
  const record = evidenceRecords.find(({ id }) => id === 'bfsi-nexus-2026-session');
  expect(record).toEqual(expect.objectContaining({
    evidenceLevel: 'self-reported',
    claim: expect.stringMatching(/delivered.*financial-grade identity/i),
  }));
  expect(record?.claim).toMatch(/FAPI/i);
  expect(record?.claim).toMatch(/strong MFA/i);
  expect(record?.claim).toMatch(/B2B federation/i);
  expect(record?.claim).toMatch(/AI agents/i);
  expect(record?.publicContext).toMatch(/confirmed directly by Steven/i);
});

test('evidence reachability is a separate bounded opt-in check outside npm test', () => {
  const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
  expect(packageJson.scripts['check:evidence-reachability']).toBe('node scripts/check-evidence-reachability.mjs');
  expect(packageJson.scripts.test).not.toContain('check:evidence-reachability');

  const script = readFileSync(join(process.cwd(), 'scripts/check-evidence-reachability.mjs'), 'utf8');
  expect(script).toContain('probeEvidenceUrl');
  expect(script).toContain('MAX_CONCURRENCY');
  expect(script).not.toContain("redirect: 'follow'");

  const realVerifier = readFileSync(join(process.cwd(), 'scripts/verify-public-hosts.mjs'), 'utf8');
  expect(realVerifier).toContain('allowedHosts');
  expect(realVerifier).not.toContain('PUBLIC_HOST_VERIFIER_CONFIG');
});

test('approved evidence records satisfy the public ledger contract', () => {
  expect(evidenceRecords.length).toBeGreaterThan(0);

  const ids = evidenceRecords.map((record) => record.id);
  expect(new Set(ids).size).toBe(ids.length);

  for (const record of evidenceRecords) {
    expect(record.id, 'record id').toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(record.claim, `${record.id} claim`).not.toHaveLength(0);
    expect(['independent', 'first-party', 'self-reported']).toContain(record.evidenceLevel);
    expect(record.publicationStatus, record.id).toBe('approved');
    expect(record.sourceUrls.length, `${record.id} source URLs`).toBeGreaterThan(0);

    for (const sourceUrl of record.sourceUrls) {
      const parsed = new URL(sourceUrl);
      expect(parsed.protocol, `${record.id}: ${sourceUrl}`).toBe('https:');
      expect(parsed.username, `${record.id}: ${sourceUrl}`).toBe('');
      expect(parsed.password, `${record.id}: ${sourceUrl}`).toBe('');
      expect(['localhost', '127.0.0.1', '::1']).not.toContain(parsed.hostname);
    }
  }
});

test('project catalog contains four published projects and one safely excluded draft', () => {
  expect(projectCatalog.map(({ slug }) => slug)).toEqual([
    'pult',
    'uptick',
    'bike-cli',
    'personal-site',
    'future-case-study',
  ]);
  expect(new Set(projectCatalog.map(({ slug }) => slug)).size).toBe(projectCatalog.length);
  expect(JSON.stringify(projectCatalog)).not.toMatch(/DialectFlow|dialectflow/i);
});

test('published projects expose structured fields, valid statuses, and approved evidence', () => {
  const approvedEvidenceIds = new Set(evidenceRecords.map(({ id }) => id));
  const validStatuses = ['active', 'maintained', 'experimental', 'archived', 'reference'];

  expect(publishedProjects).not.toBe(projectCatalog);
  expect(publishedProjects.map(({ slug }) => slug)).toEqual([
    'pult',
    'uptick',
    'bike-cli',
    'personal-site',
  ]);
  expect(projectCatalog.find(({ slug }) => slug === 'future-case-study')?.publicationStatus).toBe('draft');
  for (const project of publishedProjects) {
    expect(project.publicationStatus, project.slug).toBe('published');
    expect(validStatuses, project.slug).toContain(project.status);
    expect(project.problem, project.slug).not.toHaveLength(0);
    expect(project.role, project.slug).not.toHaveLength(0);
    expect(project.constraints.length, project.slug).toBeGreaterThan(0);
    expect(project.approach.length, project.slug).toBeGreaterThan(0);
    expect(project.outcomes.length, project.slug).toBeGreaterThan(0);
    expect(project.technologies.length, project.slug).toBeGreaterThan(0);
    expect(project.sourceUrl, project.slug).toMatch(/^https:\/\//);
    expect(project.evidenceIds.length, project.slug).toBeGreaterThan(0);
    for (const evidenceId of project.evidenceIds) {
      expect(approvedEvidenceIds, `${project.slug}: ${evidenceId}`).toContain(evidenceId);
    }
  }
});

test('published projections exclude draft entries without mutating the catalog', () => {
  const catalog = [
    { slug: 'visible', publicationStatus: 'published' as const },
    { slug: 'not-visible', publicationStatus: 'draft' as const },
  ];

  expect(selectPublished(catalog).map(({ slug }) => slug)).toEqual(['visible']);
  expect(catalog.map(({ slug }) => slug)).toEqual(['visible', 'not-visible']);
});

test('site content projects canonical identity values from siteConfig', () => {
  expect(siteContent).toEqual(siteConfig);
});


test('speaking catalog depends only on the narrow approved evidence projection', () => {
  const speakingSource = readFileSync(join(process.cwd(), 'src/content/speaking.ts'), 'utf8');
  expect(speakingSource).toContain("from '@/content/public-evidence'");
  expect(speakingSource).not.toMatch(/evidenceRecords|@\/content\/evidence/);

  const publicEvidenceSource = readFileSync(
    join(process.cwd(), 'src/content/public-evidence.ts'),
    'utf8',
  );
  expect(publicEvidenceSource).not.toMatch(/\bclaim\b|publicContext|evidenceRecords/);
});

test('speaking catalog keeps BFSI Nexus as a dormant delivered self-reported session', () => {
  expect(speakingCatalog).toHaveLength(1);
  expect(publishedSpeaking).toEqual([]);
  expect(speakingCatalog[0]).toEqual(expect.objectContaining({
    slug: 'bfsi-nexus-2026',
    event: 'BFSI Nexus Conference 2026',
    deliveryStatus: 'delivered',
    publicationStatus: 'draft',
    evidenceLevel: 'self-reported',
    evidenceIds: ['bfsi-nexus-2026-session'],
    keyTopics: ['FAPI', 'Strong MFA', 'B2B federation', 'AI agent identity'],
  }));
  expect(speakingCatalog[0]).not.toHaveProperty('year');
  expect(speakingCatalog[0]).not.toHaveProperty('organizer');
  expect(speakingCatalog[0].topic).toMatch(/users and AI agents/i);
});

test('profile and contact derive repeated canonical values from siteConfig', () => {
  expect(profileContent.name).toBe(siteConfig.personName);
  expect(profileContent.websiteUrl).toBe(siteConfig.canonicalOrigin);
  expect(contactCatalog.map(({ url }) => url)).toEqual([
    siteConfig.linkedinUrl,
    siteConfig.githubUrl,
    siteConfig.instagramUrl,
    siteConfig.xUrl,
    siteConfig.canonicalOrigin,
  ]);

  const source = [
    readFileSync(join(process.cwd(), 'src/content/profile.ts'), 'utf8'),
    readFileSync(join(process.cwd(), 'src/content/contact.ts'), 'utf8'),
    readFileSync(join(process.cwd(), 'src/components/ui/win95/ResumeSection.tsx'), 'utf8'),
  ].join('\n');
  for (const canonicalLiteral of Object.values(siteConfig)) {
    expect(source, canonicalLiteral).not.toContain(canonicalLiteral);
  }

  const resumeSource = readFileSync(
    join(process.cwd(), 'src/components/ui/win95/ResumeSection.tsx'),
    'utf8',
  );
  expect(resumeSource).not.toMatch(/>\s*(?:https?:\/\/)?(?:www\.)?barash\.me\/?\s*</i);
});

test('every visible catalog evidence ID resolves to an approved public record', () => {
  const approvedEvidenceIds = new Set(
    evidenceRecords
      .filter(({ publicationStatus }) => publicationStatus === 'approved')
      .map(({ id }) => id),
  );
  const visibleEntries = publishedProjects;

  for (const entry of visibleEntries) {
    for (const evidenceId of entry.evidenceIds) {
      expect(approvedEvidenceIds, `${entry.slug}: ${evidenceId}`).toContain(evidenceId);
    }
  }
});

test('deployable catalogs contain no unsafe claims, rejected hosts, private notes, or confidential markers', () => {
  const deployableContent = JSON.stringify({
    siteContent,
    profileContent,
    contactCatalog,
    publishedProjects,
  });

  for (const unsafeClaimId of [
    'descope-se-of-year-fy26',
    'idme-se-of-year-fy25',
    'dialectflow-project',
    'okta-arr-rank-fy23',
    'okta-largest-commercial-deal',
    'idme-largest-sled-deal',
    'confidential-customer-names',
    'confidential-revenue-amounts',
  ]) {
    expect(deployableContent, unsafeClaimId).not.toContain(unsafeClaimId);
  }

  for (const forbidden of [
    /https:\/\/(?:www\.)?stevenbarash\.com\/?/i,
    /https:\/\/www\.barash\.me\/?/i,
    /@steven_barash/i,
    /private[ -]note/i,
    /internal[ -]only/i,
    /confidential/i,
  ]) {
    expect(deployableContent).not.toMatch(forbidden);
  }
  expect(deployableContent).not.toContain('http://');
});
