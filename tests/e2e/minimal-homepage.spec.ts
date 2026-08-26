import { expect, test } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { publishedProjects } from '../../src/content/projects';
import { photoLibrary } from '../../src/data/photos';

const headline = 'I turn complex technical systems into working products, demos, and decisions.';
const supportLine = 'Identity systems, agentic AI, and independent software.';
const selectedProjectSlugs = ['uptick', 'bike-cli'];
const homepagePhotoId = 'ig-DC4r__8xPDU';

const walk = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return files.flat();
};

test('home server HTML is the minimal professional site, not the Windows shell', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();

  expect(html).toContain('minimal-site');
  expect(html).toContain(headline);
  expect(html).toContain(supportLine);
  expect(html).toContain('See the work');
  expect(html).toContain('Contact');
  expect(html).toContain('data-quiet-studio-hero');
  expect(html).toContain('d77beeac');
  expect(html).toContain('unreviewed and undocumented is unfinished');
  expect(html).not.toContain('win95-window');
  expect(html).not.toContain('STEVEN.EXE');
});

test('home has semantic navigation, sections, exact copy, and working internal destinations', async ({ page, request }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: headline })).toBeVisible();
  await expect(page.getByText(supportLine, { exact: true })).toBeVisible();

  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  for (const [label, href] of [
    ['Experience', '/resume'],
    ['Work', '/projects'],
    ['Photography', '/photos'],
    ['Contact', '/contact'],
  ]) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
    expect((await request.get(href)).ok(), href).toBe(true);
  }

  await expect(page.getByRole('link', { name: 'See the work', exact: true })).toHaveAttribute('href', '#selected-work');
  await expect(page.getByRole('link', { name: 'Contact', exact: true }).last()).toHaveAttribute('href', '/contact');
  await expect(page.getByRole('link', { name: 'Start, open the Windows 95 version', exact: true })).toHaveAttribute('href', '/desktop');

  await expect(page.getByRole('heading', { level: 2, name: 'Selected work' })).toBeVisible();
});

