import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteConfig } from '../../src/constants/site';
import { contactCatalog } from '../../src/content/contact';
import { archivePhotos, featuredPhotos } from '../../src/content/photography';
import { publishedSpeaking, speakingCatalog } from '../../src/content/speaking';
import { photoLibrary } from '../../src/data/photos';
import { resumeData } from '../../src/data/resume';

const routes = ['/resume', '/photos', '/contact'] as const;
const canonicalUrl = (pathname: string) => new URL(pathname, `${siteConfig.canonicalOrigin}/`).href;
const bannedVisitorCopy = /\b(?:evidence|proof|published|first-party|limitations)\b|internal governance|Identity Work|—/i;

async function readJpegDimensions(pathname: string) {
  const data = await readFile(pathname);
  let offset = 2;
  while (offset < data.length) {
    if (data[offset] !== 0xff) throw new Error(`Invalid JPEG marker at ${offset}`);
    const marker = data[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = data.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
    }
    offset += length + 2;
  }
  throw new Error(`No JPEG dimensions found in ${pathname}`);
}

async function expectMinimalServerDocument(page: Page, pathname: string, expectedCopy: string) {
  const response = await page.request.get(pathname);
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('minimal-site');
  expect(html).toContain(expectedCopy);
  expect(html).not.toContain('data-testid="application-window"');
  expect(html).not.toContain('win95-app-body');
}

async function expectRouteMetadata(
  page: Page,
  pathname: string,
  title: RegExp,
  description: string,
  openGraphTitle: string,
) {
  await page.goto(pathname);
  await expect(page).toHaveTitle(title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl(pathname));
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl(pathname));
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', openGraphTitle);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
}

test('public Phase 3 routes are server-rendered minimal documents without Win95 chrome', async ({ page }) => {
  for (const [pathname, copy] of [
    ['/resume', 'Experience'],
    ['/photos', 'Right outside Damascus Gate'],
    ['/contact', 'Email me about identity architecture, agentic systems, technical evaluations, or workshops.'],
  ] as const) {
    await expectMinimalServerDocument(page, pathname, copy);
    await page.goto(pathname);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('[data-testid="application-window"]')).toHaveCount(0);
    await expect(page.locator('.win95-app-body')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(bannedVisitorCopy);
  }
});

