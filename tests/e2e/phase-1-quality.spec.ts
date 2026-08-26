import { expect, test } from '@playwright/test';

test('project links derive accessible names from their visible name and description', async ({ page }) => {
  await page.goto('/projects');

  await expect(page.getByRole('link', { name: 'Personal Site', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pult', exact: true })).toBeVisible();
});

test('local production does not load Vercel telemetry or emit manual connection hints', async ({ page }) => {
  const vercelRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/_vercel/')) vercelRequests.push(request.url());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(vercelRequests).toEqual([]);
  await expect(page.locator('script[src*="/_vercel/"]')).toHaveCount(0);
  await expect(page.locator('link[rel="preconnect"][href*="vercel"]')).toHaveCount(0);
  await expect(page.locator('link[rel="dns-prefetch"][href*="vercel"]')).toHaveCount(0);
});
