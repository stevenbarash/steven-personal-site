import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import manifest from '../../src/app/manifest';
import { profileContent } from '../../src/content/profile';
import { publishedSpeaking, speakingCatalog } from '../../src/content/speaking';
import { resumeData } from '../../src/data/resume';

const forbiddenSpecialty = /agent identity/i;

async function expectActionOwnsCenter(page: Page, locator: Locator, scroll = true) {
  await expect(locator).toBeVisible();
  if (scroll) {
    await expect.poll(async () => {
      try {
        await locator.scrollIntoViewIfNeeded();
        return true;
      } catch {
        return false;
      }
    }).toBe(true);
  }
  await expect.poll(async () => locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const points = [
      [rect.left + rect.width / 2, rect.top + rect.height / 2],
      [rect.left + 2, rect.top + 2],
      [rect.right - 2, rect.bottom - 2],
    ];
    return rect.width >= 44
      && rect.height >= 44
      && rect.left >= 0
      && rect.top >= 0
      && rect.right <= innerWidth
      && rect.bottom <= innerHeight
      && points.every(([x, y]) => element === document.elementFromPoint(x, y) || element.contains(document.elementFromPoint(x, y)));
  })).toBe(true);
}

test('global profile and resume sources do not claim Agent Identity as an established specialty', async ({ page }) => {
  const layoutSource = readFileSync(join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
  expect(layoutSource).not.toMatch(forbiddenSpecialty);
  expect(JSON.stringify(manifest())).not.toMatch(forbiddenSpecialty);
  expect(JSON.stringify(profileContent)).not.toMatch(forbiddenSpecialty);
  expect(JSON.stringify(resumeData)).not.toMatch(forbiddenSpecialty);

  await page.goto('/desktop?app=profile');
  await expect(page.locator('head')).not.toContainText(forbiddenSpecialty);
  await expect(page.locator('.win95-app-body')).not.toContainText(forbiddenSpecialty);
  await page.goto('/desktop?app=resume');
  await expect(page.locator('.win95-app-body')).not.toContainText(forbiddenSpecialty);
});

test('speaking content remains a dormant delivered-session record', () => {
  expect(speakingCatalog).toHaveLength(1);
  expect(speakingCatalog[0]).not.toHaveProperty('organizer');
  expect(speakingCatalog[0]).not.toHaveProperty('year');
  expect(speakingCatalog[0].deliveryStatus).toBe('delivered');
  expect(speakingCatalog[0].publicationStatus).toBe('draft');
  expect(speakingCatalog[0].keyTopics).toEqual(['FAPI', 'Strong MFA', 'B2B federation', 'AI agent identity']);
  expect(publishedSpeaking).toEqual([]);
});

test('AppLink preserves unrelated query parameters across same-origin paths and leaves new-tab behavior native', async ({ page }) => {
  await page.goto('/desktop?campaign=phase2&source=test');
  const contact = page.locator('[data-launcher-for="contact"]');
  await contact.click();
  await expect(page).toHaveURL('/desktop?campaign=phase2&source=test&app=explorer');
  await page.goBack();
  await expect(page).toHaveURL('/desktop?campaign=phase2&source=test');

  const photography = page.locator('[data-launcher-for="photos"]');
  const modifierWasLeftNative = await photography.evaluate((anchor) => {
    let canceledByApp = true;
    document.addEventListener('click', (event) => {
      canceledByApp = event.defaultPrevented;
      event.preventDefault();
    }, { once: true });
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, metaKey: true }));
    return !canceledByApp;
  });
  expect(modifierWasLeftNative).toBe(true);
  await expect(page).toHaveURL('/desktop?campaign=phase2&source=test');
});

test('canonical app query wins over a conflicting legacy hash', async ({ page }) => {
  await page.goto('/?app=projects#section-resume');
  await expect(page).toHaveURL('/projects#section-resume');
  await expect(page.getByRole('heading', { level: 1, name: 'Projects', exact: true })).toBeVisible();
  await expect(page.locator('.win95-window')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'RESUME.DOC', exact: true })).toHaveCount(0);
});

test('stable app launches focus an accessibly named application window', async ({ page }) => {
  for (const appId of ['contact']) {
    await page.goto('/desktop');
    await page.locator(`[data-launcher-for="${appId}"]`).click();
    const window = page.locator('[data-testid="application-window"]');
    await expect(window).toBeFocused();
    await expect(window).toHaveAttribute('aria-label', /application window$/);
  }
});

test('Close returns query and stable apps Home, preserves unrelated params, and restores launcher focus', async ({ page }) => {
  await page.goto('/desktop?campaign=keep');
  const contactLauncher = page.locator('[data-launcher-for="contact"]');
  await contactLauncher.click();
  await expect(page).toHaveURL('/desktop?campaign=keep&app=explorer');
  await page.getByRole('button', { name: 'Close window' }).click();
  await expect(page).toHaveURL('/desktop?campaign=keep');
  await expect(page.locator('[data-launcher-for="contact"]')).toBeFocused();

});

