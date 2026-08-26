#!/usr/bin/env node

import { evidenceRecords } from '../src/content/evidence.ts';
import { probeEvidenceUrl } from './evidence-reachability.js';

const TIMEOUT_MS = 8_000;
const MAX_CONCURRENCY = 4;
const urls = [...new Set(evidenceRecords.flatMap((record) => record.sourceUrls))];
const allowedHosts = new Set(urls.map((url) => new URL(url).hostname.toLowerCase()));
const failures = [];
let nextIndex = 0;

async function worker() {
  while (nextIndex < urls.length) {
    const url = urls[nextIndex];
    nextIndex += 1;
    try {
      const result = await probeEvidenceUrl(url, { allowedHosts, timeoutMs: TIMEOUT_MS });
      console.log(`EVIDENCE ${result.status} ${url} -> ${result.finalUrl}`);
      if (result.status < 200 || result.status >= 400) {
        failures.push(`${url} -> ${result.finalUrl}: HTTP ${result.status}`);
      }
    } catch (error) {
      failures.push(`${url}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

await Promise.all(Array.from(
  { length: Math.min(MAX_CONCURRENCY, urls.length) },
  () => worker(),
));

if (failures.length > 0) {
  console.error(`\nFAIL evidence reachability (${failures.length}/${urls.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`\nPASS evidence reachability (${urls.length} public HTTPS sources)`);
}
