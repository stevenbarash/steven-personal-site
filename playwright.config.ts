import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:3101',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/playwright-server.mjs',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/mobile-webkit.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-webkit',
      testMatch: /.*\/(mobile-webkit|mobile-layout)\.spec\.ts/,
      use: { ...devices['iPhone 13'] },
    },
  ],
});
