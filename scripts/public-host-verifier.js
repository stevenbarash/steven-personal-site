import { lookup as dnsLookup } from 'node:dns/promises';
import { request as httpsRequest } from 'node:https';
import { isIP } from 'node:net';
import { Readable } from 'node:stream';

const CHECKPOINT_SIGNATURES = [
  /vercel security checkpoint/i,
  /security checkpoint/i,
  /x-vercel-challenge-token/i,
];
const DEFAULT_MAX_BODY_BYTES = 64 * 1024;
const DEFAULT_LABEL = 'browser';

const inIpv4Cidr = (octets, network, prefix) => {
  const value = octets.reduce((result, octet) => ((result << 8) | octet) >>> 0, 0);
  const base = network.reduce((result, octet) => ((result << 8) | octet) >>> 0, 0);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (value & mask) === (base & mask);
};

const isPublicIpv4 = (address) => {
  const octets = address.split('.').map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false;
  }
  const blocked = [
    [[0, 0, 0, 0], 8],
    [[10, 0, 0, 0], 8],
    [[100, 64, 0, 0], 10],
    [[127, 0, 0, 0], 8],
    [[169, 254, 0, 0], 16],
    [[172, 16, 0, 0], 12],
    [[192, 0, 0, 0], 24],
    [[192, 0, 2, 0], 24],
    [[192, 88, 99, 0], 24],
    [[192, 168, 0, 0], 16],
    [[198, 18, 0, 0], 15],
    [[198, 51, 100, 0], 24],
    [[203, 0, 113, 0], 24],
    [[224, 0, 0, 0], 4],
    [[240, 0, 0, 0], 4],
  ];
  return !blocked.some(([network, prefix]) => inIpv4Cidr(octets, network, prefix));
};

export const isPublicIpAddress = (address) => {
  const family = isIP(address);
  if (family === 4) return isPublicIpv4(address);
  // Fail closed: the verifier does not connect to IPv6 answers until complete
  // global-unicast classification is available.
  return false;
};

const normalizeLookupResults = (result) => (Array.isArray(result) ? result : [result]);

export const createPinnedHttpsTransport = (requestImpl = httpsRequest) => (input, init = {}, destination) => new Promise((resolve, reject) => {
  if (!destination?.address || !destination?.family) {
    reject(new Error('HTTPS transport requires a validated pinned destination'));
    return;
  }
  const url = new URL(input);
  const request = requestImpl({
    protocol: 'https:',
    hostname: url.hostname,
    port: url.port || 443,
    path: `${url.pathname}${url.search}`,
    method: init.method ?? 'GET',
    headers: {
      ...Object.fromEntries(new Headers(init.headers).entries()),
      host: url.host,
    },
    servername: url.hostname,
    signal: init.signal,
    lookup: (_hostname, options, callback) => {
      if (options?.all) callback(null, [{ address: destination.address, family: destination.family }]);
      else callback(null, destination.address, destination.family);
    },
  }, (incoming) => {
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) {
      if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
      else if (value !== undefined) headers.set(name, value);
    }
    const status = incoming.statusCode;
    if (status === undefined) {
      incoming.destroy();
      reject(new Error('HTTPS response did not include a status code'));
      return;
    }
    const bodyForbidden = init.method === 'HEAD' || status === 204 || status === 205 || status === 304;
    if (bodyForbidden) incoming.resume();
    resolve({
      status,
      statusText: incoming.statusMessage,
      headers,
      body: bodyForbidden ? null : Readable.toWeb(incoming),
    });
  });
  request.once('error', reject);
  request.end();
});

export const pinnedHttpsTransport = createPinnedHttpsTransport();

