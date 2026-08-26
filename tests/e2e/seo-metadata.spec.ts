import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteConfig } from '../../src/constants/site';
import { publishedProjects } from '../../src/content/projects';

const canonicalUrl = (pathname = '/') => (
  pathname === '/' ? siteConfig.canonicalOrigin : new URL(pathname, `${siteConfig.canonicalOrigin}/`).href
);
const identitySourceFiles = [
  'src/app/layout.tsx',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/app/manifest.ts',
  'src/data/profile.ts',
  'src/data/resume.ts',
];

const metadataContent = async (page: Page, selector: string) => {
  const locator = page.locator(selector);
  await expect(locator).toHaveCount(1);
  return locator.getAttribute('content');
};

const collectPersonEntities = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) return value.flatMap(collectPersonEntities);
  if (!value || typeof value !== 'object') return [];

  const record = value as Record<string, unknown>;
  return [
    ...(record['@type'] === 'Person' ? [record] : []),
    ...Object.values(record).flatMap(collectPersonEntities),
  ];
};

test('site identity uses the final canonical and confirmed X account', () => {
  expect(siteConfig).toMatchObject({
    personName: 'Steven Barash',
    siteName: 'Steven Barash',
    canonicalOrigin: 'https://barash.me',
    xHandle: '@stevenbarash',
    xUrl: 'https://x.com/stevenbarash',
  });
});

test('sitemap contains only active canonical public routes', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);

  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, location]) => location);
  expect(locations).toEqual([
    canonicalUrl(),
    canonicalUrl('/resume'),
    canonicalUrl('/projects'),
    ...publishedProjects.map(({ slug }) => canonicalUrl(`/projects/${slug}`)),
    canonicalUrl('/photos'),
    canonicalUrl('/contact'),
  ]);
  expect(new Set(locations.map((location) => new URL(location).origin))).toEqual(
    new Set([siteConfig.canonicalOrigin]),
  );
});

test('robots exposes one real wildcard rule and the active canonical sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBe(true);

  const robots = await response.text();
  expect(robots.match(/^User-Agent:/gim)).toHaveLength(1);
  expect(robots).toMatch(/^User-Agent: \*$/m);
  expect(robots).toMatch(/^Allow: \/$/m);
  expect(robots).not.toMatch(/^(?:Disallow|Crawl-delay|Host):/im);

  const sitemapLines = robots.match(/^Sitemap: (.+)$/gim) ?? [];
  expect(sitemapLines).toEqual([`Sitemap: ${canonicalUrl('/sitemap.xml')}`]);
  const absoluteUrls = robots.match(/https:\/\/[^\s]+/g) ?? [];
  expect(absoluteUrls.every((url) => new URL(url).origin === siteConfig.canonicalOrigin)).toBe(true);
});

test('manifest uses relative navigation, a reachable icon, and no conflicting host', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest');
  expect(response.ok()).toBe(true);

  const manifest = await response.json();
  expect(manifest.short_name).toBe(siteConfig.siteName);
  expect(manifest.name).toContain(siteConfig.siteName);
  expect(manifest.start_url).toBe('/');
  expect(manifest.scope).toBe('/');
  expect(manifest.related_applications).toBeUndefined();
  expect(manifest.prefer_related_applications).toBeUndefined();
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: expect.stringMatching(/^\/(?!\/)/), sizes: expect.any(String), type: expect.any(String) }),
  ]));

  for (const icon of manifest.icons) {
    const iconResponse = await request.get(icon.src);
    expect(iconResponse.ok(), icon.src).toBe(true);
    expect(iconResponse.headers()['content-type'], icon.src).toContain(icon.type);
  }

  const absoluteUrls = JSON.stringify(manifest).match(/https:\/\/[^"\\]+/g) ?? [];
  expect(absoluteUrls.every((url) => new URL(url).origin === siteConfig.canonicalOrigin)).toBe(true);
});

test('home emits one matching canonical and Open Graph URL with confirmed X metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl());
  expect(await metadataContent(page, 'meta[property="og:url"]')).toBe(canonicalUrl());
  expect(await metadataContent(page, 'meta[name="twitter:creator"]')).toBe(siteConfig.xHandle);
  expect(await metadataContent(page, 'meta[name="twitter:site"]')).toBe(siteConfig.xHandle);
});

test('photos emits matching canonical and Open Graph URL and resolves the title template', async ({ page }) => {
  await page.goto('/photos');

  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl('/photos'));
  expect(await metadataContent(page, 'meta[property="og:url"]')).toBe(canonicalUrl('/photos'));
  await expect(page).toHaveTitle(new RegExp(`^Photography.*${siteConfig.siteName}`));
});

test('global JSON-LD contains exactly one canonical Person entity', async ({ page }) => {
  await page.goto('/');

  const personScript = page.locator('script#person-json-ld[type="application/ld+json"]');
  await expect(personScript).toHaveCount(1);
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const entities = scripts.flatMap((script) => collectPersonEntities(JSON.parse(script)));
  expect(entities).toHaveLength(1);

  const person = entities[0];
  expect(person.name).toBe(siteConfig.personName);
  expect(person.url).toBe(canonicalUrl());
  expect(person.image).toEqual(expect.objectContaining({ url: canonicalUrl('/images/me.jpg') }));
  expect(person.sameAs).toEqual([
    siteConfig.linkedinUrl,
    siteConfig.githubUrl,
    siteConfig.instagramUrl,
    siteConfig.xUrl,
  ]);
});

test('identity sources contain no duplicated canonical origin or rejected X identity', async () => {
  const sources = await Promise.all(identitySourceFiles.map(async (path) => ({
    path,
    source: await readFile(resolve(process.cwd(), path), 'utf8'),
  })));

  const rejectedIdentityPatterns = [
    /https:\/\/(?:www\.)?stevenbarash\.com\/?/g,
    /https:\/\/www\.barash\.me\/?/g,
    /@steven_barash/g,
    /https:\/\/(?:www\.)?x\.com\/steven_barash\/?/g,
    /https:\/\/www\.x\.com\/stevenbarash\/?/g,
    /https:\/\/twitter\.com\/stevenbarash\/?/g,
  ];

  for (const { path, source } of sources) {
    expect(source, `${path} duplicates canonicalOrigin`).not.toContain(siteConfig.canonicalOrigin);
    for (const pattern of rejectedIdentityPatterns) {
      expect(source, `${path} contains rejected X identity`).not.toMatch(pattern);
    }
  }
});
