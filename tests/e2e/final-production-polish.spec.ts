import { expect, test, type Page } from '@playwright/test';
import { siteConfig } from '../../src/constants/site';

const stableRoutes = [
  '/',
  '/resume',
  '/projects',
  '/projects/pult',
  '/projects/uptick',
  '/projects/bike-cli',
  '/projects/personal-site',
  '/photos',
  '/contact',
] as const;


const canonicalUrl = (pathname: string) => pathname === '/'
  ? siteConfig.canonicalOrigin
  : new URL(pathname, `${siteConfig.canonicalOrigin}/`).href;

const meta = (page: Page, selector: string) => page.locator(selector).getAttribute('content');


test('canonical origin, email display, and X identity match the final cutover', () => {
  expect(siteConfig).toMatchObject({
    canonicalOrigin: 'https://barash.me',
    emailDisplay: 'steven@barash.me',
    xHandle: '@stevenbarash',
    xUrl: 'https://x.com/stevenbarash',
  });
});

test('sitemap contains the exact stable public route set in deliberate order', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, value]) => value);
  expect(locations).toEqual(stableRoutes.map(canonicalUrl));
  expect(locations.join('\n')).not.toMatch(/desktop|future-case-study|Identity Work|\?|#/i);
});

test('all stable routes have unique complete canonical, Open Graph, and Twitter metadata', async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const pathname of stableRoutes) {
    await page.goto(pathname);
    const title = await page.title();
    const description = await meta(page, 'meta[name="description"]');
    expect(title.trim()).not.toBe('');
    expect(description?.trim()).toBeTruthy();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl(pathname));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl(pathname));
    expect(await meta(page, 'meta[property="og:title"]')).toBe(title);
    expect(await meta(page, 'meta[property="og:description"]')).toBe(description);
    expect(await meta(page, 'meta[name="twitter:title"]')).toBe(title);
    expect(await meta(page, 'meta[name="twitter:description"]')).toBe(description);
    expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    titles.add(title);
    descriptions.add(description!);
  }

  expect(titles.size).toBe(stableRoutes.length);
  expect(descriptions.size).toBe(stableRoutes.length);
});

test('Person JSON-LD identifies the canonical public profile safely', async ({ page }) => {
  await page.goto('/');

  const personScripts = page.locator('script#person-json-ld[type="application/ld+json"]');
  await expect(personScripts).toHaveCount(1);
  const raw = await personScripts.textContent() ?? '';
  expect(raw).not.toContain('<');
  const person = JSON.parse(raw);
  expect(person['@id']).toBe('https://barash.me/#person');
  expect(person.url).toBe('https://barash.me');
});

test('desktop keeps its own canonical and noindex follow policy', async ({ page }) => {
  await page.goto('/desktop');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://barash.me/desktop');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex,\s*follow/i);
});


test('manifest represents the minimal public site and uses its reachable icon', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest).toMatchObject({
    start_url: '/',
    scope: '/',
  });
  const iconResponse = await request.get(manifest.icons[0].src);
  expect(iconResponse.ok()).toBe(true);
});

test('public route payloads do not leak private material or governance fields', async ({ request }) => {
  for (const pathname of stableRoutes) {
    const html = await (await request.get(pathname)).text();
    expect(html, pathname).not.toMatch(/evidenceIds|publicationStatus|evidenceLevel|private[ -]note|internal[ -]only|confidential/i);
  }
});

