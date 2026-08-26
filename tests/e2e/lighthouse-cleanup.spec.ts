import { spawn, type ChildProcess } from 'node:child_process';
import { chmod, mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { connect } from 'node:net';
import { createServer } from 'node:http';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const lighthouseScript = resolve(process.cwd(), 'scripts/lighthouse-local.mjs');

const exists = async (path: string) => stat(path).then(() => true, () => false);

const waitFor = async (predicate: () => Promise<boolean>, timeout = 10_000) => {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  throw new Error('Timed out waiting for isolated Lighthouse fixture state.');
};

const portIsListening = () => new Promise<boolean>((resolveCheck) => {
  const socket = connect({ host: '127.0.0.1', port: 3102 });
  socket.once('connect', () => {
    socket.destroy();
    resolveCheck(true);
  });
  socket.once('error', () => resolveCheck(false));
});

const waitForExit = (child: ChildProcess) => new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
  (resolveExit, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolveExit({ code, signal }));
  },
);

const fakeNext = `#!/usr/bin/env node
const { spawn } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const { createServer } = require('node:http');
const { join } = require('node:path');
const command = process.argv[2];
mkdirSync(process.env.NEXT_TEST_DIST_DIR, { recursive: true });
writeFileSync(join(process.cwd(), command + '.pid'), String(process.pid));
if (command === 'build') {
  if (process.env.FAKE_BUILD_WAIT === '1') setInterval(() => {}, 1000);
  else process.exit(0);
} else if (command === 'start') {
  const port = Number(process.argv[process.argv.indexOf('--port') + 1]);
  if (process.env.FAKE_SERVER_DESCENDANT === '1') {
    const descendant = spawn(process.execPath, ['-e', \`
      const { createServer } = require('node:http');
      const { writeFileSync } = require('node:fs');
      const { join } = require('node:path');
      const server = createServer((request, response) => response.end('ok'));
      writeFileSync(join(process.cwd(), 'server-descendant.pid'), String(process.pid));
      server.listen(\${port}, '127.0.0.1');
      process.on('SIGTERM', () => setTimeout(() => server.close(() => process.exit(0)), 750));
    \`], { stdio: 'ignore' });
    process.on('SIGTERM', () => process.exit(0));
    process.on('SIGINT', () => process.exit(0));
  } else {
    const server = createServer((request, response) => { response.end('ok'); });
    server.listen(port, '127.0.0.1');
    const stop = () => server.close(() => process.exit(0));
    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
  }
}
`;

const fakeLighthouse = `#!/usr/bin/env node
const { mkdirSync, writeFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
writeFileSync(join(process.cwd(), 'lighthouse.pid'), String(process.pid));
const outputArg = process.argv.find((arg) => arg.startsWith('--output-path='));
const outputPath = outputArg.slice('--output-path='.length);
if (process.env.FAKE_LIGHTHOUSE_WAIT === '1') setInterval(() => {}, 1000);
else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify({ categories: { performance: { score: 1 } } }));
}
`;

const setupFixture = async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lighthouse-cleanup-'));
  const bin = join(cwd, 'bin');
  await mkdir(bin);
  await Promise.all([
    writeFile(join(bin, 'next'), fakeNext),
    writeFile(join(bin, 'lighthouse'), fakeLighthouse),
  ]);
  await Promise.all([chmod(join(bin, 'next'), 0o755), chmod(join(bin, 'lighthouse'), 0o755)]);
  return { cwd, bin };
};

const killFixturePid = async (cwd: string, name: string) => {
  try {
    const pid = Number(await readFile(join(cwd, `${name}.pid`), 'utf8'));
    process.kill(pid, 'SIGKILL');
  } catch {
    // The child already exited or never started.
  }
};

