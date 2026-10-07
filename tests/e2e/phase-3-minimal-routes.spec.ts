import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteConfig } from '../../src/constants/site';
import { archivePhotos, featuredPhotos } from '../../src/content/photography';
import { publishedSpeaking, speakingCatalog } from '../../src/content/speaking';
import { photoLibrary } from '../../src/data/photos';
import { resumeData } from '../../src/data/resume';

const routes = ['/resume', '/photos', '/contact'] as const;
const canonicalUrl = (pathname: string) => new URL(pathname, `${siteConfig.canonicalOrigin}/`).href;
const privateMaterial = /internal governance|Identity Work|evidenceIds|publicationStatus|evidenceLevel|private[ -]note|internal[ -]only|confidential/i;

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


async function expectRouteMetadata(page: Page, pathname: string) {
  await page.goto(pathname);
  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(title.trim()).not.toBe('');
  expect(description?.trim()).toBeTruthy();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl(pathname));
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl(pathname));
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
}

test('public routes keep career, photography, and contact content separate from Win95 and private material', async ({ page }) => {
  for (const pathname of routes) {
    const response = await page.request.get(pathname);
    expect(response.ok()).toBe(true);
    expect(await response.text()).not.toMatch(privateMaterial);
    await page.goto(pathname);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('[data-testid="application-window"]')).toHaveCount(0);
    await expect(page.locator('.win95-app-body')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(privateMaterial);
  }
});

test('resume exposes career groups, expandable earlier experience, and contact destinations', async ({ page }) => {
  await page.goto('/resume');
  await expect(page.getByRole('heading', { level: 1, name: 'Experience' })).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(0);

  const main = page.locator('main');
  for (const heading of ['Career', 'Earlier experience', 'Capabilities', 'Education', 'Languages', 'Honors']) {
    await expect(main.getByRole('heading', { level: 2, name: heading, exact: true })).toBeVisible();
  }

  const recentExperience = main.locator('[data-resume-recent]');
  const earlierExperience = main.locator('[data-resume-earlier]');
  await expect(recentExperience.getByRole('article')).toHaveCount(3);
  await expect(earlierExperience.getByRole('article')).toHaveCount(resumeData.experience.length - 3);
  for (const company of ['Descope', 'ID.me', 'Okta']) {
    await expect(recentExperience.getByRole('heading', { level: 3, name: company, exact: true })).toBeVisible();
  }
  for (const group of ['Identity', 'Technical strategy', 'Building']) {
    await expect(main.getByRole('heading', { level: 3, name: group, exact: true })).toBeVisible();
  }

  for (const job of resumeData.experience.slice(3)) {
    await expect(main.getByRole('heading', { name: job.company, exact: true })).toBeVisible();
    const entry = earlierExperience.getByRole('article').filter({
      has: page.getByRole('heading', { name: job.company, exact: true }),
    });
    await entry.locator('summary').click();
    await expect(entry.locator('details')).toHaveAttribute('open', '');
  }
  await expect(page.getByRole('link', { name: resumeData.contact.email, exact: true })).toHaveAttribute('href', 'mailto:steven@barash.me');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true }).first()).toHaveAttribute('href', resumeData.contact.linkedin);
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
  const preload = page.locator('head link[rel="preload"][as="image"]');
  await expect(preload).toHaveCount(1);
  const firstFeaturedImage = figures.first().locator('img');
  await expect(preload).toHaveAttribute('imagesrcset', await firstFeaturedImage.getAttribute('srcset') as string);
  await expect(preload).toHaveAttribute('imagesizes', await firstFeaturedImage.getAttribute('sizes') as string);
  expect(await preload.getAttribute('imagesrcset')).toContain(encodeURIComponent(featuredPhotos[0].src));

});
test('photographs support keyboard enlargement and Escape dismissal without losing focus', async ({ page }) => {
  await page.goto('/photos');
  await page.evaluate(async () => { await document.fonts.ready; });
  const photo = page.getByRole('region', { name: 'Photographs' }).getByRole('button').first();
  const image = photo.getByRole('img');
  await photo.focus();
  await expect(photo).toBeFocused();
  expect(await photo.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
  const resting = await image.boundingBox();
  expect(resting).not.toBeNull();

  const distanceFromViewportCenter = async () => {
    const box = await image.boundingBox();
    const viewport = page.viewportSize();
    if (!box || !viewport) throw new Error('The photograph and viewport must be visible.');
    return Math.hypot(box.x + box.width / 2 - viewport.width / 2, box.y + box.height / 2 - viewport.height / 2);
  };

  await photo.press('Enter');
  await expect.poll(distanceFromViewportCenter).toBeLessThan(1);
  await expect.poll(() => image.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return document.elementFromPoint(box.x + box.width / 2, box.y + 4) === node;
  })).toBe(true);
  await photo.press('Escape');
  await expect.poll(() => image.boundingBox()).toEqual(resting);
  await expect(photo).toBeFocused();

  await photo.press('Space');
  await expect.poll(distanceFromViewportCenter).toBeLessThan(1);
  await photo.press('Space');
  await expect.poll(() => image.boundingBox()).toEqual(resting);
  await expect(photo).toBeFocused();
});




test('photo catalog intrinsic dimensions match every verified local JPEG', async () => {
  for (const photo of photoLibrary) {
    const dimensions = await readJpegDimensions(resolve(process.cwd(), 'public', photo.src.slice(1)));
    expect(dimensions, photo.src).toEqual({ width: photo.width, height: photo.height });
  }
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
  for (const pathname of routes) {
    await expectRouteMetadata(page, pathname);
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
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toHaveCount(0);
  }
});

test('small-screen site, footer, and resume company links meet the 44px touch floor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resume');
  for (const locator of [
    page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Home', exact: true }),
    page.getByRole('contentinfo').getByRole('link', { name: 'Credits', exact: true }),
    page.getByRole('link', { name: 'Descope', exact: true }),
  ]) {
    await expect(locator).toBeVisible();
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
