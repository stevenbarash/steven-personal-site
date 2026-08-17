import { expect, test, type Locator, type Page } from '@playwright/test';

const expectMenuItems = async (menu: Locator, labels: string[]) => {
  await expect(menu.getByRole('menuitem')).toHaveText(labels);
};

const settleClientFrames = async (page: Page) => {
  await page.evaluate(() => new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  }));
};

test('top menu labels open coherent dropdowns instead of navigating directly', async ({ page }) => {
  await page.goto('/?app=projects');
  const menubar = page.getByRole('menubar');

  await expect(menubar.getByRole('menuitem', { name: 'Edit', exact: true })).toHaveCount(0);

  await menubar.getByRole('menuitem', { name: 'File', exact: true }).click();
  await expectMenuItems(page.getByRole('menu', { name: 'File' }), [
    'Home',
    'Close Window',
    'Shut Down...',
  ]);
  await expect(page).toHaveURL('/?app=projects');

  await menubar.getByRole('menuitem', { name: 'View', exact: true }).click();
  await expectMenuItems(page.getByRole('menu', { name: 'View' }), [
    'My Computer',
    'Projects',
    'Resume',
    'Photography',
    'Internet',
    'MS-DOS Prompt',
  ]);
  await expect(page).toHaveURL('/?app=projects');

  await menubar.getByRole('menuitem', { name: 'Help', exact: true }).click();
  await expectMenuItems(page.getByRole('menu', { name: 'Help' }), [
    'Help Topics',
    'About This Site',
  ]);
  await expect(page).toHaveURL('/?app=projects');
});

