const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080';
const MODULE_URL    = BASE + '/modules/02-ddd.html';
const MODULE_07_URL = BASE + '/modules/07-case-study.html';

const QUIZ_FIXTURE = {
  moduleId: 'module-02',
  questions: [
    {
      id: 'q1', type: 'mcq',
      question: { en: 'What is a Bounded Context?', th: 'BC?' },
      options: [
        { id: 'a', text: { en: 'A model boundary', th: 'ขอบเขต' } },
        { id: 'b', text: { en: 'A database schema', th: 'สคีมา' } }
      ],
      correctOption: 'a',
      explanation: { en: 'It defines where a model applies.', th: 'อธิบาย' }
    },
    {
      id: 'q2', type: 'true-false',
      question: { en: 'DDD requires microservices.', th: 'DDD ต้องไมโคร?' },
      options: [
        { id: 'true',  text: { en: 'True',  th: 'จริง' } },
        { id: 'false', text: { en: 'False', th: 'เท็จ' } }
      ],
      correctOption: 'false',
      explanation: { en: 'DDD is architecture-agnostic.', th: 'ไม่ขึ้นกับสถาปัตยกรรม' }
    }
  ]
};

const QUIZ_07_FIXTURE = {
  moduleId: 'module-07',
  questions: [
    {
      id: 'q1', type: 'mcq',
      question: { en: 'What is the case study about?', th: 'กรณีศึกษาเกี่ยวกับอะไร?' },
      options: [
        { id: 'a', text: { en: 'E-commerce', th: 'อีคอมเมิร์ซ' } },
        { id: 'b', text: { en: 'Banking',    th: 'ธนาคาร' } }
      ],
      correctOption: 'a',
      explanation: { en: 'The case study covers an e-commerce platform.', th: 'อธิบาย' }
    },
    {
      id: 'q2', type: 'true-false',
      question: { en: 'DDD can be applied to e-commerce.', th: 'DDD ใช้กับอีคอมเมิร์ซได้?' },
      options: [
        { id: 'true',  text: { en: 'True',  th: 'จริง' } },
        { id: 'false', text: { en: 'False', th: 'เท็จ' } }
      ],
      correctOption: 'true',
      explanation: { en: 'Yes, it can.', th: 'ใช่' }
    }
  ]
};

// Empty lesson so content-loader does not error
const LESSON_FIXTURE    = { module: { id: 'module-02', number: 2, title: { en: 'X', th: 'X' }, estimatedMinutes: 1, sections: [] } };
const LESSON_07_FIXTURE = { module: { id: 'module-07', number: 7, title: { en: 'X', th: 'X' }, estimatedMinutes: 1, sections: [] } };

async function mockAll(page) {
  await page.route('**/content/quizzes/**/module-02.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(QUIZ_FIXTURE) }));
  await page.route('**/content/lessons/**/module-02.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LESSON_FIXTURE) }));
}

async function mockAll07(page) {
  await page.route('**/content/quizzes/**/module-07.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(QUIZ_07_FIXTURE) }));
  await page.route('**/content/lessons/**/module-07.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LESSON_07_FIXTURE) }));
}

async function seedProfile(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('ddd-active-profile', 'TestUser');
    localStorage.setItem('ddd-profiles', JSON.stringify(['TestUser']));
  });
}

async function gotoQuiz(page) {
  // DRE-29: seed active profile so profile modal doesn't block
  await seedProfile(page);
  await mockAll(page);
  await page.goto(MODULE_URL);
  await page.waitForFunction(() => window.Alpine !== undefined);
  await page.waitForSelector('.quiz-question[data-question-id="q1"]', { timeout: 15000 });
}

async function gotoQuiz07(page) {
  await seedProfile(page);
  await mockAll07(page);
  await page.goto(MODULE_07_URL);
  await page.waitForFunction(() => window.Alpine !== undefined);
  await page.waitForSelector('.quiz-question[data-question-id="q1"]', { timeout: 15000 });
}

async function answerAndSubmit(page) {
  await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
  await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="false"]').click();
  await page.locator('.quiz-submit').click();
}

async function answerAndSubmit07(page) {
  await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
  await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="true"]').click();
  await page.locator('.quiz-submit').click();
}

