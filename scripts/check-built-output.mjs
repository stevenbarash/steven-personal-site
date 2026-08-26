import { readFile, readdir } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const forbiddenPatterns = [
  { label: 'em dash character', pattern: /—/ },
  { label: 'absolute stale host', pattern: /https:\/\/(?:www\.)?stevenbarash\.com(?:[/?#]|$)/i },
  { label: 'rejected X handle', pattern: /@steven_barash\b/i },
  { label: 'private marker', pattern: /\bprivate[ -]note\b/i },
  { label: 'internal-only marker', pattern: /\binternal[ -]only\b/i },
  { label: 'confidential marker', pattern: /\bconfidential\b/i },
  { label: 'unapproved claim', pattern: /largest deal closed in the SLED/i },
  { label: 'unapproved claim', pattern: /Ranked #1 in segment by ARR/i },
  { label: 'unapproved claim', pattern: /Ranked #5 globally/i },
  { label: 'unapproved claim', pattern: /largest Commercial segment deal/i },
  { label: 'unapproved claim', pattern: /Solutions Engineer of the Year FY2[56]/i },
  {
    label: 'unapproved global specialty',
    pattern: /\bagent identity\b/i,
    allowedPathPattern: /(?:^|\/)desktop(?:\/|\.|$)/i,
  },
  { label: 'unapproved claim', pattern: /DialectFlow|dialectflow\.com/i },
  {
    label: 'unapproved claim identifier',
    pattern: /(?:descope-se-of-year-fy26|idme-se-of-year-fy25|dialectflow-project|okta-arr-rank-fy23|okta-largest-commercial-deal|idme-largest-sled-deal|confidential-customer-names|confidential-revenue-amounts)/i,
  },
  {
    label: 'internal evidence marker',
    pattern: /(?:pult-project|uptick-zed-project|bike-cli-project|personal-site-project|bfsi-nexus-2026-session|\bevidenceIds\b|\bpublicationStatus\b|\bevidenceLevel\b)/,
    allowedPathPattern: /^server\/app\/.*\.js$/,
  },
];

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
};

const normalizedRelativePath = (root, path) => relative(root, path).split(sep).join('/');

export const classifyDeployableFile = (relativePath) => {
  if (/^server\/app\/.*\.(?:html|body)$/.test(relativePath)) return 'rendered HTML';
  if (/^server\/app\/.*\.rsc$/.test(relativePath)) return 'rendered route payload';
  if (/^(?:server\/app|static\/chunks)\/.*\.js$/.test(relativePath)) {
    return 'first-party JavaScript';
  }
  return undefined;
};

export const findBuiltOutputViolations = (relativePath, contents) => forbiddenPatterns
  .filter(({ pattern, allowedPathPattern }) => (
    pattern.test(contents) && !allowedPathPattern?.test(relativePath)
  ))
  .map(({ label }) => label);

export const checkBuiltOutput = async (buildDirectory) => {
  const root = resolve(buildDirectory);
  const candidates = (await walk(root))
    .map((path) => ({ path, relativePath: normalizedRelativePath(root, path) }))
    .map((file) => ({ ...file, kind: classifyDeployableFile(file.relativePath) }))
    .filter((file) => file.kind);

  const counts = { 'rendered HTML': 0, 'rendered route payload': 0, 'first-party JavaScript': 0 };
  const violations = [];
  for (const file of candidates) {
    counts[file.kind] += 1;
    const contents = await readFile(file.path, 'utf8');
    for (const label of findBuiltOutputViolations(file.relativePath, contents)) {
      violations.push(`${file.relativePath}: ${label}`);
    }
  }

  if (Object.values(counts).some((count) => count === 0)) {
    throw new Error(`Built-output scan did not find every required output class: ${JSON.stringify(counts)}`);
  }
  if (violations.length > 0) {
    throw new Error(`Built-output integrity failed:\n${violations.join('\n')}`);
  }

  return { count: candidates.length, counts };
};

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isCli) {
  const buildDirectory = process.argv[2] ?? process.env.NEXT_TEST_DIST_DIR ?? '.next';
  try {
    const result = await checkBuiltOutput(buildDirectory);
    console.log(
      `Built-output integrity passed: ${result.count} deployable files scanned `
      + `(${result.counts['rendered HTML']} rendered HTML, `
      + `${result.counts['rendered route payload']} rendered route payload, `
      + `${result.counts['first-party JavaScript']} first-party JavaScript).`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
