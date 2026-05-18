// tests/e2e/diagrams.spec.js
const { test, expect } = require('@playwright/test');

const FIXTURE_URL = 'http://localhost:8080/tests/e2e/fixtures/es-board-fixture.html';

test.describe('DRE-17 · ES Board component', () => {

  test('AC1 .es-board-container is visible', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    await expect(page.locator('.es-board-container').first()).toBeVisible();
  });

  test('AC2 .sticky-event computed background = rgb(249, 115, 22)', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    const bg = await page.locator('.sticky-event').first()
      .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(249, 115, 22)');
  });

  test('AC3 .sticky-command computed background = rgb(59, 130, 246)', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    const bg = await page.locator('.sticky-command').first()
      .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(59, 130, 246)');
  });

  test('AC4 .sticky-actor computed background = rgb(253, 230, 138)', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    const bg = await page.locator('.sticky-actor').first()
      .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(253, 230, 138)');
  });

  test('AC5 .sticky-policy computed background = rgb(167, 139, 250)', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    const bg = await page.locator('.sticky-policy').first()
      .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(167, 139, 250)');
  });

  test('AC6 .sticky-hotspot computed background = rgb(251, 113, 133)', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    const bg = await page.locator('.sticky-hotspot').first()
      .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(251, 113, 133)');
  });

  test('AC7 mobile 375px: .es-board-container has overflow-x: auto', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(FIXTURE_URL);
    const overflow = await page.locator('.es-board-container').first()
      .evaluate(el => getComputedStyle(el).overflowX);
    expect(overflow).toBe('auto');
  });

  test('AC8 at least 3 .sticky-note elements rendered', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    const count = await page.locator('.es-board-container').first()
      .locator('.sticky-note').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('AC9 .es-board-legend is visible below board', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    await expect(page.locator('.es-board-legend').first()).toBeVisible();
  });

  test('AC10 content-loader renderEsBoard handles lanes format', async ({ page }) => {
    // Drive the live renderer with a module page + mocked JSON
    const MOD_URL = 'http://localhost:8080/modules/01-intro.html';
    await page.route('**/content/lessons/**/module-01.json', route => route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        module: {
          id: 'module-01', number: 1,
          title: { en: 'T', th: 'T' }, estimatedMinutes: 1,
          sections: [{
            id: 'es1', type: 'es-board',
            title: { en: 'Order Flow', th: 'สั่งซื้อ' },
            lanes: [{
              id: 'checkout',
              label: { en: 'Checkout', th: 'ชำระเงิน' },
              items: [
                { type: 'command', text: { en: 'Place Order', th: 'สั่งซื้อ' } },
                { type: 'event',   text: { en: 'OrderPlaced', th: 'สั่งซื้อแล้ว' } },
                { type: 'actor',   text: { en: 'Customer',    th: 'ลูกค้า' } }
              ]
            }]
          }]
        }
      })
    }));
    await page.goto(MOD_URL);
    await expect(page.locator('.es-board-container')).toBeVisible();
    await expect(page.locator('.sticky-note')).toHaveCount(3);
    await expect(page.locator('.es-board-legend')).toBeVisible();
  });
});