test('primary navigation identifies only the current public section', async ({ page }) => {
  const expectations = [
    ['/', null],
    ['/projects', 'Work'],
    ['/projects/pult', 'Work'],
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

test('selected work is projected from published source data without artificial numbering', async ({ page }) => {
  await page.goto('/');

  for (const slug of selectedProjectSlugs) {
    const project = publishedProjects.find((entry) => entry.slug === slug)!;
    const link = page.getByRole('link', { name: project.name, exact: true });
    await expect(link).toHaveAttribute('href', `/projects/${slug}`);
    await expect(page.getByText(project.oneLiner, { exact: true })).toBeVisible();
  }

  await expect(page.locator('[data-quiet-studio-work] ol')).toHaveCount(0);
  await expect(page.locator('[data-quiet-studio-work] [data-project-number]')).toHaveCount(0);
  await expect(page.locator('[data-quiet-studio-work]').getByRole('link', { name: 'Pult', exact: true })).toHaveCount(0);
});

test('home follows the work with personal context and a direct contact path', async ({ page }) => {
  await page.goto('/');

  const selectedWork = page.locator('[data-quiet-studio-work]');
  const about = page.locator('[data-quiet-studio-about]');
  const closer = page.locator('[data-quiet-studio-contact]');

  await expect(about.getByRole('heading', { level: 2, name: 'About' })).toBeVisible();
  await expect(about.getByRole('link', { name: 'View experience' })).toHaveAttribute('href', '/resume');
  await expect(about.getByRole('link', { name: 'View photography' })).toHaveAttribute('href', '/photos');
  await expect(closer.getByRole('heading', { level: 2, name: 'Working through a difficult technical decision?' })).toBeVisible();
  const contactLink = closer.getByRole('link', { name: 'Get in touch' });
  await expect(contactLink).toHaveAttribute('href', '/contact');

  const paragraphBox = await closer.getByText(/Email me about identity architecture/).boundingBox();
  const contactLinkBox = await contactLink.boundingBox();
  expect(paragraphBox).not.toBeNull();
  expect(contactLinkBox).not.toBeNull();
  expect(contactLinkBox!.y).toBeGreaterThanOrEqual(paragraphBox!.y + paragraphBox!.height + 20);

  expect(await selectedWork.evaluate((node) => {
    const aboutNode = document.querySelector('[data-quiet-studio-about]');
    return aboutNode !== null && Boolean(
      node.compareDocumentPosition(aboutNode) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  })).toBe(true);
  expect(await about.evaluate((node) => {
    const contactNode = document.querySelector('[data-quiet-studio-contact]');
    return contactNode !== null && Boolean(
      node.compareDocumentPosition(contactNode) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  })).toBe(true);
});

test('about section presents Steven with the supplied illustrated portrait', async ({ page }) => {
  await page.goto('/');

  const portrait = page
    .locator('[data-quiet-studio-about]')
    .getByRole('img', { name: 'Illustrated portrait of Steven Barash' });

  await expect(portrait).toHaveAttribute('src', /profile-portrait\.png/);
  await expect.poll(
    async () => portrait.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
  ).toBe(true);
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

  const about = page.locator('[data-quiet-studio-about]');
  await expect(about).not.toContainText(/Georgia Tech|M\.S\. in Computer Science/i);
  await expect(about).toContainText('I live in Brooklyn.');
});

test('footer exposes the desktop easter egg as an authentic Start control', async ({ page }) => {
  await page.goto('/');

  const startLink = page.getByRole('link', { name: 'Start, open the Windows 95 version' });
  await expect(startLink).toHaveAttribute('href', '/desktop');
  await expect(startLink.getByText('Start', { exact: true })).toBeVisible();
  await expect(startLink.locator('img')).toHaveAttribute('src', /win95\.png/);

  const face = startLink.locator('[data-desktop-start-face]');
  const style = await face.evaluate((node) => {
    const computed = getComputedStyle(node);
    return {
      backgroundColor: computed.backgroundColor,
      boxShadow: computed.boxShadow,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
    };
  });
  expect(style.backgroundColor).toBe('rgb(192, 192, 192)');
  expect(style.boxShadow).not.toBe('none');
  expect(style.fontFamily).toContain('Tahoma');
  expect(style.fontSize).toBe('11px');
});

test('home presents Pult as a protocol artifact before the selected project list', async ({ page }) => {
  await page.goto('/');

  const workbench = page.locator('[data-pult-workbench]');
  await expect(workbench.getByRole('heading', { level: 2, name: 'On the bench' })).toBeVisible();
  await expect(workbench.getByRole('heading', { level: 3, name: 'Pult' })).toBeVisible();
  await expect(workbench.getByText('Pairing and control path', { exact: true })).toBeVisible();
  await expect(workbench.getByText('iPhone Pult app', { exact: true })).toBeVisible();
  await expect(workbench.getByText('mTLS pairing and command channels', { exact: true })).toBeVisible();
  await expect(workbench.getByText('Pairing: port 6467', { exact: true })).toBeVisible();
  await expect(workbench.getByText('Commands: port 6466', { exact: true })).toBeVisible();
  await expect(workbench.getByText('Google TV', { exact: true })).toBeVisible();
  await expect(workbench.getByRole('link', { name: 'Read the Pult case study' })).toHaveAttribute('href', '/projects/pult');
  await expect(workbench.getByRole('link', { name: 'View Pult source' })).toHaveAttribute('href', 'https://github.com/stevenbarash/pult');

  const appearsBeforeSelectedWork = await workbench.evaluate((node) => {
    const selectedWork = document.querySelector('[data-quiet-studio-work]');
    return selectedWork !== null && Boolean(node.compareDocumentPosition(selectedWork) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(appearsBeforeSelectedWork).toBe(true);
});

test('quiet studio hero uses the verified taxi photograph while selected work stays typographic', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('[data-quiet-studio-image]');
  await expect(images).toHaveCount(1);

  const source = photoLibrary.find(({ id }) => id === homepagePhotoId)!;
  const image = images.first();
  await expect(image).toHaveAttribute('src', /_next\/image/);
  await expect(image).toHaveAttribute('alt', source.alt);
  await expect(image).toHaveAttribute('width', String(source.width));
  await expect(image).toHaveAttribute('height', String(source.height));
  await expect(page.locator('[data-quiet-studio-work]').getByRole('img')).toHaveCount(0);
  await image.scrollIntoViewIfNeeded();
  await expect.poll(async () => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
});

test('desktop route preserves the functional Windows 95 homepage and is excluded from indexing', async ({ page, request }) => {
  const response = await request.get('/desktop');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('win95-window');
  expect(html).toContain('STEVEN.EXE');
  expect(html).toContain('Programs and Files');

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

test('Windows 95 scrollbar chrome is scoped to the desktop route', async ({ page }) => {
  await page.goto('/');
  const publicScrollbar = await page.evaluate(() => ({
    rootWidth: getComputedStyle(document.documentElement, '::-webkit-scrollbar').width,
    siteColor: getComputedStyle(document.querySelector('.minimal-site')!).scrollbarColor,
  }));
  expect(publicScrollbar).toEqual({ rootWidth: 'auto', siteColor: 'auto' });

  await page.goto('/desktop');
  const desktopScrollbarWidth = await page.evaluate(
    () => getComputedStyle(document.documentElement, '::-webkit-scrollbar').width,
  );
  expect(desktopScrollbarWidth).toBe('16px');
});

test('minimal home has visible keyboard focus and a working skip link', async ({ page }) => {
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

test('minimal home fits a 390px viewport and key targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  for (const locator of [
    page.getByRole('link', { name: 'See the work', exact: true }),
    page.getByRole('link', { name: 'Contact', exact: true }).last(),
    page.getByRole('link', { name: 'Open the Windows 95 version' }),
    page.getByRole('link', { name: 'Uptick', exact: true }),
    page.getByRole('link', { name: 'bike-cli', exact: true }),
    page.getByRole('button', { name: 'Menu', exact: true }),
  ]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }

  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Contact' })).toBeVisible();
});

test('minimal source avoids prohibited visual idioms and deployable source contains no em dash', async ({ page }) => {
  await page.goto('/');
  const classNames = await page.locator('[class]').evaluateAll((nodes) => nodes.flatMap((node) => Array.from(node.classList)));
  expect(classNames.filter((name) => /(?:card|rounded|glass|gradient|eyebrow|grid)/i.test(name))).toEqual([]);

  const sourceRoot = join(process.cwd(), 'src');
  const sourceFiles = (await walk(sourceRoot)).filter((path) => ['.ts', '.tsx', '.css'].includes(extname(path)));
  const violations: string[] = [];
  for (const path of sourceFiles) {
    if ((await readFile(path, 'utf8')).includes('—')) violations.push(relative(process.cwd(), path));
  }
  expect(violations, `em dash found in deployable source: ${violations.join(', ')}`).toEqual([]);
});