test.describe('DRE-16 · quiz system', () => {

  test('AC1 quiz section renders with ≥1 question visible', async ({ page }) => {
    await gotoQuiz(page);
    await expect(page.locator('.quiz-question').first()).toBeVisible();
  });

  test('AC2 true/false question has exactly 2 radio options', async ({ page }) => {
    await gotoQuiz(page);
    const tfQuestion = page.locator('.quiz-question[data-question-id="q2"]');
    await expect(tfQuestion.locator('.quiz-option')).toHaveCount(2);
  });

  test('AC3 selecting answer shows explanation immediately', async ({ page }) => {
    await gotoQuiz(page);
    await page.locator('.quiz-question[data-question-id="q1"] .quiz-option').first().click();
    const expl = page.locator('.quiz-question[data-question-id="q1"] .quiz-explanation');
    await expect(expl).toBeVisible();
    await expect(expl).not.toHaveText('');
  });

  test('AC4 correct answer gets .quiz-correct class', async ({ page }) => {
    await gotoQuiz(page);
    const correct = page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]');
    await correct.click();
    await expect(correct).toHaveClass(/quiz-correct/);
  });

  test('AC5 wrong answer: selected red, correct highlighted green', async ({ page }) => {
    await gotoQuiz(page);
    const wrong   = page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="b"]');
    const correct = page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]');
    await wrong.click();
    await expect(wrong).toHaveClass(/quiz-incorrect/);
    await expect(correct).toHaveClass(/quiz-correct/);
  });

  test('AC6 option locked after selection (cannot change)', async ({ page }) => {
    await gotoQuiz(page);
    const q1 = page.locator('.quiz-question[data-question-id="q1"]');
    await q1.locator('.quiz-option[data-option-id="a"]').click();
    await q1.locator('.quiz-option[data-option-id="b"]').click(); // ignored
    // a remains correct, b never gets .quiz-incorrect
    await expect(q1.locator('.quiz-option[data-option-id="a"]')).toHaveClass(/quiz-correct/);
    await expect(q1.locator('.quiz-option[data-option-id="b"]')).not.toHaveClass(/quiz-incorrect/);
    await expect(q1).toHaveClass(/quiz-locked/);
  });

  test('AC7 submit disabled until all answered', async ({ page }) => {
    await gotoQuiz(page);
    const submit = page.locator('.quiz-submit');
    await expect(submit).toBeDisabled();
    await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
    await expect(submit).toBeDisabled(); // still 1/2
    await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="false"]').click();
    await expect(submit).toBeEnabled();
  });

  test('AC8 submit → score displayed', async ({ page }) => {
    await gotoQuiz(page);
    await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
    await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="false"]').click();
    await page.locator('.quiz-submit').click();
    const score = page.locator('.quiz-score');
    await expect(score).toBeVisible();
    await expect(score).toHaveText(/\d+%|\d+\s*\/\s*\d+/);
  });

  test('AC9 submit → localStorage progress persisted', async ({ page }) => {
    await gotoQuiz(page);
    await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
    await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="false"]').click();
    await page.locator('.quiz-submit').click();
    // DRE-29: progress is stored under profile-scoped key
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('ddd-progress-TestUser')));
    expect(progress['module-02'].quizCompleted).toBe(true);
    expect(typeof progress['module-02'].score).toBe('number');
    expect(progress['module-02'].score).toBeGreaterThanOrEqual(0);
  });

  test('AC10 reload → store.progress restored', async ({ page }) => {
    await gotoQuiz(page);
    await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
    await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="false"]').click();
    await page.locator('.quiz-submit').click();
    // DRE-29: addInitScript re-runs on reload so session storage is re-seeded
    await page.reload();
    await page.waitForFunction(() => window.Alpine !== undefined);
    // Wait for Alpine store to be fully initialized with profile-scoped progress
    await page.waitForFunction(() => {
      if (!window.Alpine) return false;
      const app = Alpine.store('app');
      return !!(app && app.activeProfile);
    }, { timeout: 10000 });
    const completed = await page.evaluate(() => Alpine.store('app').progress['module-02']?.quizCompleted);
    expect(completed).toBe(true);
  });

  test('AC11 nav checkmark visible after submit', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await ctx.newPage();
    // DRE-29: seed active profile so profile modal doesn't block
    await seedProfile(page);
    await mockAll(page);
    await page.goto(MODULE_URL);
    await page.waitForFunction(() => window.Alpine !== undefined);
    await page.waitForSelector('.quiz-question[data-question-id="q1"]', { timeout: 15000 });
    await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
    await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="false"]').click();
    await page.locator('.quiz-submit').click();
    // Open drawer to make module list visible on mobile
    await page.locator('.nav-hamburger').click();
    const mod02Row = page.locator('.drawer .nav-item').filter({ hasText: '02' }).first();
    await expect(mod02Row.locator('.check')).toBeVisible();
    await ctx.close();
  });

  test('AC12 retake clears answers, explanations, score', async ({ page }) => {
    await gotoQuiz(page);
    await page.locator('.quiz-question[data-question-id="q1"] .quiz-option[data-option-id="a"]').click();
    await page.locator('.quiz-question[data-question-id="q2"] .quiz-option[data-option-id="false"]').click();
    await page.locator('.quiz-submit').click();
    await expect(page.locator('.quiz-score')).toBeVisible();
    await page.locator('.quiz-retake').click();
    await expect(page.locator('.quiz-score')).toBeHidden();
    await expect(page.locator('.quiz-explanation').first()).toBeHidden();
    await expect(page.locator('.quiz-question.quiz-locked')).toHaveCount(0);
    await expect(page.locator('.quiz-submit')).toBeDisabled();
  });
});