test('Lighthouse lock recovery preserves live owners and replaces dead owners', async () => {
  const runtimeSource = await readFile(lighthouseScript, 'utf8');
  expect(runtimeSource).toContain("const recoveryMetadataPath = resolve(lockDir, 'recovery.json');");
  expect(runtimeSource).toContain("writeFile(recoveryMetadataPath, JSON.stringify(owner), { flag: 'wx' })");

  const { cwd, bin } = await setupFixture();
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH ?? ''}`,
    FAKE_BUILD_WAIT: '0',
    FAKE_LIGHTHOUSE_WAIT: '0',
  };
  const lockDir = join(cwd, '.next-lighthouse.lock');

  try {
    await mkdir(lockDir);
    await writeFile(join(lockDir, 'owner.json'), JSON.stringify({
      pid: process.pid,
      token: 'live-owner',
      createdAt: new Date().toISOString(),
    }));
    const blockedRun = spawn(process.execPath, [lighthouseScript], { cwd, env, stdio: 'ignore' });
    expect((await waitForExit(blockedRun)).code).not.toBe(0);
    expect(await exists(lockDir)).toBe(true);

    await rm(lockDir, { recursive: true });
    await mkdir(lockDir);
    await writeFile(join(lockDir, 'owner.json'), JSON.stringify({
      pid: 2_147_483_647,
      token: 'dead-owner',
      createdAt: new Date(0).toISOString(),
    }));
    await writeFile(join(lockDir, 'recovery.json'), JSON.stringify({
      pid: 2_147_483_646,
      token: 'dead-recovery',
      createdAt: new Date(0).toISOString(),
    }));
    const recoveredRun = spawn(process.execPath, [lighthouseScript], { cwd, env, stdio: 'ignore' });
    expect((await waitForExit(recoveredRun)).code).toBe(0);
    expect(await exists(lockDir)).toBe(false);
  } finally {
    await Promise.all(['build', 'start', 'lighthouse'].map((name) => killFixturePid(cwd, name)));
    await rm(cwd, { recursive: true, force: true });
  }
});

test('Lighthouse refuses to audit an unrelated process already using its port', async () => {
  const { cwd, bin } = await setupFixture();
  const unrelatedServer = createServer((request, response) => response.end('unrelated'));
  await new Promise<void>((resolveListen) => unrelatedServer.listen(3102, '127.0.0.1', resolveListen));

  try {
    const child = spawn(process.execPath, [lighthouseScript], {
      cwd,
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH ?? ''}`,
        FAKE_BUILD_WAIT: '0',
        FAKE_LIGHTHOUSE_WAIT: '0',
      },
      stdio: 'ignore',
    });
    expect((await waitForExit(child)).code).not.toBe(0);
    expect(await exists(join(cwd, 'lighthouse.pid'))).toBe(false);
  } finally {
    await new Promise<void>((resolveClose) => unrelatedServer.close(() => resolveClose()));
    await Promise.all(['build', 'start', 'lighthouse'].map((name) => killFixturePid(cwd, name)));
    await rm(cwd, { recursive: true, force: true });
  }
});

test('Lighthouse cleanup waits for a server descendant to release its port', async () => {
  const { cwd, bin } = await setupFixture();
  const child = spawn(process.execPath, [lighthouseScript], {
    cwd,
    env: {
      ...process.env,
      PATH: `${bin}:${process.env.PATH ?? ''}`,
      FAKE_BUILD_WAIT: '0',
      FAKE_LIGHTHOUSE_WAIT: '1',
      FAKE_SERVER_DESCENDANT: '1',
    },
    stdio: 'ignore',
  });

  try {
    await waitFor(async () => await exists(join(cwd, 'server-descendant.pid')) && await portIsListening());
    child.kill('SIGINT');
    const exit = await waitForExit(child);

    expect(exit.code).toBe(130);
    expect(await portIsListening()).toBe(false);
    expect(await exists(join(cwd, '.next-lighthouse.lock'))).toBe(false);
  } finally {
    await Promise.all(['build', 'start', 'lighthouse', 'server-descendant'].map((name) => killFixturePid(cwd, name)));
    await rm(cwd, { recursive: true, force: true });
  }
});

test('Lighthouse interruption cleanup is idempotent during build and after server spawn', async () => {
  const { cwd, bin } = await setupFixture();
  const baseEnv = { ...process.env, PATH: `${bin}:${process.env.PATH ?? ''}` };

  try {
    for (const stage of ['build', 'lighthouse'] as const) {
      const child = spawn(process.execPath, [lighthouseScript], {
        cwd,
        env: {
          ...baseEnv,
          FAKE_BUILD_WAIT: stage === 'build' ? '1' : '0',
          FAKE_LIGHTHOUSE_WAIT: stage === 'lighthouse' ? '1' : '0',
        },
        stdio: 'ignore',
      });

      await waitFor(async () => {
        const stageReady = stage === 'build'
          ? await exists(join(cwd, 'build.pid'))
          : await exists(join(cwd, 'lighthouse.pid')) && await portIsListening();
        return stageReady && await exists(join(cwd, '.next-lighthouse.lock'));
      });
      child.kill('SIGINT');
      const exit = await waitForExit(child);

      expect(exit.code).toBe(130);
      expect(await exists(join(cwd, '.next-lighthouse'))).toBe(false);
      expect(await exists(join(cwd, '.next-lighthouse.lock'))).toBe(false);
      await waitFor(async () => !(await portIsListening()));

      await rm(join(cwd, 'build.pid'), { force: true });
      await rm(join(cwd, 'start.pid'), { force: true });
      await rm(join(cwd, 'lighthouse.pid'), { force: true });
    }

    const nextRun = spawn(process.execPath, [lighthouseScript], {
      cwd,
      env: { ...baseEnv, FAKE_BUILD_WAIT: '0', FAKE_LIGHTHOUSE_WAIT: '0' },
      stdio: 'ignore',
    });
    expect((await waitForExit(nextRun)).code).toBe(0);
    expect(await exists(join(cwd, '.next-lighthouse'))).toBe(false);
    expect(await exists(join(cwd, '.next-lighthouse.lock'))).toBe(false);
    expect(await portIsListening()).toBe(false);
  } finally {
    await Promise.all(['build', 'start', 'lighthouse'].map((name) => killFixturePid(cwd, name)));
    await rm(cwd, { recursive: true, force: true });
  }
});
