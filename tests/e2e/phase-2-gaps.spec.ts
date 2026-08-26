import { expect, test, type Locator } from '@playwright/test';

const appPaths = [
  '/desktop',
  '/desktop?app=profile',
  '/desktop?app=projects',
  '/desktop?app=terminal',
  '/desktop?app=resume',
  '/desktop?app=help',
  '/desktop?app=about-site',
  '/desktop?app=photos',
  '/desktop?app=explorer',
] as const;

test('all substantive mobile app text has semantic reading or metadata sizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of appPaths) {
    await page.goto(path);
    const auditVisibleText = () => page.locator('.win95-app-body').evaluate((body) => {
      const selector = 'h1, h2, h3, h4, h5, h6, p, dt, dd, li, small, div, span';
      const candidates = [...body.querySelectorAll<HTMLElement>(selector)].filter((node) => {
        if (node.hidden || getComputedStyle(node).display === 'none') return false;
        const ownText = [...node.childNodes]
          .filter((child) => child.nodeType === Node.TEXT_NODE)
          .map((child) => child.textContent ?? '')
          .join(' ')
          .trim();
        if (!ownText) return false;
        return !node.closest(
          'button, [role="tab"], .win95-interface-label, .win95-badge, .win95-title-bar, .win95-menu-bar, .win95-status-bar',
        );
      });

      return candidates.flatMap((node) => {
        const metadata = node.matches('small, .win95-metadata') || Boolean(node.closest('.win95-metadata'));
        const size = Number.parseFloat(getComputedStyle(node).fontSize);
        const minimum = metadata ? 13 : 15;
        return size < minimum
          ? [{ tag: node.tagName.toLowerCase(), text: node.textContent?.trim(), size, minimum }]
          : [];
      });
    });

    const undersized = await auditVisibleText();
    const tabs = page.getByRole('tab');
    for (let index = 0; index < await tabs.count(); index += 1) {
      await tabs.nth(index).click();
      undersized.push(...await auditVisibleText());
    }

    expect(undersized, `${path}: ${JSON.stringify(undersized)}`).toEqual([]);
  }
});

for (const viewport of [
  { label: 'desktop', width: 1280, height: 720 },
  { label: 'mobile', width: 390, height: 844 },
]) {
  test(`Photography uses only the app body as its vertical scroll owner on ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/desktop?app=photos');

    const state = await page.locator('.win95-app-body').evaluate((body) => ({
      bodyOverflowY: getComputedStyle(body).overflowY,
      bodyScrolls: body.scrollHeight > body.clientHeight,
      nestedOwners: [...body.querySelectorAll<HTMLElement>('*')]
        .filter((node) => /(auto|scroll)/.test(getComputedStyle(node).overflowY))
        .map((node) => ({ className: node.className, scrolls: node.scrollHeight > node.clientHeight })),
    }));

    expect(state.bodyOverflowY).toMatch(/auto|scroll/);
    expect(state.bodyScrolls).toBe(true);
    expect(state.nestedOwners).toEqual([]);
  });
}

test('Photography exposes selected album and photo state and supports keyboard selection', async ({ page }) => {
  await page.goto('/desktop?app=photos');

  const allPhotos = page.getByRole('button', { name: 'All Photos', exact: true });
  const instagram = page.getByRole('button', { name: 'Instagram', exact: true });
  await expect(allPhotos).toHaveAttribute('aria-pressed', 'true');
  await expect(instagram).toHaveAttribute('aria-pressed', 'false');
  await instagram.focus();
  await page.keyboard.press('Enter');
  await expect(instagram).toHaveAttribute('aria-pressed', 'true');
  await expect(allPhotos).toHaveAttribute('aria-pressed', 'false');

  const photoButtons = page.locator('.win95-photo-grid button');
  await expect(photoButtons.first()).toHaveAttribute('aria-pressed', 'true');
  await photoButtons.nth(1).focus();
  await page.keyboard.press('Space');
  await expect(photoButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(photoButtons.first()).toHaveAttribute('aria-pressed', 'false');
});

test('AppLink href preserves unrelated query params before normal, modifier, and middle-click navigation', async ({ page }) => {
  await page.goto('/desktop?campaign=keep&source=a');
  const contact = page.locator('[data-launcher-for="contact"]');

  await expect(contact).toHaveAttribute('href', '/desktop?campaign=keep&source=a&app=explorer');
  await expect(contact).not.toHaveAttribute('target', '_blank');

  const nativeEventsWereNotCanceled = await contact.evaluate((anchor) => {
    const dispatchWithoutFollowing = (type: 'click' | 'auxclick', init: MouseEventInit) => {
      let canceledByApp = true;
      const navigationGuard = (event: Event) => {
        canceledByApp = event.defaultPrevented;
        event.preventDefault();
      };
      document.addEventListener(type, navigationGuard, { once: true });
      anchor.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, ...init }));
      return !canceledByApp;
    };

    return [
      dispatchWithoutFollowing('click', { button: 0, metaKey: true }),
      dispatchWithoutFollowing('click', { button: 0, ctrlKey: true }),
      dispatchWithoutFollowing('auxclick', { button: 1 }),
    ];
  });
  expect(nativeEventsWereNotCanceled).toEqual([true, true, true]);
  await expect(page).toHaveURL('/desktop?campaign=keep&source=a');

  await contact.click();
  await expect(page).toHaveURL('/desktop?campaign=keep&source=a&app=explorer');
});

test('CSS zoom 2 is an explicit layout-zoom surrogate with usable navigation and no clipped focus', async ({ page }) => {
  // Headless Playwright cannot automate browser-chrome zoom consistently across Chromium and WebKit.
  // CSS zoom exercises a real 2x layout/hit-testing path, but is intentionally not claimed as true browser zoom.
  await page.setViewportSize({ width: 640, height: 900 });

  const enableLayoutZoom = async () => {
    await page.locator('html').evaluate((html) => { html.style.zoom = '2'; });
  };
  const expectNoHorizontalOverflow = async () => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  };
  const expectUsable = async (locator: Locator) => {
    await locator.scrollIntoViewIfNeeded();
    await locator.focus();
    await expect(locator).toBeFocused();
    expect(await locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const center = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight
        && (center === element || element.contains(center));
    })).toBe(true);
  };

  await page.goto('/desktop');
  await enableLayoutZoom();
  await expectNoHorizontalOverflow();
  await expectUsable(page.getByRole('link', { name: 'Open Resume', exact: true }));
  await expectUsable(page.getByRole('link', { name: 'Email Steven', exact: true }));
  await expectUsable(page.getByRole('button', { name: 'Start menu' }));
  await expectUsable(page.locator('.win95-task-btn'));

  await page.getByRole('link', { name: 'Open Resume', exact: true }).click();
  await enableLayoutZoom();
  await expectNoHorizontalOverflow();
  await expectUsable(page.getByRole('tab', { name: 'Experience' }));

  await page.goto('/desktop?app=explorer');
  await enableLayoutZoom();
  await expectNoHorizontalOverflow();
  await expectUsable(page.getByRole('link', { name: /^Email Steven/ }));
});
