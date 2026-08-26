import { expect, test, type Page } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { siteConfig } from '../../src/constants/site';

const stableRoutes = [
  '/',
  '/resume',
  '/projects',
  '/projects/pult',
  '/projects/uptick',
  '/projects/bike-cli',
  '/projects/personal-site',
  '/photos',
  '/contact',
] as const;

const expectedMetadata = {
  '/': {
    title: 'Steven Barash | Products, Demos, and Technical Systems',
    description: 'I turn complex technical systems into working products, demos, and decisions.',
  },
  '/resume': {
    title: 'Resume | Steven Barash',
    description: 'Experience, education, skills, languages, and honors for Steven Barash.',
  },
  '/projects': {
    title: 'Projects | Steven Barash',
    description: 'Software projects by Steven Barash, with source code, design notes, and current status.',
  },
  '/projects/pult': {
    title: 'Pult Project | Steven Barash',
    description: 'A SwiftUI iPhone remote I built and test with my Google TV.',
  },
  '/projects/uptick': {
    title: 'Uptick Project | Steven Barash',
    description: 'A Zed extension for dependency updates and known vulnerability context.',
  },
  '/projects/bike-cli': {
    title: 'bike-cli Project | Steven Barash',
    description: 'One terminal tool for ride weather, Strava activity, training guidance, and bike maintenance.',
  },
  '/projects/personal-site': {
    title: 'Personal Site Project | Steven Barash',
    description: 'A personal site with a working Windows 95 desktop and straightforward public routes.',
  },
  '/photos': {
    title: 'Photography | Steven Barash',
    description: 'Photography by Steven Barash, with street, travel, and everyday scenes.',
  },
  '/contact': {
    title: 'Contact | Steven Barash',
    description: 'Email Steven Barash or find him on LinkedIn, GitHub, Instagram, and X.',
  },
} as const;

const canonicalUrl = (pathname: string) => pathname === '/'
  ? siteConfig.canonicalOrigin
  : new URL(pathname, `${siteConfig.canonicalOrigin}/`).href;

const meta = (page: Page, selector: string) => page.locator(selector).getAttribute('content');

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }))).flat();
}

test('canonical origin, email display, and X identity match the final cutover', () => {
  expect(siteConfig).toMatchObject({
    canonicalOrigin: 'https://barash.me',
    emailDisplay: 'steven@barash.me',
    xHandle: '@stevenbarash',
    xUrl: 'https://x.com/stevenbarash',
  });
});

test('sitemap contains the exact stable public route set in deliberate order', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, value]) => value);
  expect(locations).toEqual(stableRoutes.map(canonicalUrl));
  expect(locations.join('\n')).not.toMatch(/desktop|future-case-study|Identity Work|\?|#/i);
});

test('all stable routes have unique complete canonical, Open Graph, and Twitter metadata', async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const pathname of stableRoutes) {
    const expected = expectedMetadata[pathname];
    await page.goto(pathname);
    await expect(page).toHaveTitle(expected.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', expected.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl(pathname));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl(pathname));
    expect(await meta(page, 'meta[property="og:title"]')).toBe(expected.title);
    expect(await meta(page, 'meta[property="og:description"]')).toBe(expected.description);
    expect(await meta(page, 'meta[name="twitter:title"]')).toBe(expected.title);
    expect(await meta(page, 'meta[name="twitter:description"]')).toBe(expected.description);
    expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    titles.add(expected.title);
    descriptions.add(expected.description);
  }

  expect(titles.size).toBe(stableRoutes.length);
  expect(descriptions.size).toBe(stableRoutes.length);
});

test('global keywords and Person JSON-LD describe the actual specialty safely', async ({ page }) => {
  await page.goto('/');
  expect(await meta(page, 'meta[name="keywords"]')).toBe([
    'Steven Barash',
    'Senior Solutions Engineer',
    'Descope',
    'CIAM',
    'OAuth/OIDC',
    'passkeys',
    'FAPI',
    'identity federation',
    'B2B authorization',
    'RBAC',
    'agentic AI',
    'technical prototypes',
    'independent software',
    'Brooklyn',
  ].join(','));

  const personScripts = page.locator('script#person-json-ld[type="application/ld+json"]');
  await expect(personScripts).toHaveCount(1);
  const raw = await personScripts.textContent() ?? '';
  expect(raw).not.toContain('<');
  const person = JSON.parse(raw);
  expect(person['@id']).toBe('https://barash.me/#person');
  expect(person.url).toBe('https://barash.me');
  expect(person.knowsAbout).toEqual([
    'CIAM',
    'OAuth/OIDC',
    'Passkeys',
    'FAPI',
    'Identity federation',
    'B2B authorization',
    'RBAC',
    'Agentic AI',
    'Technical prototyping',
  ]);
  expect(person.description).toBe('I turn complex technical systems into working products, demos, and decisions.');
});

test('desktop keeps its own canonical and noindex follow policy', async ({ page }) => {
  await page.goto('/desktop');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://barash.me/desktop');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex,\s*follow/i);
});

