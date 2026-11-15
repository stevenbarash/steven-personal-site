import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/constants/site';

test('home has semantic navigation and working internal destinations', async ({ page, request }) => {
  await page.goto('/');

  expect((await request.get('/')).ok()).toBe(true);
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  for (const [label, href] of [
    ['Home', '/'],
    ['Experience', '/resume'],
    ['Projects', '/projects'],
    ['Photography', '/photos'],
    ['Contact', '/contact'],
  ]) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
    expect((await request.get(href)).ok(), href).toBe(true);
  }

  await expect(page.locator('[data-home-hero]').getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', '/contact');
  await expect(page.locator('[data-home-hero]').getByRole('link', { name: 'Experience', exact: true })).toHaveAttribute('href', '/resume');

});

test('primary navigation identifies only the current public section', async ({ page }) => {
  const expectations = [
    ['/', 'Home'],
    ['/projects', 'Projects'],
    ['/projects/localizr', 'Projects'],
    ['/projects/pult', 'Projects'],
    ['/resume', 'Experience'],
    ['/photos', 'Photography'],
    ['/contact', 'Contact'],
  ] as const;

  for (const [pathname, currentLabel] of expectations) {
    await page.goto(pathname);
    const nav = page.getByRole('navigation', { name: 'Primary navigation' });
    const currentLinks = nav.locator('[aria-current="page"]');

    if (currentLabel === null) {
      await expect(currentLinks).toHaveCount(0);
    } else {
      await expect(currentLinks).toHaveCount(1);
      await expect(nav.getByRole('link', { name: currentLabel, exact: true })).toHaveAttribute('aria-current', 'page');
    }
  }
});

