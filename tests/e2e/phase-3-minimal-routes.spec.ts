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
      await expect(image).toHaveAttribute('loading', 'eager');
      await expect(image).toHaveAttribute('fetchpriority', 'high');
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

});
for (const { width, theme } of [{ width: 320, theme: 'dark' }, { width: 1440, theme: 'light' }]) {
  test(`photo modal contains keyboard focus and preserves the gallery at ${width}px in ${theme} mode`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript((value) => localStorage.setItem('portfolio-theme', value), theme);
    await page.goto('/photos');
    await page.evaluate(async () => { await document.fonts.ready; });
    const gallery = page.getByRole('region', { name: 'Photographs' });
    const trigger = gallery.getByRole('button').first();
    const nextTrigger = page.getByRole('button', {
      name: `Enlarge ${[...featuredPhotos, ...archivePhotos][1].title}`,
      exact: true,
      includeHidden: true,
    });
    const thumbnail = trigger.getByRole('img');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    expect(await trigger.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
    const resting = await thumbnail.boundingBox();
    expect(resting).not.toBeNull();
    expect(resting!.width / resting!.height).toBeCloseTo(featuredPhotos[0].width / featuredPhotos[0].height, 2);
    const scrollY = await page.evaluate(() => window.scrollY);
    const surfaceColor = await page.locator('.portfolio-site').evaluate((node) => getComputedStyle(node).backgroundColor);

    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: featuredPhotos[0].title, exact: true });
    const close = dialog.getByRole('button', { name: 'Close enlarged photograph' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('img', { name: featuredPhotos[0].alt, exact: true })).toBeVisible();
    await expect(close).toBeFocused();
    expect(await dialog.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe(surfaceColor);
    const closeBox = await close.boundingBox();
    expect(closeBox!.width).toBeGreaterThanOrEqual(44);
    expect(closeBox!.height).toBeGreaterThanOrEqual(44);
    const enlarged = await dialog.getByRole('img').boundingBox();
    expect(enlarged).not.toBeNull();
    expect(enlarged!.x).toBeGreaterThanOrEqual(0);
    expect(enlarged!.y).toBeGreaterThanOrEqual(0);
    expect(enlarged!.x + enlarged!.width).toBeLessThanOrEqual(width);
    expect(enlarged!.y + enlarged!.height).toBeLessThanOrEqual(900);
    expect(await dialog.getByRole('img').evaluate((node) => {
      const box = node.getBoundingClientRect();
      return document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2) === node;
    })).toBe(true);

    for (const key of ['Tab', 'Tab', 'Shift+Tab']) {
      await page.keyboard.press(key);
      await expect(close).toBeFocused();
    }
    await nextTrigger.evaluate((node) => node.focus());
    await expect(close).toBeFocused();
    await page.keyboard.press('PageDown');
    await page.mouse.wheel(0, 600);
    await page.evaluate(() => {
      const { promise, resolve } = Promise.withResolvers<void>();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      return promise;
    });
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    expect(await dialog.getByRole('img').boundingBox()).toEqual(enlarged);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await thumbnail.boundingBox()).toEqual(resting);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);

    await page.keyboard.press('Space');
    await expect(dialog).toBeVisible();
    await close.click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(1, 1);
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
  });
}

test.describe('touch photo enlargement', () => {
  test.use({ hasTouch: true, viewport: { width: 320, height: 740 } });

  test('opens by touch and dismisses with the close target or backdrop', async ({ page }) => {
    await page.goto('/photos');
    const trigger = page.getByRole('region', { name: 'Photographs' }).getByRole('button').first();
    const dialog = page.getByRole('dialog', { name: featuredPhotos[0].title, exact: true });
    await trigger.tap();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close enlarged photograph' }).tap();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.tap();
    await expect(dialog).toBeVisible();
    await page.touchscreen.tap(1, 1);
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
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