test('resume is a complete editorial projection of the deployable resume data', async ({ page }) => {
  await page.goto('/resume');
  await expect(page.getByRole('heading', { level: 1, name: 'Experience' })).toBeVisible();
  await expect(page.getByText(resumeData.summary, { exact: true })).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(0);

  const main = page.locator('main');
  for (const heading of ['Career', 'Earlier experience', 'Capabilities', 'Education', 'Languages', 'Honors']) {
    await expect(main.getByRole('heading', { level: 2, name: heading, exact: true })).toBeVisible();
  }

  const recentExperience = main.locator('[data-resume-recent]');
  const earlierExperience = main.locator('[data-resume-earlier]');
  await expect(recentExperience.locator('.minimal-experience')).toHaveCount(3);
  await expect(earlierExperience.locator('.minimal-experience')).toHaveCount(resumeData.experience.length - 3);
  for (const company of ['Descope', 'ID.me', 'Okta']) {
    await expect(recentExperience.getByRole('heading', { level: 3, name: company, exact: true })).toBeVisible();
  }
  for (const group of ['Identity', 'Technical strategy', 'Building']) {
    await expect(main.getByRole('heading', { level: 3, name: group, exact: true })).toBeVisible();
  }

  const projectedRoleValues = resumeData.experience.flatMap((job) => job.roles.flatMap((role) => [
    role.title,
    `${role.startDate} to ${role.endDate}`,
    role.location,
  ]));
  const roleValueCounts = new Map(projectedRoleValues.map((value) => [
    value,
    projectedRoleValues.filter((candidate) => candidate === value).length,
  ]));

  for (const job of resumeData.experience.slice(0, 3)) {
    await expect(main.getByRole('heading', { name: job.company, exact: true })).toBeVisible();
    for (const bullet of job.bullets) await expect(main.getByText(bullet, { exact: true })).toBeVisible();
  }
  for (const job of resumeData.experience.slice(3)) {
    await expect(main.getByRole('heading', { name: job.company, exact: true })).toBeVisible();
    const entry = earlierExperience.locator('.minimal-experience').filter({
      has: page.getByRole('heading', { name: job.company, exact: true }),
    });
    await entry.locator('summary', { hasText: 'Selected work' }).click();
    for (const bullet of job.bullets) await expect(entry.getByText(bullet, { exact: true })).toBeVisible();
  }
  for (const [value, count] of roleValueCounts) {
    await expect(main.getByText(value, { exact: true })).toHaveCount(count);
  }

  for (const education of resumeData.education) {
    await expect(main.getByText(education.institution, { exact: true })).toBeVisible();
    await expect(main.getByText(`${education.degree}, ${education.field}`, { exact: true })).toBeVisible();
    await expect(main.getByText(education.dates, { exact: true })).toBeVisible();
  }
  for (const skill of resumeData.skills) await expect(main.getByText(skill, { exact: true })).toBeVisible();
  for (const language of resumeData.languages) {
    await expect(main.getByText(`${language.name}: ${language.proficiency}`, { exact: true })).toBeVisible();
  }
  for (const honor of resumeData.honors) await expect(main.getByText(honor, { exact: true })).toBeVisible();

  await expect(main.getByText("Gave demos entirely in Russian to Russian-speaking developer teams based in Armenia", { exact: true })).toBeVisible();
  await expect(main.getByText("2x President's Club (2022 + 2023)", { exact: true })).toBeVisible();
  await expect(main.getByText("Built simulations of competitors' algorithms from publicly available documentation", { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: resumeData.contact.email, exact: true })).toHaveAttribute('href', 'mailto:steven@barash.me');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true }).first()).toHaveAttribute('href', resumeData.contact.linkedin);
});

test('resume hero surfaces the current role and public proof before the career timeline', async ({ page }) => {
  await page.setViewportSize({ width: 456, height: 657 });
  await page.goto('/resume');

  const currentRole = page.getByText('Senior Solutions Engineer at Descope', { exact: true });
  await expect(currentRole).toBeVisible();
  const currentRoleBox = await currentRole.boundingBox();
  expect(currentRoleBox).not.toBeNull();
  expect(currentRoleBox!.y + currentRoleBox!.height).toBeLessThanOrEqual(657);

  const selectedProof = page.getByRole('navigation', { name: 'Selected proof' });
  await expect(selectedProof.getByRole('link', { name: /Pult/ })).toHaveAttribute('href', '/projects/pult');
  await expect(selectedProof.getByRole('link', { name: /Uptick/ })).toHaveAttribute('href', '/projects/uptick');
  await expect(selectedProof.getByRole('link', { name: /Personal Site/ })).toHaveAttribute('href', '/projects/personal-site');
});

test('resume timeline is asymmetric on desktop and becomes one reading column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/resume');

  const firstCareerEntry = page.locator('[data-resume-recent] .minimal-experience').first();
  const supportGrid = page.locator('[data-resume-support]');
  expect((await firstCareerEntry.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length))).toBeGreaterThan(1);
  expect((await supportGrid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length))).toBeGreaterThan(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(firstCareerEntry).toHaveCSS('grid-template-columns', /^(?!.*\s).+$/);
  await expect(supportGrid).toHaveCSS('grid-template-columns', /^(?!.*\s).+$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  const disclosure = page.locator('[data-resume-earlier] details').first();
  const disclosureBox = await disclosure.locator('summary', { hasText: 'Selected work' }).boundingBox();
  expect(disclosureBox).not.toBeNull();
  expect(disclosureBox!.height).toBeGreaterThanOrEqual(44);
});

