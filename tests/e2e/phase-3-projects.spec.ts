import { expect, test } from '@playwright/test';
import { publishedProjects, projectCatalog } from '../../src/content/projects';
import { siteConfig } from '../../src/constants/site';

const expectedProjects = [
  { slug: 'pult', name: 'Pult' },
  { slug: 'uptick', name: 'Uptick' },
  { slug: 'bike-cli', name: 'bike-cli' },
  { slug: 'personal-site', name: 'Personal Site' },
] as const;

const expectedSlugs = expectedProjects.map(({ slug }) => slug);
const governanceVocabulary = /evidence-backed|published|proof|drafts excluded|publication|first-party proof|evidence record/i;
const canonicalUrl = (path: string) => new URL(path, `${siteConfig.canonicalOrigin}/`).href;


test('published project catalog is the route source of truth and excludes drafts and Identity Work', () => {
  expect(publishedProjects.map(({ slug }) => slug)).toEqual(expectedSlugs);
  expect(publishedProjects.every(({ publicationStatus }) => publicationStatus === 'published')).toBe(true);
  expect(JSON.stringify(publishedProjects)).not.toMatch(/future-case-study|Identity Work/i);
  expect(projectCatalog.some(({ publicationStatus }) => publicationStatus === 'draft')).toBe(true);
});


test('project index exposes published case-study destinations and registered previews', async ({ page }) => {
  const response = await page.goto('/projects');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('body')).not.toContainText(governanceVocabulary);
  await expect(page.getByRole('main')).not.toContainText(/future-case-study|Identity Work/i);
  await expect(page.getByRole('list', { name: 'Projects' }).locator(':scope > li')).toHaveCount(4);

  for (const project of expectedProjects) {
    const row = page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: project.name, exact: true }) });
    const titleLink = row.getByRole('link', { name: project.name, exact: true });
    await expect(titleLink).toHaveAttribute('href', `/projects/${project.slug}`);
    await expect(row.locator(`[data-project-artifact="${project.slug}"][data-project-artifact-variant="preview"]`)).toHaveCount(1);
    await expect(row.getByRole('link', { name: 'Read the case study' })).toHaveAttribute('href', `/projects/${project.slug}`);
  }

});


test('mobile project title and breadcrumb links meet the 44px floor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects');
  for (const project of expectedProjects) {
    const box = await page.getByRole('link', { name: project.name, exact: true }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page.goto('/projects/pult');
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Projects' });
  const box = await breadcrumb.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(44);
});


test('project detail has an accessible article, breadcrumb, and safe source destinations', async ({ page }) => {
  await page.goto('/projects/personal-site');
  await expect(page.getByRole('heading', { level: 1, name: 'Personal Site' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('body')).not.toContainText(governanceVocabulary);
  await expect(page.getByRole('article', { name: 'Personal Site', exact: true })).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');

  const source = page.getByRole('link', { name: 'View source on GitHub' });
  await expect(source).toHaveAttribute('href', `${siteConfig.githubUrl}/steven-personal-site`);
  await expect(source).toHaveAttribute('target', '_blank');
  await expect(source).toHaveAttribute('rel', /noopener/);
  await expect(source).toHaveAttribute('rel', /noreferrer/);
  await expect(page.getByRole('link', { name: 'Open the live site' })).toHaveAttribute('href', siteConfig.canonicalOrigin);
});

test('Pult exposes an accessible pairing and control flow', async ({ page }) => {
  await page.goto('/projects/pult');
  const flow = page.getByRole('figure', { name: 'Pairing and control path' });
  await expect(flow).toBeVisible();
  await expect(flow.getByRole('listitem')).toHaveCount(3);
});

const artifactExpectations = [
  ['pult', 'Pairing and control path'],
  ['uptick', 'Extension and analysis path'],
  ['bike-cli', 'One command, three output formats'],
  ['personal-site', 'One content system, two public surfaces'],
] as const;

test('every published project has one accessible signature artifact', async ({ page }) => {
  for (const [slug, caption] of artifactExpectations) {
    await page.goto(`/projects/${slug}`);
    const artifact = page.locator(`[data-project-artifact="${slug}"][data-project-artifact-variant="detail"]`);
    await expect(artifact).toHaveCount(1);
    await expect(artifact.getByRole('figure', { name: caption })).toHaveCount(1);
  }
});


test('project pages exclude private evidence and unverified claims', async ({ page }) => {
  await page.goto('/projects/pult');
  await expect(page.locator('body')).not.toContainText('pult-project');

  await page.goto('/projects/bike-cli');
  await expect(page.locator('body')).not.toContainText(/training notes|locally stored training notes/i);

  await page.goto('/projects/personal-site');
  await expect(page.locator('body')).not.toContainText(/traffic|conversion|third-party design validation/i);
});

test('unknown and draft project slugs return guarded 404s', async ({ page, request }) => {
  for (const slug of ['does-not-exist', 'future-case-study']) {
    const response = await request.get(`/projects/${slug}`);
    expect(response.status()).toBe(404);

    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Project not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to projects' })).toHaveAttribute('href', '/projects');
    await expect(page.locator('body')).not.toContainText(/Identity Work|future-case-study/i);
  }
});

test('project index metadata is unique and canonical', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveTitle('Projects | Steven Barash');
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description?.trim()).toBeTruthy();
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl('/projects'));
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl('/projects'));
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Projects | Steven Barash');
});

