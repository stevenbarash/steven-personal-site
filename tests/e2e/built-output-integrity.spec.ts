import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

const classifyDeployableFiles = (paths: string[]) => {
  const scriptUrl = pathToFileURL(resolve(process.cwd(), 'scripts/check-built-output.mjs')).href;
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `import { classifyDeployableFile } from ${JSON.stringify(scriptUrl)}; console.log(JSON.stringify(${JSON.stringify(paths)}.map(classifyDeployableFile)));`,
    ],
    { encoding: 'utf8' },
  );
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
};

const findViolations = (relativePath: string, contents: string) => {
  const scriptUrl = pathToFileURL(resolve(process.cwd(), 'scripts/check-built-output.mjs')).href;
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `import { findBuiltOutputViolations } from ${JSON.stringify(scriptUrl)}; console.log(JSON.stringify(findBuiltOutputViolations(${JSON.stringify(relativePath)}, ${JSON.stringify(contents)})));`,
    ],
    { encoding: 'utf8' },
  );
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
};

test('production integrity scan checks the actual local build output', () => {
  const result = spawnSync(
    process.execPath,
    ['scripts/check-built-output.mjs', '.next-playwright'],
    { cwd: process.cwd(), encoding: 'utf8' },
  );

  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toMatch(/Built-output integrity passed: \d+ deployable files scanned/);
  expect(result.stdout).toContain('rendered HTML');
  expect(result.stdout).toContain('first-party JavaScript');
});

test('integrity scope includes shared browser chunks and rendered route payloads', () => {
  expect(classifyDeployableFiles([
    'static/chunks/980-deadbeef.js',
    'server/app/index.rsc',
    'server/app/index.segments/__PAGE__.segment.rsc',
  ])).toEqual([
    'first-party JavaScript',
    'rendered route payload',
    'rendered route payload',
  ]);
});

test('AI agent identity is blocked from every public browser surface', () => {
  expect(findViolations('server/app/desktop.html', 'AI agent identity')).toEqual([]);
  expect(findViolations('server/app/page.html', 'AI agent identity')).toContain('unapproved global specialty');
});

test('internal evidence IDs and governance fields cannot reach browser bundles or route payloads', () => {
  for (const marker of ['pult-project', 'evidenceIds', 'publicationStatus', 'evidenceLevel']) {
    expect(findViolations('static/chunks/app/page.js', marker)).toContain('internal evidence marker');
    expect(findViolations('server/app/index.rsc', marker)).toContain('internal evidence marker');
    expect(findViolations('server/app/page.js', marker)).toEqual([]);
  }
});

const vercelFiles = {
  'output/static/index.html': '<h1>Public profile</h1>',
  'output/static/index.rsc': 'Public route payload',
  'output/static/index.segments/__PAGE__.segment.rsc': 'Public segment payload',
  'output/static/_next/static/chunks/app/page.js': 'console.log("public");',
  'output/functions/projects/[slug].prerender-fallback.html': '<h1>Project</h1>',
  'output/functions/projects/[slug].prerender-fallback.rsc': 'Project payload',
  'server/app/page.js': 'console.log("server route");',
};

async function scanFixture(files: Record<string, string>) {
  const directory = await mkdtemp(join(tmpdir(), 'site-built-output-'));
  try {
    for (const [path, contents] of Object.entries(files)) {
      const destination = join(directory, path);
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, contents);
    }
    return spawnSync(process.execPath, ['scripts/check-built-output.mjs', directory], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('Vercel adapter output is scanned without requiring local server/app prerenders', async () => {
  const result = await scanFixture(vercelFiles);
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toContain('2 rendered HTML, 3 rendered route payload, 2 first-party JavaScript');
});

for (const path of [
  'output/static/index.html',
  'output/static/index.rsc',
  'output/static/index.segments/__PAGE__.segment.rsc',
  'output/static/_next/static/chunks/app/page.js',
  'output/functions/projects/[slug].prerender-fallback.html',
  'output/functions/projects/[slug].prerender-fallback.rsc',
]) {
  test(`Vercel integrity scan rejects private content in ${path}`, async () => {
    const result = await scanFixture({ ...vercelFiles, [path]: 'private-note' });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(`${path}: private marker`);
  });
}

test('Vercel output missing route payloads still fails integrity validation', async () => {
  const result = await scanFixture({
    'output/static/index.html': '<h1>Public profile</h1>',
    'output/static/_next/static/chunks/app/page.js': 'console.log("public");',
  });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('"rendered route payload":0');
});
