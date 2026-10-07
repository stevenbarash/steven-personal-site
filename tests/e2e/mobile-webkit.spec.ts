import { expect, test } from '@playwright/test';
import { publishedProjects } from '../../src/content/projects';

test('mobile Safari opts into safe areas and keeps the taskbar available', async ({ page }) => {
  await page.goto('/desktop');

  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/);
  const taskbar = page.locator('.win95-taskbar');
  await expect(taskbar).toBeVisible();
  await expect(taskbar).toBeInViewport();
});

test('mobile WebKit keeps active content visible and the focused Start control available', async ({ page }) => {
  await page.goto('/desktop?app=projects');

  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Project Explorer' })).toBeVisible();

  const start = page.getByRole('button', { name: 'Start menu' });
  await start.focus();
  await expect(start).toBeFocused();
  await expect(start).toBeInViewport();
  expect(await start.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
});

test('mobile WebKit renders stable project index and case-study documents readably', async ({ page }) => {
  for (const path of ['/projects', ...publishedProjects.map(({ slug }) => `/projects/${slug}`)]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('[data-testid="application-window"]')).toHaveCount(0);
    await expect(page.locator('.win95-project-readme')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  await page.goto('/projects/pult');
  const source = page.getByRole('link', { name: 'View source on GitHub' });
  const box = await source.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test('mobile WebKit keeps Phase 3 documents linear, focused, and within 390 pixels', async ({ page }) => {
  for (const path of ['/resume', '/photos', '/contact']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('[data-testid="application-window"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    const primaryLink = page.locator('main a').first();
    await primaryLink.focus();
    await expect(primaryLink).toBeFocused();
    expect(await primaryLink.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
    const box = await primaryLink.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

});


for (const [path, expectedCopy] of [
  ['/desktop?app=photos', 'Photography Explorer'],
  ['/desktop?app=help', 'Using this desktop'],
  ['/desktop?app=resume', 'RESUME.DOC'],
  ['/desktop?app=explorer', 'Contact Steven'],
] as const) {
  test(`mobile WebKit covers content and action hit ownership for ${path}`, async ({ page }) => {
    await page.goto(path);
    const body = page.locator('.win95-app-body');
    await expect(body).toBeVisible();
    await expect(body).toContainText(expectedCopy);
    const actions = body.locator('a:visible, button:visible');
    for (let index = 0; index < await actions.count(); index += 1) {
      const action = actions.nth(index);
      await action.scrollIntoViewIfNeeded();
      const ownsCenter = await action.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const center = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return rect.width >= 44 && rect.height >= 44 && (center === element || element.contains(center));
      });
      expect(ownsCenter).toBe(true);
    }
  });
}

test('small phones keep primary actions tappable and navigation clear of Start', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  for (const name of ['View experience', 'Get in touch']) {
    const action = page.getByRole('link', { name, exact: true });
    await expect.poll(() => action.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return rect.bottom <= innerHeight && element.contains(hit);
    })).toBe(true);
  }

  const darkHeadingColor = await page.getByRole('heading', { level: 1 }).evaluate((node) => getComputedStyle(node).color);
  await page.getByRole('button', { name: 'Switch to light theme', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveCSS('color', darkHeadingColor);

  const start = page.getByRole('link', { name: 'Start the Windows 95 experience', exact: true });
  const startBox = await start.boundingBox();
  expect(startBox).not.toBeNull();
  for (const path of ['/resume', '/photos', '/contact', '/']) {
    const link = page.getByRole('navigation', { name: 'Primary navigation' }).locator(`a[href="${path}"]`);
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.x).toBeGreaterThanOrEqual(startBox!.x + startBox!.width);
    await link.tap();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole('button', { name: 'Switch to dark theme', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }

  const face = await start.locator('.portfolio-start-face').boundingBox();
  await start.tap();
  await expect(page).toHaveURL('/desktop');
  const desktopStart = page.getByRole('button', { name: 'Start menu', exact: true });
  await expect(desktopStart).toBeVisible();
  const desktopFace = await desktopStart.boundingBox();
  expect(face).not.toBeNull();
  expect(desktopFace).not.toBeNull();
  expect(face!.x).toBeCloseTo(desktopFace!.x, 1);
  expect(face!.y).toBeCloseTo(desktopFace!.y, 1);
});