test('Help and About This Site open their own focused windows', async ({ page }) => {
  await page.goto('/?app=projects');
  const menubar = page.getByRole('menubar');

  await menubar.getByRole('menuitem', { name: 'Help', exact: true }).click();
  await page.getByRole('menu', { name: 'Help' }).getByRole('menuitem', { name: 'Help Topics' }).click();
  await expect(page).toHaveURL('/?app=help');
  await expect(page.locator('.win95-title-bar').getByText('HELP - Using This Site', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Using this desktop' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'STEVEN BARASH', exact: true })).toHaveCount(0);

  await page.getByRole('menubar').getByRole('menuitem', { name: 'Help', exact: true }).click();
  await page.getByRole('menu', { name: 'Help' }).getByRole('menuitem', { name: 'About This Site' }).click();
  await expect(page).toHaveURL('/?app=about-site');
  await expect(page.locator('.win95-title-bar').getByText('ABOUT - This Site', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About this site' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'STEVEN BARASH', exact: true })).toHaveCount(0);
});

test('File and View commands perform the actions their labels promise', async ({ page }) => {
  await page.goto('/?app=projects');

  await page.getByRole('menubar').getByRole('menuitem', { name: 'View', exact: true }).click();
  await page.getByRole('menu', { name: 'View' }).getByRole('menuitem', { name: 'Resume' }).click();
  await expect(page).toHaveURL('/?app=resume');
  await expect(page.locator('.win95-title-bar').getByText('RESUME.DOC - WordPad', { exact: true })).toBeVisible();

  await page.getByRole('menubar').getByRole('menuitem', { name: 'File', exact: true }).click();
  await page.getByRole('menu', { name: 'File' }).getByRole('menuitem', { name: 'Close Window' }).click();
  await expect(page.locator('.win95-title-bar')).toHaveCount(0);
  await expect(page).toHaveURL('/?app=resume');

  await page.getByRole('button', { name: 'Open My Computer' }).press('Enter');
  await expect(page).toHaveURL('/');
  await expect(page.locator('.win95-title-bar').getByText('STEVEN.EXE - Personal Site', { exact: true })).toBeVisible();
});

test('Photography opens its page and the menus retain their targets across routes', async ({ page }) => {
  await page.goto('/?app=projects');

  await page.getByRole('menubar').getByRole('menuitem', { name: 'View', exact: true }).click();
  await page.getByRole('menu', { name: 'View' }).getByRole('menuitem', { name: 'Photography' }).click();
  await expect(page).toHaveURL('/photos');
  await expect(page.locator('.win95-title-bar').getByText('PHOTOS.EXE - Photography Explorer', { exact: true })).toBeVisible();

  await page.getByRole('menubar').getByRole('menuitem', { name: 'View', exact: true }).click();
  await page.getByRole('menu', { name: 'View' }).getByRole('menuitem', { name: 'Projects' }).click();
  await expect(page).toHaveURL('/?app=projects');
  await expect(page.locator('.win95-title-bar').getByText('PROJECTS - Windows Explorer', { exact: true })).toBeVisible();
});

test('Photography window controls persist until the user restores or reopens the window', async ({ page }) => {
  await page.goto('/photos');
  const title = page.locator('.win95-title-bar').getByText('PHOTOS.EXE - Photography Explorer', { exact: true });

  await page.getByRole('button', { name: 'Minimize window' }).click();
  await settleClientFrames(page);
  await expect(title).not.toBeVisible();

  await page.getByRole('button', { name: 'PHOTOS.EXE', exact: true }).click();
  await expect(title).toBeVisible();

  await page.getByRole('button', { name: 'Maximize window' }).click();
  await settleClientFrames(page);
  await expect(page.getByRole('button', { name: 'Restore window' })).toBeVisible();
  await expect(page.locator('.win95-window-frame')).toHaveClass(/win95-window-frame--maximized/);

  await page.getByRole('button', { name: 'Restore window' }).click();
  await expect(page.getByRole('button', { name: 'Maximize window' })).toBeVisible();

  await page.getByRole('button', { name: 'Close window' }).click();
  await settleClientFrames(page);
  await expect(title).not.toBeVisible();

  await page.getByRole('button', { name: 'Start menu' }).click();
  await page.getByRole('menu', { name: 'Start' }).getByRole('menuitem', { name: 'Photography' }).click();
  await expect(title).toBeVisible();
});

test('dropdown menus support Alt mnemonics, arrow keys, Escape, and Enter', async ({ page }) => {
  await page.goto('/?app=projects');

  const helpTrigger = page.getByRole('menubar').getByRole('menuitem', { name: 'Help', exact: true });
  const helpMenu = page.getByRole('menu', { name: 'Help' });
  const helpTopics = helpMenu.getByRole('menuitem', { name: 'Help Topics' });
  const aboutSite = helpMenu.getByRole('menuitem', { name: 'About This Site' });
  await helpTrigger.focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('menubar').getByRole('menuitem', { name: 'File', exact: true })).toBeFocused();
  await page.keyboard.press('Alt+h');
  await expect(helpTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(helpTopics).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(aboutSite).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(helpMenu).not.toBeVisible();
  await expect(helpTrigger).toBeFocused();
  await expect(page).toHaveURL('/?app=projects');

  await page.keyboard.press('Enter');
  await expect(helpTopics).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/?app=about-site');
});

test('dropdown arrow navigation moves DOM focus before the next key can act', async ({ page }) => {
  await page.goto('/?app=projects');

  await page.getByRole('menubar').getByRole('menuitem', { name: 'Help', exact: true }).click();
  await expect(page.getByRole('menu', { name: 'Help' }).getByRole('menuitem', { name: 'Help Topics' })).toBeFocused();

  const activeLabelAfterArrowDown = await page.evaluate(() => {
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    }));

    return document.activeElement?.textContent?.trim();
  });

  expect(activeLabelAfterArrowDown).toBe('About This Site');
});

test('Start-menu Help opens Help, not the biography', async ({ page }) => {
  await page.goto('/?app=profile');
  await page.getByRole('button', { name: 'Start menu' }).click();
  await page.getByRole('menu', { name: 'Start' }).getByRole('menuitem', { name: 'Help' }).click();

  await expect(page).toHaveURL('/?app=help');
  await expect(page.locator('.win95-title-bar').getByText('HELP - Using This Site', { exact: true })).toBeVisible();
  await expect(page.locator('.win95-title-bar').getByText('ABOUT.EXE - About Me', { exact: true })).toHaveCount(0);
});

test('coarse-pointer dropdown rows are independent 44px touch targets', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/?app=resume');

  await page.getByRole('menubar').getByRole('menuitem', { name: 'View', exact: true }).tap();
  const rows = await page.getByRole('menu', { name: 'View' }).getByRole('menuitem').all();
  const boxes = await Promise.all(rows.map((row) => row.boundingBox()));
  for (let index = 0; index < boxes.length; index += 1) {
    expect(boxes[index]).not.toBeNull();
    expect(boxes[index]!.width).toBeGreaterThanOrEqual(44);
    expect(boxes[index]!.height).toBeGreaterThanOrEqual(44);
    if (index > 0) {
      expect(boxes[index - 1]!.y + boxes[index - 1]!.height).toBeLessThanOrEqual(boxes[index]!.y);
    }
  }

  const projects = page.getByRole('menu', { name: 'View' }).getByRole('menuitem', { name: 'Projects' });
  const projectBox = await projects.boundingBox();
  expect(projectBox).not.toBeNull();
  await page.touchscreen.tap(
    Math.round(projectBox!.x + projectBox!.width - 2),
    Math.round(projectBox!.y + projectBox!.height / 2),
  );
  await expect(page).toHaveURL('/?app=projects');
  await expect(page.locator('.win95-title-bar').getByText('PROJECTS - Windows Explorer', { exact: true })).toBeVisible();
  await expect(page.getByRole('menu', { name: 'View' })).not.toBeVisible();

  await context.close();
});
