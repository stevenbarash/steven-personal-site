import { expect, test } from '@playwright/test';
import { publishedProjects, projectCatalog } from '../../src/content/projects';
import { siteConfig } from '../../src/constants/site';

const expectedProjects = [
  {
    slug: 'pult',
    name: 'Pult',
    oneLiner: 'A SwiftUI iPhone remote I built and test with my Google TV.',
    status: 'Active',
    technologies: 'Swift + SwiftUI',
    differentiator: 'Pult implements the Android TV Remote Service v2 pairing and command protocols.',
    headings: ['Why Pult exists', 'Pairing and control', 'Protocol choices'],
    requiredCopy: [
      'I wanted an iPhone remote for my Google TV without installing another ad-supported app.',
      'The code is public, and the project is still active.',
      'Not on the App Store. Physical-device compatibility is documented per TV in the repository.',
      'Pult uses hand-rolled protobuf encoding for the small protocol surface instead of adding SwiftProtobuf as a dependency.',
    ],
  },
  {
    slug: 'uptick',
    name: 'Uptick',
    oneLiner: 'A Zed extension for dependency updates and known vulnerability context.',
    status: 'Active',
    technologies: 'Rust + Zed Extension API + LSP',
    differentiator: 'The Zed extension is intentionally thin. A Rust language server handles registry lookups and vulnerability analysis.',
    headings: ['Why Uptick exists', 'Inside the extension', 'Editor integration'],
    requiredCopy: [
      'I wanted to see outdated and vulnerable dependencies in Zed instead of switching to another tool.',
      'The Zed extension is intentionally thin. A Rust language server handles registry lookups and vulnerability analysis.',
      'Uptick supports package.json, Cargo.toml, pubspec.yaml, composer.json, go.mod, and pom.xml.',
      'OSV results are useful context, not a complete security scan.',
    ],
  },
  {
    slug: 'bike-cli',
    name: 'bike-cli',
    oneLiner: 'One terminal tool for ride weather, Strava activity, training guidance, and bike maintenance.',
    status: 'Experimental',
    technologies: 'Node.js + Strava API + Open-Meteo',
    differentiator: 'The command hierarchy groups ride weather, Strava activity, statistics, training recommendations, and maintenance in one CLI.',
    headings: ['Why bike-cli exists', 'Commands and data', 'Local by design'],
    requiredCopy: [
      'I wanted one terminal tool for ride weather, Strava activity, training recommendations, and bike maintenance.',
      'bike-cli is an experimental local CLI. It is not a hosted service, a production system, or a validated training tool.',
    ],
  },
  {
    slug: 'personal-site',
    name: 'Personal Site',
    oneLiner: 'A personal site with a working Windows 95 desktop and straightforward public routes.',
    status: 'Maintained',
    technologies: 'Next.js + React + TypeScript',
    differentiator: 'The site uses the Next.js App Router, typed content, and Playwright regression tests.',
    headings: ['Why this site exists', 'Design and routing', 'Keeping the desktop optional'],
    requiredCopy: [
      'A normal grid of portfolio cards did not feel like me, so I built a working Windows 95 desktop.',
      'The public pages use stable routes while the desktop keeps old query and hash links working.',
      'You are looking at the live site. Its source is public on GitHub.',
      'The Windows 95 interface is optional; the same core content remains available through conventional public routes.',
    ],
  },
] as const;

const expectedSlugs = expectedProjects.map(({ slug }) => slug);
const governanceVocabulary = /evidence-backed|published|proof|drafts excluded|publication|first-party proof|evidence record/i;
const canonicalUrl = (path: string) => new URL(path, `${siteConfig.canonicalOrigin}/`).href;

const expectMinimalServerHtml = (html: string) => {
  expect(html).toContain('minimal-site');
  expect(html).not.toContain('win95-window');
  expect(html).not.toContain('STEVEN.EXE');
};

test('published project catalog is the route source of truth and excludes drafts and Identity Work', () => {
  expect(publishedProjects.map(({ slug }) => slug)).toEqual(expectedSlugs);
  expect(publishedProjects.every(({ publicationStatus }) => publicationStatus === 'published')).toBe(true);
  expect(JSON.stringify(publishedProjects)).not.toMatch(/future-case-study|Identity Work/i);
  expect(projectCatalog.some(({ publicationStatus }) => publicationStatus === 'draft')).toBe(true);
});

test('project index is minimal server HTML with a plain intro and four internal project links', async ({ request }) => {
  const response = await request.get('/projects');
  expect(response.status()).toBe(200);
  const html = await response.text();

  expectMinimalServerHtml(html);
  expect(html).toContain('Software projects I have built and maintain, with notes on how they work and where they stand.');
  expect(html).not.toMatch(/future-case-study|Identity Work/i);

  for (const project of expectedProjects) {
    expect(html).toContain(`href="/projects/${project.slug}"`);
    expect(html).toContain(project.name);
    expect(html).toContain(project.oneLiner);
    expect(html).toContain(project.status);
    expect(html).toContain(project.technologies);
    expect(html).toContain(project.differentiator);
    expect(html).not.toContain(`Read about ${project.name}`);
    expect(html).not.toContain(`${siteConfig.githubUrl}/${project.slug}`);
  }
});

