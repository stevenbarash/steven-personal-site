import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer as createTcpServer } from 'node:net';
import { resolve } from 'node:path';

const host = '127.0.0.1';
const port = 3102;
const url = `http://${host}:${port}`;
const distDir = '.next-lighthouse';
const distPath = resolve(distDir);
const lockDir = resolve(`${distDir}.lock`);
const lockMetadataPath = resolve(lockDir, 'owner.json');
const recoveryMetadataPath = resolve(lockDir, 'recovery.json');
const reportDir = resolve('.lighthouse');
const reportPath = resolve(reportDir, 'local-production.report.json');
const nextBin = process.platform === 'win32' ? 'next.cmd' : 'next';
const lighthouseBin = process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse';
const env = { ...process.env, NEXT_TEST_DIST_DIR: distDir };
delete env.VERCEL_ENV;

const owner = {
  pid: process.pid,
  token: randomUUID(),
  createdAt: new Date().toISOString(),
};
const activeChildren = new Set();
const activeProcessGroups = new Set();
let ownsLock = false;
let ownsRecoveryClaim = false;
let cleanupPromise;
let signalExitStarted = false;
let auditServerSpawned = false;

const processIsAlive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code !== 'ESRCH';
  }
};

const readLockOwner = async () => {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(lockMetadataPath, 'utf8'));
  } catch (error) {
    throw new Error(`Lighthouse lock has no valid owner metadata: ${lockDir}`, { cause: error });
  }
  if (!Number.isSafeInteger(parsed?.pid) || parsed.pid <= 0 || typeof parsed.token !== 'string') {
    throw new Error(`Lighthouse lock has invalid owner metadata: ${lockDir}`);
  }
  return parsed;
};

const readRecoveryOwner = async () => JSON.parse(await readFile(recoveryMetadataPath, 'utf8'));

const releaseRecoveryClaim = async () => {
  if (!ownsRecoveryClaim) return;
  try {
    const claimant = await readRecoveryOwner();
    if (claimant.pid === owner.pid && claimant.token === owner.token) {
      await rm(recoveryMetadataPath, { force: true });
    }
  } catch {
    // The containing stale lock may already have been removed.
  } finally {
    ownsRecoveryClaim = false;
  }
};

const acquireLock = async () => {
  try {
    await mkdir(lockDir);
    try {
      await writeFile(lockMetadataPath, JSON.stringify(owner, null, 2), { flag: 'wx' });
    } catch (error) {
      await rm(lockDir, { recursive: true, force: true });
      throw error;
    }
    ownsLock = true;
    return;
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
  }

  try {
    await writeFile(recoveryMetadataPath, JSON.stringify(owner), { flag: 'wx' });
    ownsRecoveryClaim = true;
  } catch (error) {
    if (error?.code === 'EEXIST') {
      const claimant = await readRecoveryOwner();
      if (Number.isSafeInteger(claimant?.pid) && !processIsAlive(claimant.pid)) {
        await rm(recoveryMetadataPath, { force: true });
        return acquireLock();
      }
      throw new Error(`Lighthouse lock inspection or recovery is already in progress: ${lockDir}`);
    }
    throw error;
  }

  const staleOwner = await readLockOwner();
  if (processIsAlive(staleOwner.pid)) {
    await releaseRecoveryClaim();
    throw new Error(`Lighthouse build lock is owned by live PID ${staleOwner.pid}: ${lockDir}`);
  }

  const currentOwner = await readLockOwner();
  if (currentOwner.pid !== staleOwner.pid || currentOwner.token !== staleOwner.token) {
    throw new Error(`Lighthouse lock ownership changed during stale-lock recovery: ${lockDir}`);
  }
  await rm(lockDir, { recursive: true });
  ownsRecoveryClaim = false;
  await acquireLock();
};

const spawnTracked = (command, args) => {
  const child = spawn(command, args, {
    env,
    stdio: 'inherit',
    detached: process.platform !== 'win32',
  });
  activeChildren.add(child);
  if (process.platform !== 'win32' && Number.isSafeInteger(child.pid)) {
    activeProcessGroups.add(child.pid);
  }
  child.once('error', () => activeChildren.delete(child));
  child.once('exit', () => activeChildren.delete(child));
  return child;
};

const processGroupIsAlive = (pid) => {
  try {
    process.kill(-pid, 0);
    return true;
  } catch (error) {
    return error?.code !== 'ESRCH';
  }
};

const waitForCondition = async (predicate, timeoutMs) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return true;
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  return predicate();
};

const waitForChildExit = (child, timeoutMs) => new Promise((resolveExit) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    resolveExit(true);
    return;
  }
  const timeout = setTimeout(() => resolveExit(false), timeoutMs);
  child.once('exit', () => {
    clearTimeout(timeout);
    resolveExit(true);
  });
});

