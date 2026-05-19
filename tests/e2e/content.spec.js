// tests/e2e/content.spec.js
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';
const MODULE_URL = BASE + '/modules/01-intro.html';

// Fixture covers all 7 section types so one page load proves every renderer.
const FIXTURE = {
  module: {
    id: 'module-01', number: 1,
    title: { en: 'Test EN Title', th: 'Test TH Title' },
    estimatedMinutes: 1,
    sections: [
      { id: 's1', type: 'text',
        title: { en: 'Intro EN', th: 'Intro TH' },
        content: { en: 'Hello world EN', th: 'สวัสดี TH' } },
      { id: 's2', type: 'callout', variant: 'info',
        title: { en: 'Note EN', th: 'Note TH' },
        content: { en: 'Callout body EN', th: 'Callout body TH' } },
      { id: 's3', type: 'diagram',
        title: { en: 'Diagram EN', th: 'Diagram TH' },
        diagram: 'graph LR; A-->B' },
      { id: 's4', type: 'flow', title: { en: 'Flow EN', th: 'Flow TH' },
        steps: [
          { label: { en: 'One',   th: 'หนึ่ง' }, body: { en: 'first',  th: 'แรก' } },
          { label: { en: 'Two',   th: 'สอง'  }, body: { en: 'second', th: 'สอง'  } }
        ] },
      { id: 's5', type: 'comparison', title: { en: 'Cmp EN', th: 'Cmp TH' },
        left:  { heading: { en: 'L', th: 'ซ' }, items: [{ en: 'a', th: 'ก' }] },
        right: { heading: { en: 'R', th: 'ข' }, items: [{ en: 'b', th: 'ข' }] } },
      { id: 's6', type: 'infographic', title: { en: 'Info EN', th: 'Info TH' },
        items: [ { icon: '⚡', label: { en: 'Fast', th: 'เร็ว' }, body: { en: 'x', th: 'x' } } ] },
      { id: 's7', type: 'es-board', title: { en: 'Board EN', th: 'Board TH' },
        notes: [ { kind: 'event', label: { en: 'Order Placed', th: 'สั่งซื้อ' } } ] }
    ]
  }
};

async function mockJson(page, body, status) {
  await page.route('**/content/lessons/**/module-01.json', (route) => {
    if (status && status !== 200) return route.fulfill({ status, body: 'not found' });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

test.describe('DRE-14 · content-loader', () => {

  test('AC1 #sections-container has ≥1 child after load', async ({ page }) => {
    await mockJson(page, FIXTURE);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(MODULE_URL);
    const container = page.locator('#sections-container');
    await expect(container).toBeVisible();
    await expect(container.locator('> *')).not.toHaveCount(0);
    expect(errors).toEqual([]);                       // AC8 · no console errors
  });

  test('AC2 text section renders <section class="content-section"> with <p>', async ({ page }) => {
    await mockJson(page, FIXTURE);
    await page.goto(MODULE_URL);
    const sec = page.locator('section.content-section[data-section-id="s1"]');
    await expect(sec).toBeVisible();
    await expect(sec.locator('p')).toContainText('Hello world EN');
  });

  test('AC3 callout renders .callout with non-empty text', async ({ page }) => {
    await mockJson(page, FIXTURE);
    await page.goto(MODULE_URL);
    const cal = page.locator('section[data-section-id="s2"] .callout');
    await expect(cal).toBeVisible();
    await expect(cal).toContainText(/Callout body EN/);
  });

  test('AC4 diagram renders .mermaid-block element', async ({ page }) => {
    await mockJson(page, FIXTURE);
    await page.goto(MODULE_URL);
    await expect(page.locator('section[data-section-id="s3"] .mermaid-block')).toHaveCount(1);
  });

  test('AC5 flow renders .step-flow with ≥2 .step-flow-item', async ({ page }) => {
    await mockJson(page, FIXTURE);
    await page.goto(MODULE_URL);
    const items = page.locator('section[data-section-id="s4"] .step-flow .step-flow-item');
    await expect(items).toHaveCount(2);
  });

  test('AC6 language toggle re-renders with TH text', async ({ page }) => {
    await mockJson(page, FIXTURE);
    await page.goto(MODULE_URL);
    const p = page.locator('section[data-section-id="s1"] p');
    await expect(p).toContainText('Hello world EN');
    await page.evaluate(() => window.Alpine.store('app').toggleLang());
    await expect(p).toContainText('สวัสดี TH');
  });

  test('AC7 fetch 404 → "Content unavailable" visible', async ({ page }) => {
    await mockJson(page, null, 404);
    await page.goto(MODULE_URL);
    await expect(page.locator('#sections-container')).toContainText(/Content unavailable/i);
  });

  test.skip('AC8 (covered in AC1) no console errors on normal load', () => {});
});

// ── DRE-26: Real-content smoke — all 7 module URLs ──────────────────────────
// No mocking: hits the actual JSON files served by the static server.
// Asserts: #sections-container has ≥1 child within 10s, zero console.error.

const MODULES = [
  { n: '01', slug: 'intro' },
  { n: '02', slug: 'ddd' },
  { n: '03', slug: 'event-storming' },
  { n: '04', slug: 'es-to-ddd' },
  { n: '05', slug: 'eda' },
  { n: '06', slug: 'es-to-eda' },
  { n: '07', slug: 'case-study' },
];

test.describe('DRE-26 · real-content smoke (all 7 modules)', () => {
  for (const m of MODULES) {
    const url = BASE + `/modules/${m.n}-${m.slug}.html`;

    test(`module-${m.n} loads real content without errors`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(url);
      await page.waitForFunction(() => window.Alpine !== undefined);

      // Wait for at least one section to appear (real fetch from JSON)
      const container = page.locator('#sections-container');
      await expect(container).toBeVisible({ timeout: 10000 });
      await expect(container.locator('> *')).not.toHaveCount(0, { timeout: 10000 });

      expect(errors).toEqual([]);
    });
  }
});