test.describe('DRE-31 · scroll, next module, congratulations', () => {

  test('AC1 submitting quiz does not scroll to top', async ({ page }) => {
    await gotoQuiz(page);
    // Scroll down first so we can verify position is preserved after submit
    await page.evaluate(() => window.scrollTo(0, 500));
    await answerAndSubmit(page);
    // Score should be visible without scroll reset (DRE-37: removed scroll-to-top)
    await expect(page.locator('.quiz-score')).toBeVisible();
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(50);
  });

  test('AC2 module-02 shows next-module button with correct href after submit', async ({ page }) => {
    await gotoQuiz(page);
    await answerAndSubmit(page);
    const nextBtn = page.locator('a.quiz-next-module');
    await expect(nextBtn).toBeVisible();
    const href = await nextBtn.getAttribute('href');
    expect(href).toMatch(/03-event-storming\.html$/);
  });

  test('AC3 module-07 shows congrats block, no next-module button', async ({ page }) => {
    await gotoQuiz07(page);
    await answerAndSubmit07(page);
    await expect(page.locator('.quiz-congrats')).toBeVisible();
    await expect(page.locator('a.quiz-next-module')).toHaveCount(0);
  });

  test('AC4 restart button clears progress and navigates to index.html', async ({ page }) => {
    await gotoQuiz07(page);
    await answerAndSubmit07(page);
    await expect(page.locator('.quiz-restart')).toBeVisible();
    await page.locator('.quiz-restart').click();
    // Should navigate to index.html (from /modules/ the prefix is ../)
    await page.waitForURL(/index\.html$/, { timeout: 5000 });
    // Progress should be cleared for the profile
    const progress = await page.evaluate(() => {
      const raw = localStorage.getItem('ddd-progress-TestUser');
      return raw ? JSON.parse(raw) : {};
    });
    expect(Object.keys(progress)).toHaveLength(0);
  });

  test('AC5 retake hides next-module button', async ({ page }) => {
    await gotoQuiz(page);
    await answerAndSubmit(page);
    await expect(page.locator('a.quiz-next-module')).toBeVisible();
    await page.locator('.quiz-retake').click();
    await expect(page.locator('a.quiz-next-module')).toHaveCount(0);
    await expect(page.locator('.quiz-congrats')).toHaveCount(0);
  });
});
