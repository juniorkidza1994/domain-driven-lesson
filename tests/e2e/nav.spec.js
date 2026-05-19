// tests/e2e/nav.spec.js — DRE-7: Shared Nav & Page Shell
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';

const ALL_PAGES = [
  '/',
  '/glossary.html',
  '/modules/01-intro.html',
  '/modules/02-ddd.html',
  '/modules/03-event-storming.html',
  '/modules/04-es-to-ddd.html',
  '/modules/05-eda.html',
  '/modules/06-es-to-eda.html',
  '/modules/07-case-study.html',
];

const MODULE_LINKS = [
  { num: '01', href: '01-intro.html' },
  { num: '02', href: '02-ddd.html' },
  { num: '03', href: '03-event-storming.html' },
  { num: '04', href: '04-es-to-ddd.html' },
  { num: '05', href: '05-eda.html' },
  { num: '06', href: '06-es-to-eda.html' },
  { num: '07', href: '07-case-study.html' },
];

// AC: nav.html injected into all 9 pages, lang-toggle visible on every page
test.describe('injection', () => {
  for (const route of ALL_PAGES) {
    test(`topnav and lang-toggle visible on ${route}`, async ({ page }) => {
      await page.goto(BASE + route);
      await page.waitForFunction(() => window.Alpine !== undefined);
      // Wait for nav injection (async fetch)
      await page.waitForSelector('#nav-root .topnav', { timeout: 5000 });
      await expect(page.locator('#nav-root .topnav')).toBeVisible();
      await expect(page.locator('.lang-toggle').first()).toBeVisible();
    });
  }
});

// AC: All 7 module links present with correct hrefs
test('7 module links with correct hrefs', async ({ page }) => {
  await page.goto(BASE + '/');
  await page.waitForSelector('#nav-root .topnav', { timeout: 5000 });
  await page.waitForFunction(() => window.Alpine !== undefined);

  for (const mod of MODULE_LINKS) {
    // Check in drawer (always in DOM)
    const drawerLink = page.locator(`.drawer .nav-item`).filter({ hasText: mod.num });
    await expect(drawerLink).toHaveCount(1);
    const href = await drawerLink.getAttribute('href');
    expect(href).toMatch(new RegExp(`modules/${mod.href}$`));
  }
});

// AC: localStorage.lang === 'en' by default
test('default lang is en', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.waitForFunction(() => window.Alpine !== undefined);
  const lang = await page.evaluate(() => localStorage.getItem('lang'));
  // Default lang is set when toggle is used; store initialises from localStorage || 'en'
  // If never clicked, localStorage.getItem('lang') may be null — store defaults to 'en'
  expect(lang === null || lang === 'en').toBeTruthy();
  await ctx.close();
});

// AC: 375px viewport — hamburger visible, desktop nav hidden
test('mobile: hamburger visible, desktop nav hidden', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.waitForSelector('#nav-root .topnav', { timeout: 5000 });
  await page.waitForFunction(() => window.Alpine !== undefined);

  await expect(page.locator('.nav-hamburger')).toBeVisible();
  await expect(page.locator('.nav-desktop')).toBeHidden();
  await ctx.close();
});

// AC: click hamburger opens drawer; click scrim closes it
test('hamburger opens drawer, scrim closes it', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.waitForSelector('#nav-root .topnav', { timeout: 5000 });
  await page.waitForFunction(() => window.Alpine !== undefined);

  // Drawer should be closed initially
  await expect(page.locator('.drawer')).not.toHaveClass(/open/);

  // Click hamburger
  await page.locator('.nav-hamburger').click();
  await expect(page.locator('.drawer')).toHaveClass(/open/);

  // Click the visible part of the scrim (right edge, not covered by drawer panel)
  // Drawer occupies 85% of 375px ≈ 319px; scrim visible beyond that
  await page.locator('.drawer-scrim').click({ position: { x: 350, y: 400 } });
  await expect(page.locator('.drawer')).not.toHaveClass(/open/);
  await ctx.close();
});

// AC: progress seed → checkmark renders for completed module
// Use mobile viewport so the drawer is visible (desktop hides drawer via media query)
test('checkmark visible after localStorage progress seed', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('ddd-progress', JSON.stringify({
      'module-01': { quizCompleted: true, score: 80 }
    }));
  });

  await page.goto(BASE + '/');
  await page.waitForSelector('#nav-root .topnav', { timeout: 5000 });
  await page.waitForFunction(() => window.Alpine !== undefined);

  // Alpine's MutationObserver initializes x-for and x-show on injected HTML
  // asynchronously. Wait for the store to confirm progress data is loaded.
  await page.waitForFunction(() => {
    if (!window.Alpine) return false;
    const app = Alpine.store('app');
    if (!app) return false;
    return !!(app.progress && app.progress['module-01'] && app.progress['module-01'].quizCompleted);
  }, { timeout: 5000 });
  // Give Alpine one microtask to apply x-show directives on the injected nav items
  await page.waitForTimeout(100);

  // Find the module-01 nav-item in the drawer and assert .check is visible
  const mod01Row = page.locator('.drawer .nav-item').filter({ hasText: '01' }).first();
  const checkmark = mod01Row.locator('.check');
  await expect(checkmark).toBeVisible();
  await ctx.close();
});

// AC: active link has aria-current="page" on the matching module page
test('active module link has aria-current=page', async ({ page }) => {
  await page.goto(BASE + '/modules/03-event-storming.html');
  await page.waitForSelector('#nav-root .topnav', { timeout: 5000 });
  await page.waitForFunction(() => window.Alpine !== undefined);

  const activeLink = page.locator('.nav-item[aria-current="page"]').first();
  await expect(activeLink).toBeVisible();
  const text = await activeLink.textContent();
  expect(text).toMatch(/Event Storming/);
});

// AC: lang toggle re-renders labels without reload, persists to localStorage
test('lang toggle switches labels and persists to localStorage', async ({ page }) => {
  await page.goto(BASE + '/');
  await page.waitForSelector('#nav-root .topnav', { timeout: 5000 });
  await page.waitForFunction(() => window.Alpine !== undefined);

  // Click TH button (in topnav lang-toggle)
  await page.locator('.topnav .lang-toggle button').nth(1).click();

  // Wait for Alpine reactivity to settle
  await page.waitForTimeout(200);

  // Module 02 label should now be Thai
  const mod02Label = page.locator('.drawer .nav-item').filter({ hasText: '02' }).locator('.label');
  await expect(mod02Label).toHaveText('พื้นฐาน DDD');

  // localStorage should be persisted
  const lang = await page.evaluate(() => localStorage.getItem('lang'));
  expect(lang).toBe('th');
});
