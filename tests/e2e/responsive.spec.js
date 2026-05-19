// tests/e2e/responsive.spec.js — DRE-26: No horizontal overflow at 375px + zero console.error
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';

const ALL_PAGES = [
  { name: 'home',    path: '/' },
  { name: 'glossary', path: '/glossary.html' },
  { name: 'module-01', path: '/modules/01-intro.html' },
  { name: 'module-02', path: '/modules/02-ddd.html' },
  { name: 'module-03', path: '/modules/03-event-storming.html' },
  { name: 'module-04', path: '/modules/04-es-to-ddd.html' },
  { name: 'module-05', path: '/modules/05-eda.html' },
  { name: 'module-06', path: '/modules/06-es-to-eda.html' },
  { name: 'module-07', path: '/modules/07-case-study.html' },
];

test.describe('DRE-26 · responsive 375px — no overflow, no console.error', () => {
  for (const pg of ALL_PAGES) {
    test(`${pg.name}: no horizontal overflow and zero console.error at 375×800`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
      const page = await ctx.newPage();

      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(BASE + pg.path);
      await page.waitForFunction(() => window.Alpine !== undefined);
      // Give the page a moment to settle layout
      await page.waitForTimeout(500);

      // Assert no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(375);

      // Assert zero console errors
      expect(errors).toEqual([]);

      await ctx.close();
    });
  }
});