export async function validatePublicHttpsUrl(value, label, options = {}) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a public HTTPS URL`);
  }
  if (url.username || url.password) throw new Error(`${label} must not include credentials`);
  const hostname = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const localName = hostname === 'localhost' || hostname.endsWith('.localhost');
  if (url.protocol !== 'https:' || localName) throw new Error(`${label} must be a public HTTPS URL`);
  if (options.allowedHosts && !options.allowedHosts.has(hostname)) {
    throw new Error(`${label} host ${hostname} is not in the trusted host allowlist`);
  }
  const family = isIP(hostname);
  if (family !== 0) throw new Error(`${label} must be a public HTTPS URL using a hostname, not an IP literal`);
  const lookupImpl = options.lookupImpl ?? ((host) => dnsLookup(host, { all: true, verbatim: true }));
  let answers;
  try {
    answers = normalizeLookupResults(await lookupImpl(hostname));
  } catch (error) {
    throw new Error(`${label} DNS resolution failed for ${hostname}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (answers.length === 0) throw new Error(`${label} DNS resolution returned no addresses for ${hostname}`);
  const normalizedAnswers = [];
  let unsupportedIpv6Address;
  for (const answer of answers) {
    const address = typeof answer === 'string' ? answer : answer.address;
    const answerFamily = typeof answer === 'string' ? isIP(address) : (answer.family ?? isIP(address));
    if (answerFamily === 6) {
      unsupportedIpv6Address ??= address;
      continue;
    }
    if (answerFamily !== 4 || !isPublicIpAddress(address)) {
      throw new Error(`${label} resolved ${hostname} to non-public address ${address}`);
    }
    normalizedAnswers.push({ address, family: answerFamily });
  }
  if (normalizedAnswers.length === 0) {
    throw new Error(`${label} resolved ${hostname} only to unsupported non-public IPv6 address ${unsupportedIpv6Address ?? '(unknown)'}`);
  }
  return { url, ...normalizedAnswers[0] };
}

export function inspectResponse({
  method,
  url,
  status,
  contentType = '',
  body = '',
  headers = {},
  expectedStatus,
  expectedContentType,
  label = undefined,
}) {
  const failures = [];
  const prefix = label ? `[${label}] ` : '';
  const normalizedHeaders = new Headers(headers);
  const headerText = Array.from(normalizedHeaders.entries())
    .map(([name, value]) => `${name}: ${value}`)
    .join('\n');

  if (status !== expectedStatus) failures.push(`${prefix}${method} ${url}: expected status ${expectedStatus}, received ${status}`);
  const mimeType = contentType.split(';', 1)[0].trim().toLowerCase();
  if (mimeType !== expectedContentType.trim().toLowerCase()) {
    failures.push(`${prefix}${method} ${url}: expected content type ${expectedContentType}, received ${contentType || '(missing)'}`);
  }
  if (CHECKPOINT_SIGNATURES.some((signature) => signature.test(`${body}\n${headerText}`))) {
    failures.push(`${prefix}${method} ${url}: checkpoint signature detected`);
  }
  return failures;
}

const abortableRead = (reader, signal) => new Promise((resolve, reject) => {
  if (signal.aborted) {
    reject(signal.reason);
    return;
  }
  const onAbort = () => reject(signal.reason);
  signal.addEventListener('abort', onAbort, { once: true });
  reader.read().then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
});

const cancelReaderWithoutWaiting = (reader, reason) => {
  try {
    void reader.cancel(reason).catch(() => {});
  } catch {
    // Cancellation is best-effort and must never delay verifier completion.
  }
};

const cancelBodyWithoutWaiting = (body, reason) => {
  if (!body) return;
  try {
    void body.cancel(reason).catch(() => {});
  } catch {
    // Cancellation is best-effort and must never delay verifier completion.
  }
};

async function readBoundedBody(response, signal, maxBodyBytes) {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await abortableRead(reader, signal);
      if (done) break;
      total += value.byteLength;
      if (total > maxBodyBytes) {
        cancelReaderWithoutWaiting(reader, `response body exceeds ${maxBodyBytes} bytes`);
        throw new Error(`response body exceeds ${maxBodyBytes} bytes`);
      }
      chunks.push(value);
    }
  } catch (error) {
    cancelReaderWithoutWaiting(reader, error);
    throw error;
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

const errorDetail = (error, signal, timeoutMs, phase) => {
  if (signal.aborted) return `timed out after ${timeoutMs}ms${phase ? ` while ${phase}` : ''}`;
  return `fetch failed (${error instanceof Error ? error.message : String(error)})`;
};

export function withDeadline(promise, timeoutMs, phase, signal) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer;
    const cleanup = () => {
      if (timer) clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(`timed out after ${timeoutMs}ms while ${phase}`));
    };
    const onAbort = () => fail();

    if (signal?.aborted) {
      fail();
      return;
    }
    signal?.addEventListener('abort', onAbort, { once: true });
    if (!signal) timer = setTimeout(fail, timeoutMs);
    Promise.resolve(promise).then(
      (value) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(value);
      },
      (error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
      },
    );
  });
}

