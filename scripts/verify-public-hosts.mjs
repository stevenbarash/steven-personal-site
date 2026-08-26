#!/usr/bin/env node

import process from 'node:process';
import { runPublicHostVerifierCli } from './public-host-verifier-cli.js';

const requiredRoutes = [
  { path: '/', expectedContentType: 'text/html' },
  { path: '/photos', expectedContentType: 'text/html' },
  { path: '/robots.txt', expectedContentType: 'text/plain' },
  { path: '/sitemap.xml', expectedContentType: 'application/xml' },
  { path: '/manifest.webmanifest', expectedContentType: 'application/manifest+json' },
  { path: '/opengraph-image', expectedContentType: 'image/png' },
];

const directHosts = ['https://barash.me', 'https://www.barash.me', 'https://stevenbarash.com'];
const allowedHosts = ['barash.me', 'www.barash.me', 'stevenbarash.com', 'www.stevenbarash.com'];

const defaultConfig = {
  timeoutMs: 10_000,
  allowedHosts,
  routes: [
    ...directHosts.flatMap((origin) => requiredRoutes.map((route) => ({
      url: new URL(route.path, origin).href,
      expectedStatus: 200,
      expectedContentType: route.expectedContentType,
    }))),
    {
      url: 'https://www.stevenbarash.com/robots.txt',
      expectedStatus: 200,
      expectedContentType: 'text/plain',
    },
  ],
  diagnostics: [
    {
      label: 'browser',
      url: 'https://stevenbarash.com/',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/127.0 Safari/537.36',
      expectedStatus: 200,
      expectedContentType: 'text/html',
    },
    {
      label: 'crawler',
      url: 'https://stevenbarash.com/',
      userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      expectedStatus: 200,
      expectedContentType: 'text/html',
    },
    {
      label: 'social',
      url: 'https://stevenbarash.com/',
      userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      expectedStatus: 200,
      expectedContentType: 'text/html',
    },
  ],
  redirects: requiredRoutes
    .filter((route) => route.path !== '/robots.txt')
    .map((route) => {
      const pathAndQuery = `${route.path}${route.path.includes('?') ? '&' : '?'}phase0=public-host-verification`;
      return {
        url: new URL(pathAndQuery, 'https://www.stevenbarash.com').href,
        expectedLocations: [new URL(pathAndQuery, 'https://stevenbarash.com').href],
        expectedStatuses: [302, 307],
        expectedFinalStatus: 200,
        expectedContentType: route.expectedContentType,
        maxHops: 1,
      };
    }),
};

runPublicHostVerifierCli({
  defaultConfig,
}).then((exitCode) => {
  process.exitCode = exitCode;
});
