import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
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

test('production build runs integrity checks against rendered HTML and first-party route chunks', () => {
  const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
  expect(packageJson.scripts.build).toContain('node scripts/check-built-output.mjs');
  expect(packageJson.scripts.build).not.toContain('check-built-output.mjs .next');

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
