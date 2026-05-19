// tests/e2e/layout.spec.js
const { test, expect } = require('@playwright/test');
const BASE = 'http://localhost:8080';

// DRE-29: seed active profile so profile modal doesn't interfere
async function seedProfile(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('ddd-active-profile', 'TestUser');
    localStorage.setItem('ddd-profiles', JSON.stringify(['TestUser']));
  });
}

test('no horizontal scroll at 320px', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 600 } });
  const page = await ctx.newPage();
  await seedProfile(page);
  await page.goto(BASE + '/');
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sw).toBeLessThanOrEqual(320);
  await ctx.close();
});

test('no horizontal scroll at 375px', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 600 } });
  const page = await ctx.newPage();
  await seedProfile(page);
  await page.goto(BASE + '/');
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sw).toBeLessThanOrEqual(375);
  await ctx.close();
});

test('--color-primary token resolves correctly', async ({ page }) => {
  await seedProfile(page);
  await page.goto(BASE + '/');
  const v = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim());
  expect(v).toBe('#6366f1');
});

test('--color-secondary token resolves correctly', async ({ page }) => {
  await seedProfile(page);
  await page.goto(BASE + '/');
  const v = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim());
  expect(v).toBe('#14b8a6');
});

test('.card has border-radius > 0', async ({ page }) => {
  await seedProfile(page);
  await page.goto(BASE + '/');
  const r = await page.locator('.card').first().evaluate(el =>
    parseFloat(getComputedStyle(el).borderRadius));
  expect(r).toBeGreaterThan(0);
});

test('body background matches --color-bg', async ({ page }) => {
  await seedProfile(page);
  await page.goto(BASE + '/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(250, 249, 247)');
});

test('.btn-primary height >= 44px', async ({ page }) => {
  await seedProfile(page);
  await page.goto(BASE + '/');
  // Wait for Alpine to init and hide the profile modal before measuring
  await page.waitForFunction(() => window.Alpine !== undefined);
  await page.waitForTimeout(200);
  const box = await page.locator('.btn-primary:visible').first().boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test('Inter font present in body (EN)', async ({ page }) => {
  await seedProfile(page);
  await page.goto(BASE + '/');
  const ff = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(ff.toLowerCase()).toContain('inter');
});

test('Sarabun font present after lang=th reload', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem('ddd-active-profile', 'TestUser');
    localStorage.setItem('ddd-profiles', JSON.stringify(['TestUser']));
    localStorage.setItem('lang', 'th');
  });
  await page.goto(BASE + '/');
  await page.waitForFunction(() => window.Alpine !== undefined);
  await page.waitForFunction(() => document.body.getAttribute('data-lang') === 'th');
  const ff = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(ff.toLowerCase()).toContain('sarabun');
  await ctx.close();
});
