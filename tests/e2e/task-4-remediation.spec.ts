import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

declare global {
  interface Window {
    __scrollIntoViewCalls: ScrollIntoViewOptions[];
  }
}

const contrastRatio = (foreground: string, background: string) => {
  const channels = (value: string) => value.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
  const luminance = (value: string) => {
    const [red, green, blue] = channels(value).map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

const expectResumeMetadataContrast = async (page: Page, text: string) => {
  const metadata = page.getByText(text, { exact: true });
  const colors = await metadata.evaluate((element) => {
    let backgroundElement: Element | null = element.parentElement;
    while (backgroundElement && getComputedStyle(backgroundElement).backgroundColor === 'rgba(0, 0, 0, 0)') {
      backgroundElement = backgroundElement.parentElement;
    }
    return {
      foreground: getComputedStyle(element).color,
      background: getComputedStyle(backgroundElement ?? document.body).backgroundColor,
    };
  });

  expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
};

const openShutdownDialogFromKeyboard = async (page: Page) => {
  await page.getByLabel('Start menu').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu', { name: 'Start' }).getByRole('menuitem', { name: 'My Computer' })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  const restart = page.getByRole('button', { name: 'Restart computer' });
  await expect(restart).toBeFocused();
  return restart;
};

const box = async (locator: Locator) => {
  const result = await locator.boundingBox();
  expect(result).not.toBeNull();
  return result!;
};

test('Resume date metadata has readable rendered contrast when launched and directly loaded', async ({ page }) => {
  await page.goto('/desktop');
  await page.getByRole('link', { name: 'Open Resume', exact: true }).click();
  await expectResumeMetadataContrast(page, 'January 2025 to Present');
  await page.getByRole('tablist', { name: 'Resume sections' }).getByRole('tab', { name: 'Education' }).click();
  await expectResumeMetadataContrast(page, '2016 to 2020');

  await page.goto('/desktop?app=resume');
  await expectResumeMetadataContrast(page, 'January 2025 to Present');
  await page.getByRole('tab', { name: 'Education' }).click();
  await expectResumeMetadataContrast(page, '2016 to 2020');
});

test('shutdown is a keyboard-operable dialog that returns focus to Start after Enter, Space, or Escape', async ({ page }) => {
  await page.goto('/desktop');

  for (const key of ['Enter', 'Space', 'Escape']) {
    await openShutdownDialogFromKeyboard(page);
    await expect(page.getByRole('dialog', { name: 'Shut down computer' })).toBeVisible();
    await page.keyboard.press(key);
    await expect(page.getByRole('dialog', { name: 'Shut down computer' })).not.toBeVisible();
    await expect(page.getByLabel('Start menu')).toBeFocused();
  }
});

test('shutdown Restart control renders a readable visible label', async ({ page }) => {
  await page.goto('/desktop');
  const restart = await openShutdownDialogFromKeyboard(page);
  await expect(restart).toBeVisible();
  await expect(restart).toHaveText('Restart');

  const colors = await restart.evaluate((element) => ({
    foreground: getComputedStyle(element).color,
    background: getComputedStyle(element).backgroundColor,
  }));
  expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
});

test('shutdown makes the desktop inert and traps Tab focus until Escape restarts', async ({ page }) => {
  await page.goto('/desktop');
  const restart = await openShutdownDialogFromKeyboard(page);

  await expect.poll(() => page.locator('main').evaluate((element) => (element as HTMLElement).inert)).toBe(true);
  await expect.poll(() => page.locator('.win95-taskbar').evaluate((element) => (element as HTMLElement).inert)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(restart).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(restart).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Shut down computer' })).not.toBeVisible();
  await expect.poll(() => page.locator('main').evaluate((element) => (element as HTMLElement).inert)).toBe(false);
  await expect.poll(() => page.locator('.win95-taskbar').evaluate((element) => (element as HTMLElement).inert)).toBe(false);
  await expect(page.getByLabel('Start menu')).toBeFocused();
});

test('coarse Start-menu rows are 44px non-overlapping targets whose edge taps reach their owner', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/desktop');
  await page.getByLabel('Start menu').tap();

  const rows = page.getByRole('menu', { name: 'Start' }).getByRole('menuitem');
  const rowBoxes = await Promise.all((await rows.all()).map(box));
  for (let index = 0; index < rowBoxes.length; index += 1) {
    expect(rowBoxes[index].width).toBeGreaterThanOrEqual(44);
    expect(rowBoxes[index].height).toBeGreaterThanOrEqual(44);
    const icon = rows.nth(index).locator('img.win95-start-menu-icon');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveCSS('width', '32px');
    await expect(icon).toHaveCSS('height', '32px');
    if (index > 0) {
      expect(rowBoxes[index - 1].y + rowBoxes[index - 1].height).toBeLessThanOrEqual(rowBoxes[index].y);
    }
  }

  const outcomes = [
    { label: 'My Computer', startPath: '/desktop?app=projects', targetPath: '/desktop', title: 'STEVEN.EXE - Personal Site' },
    { label: 'About Me', startPath: '/desktop?app=terminal', targetPath: '/desktop?app=profile', title: 'ABOUT.EXE - About Me' },

    { label: 'Projects', startPath: '/desktop?app=profile', targetPath: '/desktop?app=projects', title: 'PROJECTS - Project Explorer' },
    { label: 'Resume', startPath: '/desktop?app=terminal', targetPath: '/desktop?app=resume', title: 'RESUME.DOC - WordPad' },
    { label: 'Photography', startPath: '/desktop?app=projects', targetPath: '/desktop?app=photos', title: 'PHOTOS.EXE - Photography Explorer' },
    { label: 'Contact', startPath: '/desktop?app=projects', targetPath: '/desktop?app=explorer', title: 'CONTACTS - Internet Explorer' },
    { label: 'Command Prompt', startPath: '/desktop?app=profile', targetPath: '/desktop?app=terminal', title: 'MS-DOS Prompt' },
    { label: 'Help', startPath: '/desktop?app=resume', targetPath: '/desktop?app=help', title: 'HELP - Using This Site' },
    { label: 'Shut Down...', startPath: '/desktop?app=profile' },
  ];
  for (const outcome of outcomes) {
    await page.goto(outcome.startPath);
    if (outcome.label === 'My Computer') {
      await expect(page.locator('.win95-title-bar').getByText('PROJECTS - Project Explorer', { exact: true })).toBeVisible();
    }
    await page.getByLabel('Start menu').tap();
    const row = page.getByRole('menu', { name: 'Start' }).getByRole('menuitem', { name: outcome.label });
    const rowBox = await box(row);
    await page.touchscreen.tap(Math.round(rowBox.x + rowBox.width - 2), Math.round(rowBox.y + rowBox.height / 2));
    if (outcome.label === 'Shut Down...') {
      await expect(page.getByRole('dialog', { name: 'Shut down computer' })).toBeVisible();
      await page.keyboard.press('Escape');
    } else {
      await expect(page).toHaveURL(outcome.targetPath!);
      await expect(page.locator('.win95-title-bar').getByText(outcome.title!, { exact: true })).toBeVisible();
      if (outcome.label === 'My Computer') {
        await expect(page.locator('.win95-title-bar').getByText('PROJECTS - Project Explorer', { exact: true })).not.toBeVisible();
      }
    }
  }
  await context.close();
});

test('menubar uses roving focus with arrows, Home, End, and retained Alt mnemonics', async ({ page }) => {
  await page.goto('/desktop?app=projects');
  const menu = page.getByRole('menubar');
  const file = menu.getByRole('menuitem', { name: 'File' });
  const view = menu.getByRole('menuitem', { name: 'View' });
  const help = menu.getByRole('menuitem', { name: 'Help' });

  await expect(file).toHaveAttribute('tabindex', '0');
  await expect(view).toHaveAttribute('tabindex', '-1');
  await file.focus();
  await page.keyboard.press('ArrowRight');
  await expect(view).toBeFocused();
  await expect(view).toHaveAttribute('tabindex', '0');
  await page.keyboard.press('End');
  await expect(help).toBeFocused();
  await page.keyboard.press('Home');
  await expect(file).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(help).toBeFocused();

  await page.keyboard.press('Alt+f');
  await expect(file).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menu', { name: 'File' }).getByRole('menuitem', { name: 'Home' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(file).toBeFocused();
  await expect(page).toHaveURL('/desktop?app=projects');
});

test('Escape closes Start and restores focus to its button', async ({ page }) => {
  await page.goto('/desktop');
  await page.getByLabel('Start menu').click();
  await expect(page.getByRole('menuitem', { name: 'My Computer' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Start menu')).toBeFocused();
});

test('terminal is labeled as a read-only transcript with no false input cursor', async ({ page }) => {
  await page.goto('/desktop?app=terminal');

  await expect(page.getByText('Command Prompt: Read-only transcript', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Command Prompt transcript (read-only)' })).toBeVisible();
  await expect(page.locator('.win95-terminal [class*="animate-pulse"]')).toHaveCount(0);
});

test('reduced motion navigation opens apps without smooth scrolling', async ({ page }) => {
  await page.addInitScript(() => {
    const calls: ScrollIntoViewOptions[] = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function scrollIntoView(options?: boolean | ScrollIntoViewOptions) {
      if (typeof options === 'object') calls.push(options);
      return original.call(this, options);
    };
    Object.defineProperty(window, '__scrollIntoViewCalls', { value: calls });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/desktop');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await page.getByRole('menubar').getByRole('menuitem', { name: 'View' }).click();
  await page.getByRole('menu', { name: 'View' }).getByRole('menuitem', { name: 'Projects' }).click();
  await expect(page).toHaveURL('/desktop?app=projects');
  expect(await page.evaluate(() => window.__scrollIntoViewCalls)).not.toContainEqual({ behavior: 'smooth', block: 'start' });
});

test('Open Graph image contains no Windows command prompt', async () => {
  const source = await readFile(resolve(process.cwd(), 'src/app/opengraph-image.tsx'), 'utf8');
  expect(source).not.toMatch(/C:\\STEVEN|commandPrompt|STEVEN\.EXE|Identity Work/i);
  expect(source).toContain('Senior Solutions Engineer at Descope');
});
