const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';
const MODULE_URL = BASE + '/modules/01-intro.html';
const GLOSSARY_URL = BASE + '/glossary.html';

// Lesson fixture that includes the tooltip-trigger markup the renderer expands.
const FIXTURE = {
  module: {
    id: 'module-01', number: 1,
    title: { en: 'T', th: 'T' },
    estimatedMinutes: 1,
    sections: [
      { id: 's1', type: 'text',
        title: { en: 'Intro', th: 'Intro' },
        content: {
          en: 'DDD revolves around the {{tip:bounded-context|Bounded Context}}.',
          th: 'DDD หมุนรอบ {{tip:bounded-context|ขอบเขตที่มีบริบท}}.'
        } }
    ]
  }
};

async function mockLesson(page) {
  await page.route('**/content/lessons/**/module-01.json', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json',
                    body: JSON.stringify(FIXTURE) }));
}

test.describe('DRE-15 · tooltip system', () => {

  test('AC1 .tooltip-trigger visible in rendered lesson', async ({ page }) => {
    await mockLesson(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(MODULE_URL);
    await expect(page.locator('.tooltip-trigger').first()).toBeVisible();
  });

  test('AC2 desktop hover → bubble visible with text', async ({ page }) => {
    await mockLesson(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(MODULE_URL);
    await page.locator('.tooltip-trigger').first().hover();
    const bubble = page.locator('.tooltip-bubble');
    await expect(bubble).toBeVisible();
    await expect(bubble).not.toHaveText('');
  });

  test('AC3 click outside → bubble hidden', async ({ page }) => {
    await mockLesson(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(MODULE_URL);
    await page.locator('.tooltip-trigger').first().hover();
    await expect(page.locator('.tooltip-bubble')).toBeVisible();
    await page.locator('h1, main').first().click({ position: { x: 5, y: 5 } });
    await expect(page.locator('.tooltip-bubble')).toBeHidden();
  });

  test('AC4 mobile tap → .tooltip-sheet visible with full def', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await ctx.newPage();
    await mockLesson(page);
    await page.goto(MODULE_URL);
    await page.locator('.tooltip-trigger').first().click();
    const sheet = page.locator('.tooltip-sheet');
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText(/[A-Za-zก-๙]/);
    await ctx.close();
  });

  test('AC5 tap overlay → sheet hidden', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await ctx.newPage();
    await mockLesson(page);
    await page.goto(MODULE_URL);
    await page.locator('.tooltip-trigger').first().click();
    await expect(page.locator('.tooltip-sheet')).toBeVisible();
    await page.locator('.tooltip-overlay').click();
    await expect(page.locator('.tooltip-sheet')).toBeHidden();
    await ctx.close();
  });

  test('AC6 close button → sheet hidden', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await ctx.newPage();
    await mockLesson(page);
    await page.goto(MODULE_URL);
    await page.locator('.tooltip-trigger').first().click();
    await page.locator('.tooltip-sheet__close').click();
    await expect(page.locator('.tooltip-sheet')).toBeHidden();
    await ctx.close();
  });

  test('AC7 glossary.html has ≥1 <h2> category heading', async ({ page }) => {
    await page.goto(GLOSSARY_URL);
    await expect(page.locator('main h2').first()).toBeVisible();
  });

  test('AC8 glossary.html has ≥1 term definition', async ({ page }) => {
    await page.goto(GLOSSARY_URL);
    await expect(page.locator('.glossary-term .glossary-term__def').first()).toBeVisible();
  });

  test('AC9 language toggle changes tooltip text', async ({ page }) => {
    await mockLesson(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(MODULE_URL);
    await page.locator('.tooltip-trigger').first().hover();
    const enText = await page.locator('.tooltip-bubble').innerText();
    await page.evaluate(() => window.Alpine.store('app').toggleLang());
    // hover again (bubble closed by lang-change)
    await page.locator('.tooltip-trigger').first().hover();
    const thText = await page.locator('.tooltip-bubble').innerText();
    expect(thText).not.toBe(enText);
  });

  test('AC10 keyboard: Tab + Enter opens tooltip', async ({ page }) => {
    await mockLesson(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(MODULE_URL);
    await page.locator('.tooltip-trigger').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.tooltip-bubble')).toBeVisible();
  });
});
