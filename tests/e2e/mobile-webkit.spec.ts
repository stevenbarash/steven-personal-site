import { expect, test } from '@playwright/test';
import { publishedProjects } from '../../src/content/projects';
import { resumeData } from '../../src/data/resume';

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

  for (const name of ['Experience', 'Contact']) {
    const action = page.getByLabel('Primary actions').getByRole('link', { name, exact: true });
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

test('closing the window on a phone reveals tappable desktop shortcuts', async ({ page }) => {
  await page.goto('/desktop');
  const coveredByWindow = await page.evaluate(() => {
    const shortcut = document.querySelector('.win95-desktop-shortcuts button');
    if (!shortcut) return false;
    const rect = shortcut.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return Boolean(hit?.closest('.win95-window'));
  });
  expect(coveredByWindow).toBe(true);

  await page.getByRole('button', { name: 'Close window' }).tap();

  const shortcut = page.locator('.win95-desktop-shortcuts').getByRole('button', { name: 'Open Resume' });
  await expect(shortcut).toBeVisible();
  const box = await shortcut.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);

  await shortcut.tap();
  await expect(page).toHaveURL(/app=resume/);
});

test('resume company label does not cover the first role title', async ({ page }) => {
  await page.goto('/desktop?app=resume');
  const firstJob = resumeData.experience[0];
  await expect(page.getByRole('link', { name: firstJob.company, exact: true })).toBeVisible();

  const overlap = await page.evaluate(({ company, title }) => {
    const link = [...document.querySelectorAll('a')].find((a) => a.textContent.trim() === company);
    const role = [...document.querySelectorAll('span')].find((s) => s.textContent.trim() === title);
    if (!link || !role) return -1;
    const a = link.getBoundingClientRect();
    const b = role.getBoundingClientRect();
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return Math.max(0, w) * Math.max(0, h);
  }, { company: firstJob.company, title: firstJob.roles[0].title });

  expect(overlap).toBe(0);
});

test('project explorer rows keep status and type on one metadata line', async ({ page }) => {
  await page.goto('/desktop?app=projects');
  await expect(page.locator('.win95-project-file-row').first()).toBeVisible();

  const row = await page.locator('.win95-project-file-row').first().evaluate((node) => {
    const status = node.querySelector('.win95-status-section')?.getBoundingClientRect();
    const type = node.querySelector(':scope > .win95-metadata:not(.win95-status-section)')?.getBoundingClientRect();
    if (!status || !type) return null;
    return { statusWidth: status.width, topDelta: Math.abs(status.top - type.top) };
  });

  expect(row).not.toBeNull();
  expect(row!.statusWidth).toBeLessThanOrEqual(140);
  expect(row!.topDelta).toBeLessThanOrEqual(4);
});

test('photography puts compact albums and selected photo details before the grid', async ({ page }) => {
  await page.goto('/desktop?app=photos');

  await expect(page.getByText('Photo Details', { exact: true })).toBeVisible();

  const layout = await page.evaluate(() => {
    const albums = document.querySelector('aside')?.getBoundingClientRect();
    const detailLabel = [...document.querySelectorAll('.win95-group-box-label')]
      .find((el) => el.textContent.includes('Photo Details'));
    const detail = detailLabel?.closest('.win95-group-box')?.getBoundingClientRect();
    const grid = document.querySelector('.win95-photo-grid')?.getBoundingClientRect();
    if (!albums || !detail || !grid) return null;
    return { albumsHeight: albums.height, detailTop: detail.top + window.scrollY, gridTop: grid.top + window.scrollY };
  });

  expect(layout).not.toBeNull();
  expect(layout!.albumsHeight).toBeLessThanOrEqual(72);
  expect(layout!.detailTop).toBeLessThan(layout!.gridTop);
});
