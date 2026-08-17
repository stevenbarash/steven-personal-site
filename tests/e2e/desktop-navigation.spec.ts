import { expect, test } from '@playwright/test';

const projectsTitle = 'PROJECTS - Windows Explorer';
const computerTitle = 'STEVEN.EXE - Personal Site';

const expandedHitRegion = async (locator: import('@playwright/test').Locator) => locator.evaluate((element) => {
  const box = element.getBoundingClientRect();
  const pseudo = window.getComputedStyle(element, '::before');
  const width = Number.parseFloat(pseudo.width);
  const height = Number.parseFloat(pseudo.height);
  return { x: box.left + (box.width - width) / 2, y: box.top + (box.height - height) / 2, width, height };
});

const intersects = (first: { x: number; y: number; width: number; height: number }, second: { x: number; y: number; width: number; height: number }) => (
  first.x < second.x + second.width
  && first.x + first.width > second.x
  && first.y < second.y + second.height
  && first.y + first.height > second.y
);

test('cold app query opens only the requested Projects window', async ({ page }) => {
  await page.goto('/?app=projects');

  await expect(page.getByText(projectsTitle, { exact: true })).toBeVisible();
  await expect(page.getByText(computerTitle, { exact: true })).not.toBeVisible();
  await expect(page.getByText('My Projects', { exact: true })).toBeVisible();
});

test('a recognized legacy section hash opens the app and canonicalizes the URL', async ({ page }) => {
  await page.goto('/?source=legacy#section-projects');

  await expect(page).toHaveURL('/?source=legacy&app=projects');
  await expect(page.getByText(projectsTitle, { exact: true })).toBeVisible();
});

test('launching an app writes its canonical query while preserving unrelated parameters', async ({ page }) => {
  await page.goto('/?source=regression');

  await page.getByLabel('Open My Projects').dblclick();

  await expect(page).toHaveURL('/?source=regression&app=projects');
  await expect(page.getByText(projectsTitle, { exact: true })).toBeVisible();
});

test('Home clears only the app query parameter', async ({ page }) => {
  await page.goto('/?source=regression&app=projects');

  await page.getByLabel('Start menu').click();
  await page.getByRole('menuitem', { name: 'Home' }).click();

  await expect(page).toHaveURL('/?source=regression');
  await expect(page.getByText(computerTitle, { exact: true })).toBeVisible();
});

test('browser history restores My Computer and the focused app', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Open My Projects').dblclick();
  await expect(page).toHaveURL('/?app=projects');

  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByText(computerTitle, { exact: true })).toBeVisible();

  await page.goForward();
  await expect(page).toHaveURL('/?app=projects');
  await expect(page.getByText(projectsTitle, { exact: true })).toBeVisible();
});

test('an unknown app query falls back to My Computer', async ({ page }) => {
  await page.goto('/?source=regression&app=not-a-real-program');

  await expect(page).toHaveURL('/?source=regression');
  await expect(page.getByText(computerTitle, { exact: true })).toBeVisible();
  await expect(page.getByText(projectsTitle, { exact: true })).not.toBeVisible();
});

test('desktop double-click and Enter open the intended isolated app', async ({ page }) => {
  await page.goto('/');
  const projectsShortcut = page.getByLabel('Open My Projects');

  await projectsShortcut.dblclick();
  await expect(page).toHaveURL('/?app=projects');
  await expect(page.getByText(projectsTitle, { exact: true })).toBeVisible();

  await page.goBack();
  await projectsShortcut.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/?app=projects');
  await expect(page.getByText(projectsTitle, { exact: true })).toBeVisible();
});

test('a real mobile tap opens Start once and creates exactly one application-history entry', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();

  await page.goto('/');
  const historyBeforeStart = await page.evaluate(() => window.history.length);
  await page.getByLabel('Start menu').tap();
  await expect(page.getByLabel('Start menu')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitem', { name: 'My Projects' })).toBeVisible();
  expect(await page.evaluate(() => window.history.length)).toBe(historyBeforeStart);

  await page.getByRole('menuitem', { name: 'My Projects' }).tap();

  await expect(page).toHaveURL('/?app=projects');
  await expect(page.getByText(projectsTitle, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.history.length)).toBe(historyBeforeStart + 1);
  await context.close();
});