/**
 * @typedef {{ url: URL, address: string, family: number }} ValidatedDestination
 * @typedef {(input: RequestInfo | URL, init: RequestInit, destination: ValidatedDestination) => Promise<{status: number, headers: Headers, body: ReadableStream | null}>} HttpsTransport
 */

/**
 * @param {object} config
 * @param {HttpsTransport} [transportImpl]
 * @param {Function} [lookupImpl]
 */
export async function verifyPublicHosts(config, transportImpl = pinnedHttpsTransport, lookupImpl) {
  const failures = [];
  const results = [];
  const timeoutMs = config.timeoutMs ?? 10_000;
  const maxBodyBytes = config.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  const allowedHosts = config.allowedHosts ? new Set(config.allowedHosts.map((host) => host.toLowerCase())) : undefined;
  const validationOptions = { lookupImpl, allowedHosts };

  const validatedDestinations = new Map();
  const validate = async (url, label) => {
    const destination = await withDeadline(
      validatePublicHttpsUrl(url, label, validationOptions),
      timeoutMs,
      'resolving DNS',
    );
    validatedDestinations.set(destination.url.href, destination);
    return destination;
  };
  for (const [index, route] of config.routes.entries()) await validate(route.url, `routes[${index}].url`);
  for (const [index, diagnostic] of (config.diagnostics ?? []).entries()) await validate(diagnostic.url, `diagnostics[${index}].url`);
  for (const [index, redirect] of config.redirects.entries()) {
    await validate(redirect.url, `redirects[${index}].url`);
    if (!Array.isArray(redirect.expectedLocations)) throw new Error(`redirects[${index}].expectedLocations must be an array`);
    if (!Number.isInteger(redirect.maxHops) || redirect.maxHops < 0) {
      throw new Error(`redirects[${index}].maxHops must be a non-negative integer`);
    }
    for (const [hopIndex, location] of redirect.expectedLocations.entries()) {
      await validate(location, `redirects[${index}].expectedLocations[${hopIndex}]`);
    }
  }

  const runProbe = async (url, init, consume) => {
    const destination = validatedDestinations.get(new URL(url).href);
    if (!destination) throw new Error(`${init.method} destination was not validated`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
    let phase = 'waiting for response headers';
    try {
      const response = await transportImpl(url, { ...init, signal: controller.signal }, destination);
      phase = 'reading response body';
      const body = init.method === 'GET'
        ? await readBoundedBody(response, controller.signal, maxBodyBytes)
        : (cancelBodyWithoutWaiting(response.body, 'HEAD response body not needed'), '');
      phase = '';
      return await consume(response, body);
    } catch (error) {
      throw new Error(errorDetail(error, controller.signal, timeoutMs, phase));
    } finally {
      clearTimeout(timer);
    }
  };

  const recordSimpleProbe = async ({ url, method, expectedStatus, expectedContentType, label, headers, diagnostic = false }) => {
    try {
      const probe = await runProbe(url, { method, redirect: 'manual', headers }, async (response, body) => {
        const responseFailures = inspectResponse({
          method, url, status: response.status,
          contentType: response.headers.get('content-type') ?? '', body, headers: response.headers,
          expectedStatus, expectedContentType, label,
        });
        failures.push(...responseFailures);
        return { method, url, status: response.status, failures: responseFailures, label, ...(diagnostic ? { diagnostic: true } : {}) };
      });
      results.push(probe);
    } catch (error) {
      const failure = `[${label}] ${method} ${url}: ${error instanceof Error ? error.message : String(error)}`;
      failures.push(failure);
      results.push({ method, url, status: null, failures: [failure], label, ...(diagnostic ? { diagnostic: true } : {}) });
    }
  };

  for (const route of config.routes) {
    for (const method of ['GET', 'HEAD']) {
      await recordSimpleProbe({ ...route, method, label: route.label ?? DEFAULT_LABEL });
    }
  }
  for (const diagnostic of config.diagnostics ?? []) {
    await recordSimpleProbe({
      ...diagnostic,
      method: 'GET',
      headers: { 'user-agent': diagnostic.userAgent },
      label: diagnostic.label,
      diagnostic: true,
    });
    results.at(-1).userAgent = diagnostic.userAgent;
  }

  for (const redirect of config.redirects) {
    const label = redirect.label ?? DEFAULT_LABEL;
    for (const method of ['GET', 'HEAD']) {
      const prefix = `[${label}] ${method} ${redirect.url}`;
      const expectedLocations = redirect.expectedLocations;
      const probeFailures = [];
      let currentUrl = redirect.url;
      let sourceStatus;
      let sourceLocation;
      let finalDestination;
      let finalStatus;
      try {
        for (let hopIndex = 0; ; hopIndex += 1) {
          const outcome = await runProbe(currentUrl, { method, redirect: 'manual' }, async (response, body) => ({ response, body }));
          const { response, body } = outcome;
          const isRedirect = response.status >= 300 && response.status < 400;
          const location = response.headers.get('location');
          if (hopIndex === 0) {
            sourceStatus = response.status;
            sourceLocation = location;
          }
          if (!isRedirect) {
            finalDestination = currentUrl;
            finalStatus = response.status;
            if (hopIndex < expectedLocations.length) {
              const failure = `${prefix}: expected redirect to ${expectedLocations[hopIndex]}, received final status ${response.status}`;
              failures.push(failure); probeFailures.push(failure);
            }
            const responseFailures = inspectResponse({
              method, url: currentUrl, status: response.status,
              contentType: response.headers.get('content-type') ?? '', body, headers: response.headers,
              expectedStatus: redirect.expectedFinalStatus, expectedContentType: redirect.expectedContentType, label,
            });
            failures.push(...responseFailures); probeFailures.push(...responseFailures);
            break;
          }
          const contentType = response.headers.get('content-type') ?? '';
          const checkpointFailures = inspectResponse({
            method, url: currentUrl, status: response.status, contentType, body, headers: response.headers,
            expectedStatus: response.status, expectedContentType: contentType.split(';', 1)[0], label,
          });
          failures.push(...checkpointFailures); probeFailures.push(...checkpointFailures);
          if (!redirect.expectedStatuses.includes(response.status)) {
            const failure = `${prefix}: unexpected redirect status ${response.status}`;
            failures.push(failure); probeFailures.push(failure);
          }
          if (!location) {
            const failure = `${prefix}: missing Location header`;
            failures.push(failure); probeFailures.push(failure); break;
          }
          const resolvedLocation = new URL(location, currentUrl).href;
          try {
            await validate(resolvedLocation, `${method} redirect destination`);
          } catch (error) {
            const failure = `${prefix}: unsafe redirect destination ${resolvedLocation} (${error instanceof Error ? error.message : String(error)})`;
            failures.push(failure); probeFailures.push(failure); break;
          }
          const source = new URL(redirect.url);
          const destination = new URL(resolvedLocation);
          if (`${destination.pathname}${destination.search}` !== `${source.pathname}${source.search}`) {
            const failure = `${prefix}: path/query loss (${source.pathname}${source.search} -> ${destination.pathname}${destination.search})`;
            failures.push(failure); probeFailures.push(failure);
          }
          if (hopIndex >= redirect.maxHops) {
            const failure = `${prefix}: redirect chain exceeds ${redirect.maxHops} hop(s)`;
            failures.push(failure); probeFailures.push(failure); break;
          }
          const expectedLocation = expectedLocations[hopIndex];
          if (resolvedLocation !== expectedLocation) {
            const failure = `${prefix}: incorrect Location ${resolvedLocation}; expected ${expectedLocation}`;
            failures.push(failure); probeFailures.push(failure); break;
          }
          currentUrl = resolvedLocation;
        }
        results.push({
          method, url: redirect.url, status: sourceStatus, location: sourceLocation, label,
          source: { url: redirect.url, status: sourceStatus, location: sourceLocation },
          final: finalDestination ? { url: finalDestination, status: finalStatus } : undefined,
          failures: probeFailures,
        });
      } catch (error) {
        const failure = `[${label}] ${method} ${currentUrl}: ${error instanceof Error ? error.message : String(error)}`;
        failures.push(failure); probeFailures.push(failure);
        results.push({
          method, url: redirect.url, status: sourceStatus ?? null, location: sourceLocation, label,
          source: { url: redirect.url, status: sourceStatus ?? null, location: sourceLocation }, failures: probeFailures,
        });
      }
    }
  }
  return { failures, results };
}
