import { expect, test, type Page } from '@playwright/test';

const mobileViewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

const appPaths = [
  '/desktop',
  '/desktop?app=profile',
  '/desktop?app=projects',
  '/desktop?app=resume',
  '/desktop?app=photos',
  '/desktop?app=help',
  '/desktop?app=explorer',
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
}

test.describe('Phase 2 mobile reading and shell adaptation', () => {
  for (const viewport of mobileViewports) {
    test(`${viewport.width}x${viewport.height} has readable type, one scroll owner, and unobscured content`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/desktop?app=resume');

      await expectNoHorizontalOverflow(page);
      await expect(page.getByRole('button', { name: 'Maximize window' })).toHaveCount(0);

      const type = await page.evaluate(() => {
        const reading = document.querySelector<HTMLElement>('.win95-reading');
        const metadata = document.querySelector<HTMLElement>('.win95-metadata');
        const title = document.querySelector<HTMLElement>('.win95-title-bar span');
        if (!reading || !metadata || !title) throw new Error('semantic typography hooks are required');
        return {
          readingSize: Number.parseFloat(getComputedStyle(reading).fontSize),
          readingLineHeight: Number.parseFloat(getComputedStyle(reading).lineHeight),
          metadataSize: Number.parseFloat(getComputedStyle(metadata).fontSize),
          chromeSize: Number.parseFloat(getComputedStyle(title).fontSize),
        };
      });
      expect(type.readingSize).toBeGreaterThanOrEqual(15);
      expect(type.readingLineHeight / type.readingSize).toBeGreaterThanOrEqual(1.4);
      expect(type.readingLineHeight / type.readingSize).toBeLessThanOrEqual(1.5);
      expect(type.metadataSize).toBeGreaterThanOrEqual(13);
      expect(type.chromeSize).toBe(11);

      const scrollOwners = await page.evaluate(() => {
        const body = document.querySelector<HTMLElement>('.win95-app-body');
        if (!body) throw new Error('app body scroll owner is required');
        const verticalScrollers = [body, ...body.querySelectorAll<HTMLElement>('*')].filter((element) => {
          const style = getComputedStyle(element);
          return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight;
        });
        return {
          count: verticalScrollers.length,
          ownerIsBody: verticalScrollers.length === 0 || verticalScrollers[0] === body,
          bodyOverflow: getComputedStyle(body).overflowY,
        };
      });
      expect(scrollOwners.bodyOverflow).toBe('auto');
      expect(scrollOwners.ownerIsBody).toBe(true);
      expect(scrollOwners.count).toBeLessThanOrEqual(1);

      const lastFocusable = page.locator('.win95-app-body a:visible, .win95-app-body button:visible').last();
      await lastFocusable.scrollIntoViewIfNeeded();
      await lastFocusable.focus();
      const clearance = await page.evaluate(() => {
        const focused = document.activeElement as HTMLElement;
        const taskbar = document.querySelector<HTMLElement>('.win95-taskbar');
        if (!focused || !taskbar) throw new Error('focusable or taskbar missing');
        return taskbar.getBoundingClientRect().top - focused.getBoundingClientRect().bottom;
      });
      expect(clearance).toBeGreaterThanOrEqual(0);
    });
  }

  test('mobile window fills the usable viewport while desktop retains Maximize', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/desktop');
    const mobileShell = await page.locator('[data-testid="application-window"]').boundingBox();
    const taskbar = await page.locator('.win95-taskbar').boundingBox();
    expect(mobileShell).not.toBeNull();
    expect(taskbar).not.toBeNull();
    expect(mobileShell!.x).toBeLessThanOrEqual(2);
    expect(mobileShell!.width).toBeGreaterThanOrEqual(386);
    expect(mobileShell!.y + mobileShell!.height).toBeLessThanOrEqual(taskbar!.y + 1);

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/desktop');
    await expect(page.getByRole('button', { name: 'Maximize window' })).toBeVisible();
  });

  test('all primary mobile apps are operable by one tap without drag, hover, or double-click', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of appPaths) {
      await page.goto(path);
      await expect(page.locator('[data-testid="application-window"]')).toBeVisible();
      await expect(page.locator('.win95-app-body')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Minimize window' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Close window' })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }

    await page.goto('/desktop');
    await page.getByRole('button', { name: 'Start menu' }).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.getByRole('menuitem', { name: 'Projects' }).click();
    await expect(page.getByRole('heading', { name: 'Project Explorer' })).toBeVisible();
  });

  test('200% layout emulation remains operable at an effective 320 CSS pixels', async ({ page }) => {
    // Playwright does not expose browser UI zoom. A measured 320 CSS-pixel viewport
    // is the documented layout-equivalent of 640 device pixels at 200%.
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/desktop?app=projects');
    const measuredWidth = await page.evaluate(() => ({
      cssPixels: document.documentElement.clientWidth,
      requiredDevicePixelsAt200Percent: document.documentElement.clientWidth * 2,
    }));
    expect(measuredWidth).toEqual({ cssPixels: 320, requiredDevicePixelsAt200Percent: 640 });
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole('button', { name: 'Start menu' })).toBeInViewport();
    await page.getByRole('button', { name: 'Start menu' }).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.getByRole('menuitem', { name: 'Resume' }).click();
    await expect(page.getByRole('heading', { name: 'RESUME.DOC', exact: true })).toBeVisible();
  });

  test('every Resume field group and tab remains readable and operable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/desktop?app=resume');
    for (const tabName of ['Experience', 'Education', 'Skills', 'Honors']) {
      const tab = page.getByRole('tab', { name: tabName });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      const panelId = await tab.getAttribute('aria-controls');
      const panel = page.locator(`#${panelId}`);
      await expect(panel).toBeVisible();
      const dimensions = await panel.evaluate((node) => ({ width: node.scrollWidth, available: node.clientWidth }));
      expect(dimensions.width).toBeLessThanOrEqual(dimensions.available);
    }
  });
});