test('coarse-pointer adjacent controls have disjoint expanded hit regions', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/');

  for (const controls of [
    page.getByRole('button', { name: /window$/ }),
    page.getByRole('menuitem'),
    page.locator('.win95-tab'),
  ]) {
    const regions = await Promise.all((await controls.all()).map(expandedHitRegion));
    for (let index = 1; index < regions.length; index += 1) {
      expect(intersects(regions[index - 1], regions[index])).toBe(false);
    }
  }

  await context.close();
});

test('coarse-pointer menu and tab faces remain content-sized inside 44px targets', async ({ browser }) => {
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('/');
  const [nativeFileBox, nativeResumeBox] = await Promise.all([
    desktopPage.getByRole('menuitem', { name: 'File' }).boundingBox(),
    desktopPage.getByRole('tab', { name: 'Resume', exact: true }).boundingBox(),
  ]);

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/');

  const fileTarget = page.getByRole('menuitem', { name: 'File' });
  const fileFace = page.locator('.win95-menu-item-face').filter({ hasText: 'File' });
  await expect(fileFace).toHaveCount(1);
  const [fileTargetBox, fileFaceBox] = await Promise.all([fileTarget.boundingBox(), fileFace.boundingBox()]);
  expect(fileTargetBox!.width).toBeGreaterThanOrEqual(44);
  expect(fileFaceBox!.width).toBeLessThan(44);
  expect(fileFaceBox!.width).toBeCloseTo(nativeFileBox!.width, 1);

  const resumeTarget = page.getByRole('tab', { name: 'Resume', exact: true });
  const resumeFace = page.locator('.win95-tab-face').filter({ hasText: 'Resume' });
  await expect(resumeFace).toHaveCount(1);
  const [resumeTargetBox, resumeFaceBox] = await Promise.all([resumeTarget.boundingBox(), resumeFace.boundingBox()]);
  expect(resumeTargetBox!.width).toBeGreaterThanOrEqual(44);
  expect(resumeFaceBox!.width).toBeCloseTo(nativeResumeBox!.width, 1);
  expect(resumeFaceBox!.width).toBeLessThanOrEqual(resumeTargetBox!.width);

  await desktopContext.close();
  await context.close();
});

test('embedded Resume tabs retain independent coarse targets and edge ownership', async ({ browser }) => {
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('/');
  await desktopPage.getByRole('tab', { name: 'Resume', exact: true }).click();
  const nativeExperienceBox = await desktopPage
    .getByRole('tablist', { name: 'Resume sections' })
    .getByRole('tab', { name: 'Experience', exact: true })
    .boundingBox();

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('tab', { name: 'Resume', exact: true }).click();

  const embeddedTabs = page
    .getByRole('tablist', { name: 'Resume sections' })
    .getByRole('tab');
  await expect(embeddedTabs).toHaveCount(4);
  const regions = await Promise.all((await embeddedTabs.all()).map(expandedHitRegion));
  for (let index = 0; index < regions.length; index += 1) {
    expect(regions[index].width).toBeGreaterThanOrEqual(44);
    expect(regions[index].height).toBeGreaterThanOrEqual(44);
    if (index > 0) expect(intersects(regions[index - 1], regions[index])).toBe(false);
  }

  const experience = embeddedTabs.filter({ hasText: 'Experience' });
  const experienceFace = experience.locator('.win95-tab-face');
  const [experienceBox, experienceFaceBox] = await Promise.all([
    experience.boundingBox(),
    experienceFace.boundingBox(),
  ]);
  expect(experienceFaceBox!.width).toBeCloseTo(nativeExperienceBox!.width, 1);
  expect(experienceFaceBox!.height).toBeCloseTo(nativeExperienceBox!.height, 1);
  expect(experienceFaceBox!.width).toBeLessThanOrEqual(experienceBox!.width);
  expect(experienceFaceBox!.height).toBeLessThanOrEqual(experienceBox!.height);

  const education = page.getByRole('tab', { name: 'Education', exact: true });
  const skills = page.getByRole('tab', { name: 'Skills', exact: true });
  const [educationRegion, skillsRegion] = await Promise.all([
    expandedHitRegion(education),
    expandedHitRegion(skills),
  ]);

  await page.mouse.click(
    educationRegion.x + educationRegion.width - 2,
    educationRegion.y + educationRegion.height / 2,
  );
  await expect(education).toHaveAttribute('aria-selected', 'true');
  await page.mouse.click(skillsRegion.x + 2, skillsRegion.y + skillsRegion.height / 2);
  await expect(skills).toHaveAttribute('aria-selected', 'true');

  await desktopContext.close();
  await context.close();
});