test('mobile title controls and every content action have disjoint effective hit ownership', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  const paths = ['/desktop', '/desktop?app=projects', '/desktop?app=resume', '/desktop?app=photos', '/desktop?app=explorer', '/desktop?app=help'];
  for (const path of paths) {
    await page.goto(path);
    const minimize = page.getByRole('button', { name: 'Minimize window' });
    const close = page.getByRole('button', { name: 'Close window' });
    const titleBar = page.locator('.win95-title-bar');
    await expectActionOwnsCenter(page, minimize, false);
    await expectActionOwnsCenter(page, close, false);
    const minimizeFace = minimize.locator('.win95-title-btn-face');
    const closeFace = close.locator('.win95-title-btn-face');
    await expect(titleBar).toBeVisible();
    await expect(minimizeFace).toBeVisible();
    await expect(closeFace).toBeVisible();
    await expect.poll(async () => {
      const boxes = await Promise.all([
        titleBar.boundingBox(),
        minimize.boundingBox(),
        close.boundingBox(),
        minimizeFace.boundingBox(),
        closeFace.boundingBox(),
      ]);
      return boxes.every(Boolean);
    }).toBe(true);
    const [titleBox, minimizeBox, closeBox, minimizeFaceBox, closeFaceBox] = await Promise.all([
      titleBar.boundingBox(),
      minimize.boundingBox(),
      close.boundingBox(),
      minimizeFace.boundingBox(),
      closeFace.boundingBox(),
    ]);
    for (const box of [minimizeBox, closeBox]) {
      expect(box!.y).toBeGreaterThanOrEqual(titleBox!.y);
      expect(box!.y + box!.height).toBeLessThanOrEqual(titleBox!.y + titleBox!.height);
    }
    for (const face of [minimizeFaceBox, closeFaceBox]) {
      const faceCenter = face!.y + face!.height / 2;
      const titleCenter = titleBox!.y + titleBox!.height / 2;
      expect(faceCenter).toBeCloseTo(titleCenter, 0);
    }
    const overlap = await page.evaluate(() => {
      const a = document.querySelector('[aria-label="Minimize window"]')!.getBoundingClientRect();
      const b = document.querySelector('[aria-label="Close window"]')!.getBoundingClientRect();
      const menu = document.querySelector('.win95-menu-bar')!.getBoundingClientRect();
      return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top) || a.bottom > menu.top || b.bottom > menu.top;
    });
    expect(overlap).toBe(false);

    const actions = page.locator('.win95-app-body a:visible, .win95-app-body button:visible');
    for (let index = 0; index < await actions.count(); index += 1) {
      await expectActionOwnsCenter(page, actions.nth(index));
    }
  }
});

test('coarse-pointer title controls stay fully inside and centered within the mobile title bar', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/desktop');

  const titleBox = await page.locator('.win95-title-bar').boundingBox();
  for (const name of ['Minimize window', 'Close window']) {
    const control = page.getByRole('button', { name });
    const [controlBox, faceBox] = await Promise.all([
      control.boundingBox(),
      control.locator('.win95-title-btn-face').boundingBox(),
    ]);
    expect(controlBox!.y).toBeGreaterThanOrEqual(titleBox!.y);
    expect(controlBox!.y + controlBox!.height).toBeLessThanOrEqual(titleBox!.y + titleBox!.height);
    expect(faceBox!.y + faceBox!.height / 2).toBeCloseTo(titleBox!.y + titleBox!.height / 2, 0);
  }

  await context.close();
});

test('all app copy uses semantic mobile typography and Photography has one vertical scroll owner', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const paths = ['/desktop?app=profile', '/desktop?app=resume', '/desktop?app=projects', '/desktop?app=photos', '/desktop?app=help', '/desktop?app=explorer'];
  for (const path of paths) {
    await page.goto(path);
    const badCopy = await page.locator('.win95-app-body').evaluate((body) => {
      const candidates = [...body.querySelectorAll<HTMLElement>('p, dd, li, small')].filter((node) => !node.closest('button, [role="tab"], .win95-status-bar, .win95-badge'));
      return candidates.filter((node) => {
        const size = Number.parseFloat(getComputedStyle(node).fontSize);
        const metadata = node.matches('small, .win95-metadata') || Boolean(node.closest('.win95-metadata'));
        return size < (metadata ? 13 : 15);
      }).map((node) => node.textContent?.trim()).filter(Boolean);
    });
    expect(badCopy, `${path}: ${badCopy.join(' | ')}`).toEqual([]);
  }

  await page.goto('/desktop?app=photos');
  await expect.poll(() => page.locator('.win95-app-body').evaluate((body) => [body, ...body.querySelectorAll<HTMLElement>('*')]
    .filter((node) => /(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight)
    .length)).toBe(1);
  const owners = await page.locator('.win95-app-body').evaluate((body) => [body, ...body.querySelectorAll<HTMLElement>('*')]
    .filter((node) => /(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight)
    .map((node) => node.className));
  expect(owners).toHaveLength(1);
  expect(String(owners[0])).toContain('win95-app-body');
});