for (const project of expectedProjects) {
  test(`${project.name} metadata is unique, canonical, and carries SoftwareSourceCode JSON-LD`, async ({ page }) => {
    const path = `/projects/${project.slug}`;
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${project.name} Project | Steven Barash`);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.trim()).toBeTruthy();
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
    await expect(page.getByRole('article', { name: project.name, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('main')).not.toContainText(/future-case-study|Identity Work/i);
    await expect(page.locator('[data-testid="application-window"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl(path));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl(path));
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', `${project.name} Project | Steven Barash`);

    const routeScript = page.locator('script[data-project-json-ld][type="application/ld+json"]');
    await expect(routeScript).toHaveCount(1);
    const jsonLd = JSON.parse(await routeScript.textContent() ?? '{}');
    expect(jsonLd['@type']).toBe('SoftwareSourceCode');
    expect(jsonLd.url).toBe(canonicalUrl(path));
    expect(jsonLd.author).toEqual({ '@id': `${siteConfig.canonicalOrigin}/#person` });
    expect(jsonLd.codeRepository).toBe(`${siteConfig.githubUrl}/${project.slug === 'uptick' ? 'uptick-zed' : project.slug === 'personal-site' ? 'steven-personal-site' : project.slug}`);
    if (project.slug === 'personal-site') expect(jsonLd.sameAs).toContain(siteConfig.canonicalOrigin);
    expect(JSON.stringify(jsonLd)).not.toContain('"@type":"Person"');
  });
}

test('sitemap publishes index and detail routes without query URLs, drafts, or Identity Work', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain(`<loc>${canonicalUrl('/projects')}</loc>`);
  for (const slug of expectedSlugs) expect(xml).toContain(`<loc>${canonicalUrl(`/projects/${slug}`)}</loc>`);
  expect(xml).not.toContain('?app=projects');
  expect(xml).not.toMatch(/future-case-study|Identity Work/i);
});

test('project routes have a working skip link and keyboard-visible focus', async ({ page }) => {
  for (const path of ['/projects', '/projects/pult']) {
    await page.goto(path);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  }

  const source = page.getByRole('link', { name: 'View source on GitHub' });
  await source.focus();
  await expect(source).toBeFocused();
  expect(await source.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
});

test('project routes fit 390px and provide 44px primary links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/projects', '/projects/pult']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }


  for (const locator of [
    page.getByRole('link', { name: 'View source on GitHub' }),
    page.getByRole('link', { name: 'Back to projects' }),
  ]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
});

test('Windows 95 Project Explorer remains available only on the desktop route', async ({ page, request }) => {
  const response = await request.get('/desktop?app=projects');
  expect(response.status()).toBe(200);

  await page.goto('/desktop?app=projects');
  await expect(page).toHaveURL('/desktop?app=projects');
  await expect(page.locator('.win95-title-bar').getByText('PROJECTS - Project Explorer', { exact: true })).toBeVisible();
  await expect(page.locator('.win95-project-index')).toBeVisible();
  await expect(page.locator('.win95-project-index')).not.toContainText(governanceVocabulary);
});