test('Open Graph image carries the Quiet Studio public positioning at 1200 by 630', async () => {
  const source = await readFile(join(process.cwd(), 'src/app/opengraph-image.tsx'), 'utf8');
  expect(source).toContain("export const alt = 'Steven Barash. Complex technical systems turned into working products, demos, and decisions.'");
  expect(source).toMatch(/width:\s*1200/);
  expect(source).toMatch(/height:\s*630/);
  expect(source).toContain('I turn complex technical systems into working products, demos, and decisions.');
  expect(source).toContain('Identity systems, agentic AI, and independent software.');
  expect(source).toContain("background: '#f8f8f6'");
  expect(source).toContain("color: '#040404'");
  expect(source).toContain('#034cfc');
  expect(source).not.toMatch(/Identity Work|MY COMPUTER|STEVEN\.EXE|terminal|gradient|boxShadow|borderRadius|rgba?\(|hsla?\(|—/i);
});

test('manifest represents the minimal public site and uses its reachable icon', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest).toMatchObject({
    name: 'Steven Barash | Products, Demos, and Technical Systems',
    short_name: 'Steven Barash',
    description: 'Complex technical systems turned into working products, demos, and decisions.',
    start_url: '/',
    scope: '/',
    background_color: '#f8f8f6',
    theme_color: '#034cfc',
  });
  expect(JSON.stringify(manifest)).not.toMatch(/Windows 95|Identity Solutions Engineer|#008080/i);
  const iconResponse = await request.get(manifest.icons[0].src);
  expect(iconResponse.ok()).toBe(true);
});

test('visitor-facing source and production output contain no banned copy, em dash, or leaked governance IDs', async () => {
  const sourceRoots = ['src/app', 'src/components', 'src/data', 'src/features'];
  const sourceFiles = (await Promise.all(sourceRoots.map((root) => walk(join(process.cwd(), root))))).flat()
    .filter((path) => ['.ts', '.tsx', '.js', '.jsx'].includes(extname(path)));
  const deployableFiles = await walk(join(process.cwd(), '.next-playwright', 'server', 'app'));
  const files = [...sourceFiles, ...deployableFiles.filter((path) => /\.(?:html|rsc|body)$/.test(path))];
  const banned = /—|make tangible|complex requirements|proofs of concept|Connect professionally|evidence-backed|first-party proof|evidence record|Identity Work/i;

  for (const path of files) {
    const source = await readFile(path, 'utf8');
    expect(source, relative(process.cwd(), path)).not.toMatch(banned);
  }
});

test('canonical origin is centralized and stale canonical literals are absent from deployable source', async () => {
  const files = (await walk(join(process.cwd(), 'src'))).filter((path) => ['.ts', '.tsx', '.js', '.jsx'].includes(extname(path)));
  for (const path of files) {
    const source = await readFile(path, 'utf8');
    if (path.endsWith('src/constants/site.ts')) {
      expect(source.match(/https:\/\/barash\.me/g)).toHaveLength(1);
    } else {
      expect(source, relative(process.cwd(), path)).not.toContain('https://barash.me');
    }
    expect(source, relative(process.cwd(), path)).not.toMatch(/https:\/\/(?:www\.)?stevenbarash\.com/i);
  }
});

test('project route documents the Next 16 clean 404 rationale', async () => {
  const source = await readFile(join(process.cwd(), 'src/app/projects/[slug]/page.tsx'), 'utf8');
  expect(source).toContain('export const dynamicParams = true');
  expect(source).toMatch(/Next 16/);
  expect(source).toMatch(/clean[\s\S]*notFound\(\)[\s\S]*NoFallbackError/i);
});

test('primary documentation describes the route split, domain, tokens, tests, redirects, and local commands', async () => {
  const docs = Object.fromEntries(await Promise.all(
    ['PRODUCT.md', 'DESIGN.md', 'ARCHITECTURE.md', 'README.md'].map(async (name) => [name, await readFile(join(process.cwd(), name), 'utf8')]),
  ));
  const combined = Object.values(docs).join('\n');

  for (const [name, content] of Object.entries(docs)) {
    expect(content, name).not.toContain('—');
    expect(content, name).not.toMatch(/permanent core identity|focused desktop portfolio, not a set of independently routed content pages/i);
  }
  expect(docs['PRODUCT.md']).toMatch(/public professional home[\s\S]*primary experience/i);
  expect(docs['PRODUCT.md']).toMatch(/Windows 95[\s\S]*\/desktop[\s\S]*noindex[\s\S]*easter egg/i);
  expect(docs['DESIGN.md']).toMatch(/Quiet Studio[\s\S]*#f8f8f6[\s\S]*#034cfc/i);
  expect(docs['DESIGN.md']).toMatch(/\/desktop[\s\S]*Windows 95/i);
  expect(docs['ARCHITECTURE.md']).toMatch(/dynamicParams[\s\S]*true[\s\S]*clean[\s\S]*404[\s\S]*NoFallbackError/i);
  expect(combined).toContain('https://barash.me');
  expect(combined).toMatch(/legacy[\s\S]*redirect/i);
  expect(combined).toMatch(/Chromium[\s\S]*WebKit/i);
  for (const command of ['npm run dev', 'npm test', 'npm run lint', 'npm run type-check', 'npm run build', 'npm run lighthouse']) {
    expect(combined).toContain(command);
  }
});