test('experience entries pair every company name with its local logo', async ({ page }) => {
  await page.goto('/resume');

  const expectedLogos = [
    ['Descope', '/images/logos/descope.png'],
    ['ID.me', '/images/logos/idme.png'],
    ['Okta', '/images/logos/okta.png'],
    ['University of Pittsburgh, Swanson School of Engineering', '/images/logos/pitt.png'],
    ['Innovative Systems, Inc.', '/images/logos/innovative.png'],
    ['Federated Hermes', '/images/logos/federated.png'],
    ['University of Pittsburgh', '/images/logos/pitt.png'],
    ['Carnegie Mellon University', '/images/logos/cmu.png'],
  ] as const;

  for (const [company, src] of expectedLogos) {
    const entry = page.locator('.minimal-experience').filter({
      has: page.getByRole('heading', { level: 3, name: company, exact: true }),
    });
    const logo = entry.locator('.minimal-company-logo');
    await expect(logo).toHaveCount(1);
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', src);
    await expect(logo).toHaveAttribute('alt', '');
    expect(await logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
});

test('resume copy uses direct active language and no banned filler', () => {
  const deployedResume = JSON.stringify(resumeData);
  expect(deployedResume).not.toMatch(/actionable insights|enhancing|showcasing|diverse audiences|utilized|from initial design to production readiness/i);
  expect(deployedResume).not.toMatch(bannedVisitorCopy);
});

test('photography renders every verified local photo with dimensions, honest alt, caption, and loading behavior', async ({ page }) => {
  await page.goto('/photos');
  await expect(page.getByRole('heading', { level: 1, name: 'Photography' })).toBeVisible();
  const figures = page.locator('main figure');
  await expect(figures).toHaveCount(photoLibrary.length);

  const projectedPhotos = [...featuredPhotos, ...archivePhotos];
  for (let index = 0; index < projectedPhotos.length; index += 1) {
    const photo = projectedPhotos[index];
    const figure = figures.nth(index);
    const image = figure.locator('img');
    await expect(image).toHaveAttribute('alt', photo.alt);
    await expect(image).toHaveAttribute('width', String(photo.width));
    await expect(image).toHaveAttribute('height', String(photo.height));
    if (index === 0) {
      await expect(image).not.toHaveAttribute('loading');
    } else {
      await expect(image).toHaveAttribute('loading', 'lazy');
    }
    await expect(figure.getByText(photo.title, { exact: true })).toBeVisible();
    if (photo.location && photo.location !== 'Unknown') {
      await expect(figure.getByText(photo.location, { exact: true })).toBeVisible();
    }
  }

  await expect(page.getByText('Unknown', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', siteConfig.instagramUrl);
  await expect(page.getByAltText('Two soldiers watch a woman in a red skirt and a man in a cowboy hat perform on a city sidewalk.')).toBeVisible();
  await expect(page.getByAltText('A food-service worker prepares food behind a restaurant window.')).toBeVisible();
  await expect(page.getByAltText('A white bulldog lies on the ground wearing a gray rhinoceros costume.')).toBeVisible();
  await expect(page.locator('head link[rel="preload"][as="image"]')).toHaveCount(1);

  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page.locator('[data-photo-archive]')).toHaveCSS('column-count', '2');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('[data-photo-archive]')).toHaveCSS('column-count', '1');
});

test('photography opens with five selected images and keeps the full library exactly once', async ({ page }) => {
  expect(featuredPhotos.map(({ id }) => id)).toEqual([
    'ig-DTM8x-XjH87',
    'ig-DC4r__8xPDU',
    'ig-Cz83QsPOSTh',
    'ig-CoQuyVsOJJA',
    'ig-Cn-S9S4O_Of',
  ]);
  const projectedIds = [...featuredPhotos, ...archivePhotos].map(({ id }) => id);
  expect(projectedIds).toHaveLength(photoLibrary.length);
  expect(new Set(projectedIds).size).toBe(photoLibrary.length);
  expect(projectedIds).toEqual(expect.arrayContaining(photoLibrary.map(({ id }) => id)));

  await page.goto('/photos');
  await expect(page.locator('[data-photo-featured] figure')).toHaveCount(5);
  await expect(page.locator('[data-photo-archive] figure')).toHaveCount(photoLibrary.length - 5);
  await expect(page.locator('main figure')).toHaveCount(photoLibrary.length);
});

test('featured photography varies scale on desktop and keeps one reading column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/photos');
  const figures = page.locator('[data-photo-featured] figure');
  expect((await figures.nth(0).boundingBox())!.width).toBeGreaterThan((await figures.nth(1).boundingBox())!.width);

  await page.setViewportSize({ width: 390, height: 844 });
  const boxes = await figures.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  expect(Math.max(...boxes) - Math.min(...boxes)).toBeLessThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('photo catalog intrinsic dimensions match every verified local JPEG', async () => {
  for (const photo of photoLibrary) {
    const dimensions = await readJpegDimensions(resolve(process.cwd(), 'public', photo.src.slice(1)));
    expect(dimensions, photo.src).toEqual({ width: photo.width, height: photo.height });
  }
});

test('contact is direct and projects the four social destinations as simple rows', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();
  await expect(page.getByText('Email me about identity architecture, agentic systems, technical evaluations, or workshops.', { exact: true })).toBeVisible();
  const email = page.getByRole('link', { name: `Email ${siteConfig.emailDisplay}`, exact: true });
  await expect(email).toHaveAttribute('href', 'mailto:steven@barash.me');
  await expect(email).toHaveText('steven@barash.me');

  const expectedDescriptions = ['Work history and updates', 'Code and projects', 'Photos', 'Posts and updates'];
  const socialContacts = contactCatalog.filter(({ kind }) => kind !== 'website');
  expect(socialContacts.map(({ description }) => description)).toEqual(expectedDescriptions);
  for (const contact of socialContacts) {
    await expect(page.getByRole('link', { name: contact.label, exact: true })).toHaveAttribute('href', contact.url);
    await expect(page.getByText(contact.description, { exact: true })).toBeVisible();
  }
  await expect(page.locator('main')).not.toContainText(/professional channel|\?/i);
});

test('the preserved speaking record has no public route, navigation, or sitemap entry', async ({ page, request }) => {
  expect(speakingCatalog).toHaveLength(1);
  expect(publishedSpeaking).toHaveLength(0);

  const response = await request.get('/speaking');
  expect(response.status()).toBe(404);
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('/speaking');

  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Speaking' })).toHaveCount(0);
  await page.goto('/contact');
  await expect(page.locator('main')).not.toContainText(/speaking/i);
});

test('Phase 3 routes have unique complete metadata and remain indexable', async ({ page }) => {
  await expectRouteMetadata(page, '/resume', /^Resume \| Steven Barash$/, 'Experience, education, skills, languages, and honors for Steven Barash.', 'Resume | Steven Barash');
  await expectRouteMetadata(page, '/photos', /^Photography \| Steven Barash$/, 'Photography by Steven Barash, with street, travel, and everyday scenes.', 'Photography | Steven Barash');
  await expectRouteMetadata(page, '/contact', /^Contact \| Steven Barash$/, 'Email Steven Barash or find him on LinkedIn, GitHub, Instagram, and X.', 'Contact | Steven Barash');
  for (const pathname of routes) {
    await page.goto(pathname);
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/i);
  }
  await page.goto('/desktop');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);
});

test('Win95 applications remain available only under their desktop app URLs', async ({ page }) => {
  for (const [pathname, expectedCopy] of [
    ['/desktop?app=resume', 'RESUME.DOC'],
    ['/desktop?app=photos', 'Photography Explorer'],
    ['/desktop?app=explorer', 'Contact Steven'],
  ] as const) {
    await page.goto(pathname);
    await expect(page.locator('[data-testid="application-window"]')).toBeVisible();
    await expect(page.locator('.win95-app-body')).toContainText(expectedCopy);
    await expect(page.locator('.minimal-site')).toHaveCount(0);
  }
});

test('small-screen site, footer, and resume company links meet the 44px touch floor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resume');
  for (const locator of [
    page.getByRole('link', { name: 'Steven Barash, home' }),
    page.getByRole('link', { name: 'Open the Windows 95 version' }),
    page.getByRole('link', { name: 'Descope', exact: true }),
  ]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
