import { expect, test } from '@playwright/test';
import { publishedProjects } from '../../src/content/projects';

test('mobile Safari opts into safe areas and keeps the taskbar available', async ({ page }) => {
  await page.goto('/desktop');

  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/);
  const taskbar = page.locator('.win95-taskbar');
  await expect(taskbar).toBeVisible();
  await expect(taskbar).toBeInViewport();
  await expect(taskbar).toHaveCSS('position', 'fixed');
});

test('mobile WebKit keeps active content visible and the focused Start control available', async ({ page }) => {
  await page.goto('/desktop?app=projects');

  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Project Explorer' })).toBeVisible();

  const start = page.getByRole('button', { name: 'Start menu' });
  await start.focus();
  await expect(start).toBeFocused();
  await expect(start).toBeInViewport();
  await expect(start).toHaveCSS('outline-style', 'dotted');
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
  expect(await page.locator('.minimal-project-prose').first().evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
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
    await expect(primaryLink).toHaveCSS('outline-style', 'solid');
    const box = await primaryLink.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.goto('/photos');
  const columns = await page.locator('.minimal-photo-gallery').evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length);
  expect(columns).toBe(1);
});

test('Phase 3 pages disable nonessential motion for reduced-motion users', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/resume');
  const motion = await page.locator('.minimal-site').evaluate((node) => {
    const style = getComputedStyle(node);
    return { scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, animation: style.animationName };
  });
  expect(motion.scrollBehavior).toBe('auto');
  expect(motion.animation).toBe('none');
});

test('Start image remains decorative with intrinsic 8:7 dimensions', async ({ page }) => {
  await page.goto('/desktop');

  const start = page.getByRole('button', { name: 'Start menu' });
  const image = start.locator('img');
  await expect(image).toHaveAttribute('alt', '');
  await expect(image).toHaveAttribute('width', '16');
  await expect(image).toHaveAttribute('height', '14');
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
