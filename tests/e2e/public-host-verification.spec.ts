import { expect, test } from '@playwright/test';
import { inspectResponse, verifyPublicHosts as verifyPublicHostsWithDns } from '../../scripts/public-host-verifier.js';
import { runPublicHostVerifierCli } from '../../scripts/public-host-verifier-cli.js';
import { probeEvidenceUrl } from '../../scripts/evidence-reachability.js';

const publicDns = async () => [{ address: '93.184.216.34', family: 4 }];
const verifyPublicHosts = (
  config: Parameters<typeof verifyPublicHostsWithDns>[0],
  fetchImpl?: Parameters<typeof verifyPublicHostsWithDns>[1],
) => verifyPublicHostsWithDns(config, fetchImpl, publicDns);

test('CLI runner returns deterministic exit 0 and 1 without external network', async () => {
  const configJson = JSON.stringify({
    routes: [{ url: 'https://fixture.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  });
  const run = async (status: number) => {
    const stdout: string[] = [];
    const stderr: string[] = [];
    const exitCode = await runPublicHostVerifierCli({
      configJson,
      fetchImpl: async (_input: RequestInfo | URL, init?: RequestInit) => new Response(
        init!.method === 'HEAD' ? null : '<!doctype html>',
        { status, headers: { 'content-type': 'text/html' } },
      ),
      lookupImpl: publicDns,
      stdout: (line: string) => stdout.push(line),
      stderr: (line: string) => stderr.push(line),
    });
    return { exitCode, stdout, stderr };
  };

  const passing = await run(200);
  expect(passing.exitCode).toBe(0);
  expect(passing.stdout.join('\n')).toContain('PASS public-host verification');
  expect(passing.stderr).toEqual([]);

  const failing = await run(429);
  expect(failing.exitCode).toBe(1);
  expect(failing.stderr.join('\n')).toContain('FAIL public-host verification (2 assertions):');
  expect(failing.stderr.join('\n')).toContain('expected status 200, received 429');
});

test('CLI runner reports malformed injected JSON readably with exit code 1', async () => {
  const stderr: string[] = [];
  const exitCode = await runPublicHostVerifierCli({ configJson: '{', stderr: (line) => stderr.push(line) });
  expect(exitCode).toBe(1);
  expect(stderr.join('\n')).toContain('FAIL public-host verification could not complete:');
  expect(stderr.join('\n')).toMatch(/JSON|property name|position/i);
  expect(stderr.join('\n')).not.toContain('at JSON.parse');
});

test('diagnostic browser crawler and social probes send their User-Agents without allowlisting guidance', async () => {
  const calls: Array<{ label: string; userAgent: string }> = [];
  const diagnostics = [
    { label: 'browser', userAgent: 'Mozilla/5.0 Phase0Browser' },
    { label: 'crawler', userAgent: 'Googlebot/2.1' },
    { label: 'social', userAgent: 'facebookexternalhit/1.1' },
  ].map((probe) => ({
    ...probe,
    url: 'https://barash.me/',
    expectedStatus: 200,
    expectedContentType: 'text/html',
  }));

  const result = await verifyPublicHosts({ routes: [], redirects: [], diagnostics }, async (_input, init) => {
    const userAgent = new Headers(init!.headers).get('user-agent')!;
    const label = diagnostics.find((probe) => probe.userAgent === userAgent)!.label;
    calls.push({ label, userAgent });
    return new Response('<!doctype html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  });

  expect(calls).toEqual(diagnostics.map(({ label, userAgent }) => ({ label, userAgent })));
  expect(result.failures).toEqual([]);
  expect(result.results.filter((probe) => 'diagnostic' in probe && probe.diagnostic)).toHaveLength(3);
  expect(JSON.stringify(result)).not.toMatch(/allowlist/i);
});

test('route verification rejects credentialed URLs before fetching', async () => {
  let fetchCalls = 0;
  const fetchImpl = async () => {
    fetchCalls += 1;
    return new Response('unexpected');
  };

  await expect(verifyPublicHosts({
    routes: [{
      url: 'https://user:secret@example.com/',
      expectedStatus: 200,
      expectedContentType: 'text/html',
    }],
    redirects: [],
  }, fetchImpl)).rejects.toThrow(/credentials/i);
  expect(fetchCalls).toBe(0);
});

test('route verification rejects non-public HTTPS URLs before fetching', async () => {
  const unsafeUrls = [
    'http://example.com/',
    'https://localhost/',
    'https://127.0.0.1/',
    'https://10.0.0.1/',
    'https://172.16.0.1/',
    'https://192.168.0.1/',
    'https://169.254.169.254/latest/meta-data/',
    'https://100.100.100.200/latest/meta-data/',
    'https://[::1]/',
    'https://[fe80::1]/',
  ];

  for (const url of unsafeUrls) {
    await expect(verifyPublicHosts({
      routes: [{ url, expectedStatus: 200, expectedContentType: 'text/html' }],
      redirects: [],
    }, async () => new Response('unexpected'))).rejects.toThrow(/public HTTPS/i);
  }
});

test('redirect verification validates every configured source and destination before fetching', async () => {
  const unsafeRedirects = [
    {
      url: 'https://127.0.0.1/source',
      expectedLocations: ['https://example.com/final'],
    },
    {
      url: 'https://example.com/source',
      expectedLocations: ['https://169.254.169.254/latest/meta-data/'],
    },
  ];

  for (const redirect of unsafeRedirects) {
    let fetchCalls = 0;
    await expect(verifyPublicHosts({
      routes: [],
      redirects: [{
        ...redirect,
        expectedStatuses: [302],
        expectedFinalStatus: 200,
        expectedContentType: 'text/html',
        maxHops: 1,
      }],
    }, async () => {
      fetchCalls += 1;
      return new Response('unexpected');
    })).rejects.toThrow(/public HTTPS/i);
    expect(fetchCalls).toBe(0);
  }
});

test('GET inspection rejects checkpoint responses and validates status and content type', () => {
  expect(inspectResponse({
    method: 'GET',
    url: 'https://barash.me/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><title>Steven Barash</title>',
    expectedStatus: 200,
    expectedContentType: 'text/html',
  })).toEqual([]);

  expect(inspectResponse({
    method: 'GET',
    url: 'https://barash.me/',
    status: 429,
    contentType: 'text/html; charset=utf-8',
    body: '<title>Vercel Security Checkpoint</title>\ncheckpoint',
    expectedStatus: 200,
    expectedContentType: 'text/html',
  })).toEqual(expect.arrayContaining([
    expect.stringContaining('429'),
    expect.stringContaining('checkpoint signature'),
  ]));
});

test('content type inspection compares the exact MIME token case-insensitively', () => {
  const base = {
    method: 'GET',
    url: 'https://barash.me/',
    status: 200,
    body: '<!doctype html>',
    expectedStatus: 200,
    expectedContentType: 'text/html',
  };

  expect(inspectResponse({ ...base, contentType: 'TEXT/HTML; charset=utf-8' })).toEqual([]);
  expect(inspectResponse({ ...base, contentType: 'text/html-malformed' })).toEqual([
    expect.stringContaining('expected content type text/html, received text/html-malformed'),
  ]);
});

test('checkpoint signatures are detected in response bodies and headers', () => {
  expect(inspectResponse({
    method: 'HEAD',
    url: 'https://barash.me/',
    status: 200,
    contentType: 'text/html',
    body: '',
    headers: { 'x-vercel-challenge-token': 'challenge' },
    expectedStatus: 200,
    expectedContentType: 'text/html',
  })).toEqual([expect.stringContaining('checkpoint signature')]);
});

test('route verification injects fetch and probes both GET and HEAD', async () => {
  const calls: Array<{ url: string; method: string; redirect: string }> = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    calls.push({ url, method: init!.method!, redirect: init!.redirect! });
    return new Response(init!.method === 'HEAD' ? null : '<!doctype html><title>Steven Barash</title>', {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  };

  const result = await verifyPublicHosts({
    routes: [{ url: 'https://barash.me/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, fetchImpl);

  expect(result.failures).toEqual([]);
  expect(calls).toEqual([
    { url: 'https://barash.me/', method: 'GET', redirect: 'manual' },
    { url: 'https://barash.me/', method: 'HEAD', redirect: 'manual' },
  ]);
});

test('route verification detects challenge headers on GET and HEAD responses', async () => {
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => new Response(
    init!.method === 'HEAD' ? null : '<!doctype html><title>Steven Barash</title>',
    {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-vercel-challenge-token': `challenge-${init!.method}-${input.toString()}`,
      },
    },
  );

  const result = await verifyPublicHosts({
    routes: [{ url: 'https://barash.me/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, fetchImpl);

  expect(result.failures).toEqual([
    expect.stringContaining('GET https://barash.me/: checkpoint signature detected'),
    expect.stringContaining('HEAD https://barash.me/: checkpoint signature detected'),
  ]);
});

test('a timed-out route probe records diagnostics and the remaining matrix continues', async () => {
  const calls: string[] = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const call = `${init!.method} ${input.toString()}`;
    calls.push(call);
    if (call === 'GET https://slow.example/') {
      return await new Promise<Response>((_resolve, reject) => {
        init!.signal!.addEventListener('abort', () => reject(init!.signal!.reason), { once: true });
      });
    }
    return new Response(init!.method === 'HEAD' ? null : '<!doctype html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  };

  const result = await verifyPublicHosts({
    timeoutMs: 5,
    routes: [
      { url: 'https://slow.example/', expectedStatus: 200, expectedContentType: 'text/html' },
      { url: 'https://healthy.example/', expectedStatus: 200, expectedContentType: 'text/html' },
    ],
    redirects: [],
  }, fetchImpl);

  expect(calls).toEqual([
    'GET https://slow.example/',
    'HEAD https://slow.example/',
    'GET https://healthy.example/',
    'HEAD https://healthy.example/',
  ]);
  expect(result.failures).toEqual([
    '[browser] GET https://slow.example/: timed out after 5ms while waiting for response headers',
  ]);
  expect(result.results).toHaveLength(4);
});

test('a rejected redirect probe records diagnostics and its HEAD probe still runs', async () => {
  const calls: string[] = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const call = `${init!.method} ${input.toString()}`;
    calls.push(call);
    if (call === 'GET https://www.barash.me/photos') throw new Error('deterministic socket reset');
    if (input.toString() === 'https://www.barash.me/photos') {
      return new Response(null, { status: 302, headers: { location: 'https://barash.me/photos' } });
    }
    return new Response(null, { status: 200, headers: { 'content-type': 'text/html' } });
  };

  const result = await verifyPublicHosts({
    timeoutMs: 50,
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos',
      expectedLocations: ['https://barash.me/photos'],
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, fetchImpl);

  expect(calls).toEqual([
    'GET https://www.barash.me/photos',
    'HEAD https://www.barash.me/photos',
    'HEAD https://barash.me/photos',
  ]);
  expect(result.failures).toEqual([
    '[browser] GET https://www.barash.me/photos: fetch failed (deterministic socket reset)',
  ]);
  expect(result.results).toHaveLength(2);
});

test('redirect verification requires an explicit expectedLocations array', async () => {
  await expect(verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos',
      expectedLocation: 'https://barash.me/photos',
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, async () => new Response(null, { status: 302 }))).rejects.toThrow(/expectedLocations/i);
});

test('redirect verification rejects invalid maxHops bounds before fetching', async () => {
  for (const maxHops of [-1, 1.5, Number.NaN]) {
    await expect(verifyPublicHosts({
      routes: [],
      redirects: [{
        url: 'https://www.barash.me/photos',
        expectedLocations: [],
        expectedStatuses: [302],
        expectedFinalStatus: 200,
        expectedContentType: 'text/html',
        maxHops,
      }],
    }, async () => new Response(null, { status: 200 }))).rejects.toThrow(/maxHops.*non-negative integer/i);
  }
});

test('maxHops zero inspects but never follows redirect responses for GET and HEAD', async () => {
  const calls: string[] = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push(`${init!.method} ${input.toString()}`);
    return new Response(init!.method === 'HEAD' ? null : 'Vercel Security Checkpoint', {
      status: 302,
      headers: {
        location: 'https://barash.me/photos',
        'content-type': 'text/html',
        'x-vercel-challenge-token': 'challenge',
      },
    });
  };

  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos',
      expectedLocations: [],
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 0,
    }],
  }, fetchImpl);

  expect(calls).toEqual([
    'GET https://www.barash.me/photos',
    'HEAD https://www.barash.me/photos',
  ]);
  expect(result.failures).toEqual(expect.arrayContaining([
    expect.stringContaining('GET https://www.barash.me/photos: checkpoint signature detected'),
    expect.stringContaining('GET https://www.barash.me/photos: redirect chain exceeds 0 hop(s)'),
    expect.stringContaining('HEAD https://www.barash.me/photos: checkpoint signature detected'),
    expect.stringContaining('HEAD https://www.barash.me/photos: redirect chain exceeds 0 hop(s)'),
  ]));
});

test('redirect verification fails when an expected hop terminates without redirecting', async () => {
  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos',
      expectedLocations: ['https://barash.me/photos'],
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, async (_input, init) => new Response(init!.method === 'HEAD' ? null : '<!doctype html>', {
    status: 200,
    headers: { 'content-type': 'text/html' },
  }));

  expect(result.failures).toEqual([
    expect.stringContaining('GET https://www.barash.me/photos: expected redirect to https://barash.me/photos, received final status 200'),
    expect.stringContaining('HEAD https://www.barash.me/photos: expected redirect to https://barash.me/photos, received final status 200'),
  ]);
});

test('redirect verification follows one hop and preserves path and query for GET and HEAD', async () => {
  const calls: string[] = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    calls.push(`${init!.method} ${url}`);
    if (url.startsWith('https://www.barash.me/')) {
      return new Response(null, {
        status: 302,
        headers: { location: 'https://barash.me/photos?album=nyc' },
      });
    }
    return new Response(init!.method === 'HEAD' ? null : '<!doctype html><title>Photos</title>', {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  };

  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos?album=nyc',
      expectedLocations: ['https://barash.me/photos?album=nyc'],
      expectedStatuses: [301, 302, 307, 308],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, fetchImpl);

  expect(result.failures).toEqual([]);
  expect(result.results).toEqual([
    expect.objectContaining({
      method: 'GET',
      status: 302,
      location: 'https://barash.me/photos?album=nyc',
      source: {
        url: 'https://www.barash.me/photos?album=nyc',
        status: 302,
        location: 'https://barash.me/photos?album=nyc',
      },
      final: { url: 'https://barash.me/photos?album=nyc', status: 200 },
    }),
    expect.objectContaining({
      method: 'HEAD',
      status: 302,
      location: 'https://barash.me/photos?album=nyc',
      source: {
        url: 'https://www.barash.me/photos?album=nyc',
        status: 302,
        location: 'https://barash.me/photos?album=nyc',
      },
      final: { url: 'https://barash.me/photos?album=nyc', status: 200 },
    }),
  ]);
  expect(calls).toEqual([
    'GET https://www.barash.me/photos?album=nyc',
    'GET https://barash.me/photos?album=nyc',
    'HEAD https://www.barash.me/photos?album=nyc',
    'HEAD https://barash.me/photos?album=nyc',
  ]);
});

test('redirect verification allows an explicitly configured two-hop chain for GET and HEAD', async () => {
  const calls: string[] = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    calls.push(`${init!.method} ${url}`);
    if (url === 'https://www.barash.me/photos') {
      return new Response(null, { status: 302, headers: { location: 'https://barash.me/photos' } });
    }
    if (url === 'https://barash.me/photos') {
      return new Response(null, { status: 307, headers: { location: 'https://stevenbarash.com/photos' } });
    }
    return new Response(init!.method === 'HEAD' ? null : '<!doctype html><title>Photos</title>', {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  };

  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos',
      expectedLocations: ['https://barash.me/photos', 'https://stevenbarash.com/photos'],
      expectedStatuses: [302, 307],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 2,
    }],
  }, fetchImpl);

  expect(result.failures).toEqual([]);
  expect(calls).toEqual([
    'GET https://www.barash.me/photos',
    'GET https://barash.me/photos',
    'GET https://stevenbarash.com/photos',
    'HEAD https://www.barash.me/photos',
    'HEAD https://barash.me/photos',
    'HEAD https://stevenbarash.com/photos',
  ]);
});

test('redirect verification inspects normalized challenge headers on every hop and final response', async () => {
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    if (url === 'https://www.barash.me/photos') {
      return new Response(null, {
        status: 302,
        headers: { location: 'https://barash.me/photos', 'X-Vercel-Challenge-Token': 'initial' },
      });
    }
    if (url === 'https://barash.me/photos') {
      return new Response(null, {
        status: 307,
        headers: { location: 'https://stevenbarash.com/photos', 'X-Vercel-Challenge-Token': 'intermediate' },
      });
    }
    return new Response(init!.method === 'HEAD' ? null : '<!doctype html><title>Photos</title>', {
      status: 200,
      headers: { 'content-type': 'text/html', 'X-Vercel-Challenge-Token': 'final' },
    });
  };

  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos',
      expectedLocations: ['https://barash.me/photos', 'https://stevenbarash.com/photos'],
      expectedStatuses: [302, 307],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 2,
    }],
  }, fetchImpl);

  for (const method of ['GET', 'HEAD']) {
    for (const url of [
      'https://www.barash.me/photos',
      'https://barash.me/photos',
      'https://stevenbarash.com/photos',
    ]) {
      expect(result.failures).toContain(`[browser] ${method} ${url}: checkpoint signature detected`);
    }
  }
});

test('redirect verification inspects and stops at an over-limit hop for GET and HEAD', async () => {
  const calls: string[] = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    calls.push(`${init!.method} ${url}`);
    const location = url === 'https://www.barash.me/photos'
      ? 'https://barash.me/photos'
      : 'https://stevenbarash.com/photos';
    return new Response(init!.method === 'HEAD' ? null : 'Security Checkpoint', {
      status: 302,
      headers: {
        location,
        'content-type': 'text/html',
        ...(url === 'https://barash.me/photos' ? { 'x-vercel-challenge-token': 'challenge' } : {}),
      },
    });
  };

  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos',
      expectedLocations: ['https://barash.me/photos', 'https://stevenbarash.com/photos'],
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, fetchImpl);

  expect(calls).toEqual([
    'GET https://www.barash.me/photos',
    'GET https://barash.me/photos',
    'HEAD https://www.barash.me/photos',
    'HEAD https://barash.me/photos',
  ]);
  expect(result.failures).toEqual(expect.arrayContaining([
    expect.stringContaining('GET https://barash.me/photos: checkpoint signature detected'),
    expect.stringContaining('GET https://www.barash.me/photos: redirect chain exceeds 1 hop(s)'),
    expect.stringContaining('HEAD https://barash.me/photos: checkpoint signature detected'),
    expect.stringContaining('HEAD https://www.barash.me/photos: redirect chain exceeds 1 hop(s)'),
  ]));
});

