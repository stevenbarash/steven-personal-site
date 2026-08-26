import { spawn } from 'node:child_process';
import { expect, test } from '@playwright/test';

const waitForServer = async (url: string) => {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for ${url}`);
};

test('production server returns expected project 404s without internal error logs', async () => {
  const port = 3111;
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn('next', ['start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, NEXT_TEST_DIST_DIR: '.next-playwright' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout?.on('data', (chunk) => { logs += chunk.toString(); });
  child.stderr?.on('data', (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer(origin);
    for (const path of [
      '/projects/does-not-exist',
      '/projects/future-case-study',

    ]) {
      expect((await fetch(`${origin}${path}`)).status, path).toBe(404);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(logs).not.toContain('NoFallbackError');
    expect(logs).not.toMatch(/\bError:/);
  } finally {
    child.kill('SIGTERM');
    await new Promise<void>((resolve) => {
      if (child.exitCode !== null || child.signalCode !== null) resolve();
      else child.once('exit', () => resolve());
    });
  }
});