test('home features Localizr while the resume stays focused on experience', async ({ page }) => {
  await page.goto('/');
  const projects = page.getByRole('region', { name: 'Projects', exact: true });
  await expect(projects.getByRole('heading', { name: 'Localizr', exact: true })).toBeVisible();
  await projects.getByRole('link', { name: 'How Localizr works' }).click();
  await expect(page).toHaveURL('/projects/localizr');
  await expect(page.getByRole('heading', { name: 'How it works', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the live site' })).toHaveAttribute('href', 'https://localizr.barash.me');
  await expect(page.getByRole('main').locator('a[href*="github.com/"]')).toHaveCount(0);

  await page.goto('/resume');
  await expect(page.getByRole('main').locator('a[href^="/projects"], a[href*="github.com/"]')).toHaveCount(0);
});



test('Windows 95 home and profile portraits load successfully', async ({ page }) => {
  for (const pathname of ['/desktop', '/desktop?app=profile']) {
    await page.goto(pathname);
    const portrait = pathname === '/desktop'
      ? page.locator('.win95-home-portrait')
      : page.getByRole('img', { name: /portrait/i });
    await expect(portrait).toBeVisible();
    await expect.poll(() => portrait.evaluate((image: HTMLImageElement) =>
      image.complete && image.naturalWidth > 0,
    )).toBe(true);
  }
});

test('home does not claim an unfinished Georgia Tech degree', async ({ page }) => {
  await page.goto('/');

  const about = page.locator('[data-home-about]');
  await expect(about).not.toContainText(/Georgia Tech|M\.S\. in Computer Science/i);
});

test('desktop route preserves the functional Windows 95 homepage and is excluded from indexing', async ({ page, request }) => {
  const response = await request.get('/desktop');
  expect(response.ok()).toBe(true);

  await page.goto('/desktop');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://barash.me/desktop');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex,\s*follow/i);
  await expect(page.getByRole('button', { name: 'Start menu' })).toBeVisible();
  await page.getByRole('button', { name: 'Start menu' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Start menu' })).toBeFocused();

  await page.getByRole('button', { name: 'Start menu' }).click();
  await page.getByRole('menu').getByRole('menuitem', { name: 'Help' }).click();
  await expect(page).toHaveURL('/desktop?app=help');
  await expect(page.locator('.win95-title-bar').getByText('HELP - Using This Site', { exact: true })).toBeVisible();

  await page.getByRole('menubar').getByRole('menuitem', { name: 'View', exact: true }).click();
  await page.getByRole('menu', { name: 'View' }).getByRole('menuitem', { name: 'Resume' }).click();
  await expect(page).toHaveURL('/desktop?app=resume');
  await expect(page.locator('.win95-title-bar').getByText('RESUME.DOC - WordPad', { exact: true })).toBeVisible();
});


test('home has visible keyboard focus and a working skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  await page.keyboard.press('Tab');
  const focusedOutline = await page.locator(':focus-visible').evaluate((node) => getComputedStyle(node).outlineStyle);
  expect(focusedOutline).not.toBe('none');
});

test('home fits a 390px viewport with reachable 44px actions and navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  for (const locator of [
    page.locator('[data-home-hero]').getByRole('link', { name: 'Experience', exact: true }),
    page.locator('[data-home-hero]').getByRole('link', { name: 'Contact', exact: true }),
    page.getByRole('navigation', { name: 'Social profiles' }).getByRole('link', { name: /^X\b/ }),
    page.getByRole('navigation', { name: 'Social profiles' }).getByRole('link', { name: /^GitHub\b/ }),
    page.locator('[data-home-contact] a[href^="mailto:"]'),
    page.getByRole('link', { name: 'Start the Windows 95 experience', exact: true }),
    ...['/', '/resume', '/projects', '/photos', '/contact'].map((href) =>
      page.getByRole('navigation', { name: 'Primary navigation' }).locator(`a[href="${href}"]`)),
  ]) {
    await expect(locator).toBeVisible();
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }

  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  for (const href of ['/resume', '/projects', '/photos', '/contact', '/']) {
    const link = nav.locator(`a[href="${href}"]`);
    await expect(link).toBeInViewport();
    await link.click();
    await expect(page).toHaveURL(href);
    await expect(link).toHaveAttribute('aria-current', 'page');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
});


for (const theme of ['light', 'dark'] as const) {
  test(`saved ${theme} theme is visible before hydration`, async ({ page }) => {
    await page.addInitScript((savedTheme) => {
      localStorage.setItem('portfolio-theme', savedTheme);
    }, theme);
    const toggleName = `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`;
    await page.goto('/');
    await expect(page.getByRole('button', { name: toggleName })).toBeVisible();
    const themedBackground = await page.locator('.portfolio-site').evaluate(
      (site) => getComputedStyle(site).backgroundColor,
    );
    const themedIcon = await page.getByRole('button', { name: toggleName })
      .locator('svg:visible').evaluate((icon) => icon.outerHTML);
    // Leave the server-rendered page visible without React restoring the theme.
    await page.route('**/_next/**/*.js', (route) => route.abort());
    // Model Cloudflare Rocket Loader deferring scripts unless explicitly excluded.
    await page.route('**/resume', async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace(/<script\b([^>]*)>/g, (tag, attributes: string) =>
        attributes.includes('data-cfasync="false"') || /\btype=/.test(attributes)
          ? tag
          : `<script type="rocket-loader-deferred"${attributes}>`,
      );
      await route.fulfill({ response, body });
    });
    await page.goto('/resume');
    await expect(page.locator('.portfolio-site')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('.portfolio-site')).toHaveCSS('color-scheme', theme);
    await expect(page.locator('.portfolio-site')).toHaveCSS('background-color', themedBackground);
    await expect(page.locator('html')).not.toHaveAttribute('data-theme');
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      const toggle = page.getByRole('button', { name: toggleName });
      await expect(toggle).toBeVisible();
      await expect(toggle.locator('svg:visible')).toHaveCount(1);
      expect(await toggle.locator('svg:visible').evaluate((icon) => icon.outerHTML)).toBe(themedIcon);
    }

    const hydrationErrors: string[] = [];
    page.on('pageerror', (error) => hydrationErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') hydrationErrors.push(message.text());
    });
    await page.unroute('**/_next/**/*.js');
    await page.unroute('**/resume');
    await page.reload();
    await expect(page.getByRole('button', { name: toggleName })).toBeVisible();
    await expect(page.locator('.portfolio-site')).toHaveAttribute('data-theme', theme);
    expect(hydrationErrors.filter((message) => /hydrat|didn't match/i.test(message))).toEqual([]);
  });
}

test('theme changes persist across navigation and reload without changing the desktop', async ({ page }) => {
  await page.goto('/desktop');
  await expect(page.getByRole('button', { name: 'Start menu' })).toBeVisible();
  const baseline = await page.locator('html, body, main, .win95-taskbar').evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      return {
        background: style.backgroundColor,
        color: style.color,
        font: style.fontFamily,
        colorScheme: style.colorScheme,
      };
    }));

  await page.goto('/');
  const darkHeadingColor = await page.getByRole('heading', { level: 1 }).evaluate((node) => getComputedStyle(node).color);
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveCSS('color', darkHeadingColor);
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(page).toHaveURL('/resume');
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();

  await page.getByRole('link', { name: 'Start the Windows 95 experience', exact: true }).click();
  await expect(page).toHaveURL('/desktop');
  await expect(page.getByRole('button', { name: 'Start menu' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Switch to .* theme/ })).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  const restored = await page.locator('html, body, main, .win95-taskbar').evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      return {
        background: style.backgroundColor,
        color: style.color,
        font: style.fontFamily,
        colorScheme: style.colorScheme,
      };
    }));
  expect(restored).toEqual(baseline);

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('color', darkHeadingColor);
});