test('redirect verification never follows an unconfigured Location', async () => {
  const calls: string[] = [];
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push(`${init!.method} ${input.toString()}`);
    return new Response(null, {
      status: 302,
      headers: { location: 'https://attacker.example/steal' },
    });
  };

  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos?album=nyc',
      expectedLocations: ['https://barash.me/photos?album=nyc'],
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, fetchImpl);

  expect(calls).toEqual([
    'GET https://www.barash.me/photos?album=nyc',
    'HEAD https://www.barash.me/photos?album=nyc',
  ]);
  expect(result.failures).toEqual(expect.arrayContaining([
    expect.stringContaining('GET https://www.barash.me/photos?album=nyc: incorrect Location'),
    expect.stringContaining('HEAD https://www.barash.me/photos?album=nyc: incorrect Location'),
  ]));
});

test('redirect verification reports incorrect locations and path or query loss', async () => {
  const fetchImpl = async () => new Response(null, {
    status: 302,
    headers: { location: 'https://barash.me/' },
  });

  const result = await verifyPublicHosts({
    routes: [],
    redirects: [{
      url: 'https://www.barash.me/photos?album=nyc',
      expectedLocations: ['https://barash.me/photos?album=nyc'],
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, fetchImpl);

  expect(result.failures).toEqual(expect.arrayContaining([
    expect.stringContaining('incorrect Location'),
    expect.stringContaining('path/query loss'),
  ]));
});

test('URL validation rejects every remaining non-global address bypass before fetching', async () => {
  for (const url of [
    'https://0.1.2.3/',
    'https://100.64.0.1/',
    'https://192.0.2.1/',
    'https://224.0.0.1/',
    'https://8.8.8.8/',
    'https://[::ffff:127.0.0.1]/',
    'https://[::ffff:7f00:1]/',
    'https://[2606:4700:4700::1111]/',
  ]) {
    let fetchCalls = 0;
    await expect(verifyPublicHostsWithDns({
      routes: [{ url, expectedStatus: 200, expectedContentType: 'text/html' }],
      redirects: [],
    }, async () => {
      fetchCalls += 1;
      return new Response('unexpected');
    }, publicDns)).rejects.toThrow(/public HTTPS/i);
    expect(fetchCalls, url).toBe(0);
  }
});

test('DNS validation fails closed for non-global IPv6 answers', async () => {
  for (const address of [
    '::192.168.1.1',
    '64:ff9b:1::c0a8:101',
    '2001:2::1',
    '2001:20::1',
    '3fff::1',
    '5f00::1',
  ]) {
    let transportCalls = 0;
    await expect(verifyPublicHostsWithDns({
      routes: [{ url: 'https://ipv6-answer.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
      redirects: [],
    }, async () => {
      transportCalls += 1;
      return new Response('unexpected');
    }, async () => [{ address, family: 6 }])).rejects.toThrow(/non-public|public HTTPS/i);
    expect(transportCalls, address).toBe(0);
  }
});

test('DNS validation ignores unsupported IPv6 when a public IPv4 answer is available', async () => {
  const pinnedAddresses: string[] = [];
  const result = await verifyPublicHostsWithDns({
    routes: [{ url: 'https://dual-stack.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, async (_input, init, destination) => {
    pinnedAddresses.push(destination.address);
    return new Response(init.method === 'HEAD' ? null : '<!doctype html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  }, async () => [
    { address: '2606:4700:3037::6815:1dcf', family: 6 },
    { address: '104.21.29.207', family: 4 },
  ]);

  expect(result.failures).toEqual([]);
  expect(pinnedAddresses).toEqual(['104.21.29.207', '104.21.29.207']);
});

test('hostname DNS resolution rejects private answers before fetching', async () => {
  let fetchCalls = 0;
  await expect(verifyPublicHostsWithDns({
    routes: [{ url: 'https://127.0.0.1.nip.io/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, async () => {
    fetchCalls += 1;
    return new Response('unexpected');
  }, async () => [{ address: '127.0.0.1', family: 4 }])).rejects.toThrow(/resolved.*non-public|public HTTPS/i);
  expect(fetchCalls).toBe(0);
});

test('route transport uses the validated address without a second DNS resolution', async () => {
  let resolutions = 0;
  const pinnedAddresses: string[] = [];
  const result = await verifyPublicHostsWithDns({
    routes: [{ url: 'https://rebind.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, async (_input, init, destination) => {
    pinnedAddresses.push(destination.address);
    return new Response(init!.method === 'HEAD' ? null : '<!doctype html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  }, async () => {
    resolutions += 1;
    return [{ address: resolutions === 1 ? '93.184.216.34' : '10.0.0.1', family: 4 }];
  });

  expect(result.failures).toEqual([]);
  expect(resolutions).toBe(1);
  expect(pinnedAddresses).toEqual(['93.184.216.34', '93.184.216.34']);
});

test('a redirect hop is DNS-validated and never follows a private destination', async () => {
  const calls: string[] = [];
  const result = await verifyPublicHostsWithDns({
    routes: [],
    redirects: [{
      url: 'https://public.example/path',
      expectedLocations: ['https://safe.example/path'],
      expectedStatuses: [302],
      expectedFinalStatus: 200,
      expectedContentType: 'text/html',
      maxHops: 1,
    }],
  }, async (input, init) => {
    calls.push(`${init!.method} ${input.toString()}`);
    return new Response(null, { status: 302, headers: { location: 'https://private.example/path' } });
  }, async (hostname: string) => [{
    address: hostname === 'private.example' ? '10.0.0.1' : '93.184.216.34',
    family: 4,
  }]);

  expect(calls).toEqual(['GET https://public.example/path', 'HEAD https://public.example/path']);
  expect(result.failures).toEqual([
    expect.stringMatching(/\[browser\].*private\.example.*resolved.*non-public/i),
    expect.stringMatching(/\[browser\].*private\.example.*resolved.*non-public/i),
  ]);
});

test('evidence reachability uses the address validated for its request', async () => {
  let resolutions = 0;
  const pinnedAddresses: string[] = [];
  const result = await probeEvidenceUrl('https://evidence.example/source', {
    lookupImpl: async () => {
      resolutions += 1;
      return [{ address: resolutions === 1 ? '93.184.216.34' : '10.0.0.1', family: 4 }];
    },
    transportImpl: async (_input: RequestInfo | URL, _init: RequestInit | undefined, destination: { address: string }) => {
      pinnedAddresses.push(destination.address);
      return new Response(null, { status: 200 });
    },
  });

  expect(result.status).toBe(200);
  expect(resolutions).toBe(1);
  expect(pinnedAddresses).toEqual(['93.184.216.34']);
});

test('evidence reachability reports and refuses a redirect to a private address', async () => {
  const calls: string[] = [];
  await expect(probeEvidenceUrl('https://evidence.example/source', {
    allowedHosts: new Set(['evidence.example']),
    lookupImpl: async (hostname: string) => [{
      address: hostname === 'evidence.example' ? '93.184.216.34' : '10.0.0.1',
      family: 4,
    }],
    fetchImpl: async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push(`${init!.method} ${input.toString()}`);
      return new Response(null, { status: 302, headers: { location: 'https://private.example/metadata' } });
    },
  })).rejects.toThrow(/unsafe redirect|allowlist|non-public/i);
  expect(calls).toEqual(['HEAD https://evidence.example/source']);
});

test('one deadline remains active while consuming a never-ending response body', async () => {
  const neverEndingBody = () => new ReadableStream<Uint8Array>({
    pull(controller) {
      controller.enqueue(new TextEncoder().encode('checkpoint scan continues'));
      return new Promise(() => {});
    },
  });
  const result = await verifyPublicHosts({
    timeoutMs: 20,
    routes: [{ url: 'https://slow.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, async (_input, init) => new Response(init!.method === 'HEAD' ? null : neverEndingBody(), {
    status: 200,
    headers: { 'content-type': 'text/html' },
  }));

  expect(result.failures).toEqual([
    expect.stringMatching(/\[browser\].*timed out after 20ms while reading response body/i),
  ]);
});

test('oversized body returns promptly when reader cancellation never settles', async () => {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(33));
    },
    cancel() {
      return new Promise(() => {});
    },
  });
  const verification = verifyPublicHosts({
    timeoutMs: 20,
    maxBodyBytes: 32,
    routes: [{ url: 'https://stalled-cancel.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, async (_input, init) => new Response(init!.method === 'HEAD' ? null : body, {
    status: 200,
    headers: { 'content-type': 'text/html' },
  }));

  const outcome = await Promise.race([
    verification,
    new Promise<'stalled'>((resolve) => setTimeout(() => resolve('stalled'), 100)),
  ]);
  expect(outcome).not.toBe('stalled');
  expect(outcome).toEqual(expect.objectContaining({
    failures: [expect.stringMatching(/response body exceeds 32 bytes/i)],
  }));
});

test('public-host verification deadline covers stalled DNS validation', async () => {
  const verification = verifyPublicHostsWithDns({
    timeoutMs: 20,
    routes: [{ url: 'https://stalled-dns.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, async () => new Response(null, { status: 200, headers: { 'content-type': 'text/html' } }),
  async () => new Promise(() => {}));

  const outcome = await Promise.race([
    verification.then(
      () => 'resolved',
      (error) => error,
    ),
    new Promise<'stalled'>((resolve) => setTimeout(() => resolve('stalled'), 100)),
  ]);

  expect(outcome).not.toBe('stalled');
  expect(outcome).toBeInstanceOf(Error);
  expect((outcome as Error).message).toMatch(/timed out after 20ms while resolving DNS/i);
});

test('evidence reachability deadline covers stalled DNS validation', async () => {
  const probe = probeEvidenceUrl('https://stalled-evidence-dns.example/source', {
    timeoutMs: 20,
    lookupImpl: async () => new Promise(() => {}),
    transportImpl: async () => new Response(null, { status: 200 }),
  });

  const outcome = await Promise.race([
    probe.then(
      () => 'resolved',
      (error) => error,
    ),
    new Promise<'stalled'>((resolve) => setTimeout(() => resolve('stalled'), 100)),
  ]);

  expect(outcome).not.toBe('stalled');
  expect(outcome).toBeInstanceOf(Error);
  expect((outcome as Error).message).toMatch(/timed out after 20ms while resolving DNS/i);
});

test('checkpoint body consumption is byte-bounded and cancels oversized streams', async () => {
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(33));
    },
    cancel() {
      cancelled = true;
    },
  });
  const result = await verifyPublicHosts({
    maxBodyBytes: 32,
    routes: [{ url: 'https://large.example/', expectedStatus: 200, expectedContentType: 'text/html' }],
    redirects: [],
  }, async (_input, init) => new Response(init!.method === 'HEAD' ? null : body, {
    status: 200,
    headers: { 'content-type': 'text/html' },
  }));

  expect(cancelled).toBe(true);
  expect(result.failures).toEqual([
    expect.stringMatching(/\[browser\].*response body exceeds 32 bytes/i),
  ]);
});

test('diagnostic result, failure, and CLI PROBE output include exact probe labels', async () => {
  const diagnostics = ['browser', 'crawler', 'social'].map((label) => ({
    label,
    url: 'https://barash.me/',
    userAgent: `${label}-agent`,
    expectedStatus: 200,
    expectedContentType: 'text/html',
  }));
  const result = await verifyPublicHosts({ routes: [], redirects: [], diagnostics }, async () => new Response('bad', {
    status: 429,
    headers: { 'content-type': 'text/html' },
  }));
  expect(result.results.map((probe) => probe.label)).toEqual(['browser', 'crawler', 'social']);
  expect(result.failures).toEqual([
    '[browser] GET https://barash.me/: expected status 200, received 429',
    '[crawler] GET https://barash.me/: expected status 200, received 429',
    '[social] GET https://barash.me/: expected status 200, received 429',
  ]);

  const stdout: string[] = [];
  await runPublicHostVerifierCli({
    defaultConfig: { routes: [], redirects: [], diagnostics },
    fetchImpl: async () => new Response('<!doctype html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    lookupImpl: publicDns,
    stdout: (line) => stdout.push(line),
  });
  expect(stdout.filter((line) => line.startsWith('PROBE '))).toEqual([
    'PROBE [browser] GET https://barash.me/ -> 200',
    'PROBE [crawler] GET https://barash.me/ -> 200',
    'PROBE [social] GET https://barash.me/ -> 200',
  ]);
});
