import { verifyPublicHosts } from './public-host-verifier.js';

/**
 * @param {{
 *   configJson?: string,
 *   defaultConfig?: object,
 *   fetchImpl?: Function,
 *   lookupImpl?: Function,
 *   stdout?: (line: string) => void,
 *   stderr?: (line: string) => void,
 * }} [options]
 */
export async function runPublicHostVerifierCli(options = {}) {
  const {
    configJson,
    defaultConfig,
    fetchImpl,
    lookupImpl,
    stdout = console.log,
    stderr = console.error,
  } = options;
  try {
    const config = configJson ? JSON.parse(configJson) : defaultConfig;
    const result = await verifyPublicHosts(config, fetchImpl, lookupImpl);

    for (const probe of result.results) {
      const destination = probe.final
        ? `; final ${probe.final.url} -> ${probe.final.status}`
        : '';
      stdout(`PROBE [${probe.label}] ${probe.method} ${probe.url} -> ${probe.status}${destination}`);
    }

    if (result.failures.length > 0) {
      stderr(`\nFAIL public-host verification (${result.failures.length} assertion${result.failures.length === 1 ? '' : 's'}):`);
      for (const failure of result.failures) stderr(`- ${failure}`);
      return 1;
    }

    stdout('\nPASS public-host verification');
    return 0;
  } catch (error) {
    stderr(`FAIL public-host verification could not complete: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}