const signalChildTree = (child, signal) => {
  if (!Number.isSafeInteger(child.pid) || child.exitCode !== null || child.signalCode !== null) return;
  try {
    if (process.platform === 'win32') child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch (error) {
    if (error?.code !== 'ESRCH') throw error;
  }
};

const terminateChild = async (child) => {
  signalChildTree(child, 'SIGTERM');
  if (await waitForChildExit(child, 5_000)) return;
  signalChildTree(child, 'SIGKILL');
  await waitForChildExit(child, 5_000);
};

const terminateProcessGroup = async (pid) => {
  if (!processGroupIsAlive(pid)) return;
  try {
    process.kill(-pid, 'SIGTERM');
  } catch (error) {
    if (error?.code !== 'ESRCH') throw error;
  }
  if (await waitForCondition(() => !processGroupIsAlive(pid), 5_000)) return;
  try {
    process.kill(-pid, 'SIGKILL');
  } catch (error) {
    if (error?.code !== 'ESRCH') throw error;
  }
  await waitForCondition(() => !processGroupIsAlive(pid), 5_000);
};

const waitForPortRelease = async () => {
  const released = await waitForCondition(async () => {
    try {
      await assertPortAvailable();
      return true;
    } catch {
      return false;
    }
  }, 10_000);
  if (!released) throw new Error(`Timed out waiting for Lighthouse port ${port} to be released.`);
};

const removeOwnedLock = async () => {
  if (!ownsLock) return;
  try {
    const currentOwner = await readLockOwner();
    if (currentOwner.pid === owner.pid && currentOwner.token === owner.token) {
      await rm(lockDir, { recursive: true, force: true });
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  } finally {
    ownsLock = false;
  }
};

const stillOwnsLock = async () => {
  if (!ownsLock) return false;
  try {
    const currentOwner = await readLockOwner();
    return currentOwner.pid === owner.pid && currentOwner.token === owner.token;
  } catch {
    return false;
  }
};

const cleanup = () => {
  if (cleanupPromise) return cleanupPromise;
  cleanupPromise = (async () => {
    if (process.platform === 'win32') {
      await Promise.all([...activeChildren].map(terminateChild));
    } else {
      await Promise.all([...activeProcessGroups].map(terminateProcessGroup));
    }
    if (auditServerSpawned) await waitForPortRelease();
    await releaseRecoveryClaim();
    if (await stillOwnsLock()) await rm(distPath, { recursive: true, force: true });
    await removeOwnedLock();
  })();
  return cleanupPromise;
};

const signalExitCodes = { SIGINT: 130, SIGTERM: 143, SIGHUP: 129 };
for (const signal of Object.keys(signalExitCodes)) {
  process.on(signal, () => {
    if (signalExitStarted) return;
    signalExitStarted = true;
    void cleanup()
      .catch((error) => console.error(error))
      .finally(() => process.exit(signalExitCodes[signal]));
  });
}

const run = (command, args) => new Promise((resolveRun, reject) => {
  const child = spawnTracked(command, args);
  child.once('error', reject);
  child.once('exit', (code, signal) => {
    if (code === 0) resolveRun();
    else reject(new Error(`${command} exited with ${code ?? signal}`));
  });
});

const assertPortAvailable = () => new Promise((resolveCheck, reject) => {
  const probe = createTcpServer();
  probe.once('error', (error) => reject(new Error(`Lighthouse port ${port} is unavailable.`, { cause: error })));
  probe.listen(port, host, () => probe.close(resolveCheck));
});

const waitForServer = async (server) => {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null || server.signalCode !== null) {
      throw new Error(`Lighthouse Next.js server exited before becoming ready.`);
    }
    let response;
    try {
      response = await fetch(url);
    } catch {
      // The production server is still starting.
    }
    if (response?.ok) {
      await new Promise((resolveConfirmation) => setTimeout(resolveConfirmation, 250));
      if (server.exitCode !== null || server.signalCode !== null) {
        throw new Error(`Lighthouse Next.js server exited before readiness was confirmed.`);
      }
      return;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
};

try {
  await acquireLock();
  await rm(distPath, { recursive: true, force: true });
  await run(nextBin, ['build', '--webpack']);
  await assertPortAvailable();
  const server = spawnTracked(nextBin, ['start', '--hostname', host, '--port', String(port)]);
  auditServerSpawned = true;
  await waitForServer(server);
  await mkdir(reportDir, { recursive: true });
  await run(lighthouseBin, [
    url,
    '--quiet',
    '--output=json',
    `--output-path=${reportPath}`,
    '--chrome-flags=--headless',
  ]);

  const report = JSON.parse(await readFile(reportPath, 'utf8'));
  const scores = Object.fromEntries(
    Object.entries(report.categories).map(([name, category]) => [
      name,
      Math.round(category.score * 100),
    ]),
  );
  console.log(`Lighthouse report: ${reportPath}`);
  console.log(`Lighthouse scores: ${JSON.stringify(scores)}`);
} catch (error) {
  if (!signalExitStarted) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
} finally {
  await cleanup();
}
