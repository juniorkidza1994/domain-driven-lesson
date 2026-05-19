// tests/e2e/language-switch.spec.js — DRE-26: EN↔TH language toggle
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';
const PAGE_URL = BASE + '/modules/01-intro.html';

// Minimal lesson fixture with EN and TH strings so content re-render is verifiable
const LESSON_FIXTURE = {
  module: {
    id: 'module-01', number: 1,
    title: { en: 'Introduction EN', th: 'บทนำ TH' },
    estimatedMinutes: 1,
    sections: [
      {
        id: 's1', type: 'text',
        title: { en: 'Hello EN', th: 'สวัสดี TH' },
        content: { en: 'English content here', th: 'เนื้อหาภาษาไทยที่นี่' }
      }
    ]
  }
};

async function mockLesson(page) {
  await page.route('**/content/lessons/**/module-01.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LESSON_FIXTURE) }));
}

async function setup(page) {
  // DRE-29: seed active profile so profile modal doesn't block
  await page.addInitScript(() => {
    sessionStorage.setItem('ddd-active-profile', 'TestUser');
    localStorage.setItem('ddd-profiles', JSON.stringify(['TestUser']));
  });
  await mockLesson(page);
  await page.goto(PAGE_URL);
  await page.waitForFunction(() => window.Alpine !== undefined);
  await page.waitForSelector('#nav-root .topnav', { timeout: 8000 });
}

test.describe('DRE-25/26 · language toggle', () => {

  test('AC1 default lang is "en" — body[data-lang] and Alpine store', async ({ page }) => {
    await setup(page);
    // body[data-lang] is set by setLang on init
    const dataLang = await page.evaluate(() => document.body.getAttribute('data-lang'));
    expect(dataLang).toBe('en');
    // Alpine store also reflects 'en'
    const storeLang = await page.evaluate(() => window.Alpine?.store('app')?.lang);
    expect(storeLang).toBe('en');
  });

  test('AC2 click TH → data-lang becomes "th", localStorage persists', async ({ page }) => {
    await setup(page);
    // Click the TH button in the topnav lang-toggle
    await page.locator('.topnav .lang-toggle button').nth(1).click();
    await page.waitForTimeout(200);

    const dataLang = await page.evaluate(() => document.body.getAttribute('data-lang'));
    expect(dataLang).toBe('th');

    const storeLang = await page.evaluate(() => window.Alpine?.store('app')?.lang);
    expect(storeLang).toBe('th');

    const stored = await page.evaluate(() => localStorage.getItem('lang'));
    expect(stored).toBe('th');
  });

  test('AC3 TH preference persists after page reload', async ({ browser }) => {
    // Use a fresh context so localStorage is isolated
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    // DRE-29: seed active profile so profile modal doesn't block
    await page.addInitScript(() => {
      sessionStorage.setItem('ddd-active-profile', 'TestUser');
      localStorage.setItem('ddd-profiles', JSON.stringify(['TestUser']));
    });
    await page.route('**/content/lessons/**/module-01.json', r =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LESSON_FIXTURE) }));

    // First visit: switch to TH
    await page.goto(PAGE_URL);
    await page.waitForFunction(() => window.Alpine !== undefined);
    await page.waitForSelector('#nav-root .topnav', { timeout: 8000 });
    await page.locator('.topnav .lang-toggle button').nth(1).click();
    await page.waitForTimeout(200);

    // Reload
    await page.route('**/content/lessons/**/module-01.json', r =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LESSON_FIXTURE) }));
    await page.reload();
    await page.waitForFunction(() => window.Alpine !== undefined);
    await page.waitForSelector('#nav-root .topnav', { timeout: 8000 });

    const storeLang = await page.evaluate(() => window.Alpine?.store('app')?.lang);
    expect(storeLang).toBe('th');

    const dataLang = await page.evaluate(() => document.body.getAttribute('data-lang'));
    expect(dataLang).toBe('th');

    await ctx.close();
  });

  test('AC4 toggle back to EN works', async ({ page }) => {
    await setup(page);
    // Switch to TH first
    await page.locator('.topnav .lang-toggle button').nth(1).click();
    await page.waitForTimeout(200);
    // Switch back to EN
    await page.locator('.topnav .lang-toggle button').nth(0).click();
    await page.waitForTimeout(200);

    const dataLang = await page.evaluate(() => document.body.getAttribute('data-lang'));
    expect(dataLang).toBe('en');

    const storeLang = await page.evaluate(() => window.Alpine?.store('app')?.lang);
    expect(storeLang).toBe('en');

    const stored = await page.evaluate(() => localStorage.getItem('lang'));
    expect(stored).toBe('en');
  });

  test('AC5 toggle re-renders lesson content (EN↔TH text changes)', async ({ page }) => {
    await setup(page);

    // Wait for content to load (section s1 should have EN text)
    const contentPara = page.locator('section[data-section-id="s1"] p');
    await expect(contentPara).toContainText('English content here', { timeout: 10000 });

    // Switch to TH
    await page.locator('.topnav .lang-toggle button').nth(1).click();
    await page.waitForTimeout(300);

    // Content should now show Thai text
    await expect(contentPara).toContainText('เนื้อหาภาษาไทยที่นี่');

    // Switch back to EN
    await page.locator('.topnav .lang-toggle button').nth(0).click();
    await page.waitForTimeout(300);

    await expect(contentPara).toContainText('English content here');
  });

});