test('project index has one h1 and a strong semantic list rather than cards', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('body')).not.toContainText(governanceVocabulary);
  await expect(page.getByRole('list', { name: 'Projects' }).getByRole('listitem')).toHaveCount(4);

  for (const project of expectedProjects) {
    const row = page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: project.name, exact: true }) });
    await expect(row.getByText(project.oneLiner, { exact: true })).toBeVisible();
    await expect(row.getByText(project.differentiator, { exact: true })).toBeVisible();
    await expect(row.getByText(`Status: ${project.status}`, { exact: true })).toBeVisible();
    await expect(row.getByText(`Technologies: ${project.technologies}`, { exact: true })).toBeVisible();
    const titleLink = row.getByRole('link', { name: project.name, exact: true });
    await expect(titleLink).toHaveAttribute('href', `/projects/${project.slug}`);
    expect((await titleLink.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect(row).not.toContainText('Role:');
    await expect(row).not.toContainText(`Read about ${project.name}`);
  }

  const classNames = await page.locator('[class]').evaluateAll((nodes) => nodes.flatMap((node) => Array.from(node.classList)));
  expect(classNames.filter((name) => /(?:card|rounded|glass|gradient|eyebrow|grid)/i.test(name))).toEqual([]);
});

for (const expected of expectedProjects) {
  test(`${expected.name} is a minimal, specific, server-rendered project document`, async ({ request }) => {
    const response = await request.get(`/projects/${expected.slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();

    expectMinimalServerHtml(html);
    expect(html).toContain(expected.oneLiner);
    expect(html).toContain(expected.status);
    for (const heading of expected.headings) expect(html).toContain(heading);
    for (const copy of expected.requiredCopy) expect(html).toContain(copy);
    expect(html).not.toMatch(/Why I built it|How it works|Tradeoffs|Current state|Caveats/);
    expect(html).not.toMatch(/future-case-study|Identity Work/i);
  });
}

test('project detail uses semantic article sections, a plain breadcrumb, and honest source links', async ({ page }) => {
  await page.goto('/projects/personal-site');
  await expect(page.getByRole('heading', { level: 1, name: 'Personal Site' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('body')).not.toContainText(governanceVocabulary);
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
  for (const heading of expectedProjects[3].headings) await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
  await expect(page.locator('.minimal-project-prose ul').first()).toHaveCSS('list-style-type', 'disc');

  const source = page.getByRole('link', { name: 'View source on GitHub' });
  await expect(source).toHaveAttribute('href', `${siteConfig.githubUrl}/steven-personal-site`);
  await expect(source).toHaveAttribute('target', '_blank');
  await expect(source).toHaveAttribute('rel', /noopener/);
  await expect(source).toHaveAttribute('rel', /noreferrer/);
  await expect(page.getByRole('link', { name: 'Open the live site' })).toHaveAttribute('href', siteConfig.canonicalOrigin);
});

test('Pult places an accessible pairing and control flow immediately after its header', async ({ page }) => {
  await page.goto('/projects/pult');
  const flow = page.getByRole('figure', { name: 'Pairing and control path' });
  await expect(flow).toBeVisible();
  await expect(flow.getByRole('listitem')).toHaveCount(3);
  await expect(flow.getByRole('listitem').nth(0)).toHaveText('iPhone Pult app');
  await expect(flow.getByRole('listitem').nth(1)).toContainText('mTLS pairing and command channels');
  await expect(flow.getByRole('listitem').nth(1)).toContainText('Pairing: port 6467');
  await expect(flow.getByRole('listitem').nth(1)).toContainText('Commands: port 6466');
  await expect(flow.getByRole('listitem').nth(2)).toHaveText('Google TV');
  await expect(page.locator('.minimal-project-header + [data-project-artifact] .pult-protocol-flow')).toHaveCount(1);
  expect(await flow.evaluate((node) => getComputedStyle(node).backgroundImage)).toBe('none');
  expect(await flow.evaluate((node) => getComputedStyle(node).borderRadius)).toBe('0px');
});

const artifactExpectations = [
  ['pult', 'Pairing and control path'],
  ['uptick', 'Extension and analysis path'],
  ['bike-cli', 'One command, three output formats'],
  ['personal-site', 'One content system, two public surfaces'],
] as const;

test('every published project has one truthful signature artifact after its header', async ({ page }) => {
  for (const [slug, caption] of artifactExpectations) {
    await page.goto(`/projects/${slug}`);
    const artifact = page.locator(`[data-project-artifact="${slug}"][data-project-artifact-variant="detail"]`);
    await expect(artifact).toHaveCount(1);
    await expect(artifact.getByRole('figure', { name: caption })).toHaveCount(1);
    await expect(page.locator('.minimal-project-header + [data-project-artifact]')).toHaveCount(1);
  }
});

test('project artifacts expose only verified technical claims', async ({ page }) => {
  await page.goto('/projects/uptick');
  await expect(page.getByText('Thin Zed extension', { exact: true })).toBeVisible();
  await expect(page.getByText('Rust language server', { exact: true })).toBeVisible();
  await expect(page.getByText('Registry data + OSV', { exact: true })).toBeVisible();
  await expect(page.getByText('Hints, diagnostics, links, and update actions through LSP', { exact: true })).toBeVisible();

  await page.goto('/projects/bike-cli');
  for (const command of ['bike now', 'bike now --format json', 'bike wear --format csv']) {
    await expect(page.getByText(command, { exact: true })).toBeVisible();
  }

  await page.goto('/projects/personal-site');
  for (const label of ['Typed content', 'Public routes', 'Optional /desktop', 'Legacy query + hash links']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});

test('corrected project copy has no duplicate Pult caveat, training notes, or public evidence IDs', async ({ page }) => {
  await page.goto('/projects/pult');
  await expect(page.getByText('Not on the App Store. Physical-device compatibility is documented per TV in the repository.', { exact: true })).toHaveCount(1);
  await expect(page.locator('body')).not.toContainText('pult-project');

  await page.goto('/projects/bike-cli');
  await expect(page.locator('body')).not.toContainText(/training notes|locally stored training notes/i);

  await page.goto('/projects/personal-site');
  await expect(page.locator('body')).not.toContainText(/traffic|conversion|third-party design validation/i);
});

test('unknown and draft project slugs return guarded minimal 404s', async ({ page, request }) => {
  for (const slug of ['does-not-exist', 'future-case-study']) {
    const response = await request.get(`/projects/${slug}`);
    expect(response.status()).toBe(404);
    const html = await response.text();
    expectMinimalServerHtml(html);
    expect(html).toContain('Project not found');
    expect(html).toContain('This project does not exist or is not available.');

    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Project not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to projects' })).toHaveAttribute('href', '/projects');
    await expect(page.locator('body')).not.toContainText(/Identity Work|future-case-study/i);
  }
});

test('project index metadata is unique and canonical', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveTitle('Projects | Steven Barash');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Software projects by Steven Barash, with source code, design notes, and current status.');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl('/projects'));
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl('/projects'));
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Projects | Steven Barash');
});

for (const project of expectedProjects) {
  test(`${project.name} metadata is unique, canonical, and carries SoftwareSourceCode JSON-LD`, async ({ page }) => {
    const path = `/projects/${project.slug}`;
    await page.goto(path);
    await expect(page).toHaveTitle(`${project.name} Project | Steven Barash`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', project.oneLiner);
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

test('minimal project routes have a working skip link and keyboard-visible focus', async ({ page }) => {
  for (const path of ['/projects', '/projects/pult']) {
    await page.goto(path);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main-content[tabindex="-1"]')).toBeFocused();
  }

  const source = page.getByRole('link', { name: 'View source on GitHub' });
  await source.focus();
  await expect(source).toBeFocused();
  expect(await source.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
});

test('project routes fit 390px, keep readable prose, and provide 44px primary links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/projects', '/projects/pult']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  const prose = page.locator('.minimal-project-prose').first();
  expect(await prose.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await prose.evaluate((node) => Number.parseFloat(getComputedStyle(node).maxWidth))).toBeGreaterThanOrEqual(650);
  expect(await prose.evaluate((node) => Number.parseFloat(getComputedStyle(node).maxWidth))).toBeLessThanOrEqual(750);

  for (const locator of [
    page.getByRole('link', { name: 'View source on GitHub' }),
    page.getByRole('link', { name: 'Back to projects' }),
  ]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
    await expect(locator).toHaveCSS('touch-action', 'manipulation');
  }
});

test('Windows 95 Project Explorer remains available only on the desktop route', async ({ page, request }) => {
  const response = await request.get('/desktop?app=projects');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('win95-window');
  expect(html).toContain('win95-project-index');
  expect(html).toContain('Project Explorer');

  await page.goto('/desktop?app=projects');
  await expect(page).toHaveURL('/desktop?app=projects');
  await expect(page.locator('.win95-title-bar').getByText('PROJECTS - Project Explorer', { exact: true })).toBeVisible();
  await expect(page.locator('.win95-project-index')).toBeVisible();
  await expect(page.locator('.win95-project-index')).not.toContainText(governanceVocabulary);
});
