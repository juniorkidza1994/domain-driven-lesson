const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';
const INDEX = BASE + '/index.html';

async function clearAll(page) {
  await page.context().clearCookies();
  await page.addInitScript(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  });
}

test.describe('DRE-29 Named profile', () => {

  test('Case A: first visit shows non-dismissible name-entry modal', async ({ page }) => {
    await clearAll(page);
    await page.goto(INDEX);

    const modal = page.getByTestId('profile-modal');
    await expect(modal).toBeVisible();

    // Should be in 'create' view (no profiles exist)
    await expect(page.getByTestId('profile-name-input')).toBeVisible();
    // profile-list is in DOM but hidden when view is 'create'
    await expect(page.getByTestId('profile-list')).toBeHidden();

    // ESC should NOT close
    await page.keyboard.press('Escape');
    await expect(modal).toBeVisible();

    // Overlay click should NOT close
    await page.getByTestId('profile-modal-overlay').click({ position: { x: 10, y: 10 }, force: true });
    await expect(modal).toBeVisible();

    // Submit empty/whitespace rejected
    await page.getByTestId('profile-name-input').fill('   ');
    await expect(page.getByTestId('profile-create-submit')).toBeDisabled();

    // Valid name closes modal and persists profile
    await page.getByTestId('profile-name-input').fill('Alice');
    await page.getByTestId('profile-create-submit').click();
    await expect(modal).toBeHidden();

    const stored = await page.evaluate(() => ({
      active:   sessionStorage.getItem('ddd-active-profile'),
      profiles: JSON.parse(localStorage.getItem('ddd-profiles') || '[]'),
    }));
    expect(stored.active).toBe('Alice');
    expect(stored.profiles).toEqual(['Alice']);

    // Nav chip visible with name
    await expect(page.getByTestId('profile-chip')).toContainText('Alice');
  });

  test('Case B: return visit (new tab) shows profile list', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddd-profiles', JSON.stringify(['Alice', 'Bob']));
      localStorage.setItem('ddd-progress-Alice', JSON.stringify({ 'module-01': { quizCompleted: true, score: 80 } }));
    });
    await page.goto(INDEX);

    const modal = page.getByTestId('profile-modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('profile-list')).toBeVisible();

    const items = page.getByTestId('profile-list-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveText('Alice');
    await expect(items.nth(1)).toHaveText('Bob');

    // "+ New Profile" always available
    await expect(page.getByTestId('profile-create-new')).toBeVisible();

    // Click Alice → modal closes, progress loaded, chip shows Alice
    await items.nth(0).click();
    await expect(modal).toBeHidden();
    await expect(page.getByTestId('profile-chip')).toContainText('Alice');

    const active = await page.evaluate(() => sessionStorage.getItem('ddd-active-profile'));
    expect(active).toBe('Alice');
  });

  test('Case B: New Profile button switches view to create form', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddd-profiles', JSON.stringify(['Alice']));
    });
    await page.goto(INDEX);
    await expect(page.getByTestId('profile-list')).toBeVisible();

    await page.getByTestId('profile-create-new').click();
    await expect(page.getByTestId('profile-name-input')).toBeVisible();
    await expect(page.getByTestId('profile-create-back')).toBeVisible();

    await page.getByTestId('profile-name-input').fill('Bob');
    await page.getByTestId('profile-create-submit').click();

    const stored = await page.evaluate(() => ({
      active:   sessionStorage.getItem('ddd-active-profile'),
      profiles: JSON.parse(localStorage.getItem('ddd-profiles') || '[]'),
    }));
    expect(stored.active).toBe('Bob');
    // MRU order — Bob first
    expect(stored.profiles[0]).toBe('Bob');
    expect(stored.profiles).toContain('Alice');
  });

  test('Case C: active profile in sessionStorage skips modal', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddd-profiles', JSON.stringify(['Alice']));
      sessionStorage.setItem('ddd-active-profile', 'Alice');
      localStorage.setItem('ddd-progress-Alice', JSON.stringify({ 'module-01': { quizCompleted: true, score: 90 } }));
    });
    await page.goto(INDEX);

    await expect(page.getByTestId('profile-modal')).toBeHidden();
    await expect(page.getByTestId('profile-chip')).toContainText('Alice');
  });

  test('Nav chip dropdown: Switch Profile and New Profile', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddd-profiles', JSON.stringify(['Alice', 'Bob']));
      sessionStorage.setItem('ddd-active-profile', 'Alice');
    });
    await page.goto(INDEX);

    await page.getByTestId('profile-chip').click();
    await expect(page.getByTestId('chip-switch')).toBeVisible();
    await expect(page.getByTestId('chip-new')).toBeVisible();

    // Switch Profile reopens list modal and clears active
    await page.getByTestId('chip-switch').click();
    await expect(page.getByTestId('profile-modal')).toBeVisible();
    await expect(page.getByTestId('profile-list')).toBeVisible();

    const active = await page.evaluate(() => sessionStorage.getItem('ddd-active-profile'));
    expect(active).toBeNull();
  });

  test('Profiles ordered most-recently-used first', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddd-profiles', JSON.stringify(['Alice', 'Bob']));
    });
    await page.goto(INDEX);

    await page.getByTestId('profile-list-item').nth(1).click(); // pick Bob
    const profiles = await page.evaluate(() => JSON.parse(localStorage.getItem('ddd-profiles')));
    expect(profiles).toEqual(['Bob', 'Alice']);
  });

  test('Progress is scoped to ddd-progress-{name}', async ({ page }) => {
    await clearAll(page);
    await page.goto(INDEX);

    await page.getByTestId('profile-name-input').fill('Carol');
    await page.getByTestId('profile-create-submit').click();

    // Simulate quiz completion via store
    await page.evaluate(() => {
      Alpine.store('app').saveProgress('module-01', 100);
    });

    const carolProgress = await page.evaluate(() => localStorage.getItem('ddd-progress-Carol'));
    expect(carolProgress).toContain('module-01');

    // Legacy key must not be written to
    const legacy = await page.evaluate(() => localStorage.getItem('ddd-progress'));
    expect(legacy).toBeNull();
  });

  test('Legacy ddd-progress key is preserved (read-only fallback, never overwritten)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ddd-progress', JSON.stringify({ 'module-01': { quizCompleted: true, score: 50 } }));
    });
    await page.goto(INDEX);

    // First visit: modal still shown because no profiles defined
    await expect(page.getByTestId('profile-modal')).toBeVisible();

    await page.getByTestId('profile-name-input').fill('Dave');
    await page.getByTestId('profile-create-submit').click();

    // Legacy key untouched
    const legacy = await page.evaluate(() => JSON.parse(localStorage.getItem('ddd-progress')));
    expect(legacy['module-01'].score).toBe(50);
  });
});
