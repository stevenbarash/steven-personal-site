import { expect, test } from '@playwright/test';
import { getAppsForPlacement } from '../../src/features/desktop/app-catalog';
import { profileContent } from '../../src/content/profile';

const headline = 'I turn complex technical systems into working products, demos, and decisions.';
const capabilityLine = 'Identity Systems · Agentic AI · Technical Prototyping · Independent Software';
const supportLine = 'Identity systems, agentic AI, and independent software.';

const homeLauncherExpectations = [
  ['projects', 'Projects', '/desktop?app=projects'],
  ['resume', 'Resume', '/desktop?app=resume'],
  ['photos', 'Photography', '/desktop?app=photos'],
  ['contact', 'Contact', '/desktop?app=explorer'],
  ['profile', 'About Me', '/desktop?app=profile'],
  ['terminal', 'Command Prompt', '/desktop?app=terminal'],
  ['help', 'Help / About This Site', '/desktop?app=help'],
] as const;

test('approved broad technical narrative leads while identity remains an area of depth', async ({ page, request }) => {
  expect(profileContent.headline).toBe(headline);
  expect(profileContent.summary).toContain('Senior Solutions Engineer at Descope');
  expect(profileContent.summary).toContain('worked at Okta/Auth0 and ID.me');
  expect(profileContent.capabilityLine).toBe(capabilityLine);

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: headline })).toBeVisible();
  await expect(page.getByText(supportLine, { exact: true })).toBeVisible();
  await expect(page.locator('.win95-window')).toHaveCount(0);
  await expect(page).toHaveTitle('Steven Barash | Products, Demos, and Technical Systems');
  expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toContain('Products, Demos, and Technical Systems');
  expect(await page.locator('meta[property="og:title"]').getAttribute('content')).not.toContain('Photographer');
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.name).toContain('Products, Demos, and Technical Systems');
  expect(manifest.name).not.toContain('Photographer');
  expect(manifest.name).not.toContain('Senior Solutions Engineer');
});

test('My Computer is a concise identity summary with literal one-action controls', async ({ page }) => {
  await page.goto('/desktop');

  await expect(page.getByRole('link', { name: 'Open Resume', exact: true })).toHaveAttribute('href', '/desktop?app=resume');
  await expect(page.getByRole('link', { name: 'Email Steven', exact: true })).toHaveAttribute('href', 'mailto:steven@barash.me');
  await expect(page.getByRole('heading', { name: 'Programs and Files' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'My Projects' })).toHaveCount(0);
  await expect(page.getByRole('tablist', { name: 'Resume sections' })).toHaveCount(0);
  await expect(page.getByText('Read-only transcript')).toHaveCount(0);
});

test('Home application launchers are catalog-generated, ordered, and point only to shipped destinations', async ({ page, request }) => {
  expect(getAppsForPlacement('home').map(({ id, placement, href }) => [id, placement.label, href])).toEqual(homeLauncherExpectations);

  await page.goto('/desktop');
  for (const [id, label, href] of homeLauncherExpectations) {
    const launcher = page.locator(`[data-launcher-for="${id}"]`);
    const visibleText = (await launcher.innerText()).replace(/\s+/g, ' ').trim();
    expect(visibleText).toContain(label);
    await expect(launcher).toHaveAccessibleName(visibleText);
    await expect(launcher).toHaveAttribute('href', href);
    const parsed = new URL(href, 'http://127.0.0.1:3101');
    const response = await request.get(parsed.pathname + parsed.search);
    expect(response.ok(), href).toBe(true);
  }
});


test('Contact is a stable minimal route with decoded email and direct links', async ({ page, request }) => {
  const response = await request.get('/contact');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('Contact');
  expect(html).toContain('steven@barash.me');

  await page.goto('/contact');
  await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email steven@barash.me' })).toHaveAttribute('href', 'mailto:steven@barash.me');
  for (const label of ['LinkedIn', 'GitHub', 'X', 'Instagram']) {
    await expect(page.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://barash.me/contact');
});

test('legacy Explorer redirects narrowly to Contact while preserving unrelated query parameters', async ({ request }) => {
  const legacy = await request.get('/?source=legacy&app=explorer&campaign=phase2', { maxRedirects: 0 });
  expect(legacy.status()).toBe(307);
  const destination = new URL(legacy.headers().location, 'http://127.0.0.1:3101');
  expect(destination.pathname).toBe('/contact');
  expect(destination.search).toBe('?source=legacy&campaign=phase2');

  const projects = await request.get('/?source=legacy&app=projects', { maxRedirects: 0 });
  expect(projects.status()).toBe(307);
  const projectsDestination = new URL(projects.headers().location, 'http://127.0.0.1:3101');
  expect(`${projectsDestination.pathname}${projectsDestination.search}`).toBe('/projects?source=legacy');
  const unknown = await request.get('/?source=legacy&app=unknown', { maxRedirects: 0 });
  expect(unknown.status()).toBe(200);
});

test('legacy Explorer hash canonicalizes to Contact without adding an extra history entry', async ({ page }) => {
  await page.goto('/desktop?source=before');
  const historyLength = await page.evaluate(() => history.length);
  await page.goto('/desktop?source=legacy#section-explorer');
  await expect(page).toHaveURL('/desktop?source=legacy&app=explorer');
  await expect(page.getByRole('heading', { name: 'Contact Steven' })).toBeVisible();
  expect(await page.evaluate(() => history.length)).toBe(historyLength + 1);
  await page.goBack();
  await expect(page).toHaveURL('/desktop?source=before');
});

test('browser history and unknown query behavior remain coherent', async ({ page }) => {
  await page.goto('/desktop?source=phase2');
  await page.locator('[data-launcher-for="projects"]').click();
  await expect(page).toHaveURL('/desktop?source=phase2&app=projects');
  await page.goBack();
  await expect(page).toHaveURL('/desktop?source=phase2');
  await page.goForward();
  await expect(page).toHaveURL('/desktop?source=phase2&app=projects');

  await page.goto('/desktop?source=phase2&app=not-real&campaign=keep');
  await expect(page).toHaveURL('/desktop?source=phase2&campaign=keep');
});

test('application launch focuses the opened window', async ({ page }) => {
  await page.goto('/desktop');
  await page.locator('[data-launcher-for="projects"]').click();
  await expect(page.locator('[data-testid="application-window"]')).toBeFocused();
});

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
]) {
  test(`Resume and Email actions are visible without window scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/desktop');
    for (const label of ['Open Resume', 'Email Steven']) {
      const box = await page.getByRole('link', { name: label, exact: true }).boundingBox();
      expect(box, label).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height - 40);
    }
    expect(await page.locator('.win95-window > .overflow-auto').evaluate((node) => node.scrollTop)).toBe(0);
  });
}
