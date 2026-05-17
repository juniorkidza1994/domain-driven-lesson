// tests/e2e/alpine.spec.js — DRE-9: Alpine.js + Mermaid.js integration tests
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';

test.describe('DRE-9 · Alpine + Mermaid integration', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('window.Alpine is defined after load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

    await page.goto(BASE + '/index.html');
    await page.waitForFunction(() => !!window.Alpine);
    expect(errors).toEqual([]);
  });

  test('Alpine.store(app).lang defaults to "en" on fresh load', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto(BASE + '/index.html');
    await page.waitForFunction(() => !!window.Alpine?.store('app'));
    const lang = await page.evaluate(() => Alpine.store('app').lang);
    expect(lang).toBe('en');
  });

  test('clicking TH toggle sets store.lang to "th"', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto(BASE + '/index.html');
    await page.waitForFunction(() => document.querySelector('.lang-toggle button'));
    await page.locator('.lang-toggle button', { hasText: 'TH' }).first().click();
    const lang = await page.evaluate(() => Alpine.store('app').lang);
    expect(lang).toBe('th');
  });

  test('lang persists across reload via localStorage', async ({ page }) => {
    // Clear localStorage before initial load only (addInitScript would clear on reload too)
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE + '/index.html');
    await page.waitForFunction(() => document.querySelector('.lang-toggle button'));
    await page.locator('.lang-toggle button', { hasText: 'TH' }).first().click();
    // Ensure toggleLang has persisted before reload
    await page.waitForFunction(() => localStorage.getItem('lang') === 'th');
    await page.reload();
    await page.waitForFunction(() => !!window.Alpine?.store('app'));
    const lang = await page.evaluate(() => Alpine.store('app').lang);
    expect(lang).toBe('th');
  });

  test('renderDiagrams() turns .mermaid-block[data-source] into an SVG', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForFunction(() => {
      const el = document.querySelector('.mermaid-block');
      return el && el.querySelector('svg');
    });
    const hasSvg = await page.locator('.mermaid-block svg').first().isVisible();
    expect(hasSvg).toBe(true);
  });

  test('Mermaid SVG has viewBox attribute', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.mermaid-block svg');
    const viewBox = await page.locator('.mermaid-block svg').first().getAttribute('viewBox');
    expect(viewBox).toBeTruthy();
  });

  test('no console errors during Alpine init and Mermaid render', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.mermaid-block svg');
    expect(errors).toEqual([]);
  });
});
