import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteConfig } from '../../src/constants/site';

const resumeTabs = ['Experience', 'Education', 'Skills', 'Honors'];

const expectTabRelationships = async (
  page: Page,
  tablist: Locator,
  labels: string[],
) => {
  const tabs = tablist.getByRole('tab');

  await expect(tabs).toHaveCount(labels.length);
  const ids = await Promise.all(labels.map(async (label, index) => {
    const tab = tabs.nth(index);
    const id = await tab.getAttribute('id');
    const panelId = await tab.getAttribute('aria-controls');

    await expect(tab).toHaveAccessibleName(label);
    await expect(tab).toHaveAttribute('aria-selected', index === 0 ? 'true' : 'false');
    await expect(tab).toHaveAttribute('tabindex', index === 0 ? '0' : '-1');
    expect(id).toBeTruthy();
    expect(panelId).toBeTruthy();

    const panel = page.locator(`[id="${panelId}"]`);
    await expect(panel).toHaveAttribute('role', 'tabpanel');
    await expect(panel).toHaveAttribute('aria-labelledby', id!);
    return id!;
  }));

  expect(new Set(ids).size).toBe(labels.length);
};

const expectResumeTabKeyboardNavigation = async (page: Page, tablist: Locator) => {
  const experience = tablist.getByRole('tab', { name: 'Experience' });
  const honors = tablist.getByRole('tab', { name: 'Honors' });

  await experience.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(honors).toBeFocused();
  await expect(honors).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Awards & Honors', { exact: true })).toBeVisible();

  await page.keyboard.press('ArrowRight');
  await expect(experience).toBeFocused();
  await expect(experience).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('End');
  await expect(honors).toBeFocused();
  await expect(honors).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Home');
  await expect(experience).toBeFocused();
  await expect(experience).toHaveAttribute('aria-selected', 'true');
};

test('My Computer opens the focused Resume app with linked, roving tabs', async ({ page }) => {
  await page.goto('/desktop');
  await page.getByRole('link', { name: 'Open Resume', exact: true }).click();
  await expect(page).toHaveURL('/desktop?app=resume');
  const embeddedResumeTabs = page.getByRole('tablist', { name: 'Resume sections' });
  await expectTabRelationships(page, embeddedResumeTabs, resumeTabs);
  await expectResumeTabKeyboardNavigation(page, embeddedResumeTabs);
  await expect(page.locator('img[src="/images/logos/descope.png"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Descope', exact: true })).toHaveAttribute('href', 'https://www.descope.com');
});

test('focused Resume app exposes the same linked, roving resume tabs', async ({ page }) => {
  await page.goto('/desktop?app=resume');

  const focusedResumeTabs = page.getByRole('tablist', { name: 'Resume sections' });
  await expectTabRelationships(page, focusedResumeTabs, resumeTabs);
  await expectResumeTabKeyboardNavigation(page, focusedResumeTabs);
  await expect(page.locator('img[src="/images/logos/descope.png"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Descope', exact: true })).toHaveAttribute('href', 'https://www.descope.com');
});

test('resume website link displays the canonical destination hostname', async ({ page }) => {
  await page.goto('/desktop?app=resume');

  const expectedHostname = new URL(siteConfig.canonicalOrigin).hostname;
  const websiteLink = page.getByRole('link', { name: expectedHostname, exact: true });
  await expect(websiteLink).toBeVisible();
  await expect(websiteLink).toHaveAttribute('href', siteConfig.canonicalOrigin);
});

test('ProjectsSection delegates resume panels to ResumeSection', async () => {
  const source = await readFile(resolve(process.cwd(), 'src/components/ui/win95/ProjectsSection.tsx'), 'utf8');

  expect(source).toContain("import { ResumeSection } from './ResumeSection';");
  expect(source).not.toMatch(/\b(?:ResumeContent|ExperiencePanel|EducationPanel|SkillsPanel|HonorsPanel)\b/);
});
