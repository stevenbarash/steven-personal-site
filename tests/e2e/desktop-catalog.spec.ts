import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { desktopAppCatalog, getAppsForPlacement } from '../../src/features/desktop/app-catalog';
import {
  HELP_MENU_APP_IDS,
  START_MENU_ITEMS,
  getAppByLegacyAppId,
  getAppByLegacySectionId,
  getNavigationTarget,
} from '../../src/features/desktop/navigation';

const expectedLegacyMatrix = [
  ['profile', 'section-profile', 'profile', '/desktop?app=profile', { path: '/desktop', sectionId: 'section-profile' }],
  ['projects', 'section-projects', 'projects', '/desktop?app=projects', { path: '/desktop', sectionId: 'section-projects' }],
  ['explorer', 'section-explorer', 'contact', '/desktop?app=explorer', { path: '/desktop', sectionId: 'section-explorer' }],
  ['terminal', 'section-terminal', 'terminal', '/desktop?app=terminal', { path: '/desktop', sectionId: 'section-terminal' }],
  ['resume', 'section-resume', 'resume', '/desktop?app=resume', { path: '/desktop', sectionId: 'section-resume' }],
  ['help', 'section-help', 'help', '/desktop?app=help', { path: '/desktop', sectionId: 'section-help' }],
  ['about-site', 'section-about-site', 'about-site', '/desktop?app=about-site', { path: '/desktop', sectionId: 'section-about-site' }],
] as const;

test('desktop application catalog is serializable and has unique navigation identities', () => {
  expect(() => JSON.stringify(desktopAppCatalog)).not.toThrow();
  expect(JSON.parse(JSON.stringify(desktopAppCatalog))).toEqual(desktopAppCatalog);

  for (const key of ['id', 'href', 'legacyAppId', 'legacySectionId'] as const) {
    const values = desktopAppCatalog.flatMap((app) => app[key] ? [app[key]] : []);
    expect(new Set(values).size, `${key} values`).toBe(values.length);
  }
});

test('every placement resolves in the Phase 2 hierarchy and exact labels', () => {
  expect(getAppsForPlacement('desktop').map(({ id, placement }) => [id, placement.label])).toEqual([
    ['home', 'My Computer'],
    ['projects', 'Projects'],
    ['resume', 'Resume'],
    ['photos', 'Photography'],
    ['contact', 'Contact'],
  ]);
  expect(getAppsForPlacement('start').map(({ id, placement }) => [id, placement.label])).toEqual([
    ['home', 'My Computer'],
    ['profile', 'About Me'],
    ['projects', 'Projects'],
    ['resume', 'Resume'],
    ['photos', 'Photography'],
    ['contact', 'Contact'],
    ['terminal', 'Command Prompt'],
    ['help', 'Help'],
  ]);
  expect(getAppsForPlacement('view-menu').map(({ id, placement }) => [id, placement.label])).toEqual([
    ['home', 'My Computer'],
    ['projects', 'Projects'],
    ['resume', 'Resume'],
    ['photos', 'Photography'],
    ['contact', 'Contact'],
    ['profile', 'About Me'],
    ['terminal', 'Command Prompt'],
  ]);
  expect(getAppsForPlacement('home').map(({ id }) => id)).toEqual([
    'projects', 'resume', 'photos', 'contact',
    'profile', 'terminal', 'help',
  ]);
});

test('Start and Help menu structure follows the approved hierarchy through app IDs', () => {
  expect(START_MENU_ITEMS).toEqual([
    { type: 'app', appId: 'home' },
    { type: 'app', appId: 'profile' },
    { type: 'app', appId: 'projects' },
    { type: 'app', appId: 'resume' },
    { type: 'app', appId: 'photos' },
    { type: 'app', appId: 'contact' },
    { type: 'separator' },
    { type: 'app', appId: 'terminal' },
    { type: 'app', appId: 'help' },
    { type: 'separator' },
    { type: 'shutdown' },
  ]);
  expect(HELP_MENU_APP_IDS).toEqual(['help', 'about-site']);
  for (const item of START_MENU_ITEMS) {
    if (item.type === 'app') expect(desktopAppCatalog.some(({ id }) => id === item.appId), item.appId).toBe(true);
  }
});

test('Speaking is not offered as a desktop application', async ({ page }) => {
  expect(desktopAppCatalog.map(({ id }) => String(id))).not.toContain('speaking');

  await page.goto('/desktop');
  await expect(page.locator('[data-launcher-for="speaking"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start menu' }).click();
  await expect(page.getByRole('menu').getByRole('menuitem', { name: 'Speaking' })).toHaveCount(0);
});

test('the retired speaking query canonicalizes to the desktop home', async ({ page }) => {
  await page.goto('/desktop?campaign=keep&app=speaking');
  await expect(page).toHaveURL('/desktop?campaign=keep');
  await expect(page.locator('.win95-title-bar').getByText('STEVEN.EXE - Personal Site', { exact: true })).toBeVisible();
});

test('every legacy app and section ID resolves to its Phase 2 destination', () => {
  for (const [legacyAppId, sectionId, appId, href, navigationTarget] of expectedLegacyMatrix) {
    const fromApp = getAppByLegacyAppId(legacyAppId);
    const fromSection = getAppByLegacySectionId(sectionId);
    expect(fromApp?.id, legacyAppId).toBe(appId);
    expect(fromSection?.id, sectionId).toBe(appId);
    expect(fromApp?.href).toBe(href);
    expect(getNavigationTarget(fromApp!)).toEqual(navigationTarget);
  }

  expect(getNavigationTarget(desktopAppCatalog.find(({ id }) => id === 'home')!)).toEqual({ path: '/desktop' });
  expect(getNavigationTarget(desktopAppCatalog.find(({ id }) => id === 'photos')!)).toEqual({ path: '/desktop', sectionId: 'section-photos' });
  expect(getAppByLegacyAppId('not-a-real-program')).toBeUndefined();
  expect(getAppByLegacySectionId('section-not-real')).toBeUndefined();
});

test('navigation components do not duplicate destination arrays or legacy maps', () => {
  for (const relativePath of [
    'src/components/ui/win95/DesktopShortcuts.tsx',
    'src/components/ui/win95/StartMenu.tsx',
    'src/components/ui/win95/MenuBar.tsx',
    'src/components/layout/DesktopEnvironment.tsx',
  ]) {
    const source = readFileSync(join(process.cwd(), relativePath), 'utf8');
    expect(source, relativePath).not.toMatch(/const\s+(shortcuts|menuItems|SECTION_APP_IDS)\s*[:=]/);
    expect(source, relativePath).not.toContain("'section-projects'");
    expect(source, relativePath).not.toContain("'section-explorer'");
    expect(source, relativePath).not.toContain("'section-terminal'");
  }
});
