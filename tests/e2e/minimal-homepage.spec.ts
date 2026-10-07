import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/constants/site';

test('home has semantic navigation and working internal destinations', async ({ page, request }) => {
  await page.goto('/');

  expect((await request.get('/')).ok()).toBe(true);
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  for (const [label, href] of [
    ['Home', '/'],
    ['Experience', '/resume'],
    ['Photography', '/photos'],
    ['Contact', '/contact'],
  ]) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
    expect((await request.get(href)).ok(), href).toBe(true);
  }

  await expect(page.locator('[data-home-hero]').getByRole('link', { name: 'Get in touch', exact: true })).toHaveAttribute('href', '/contact');
  await expect(page.locator('[data-home-hero]').getByRole('link', { name: 'View experience', exact: true })).toHaveAttribute('href', '/resume');

});

test('primary navigation identifies only the current public section', async ({ page }) => {
  const expectations = [
    ['/', 'Home'],
    ['/projects', null],
    ['/projects/pult', null],
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

test('home and resume do not promote repository projects', async ({ page }) => {
  for (const pathname of ['/', '/resume']) {
    await page.goto(pathname);
    const githubSelector = pathname === '/'
      ? `main a[href^="${siteConfig.githubUrl}/"]`
      : 'main a[href*="github.com/"]';
    await expect(page.locator(`a[href^="/projects"], ${githubSelector}`)).toHaveCount(0);
  }
});



test('Windows 95 home and profile views use the supplied illustrated portrait', async ({ page }) => {
  await page.goto('/desktop');
  await expect(page.locator('.win95-home-portrait')).toHaveAttribute('src', /profile-portrait\.png/);

  await page.goto('/desktop?app=profile');
  await expect(page.getByRole('img', { name: 'STEVEN BARASH' })).toHaveAttribute(
    'src',
    /profile-portrait\.png/,
  );
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
    page.locator('[data-home-hero]').getByRole('link', { name: 'View experience', exact: true }),
    page.locator('[data-home-hero]').getByRole('link', { name: 'Get in touch', exact: true }),
    page.getByRole('navigation', { name: 'Social profiles' }).getByRole('link', { name: /^X\b/ }),
    page.getByRole('navigation', { name: 'Social profiles' }).getByRole('link', { name: /^GitHub\b/ }),
    page.locator('[data-home-contact] a[href^="mailto:"]'),
    page.getByRole('link', { name: 'Start the Windows 95 experience', exact: true }),
    ...['/', '/resume', '/photos', '/contact'].map((href) =>
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
  for (const href of ['/resume', '/photos', '/contact', '/']) {
    const link = nav.locator(`a[href="${href}"]`);
    await expect(link).toBeInViewport();
    await link.click();
    await expect(page).toHaveURL(href);
    await expect(link).toHaveAttribute('aria-current', 'page');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
});


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
