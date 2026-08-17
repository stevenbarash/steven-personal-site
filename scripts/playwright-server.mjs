import { spawn } from 'node:child_process';

const nextBin = process.platform === 'win32' ? 'next.cmd' : 'next';
const env = { ...process.env, NEXT_TEST_DIST_DIR: '.next-playwright' };

const run = (args) => new Promise((resolve, reject) => {
  const child = spawn(nextBin, args, { env, stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`next ${args[0]} exited with ${code}`)));
});

await run(['build', '--webpack']);

const child = spawn(nextBin, ['start', '--hostname', '127.0.0.1', '--port', '3101'], { env, stdio: 'inherit' });

const stop = () => child.kill('SIGTERM');
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

child.on('exit', (code) => process.exit(code ?? 1));