test('coarse-pointer expanded edges activate their adjacent title, menu, and tab owners', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();

  await page.goto('/');
  const minimizeRegion = await expandedHitRegion(page.getByRole('button', { name: 'Minimize window' }));
  await page.mouse.click(minimizeRegion.x + 2, minimizeRegion.y + minimizeRegion.height / 2);
  await expect(page.getByRole('button', { name: 'Minimize window' })).not.toBeVisible();

  await page.goto('/?app=projects');
  const fileTrigger = page.getByRole('menubar').getByRole('menuitem', { name: 'File' });
  const fileRegion = await expandedHitRegion(fileTrigger);
  await page.mouse.click(fileRegion.x + 2, fileRegion.y + fileRegion.height / 2);
  await expect(fileTrigger).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('menu', { name: 'File' }).getByRole('menuitem', { name: 'Home' }).click();
  await expect(page).toHaveURL('/');

  const resumeTabRegion = await expandedHitRegion(page.getByRole('tab', { name: 'Resume', exact: true }));
  await page.mouse.click(resumeTabRegion.x + resumeTabRegion.width - 2, resumeTabRegion.y + resumeTabRegion.height / 2);
  await expect(page.getByRole('tab', { name: 'Resume', exact: true })).toHaveClass(/active/);

  await context.close();
});

test('coarse-pointer controls expose 44px hit areas while preserving Win95 chrome dimensions', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();

  await page.goto('/');
  const computerControls = [
    page.locator('#start-button'),
    page.locator('.win95-task-btn'),
    page.getByRole('button', { name: 'Minimize window' }),
    page.getByRole('button', { name: 'Maximize window' }),
    page.getByRole('button', { name: 'Close window' }),
    page.getByRole('menuitem'),
    page.locator('.win95-tab'),
  ];

  for (const controls of computerControls) {
    for (const control of await controls.all()) {
      const hitArea = await control.evaluate((element) => {
        const pseudo = window.getComputedStyle(element, '::before');
        return { width: Number.parseFloat(pseudo.width), height: Number.parseFloat(pseudo.height) };
      });
      expect(hitArea.width).toBeGreaterThanOrEqual(44);
      expect(hitArea.height).toBeGreaterThanOrEqual(44);
    }
  }

  await page.goto('/?app=resume');
  for (const resumeTab of await page.locator('.win95-tab').all()) {
    const hitArea = await resumeTab.evaluate((element) => {
      const pseudo = window.getComputedStyle(element, '::before');
      return { width: Number.parseFloat(pseudo.width), height: Number.parseFloat(pseudo.height) };
    });
    expect(hitArea.width).toBeGreaterThanOrEqual(44);
    expect(hitArea.height).toBeGreaterThanOrEqual(44);
  }

  const [startBox, taskBox, titleFaceBox, menuFaceBox, tabFaceBox] = await Promise.all([
    page.locator('#start-button').boundingBox(),
    page.locator('.win95-task-btn').boundingBox(),
    page.locator('.win95-title-btn-face').first().boundingBox(),
    page.locator('.win95-menu-item-face').filter({ hasText: 'File' }).boundingBox(),
    page.locator('.win95-tab-face').first().boundingBox(),
  ]);
  expect(startBox!.height).toBeLessThanOrEqual(23);
  expect(taskBox!.height).toBeLessThanOrEqual(22);
  expect(titleFaceBox!.width).toBeLessThanOrEqual(16);
  expect(titleFaceBox!.height).toBeLessThanOrEqual(14);
  expect(menuFaceBox!.height).toBeLessThanOrEqual(23);
  expect(tabFaceBox!.height).toBeLessThanOrEqual(28);

  await page.mouse.click(startBox!.x + startBox!.width / 2, startBox!.y - 8);
  await expect(page.getByLabel('Start menu')).toHaveAttribute('aria-expanded', 'true');

  const icon = page.locator('#start-button img');
  await expect(icon).toHaveCSS('width', '16px');
  await expect(icon).toHaveCSS('height', '16px');
  await context.close();
});
