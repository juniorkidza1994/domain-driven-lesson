const { test, expect } = require('@playwright/test');

test('index.html returns 200 and core globals load', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8080';
  const resp = await page.goto(`${BASE}/index.html`);
  expect(resp.status()).toBe(200);                      // AC1

  await page.waitForLoadState('domcontentloaded');
  // Alpine defers init until DOMContentLoaded; wait one tick for it to attach.
  await page.waitForFunction(() => window.Alpine !== undefined);  // AC3
  await page.waitForFunction(() => window.mermaid !== undefined); // AC4

  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);              // AC5

  expect(errors).toEqual([]);                           // AC2
});
