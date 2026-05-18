// js/quiz.js — DRE-16: Quiz System (MCQ + True/False)
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pick(field, lang) {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
  }

  const TF_OPTIONS = [
    { id: 'true',  text: { en: 'True',  th: 'จริง' } },
    { id: 'false', text: { en: 'False', th: 'เท็จ' } }
  ];

  class QuizEngine {
    constructor(moduleId) {
      this.moduleId = moduleId;
      this.questions = [];
      this.answers   = {};   // questionId -> optionId
      this.answered  = {};   // questionId -> boolean
      this.submitted = false;
      this.score     = null;
      this.loaded    = false;
    }

    async load(lang, pathPrefix) {
      const url = `${pathPrefix}content/quizzes/${lang}/${this.moduleId}.json`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        this.questions = (data.questions || []).map(q => {
          if (q.type === 'truefalse' && !q.options) {
            return Object.assign({}, q, { options: TF_OPTIONS });
          }
          return q;
        });
        this.loaded = true;
      } catch (err) {
        console.warn('[quiz] load failed', url, err);
        this.questions = [];
        this.loaded = true;
      }
    }

    selectAnswer(questionId, optionId) {
      if (this.answered[questionId]) return null;
      this.answers[questionId]  = optionId;
      this.answered[questionId] = true;
      return this.buildQuestionResult(questionId);
    }

    buildQuestionResult(questionId) {
      const q = this.questions.find(x => x.id === questionId);
      if (!q) return null;
      return {
        isCorrect:     this.answers[questionId] === q.correctOption,
        correctOption: q.correctOption,
        explanation:   q.explanation
      };
    }

    allAnswered() {
      return this.questions.length > 0 &&
             this.questions.every(q => this.answered[q.id]);
    }

    calculateScore() {
      if (!this.questions.length) return 0;
      const correct = this.questions.filter(q => this.answers[q.id] === q.correctOption).length;
      return Math.round((correct / this.questions.length) * 100);
    }

    correctCount() {
      return this.questions.filter(q => this.answers[q.id] === q.correctOption).length;
    }

    submit() {
      this.score = this.calculateScore();
      this.submitted = true;
      const progress = JSON.parse(localStorage.getItem('ddd-progress') || '{}');
      progress[this.moduleId] = {
        quizCompleted: true,
        score: this.score,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('ddd-progress', JSON.stringify(progress));
      // Reassign for Alpine reactivity (nav x-show observes store.progress)
      if (window.Alpine && Alpine.store('app')) {
        Alpine.store('app').progress = progress;
      }
      return this.score;
    }

    retake() {
      this.answers   = {};
      this.answered  = {};
      this.submitted = false;
      this.score     = null;
    }
  }

  // ── rendering ─────────────────────────────────────────────────────────────
  function ensureRoot() {
    let root = document.getElementById('quiz-root');
    if (root) return root;
    const main = document.getElementById('module-root');
    if (!main) return null;
    root = document.createElement('section');
    root.id = 'quiz-root';
    root.className = 'quiz-section';
    main.appendChild(root);
    return root;
  }

  function render(engine, lang) {
    const root = ensureRoot();
    if (!root) return;
    if (!engine.questions.length) { root.innerHTML = ''; return; }

    const allAnswered = engine.allAnswered();

    const questionsHtml = engine.questions.map((q, idx) => {
      const locked = engine.answered[q.id];
      const sel    = engine.answers[q.id];
      const correctId = q.correctOption;

      const optionsHtml = q.options.map(opt => {
        let cls = 'quiz-option';
        if (locked) {
          if (opt.id === correctId) cls += ' quiz-correct';
          else if (opt.id === sel)  cls += ' quiz-incorrect';
        }
        const checkedAttr  = sel === opt.id ? 'checked' : '';
        // Note: no 'disabled' attr on input — locking is enforced by the event handler
        // checking .quiz-question.quiz-locked. Setting disabled blocks Playwright clicks.
        return `<label class="${cls}" data-option-id="${esc(opt.id)}">
          <input type="radio" name="${esc(q.id)}" value="${esc(opt.id)}" ${checkedAttr}/>
          <span>${esc(pick(opt.text, lang))}</span>
        </label>`;
      }).join('');

      const explHtml = locked
        ? `<div class="quiz-explanation" role="status">${esc(pick(q.explanation, lang))}</div>`
        : `<div class="quiz-explanation" hidden></div>`;

      return `<div class="quiz-question ${locked ? 'quiz-locked' : ''}" data-question-id="${esc(q.id)}">
        <p class="quiz-question__text"><strong>${idx + 1}.</strong> ${esc(pick(q.question, lang))}</p>
        <div class="quiz-options">${optionsHtml}</div>
        ${explHtml}
      </div>`;
    }).join('');

    const scoreHtml = engine.submitted
      ? `<div class="quiz-score" role="status">Score: ${engine.score}% (${engine.correctCount()} / ${engine.questions.length})</div>`
      : `<div class="quiz-score" hidden></div>`;

    root.innerHTML = `
      <h2 class="quiz-heading">${lang === 'th' ? 'แบบทดสอบ' : 'Quiz'}</h2>
      <form class="quiz-form" onsubmit="return false">
        ${questionsHtml}
        ${scoreHtml}
        <div class="quiz-actions">
          <button type="button" class="btn-primary quiz-submit" ${allAnswered && !engine.submitted ? '' : 'disabled'}>
            ${lang === 'th' ? 'ส่งคำตอบ' : 'Submit'}
          </button>
          <button type="button" class="btn-secondary quiz-retake" ${engine.submitted ? '' : 'hidden'}>
            ${lang === 'th' ? 'ทำใหม่' : 'Retake'}
          </button>
        </div>
      </form>
    `;
  }

  // ── event delegation ──────────────────────────────────────────────────────
  let ENGINE = null;
  let bound = false;

  function bindOnce() {
    if (bound) return;
    bound = true;
    document.addEventListener('click', (e) => {
      if (!ENGINE) return;
      const root = document.getElementById('quiz-root');
      if (!root || !root.contains(e.target)) return;

      const opt = e.target.closest('.quiz-option');
      if (opt && !opt.closest('.quiz-question.quiz-locked')) {
        const qEl = opt.closest('.quiz-question');
        const qid = qEl.dataset.questionId;
        const oid = opt.dataset.optionId;
        ENGINE.selectAnswer(qid, oid);
        render(ENGINE, currentLang());
        return;
      }

      if (e.target.closest('.quiz-submit')) {
        if (!ENGINE.allAnswered() || ENGINE.submitted) return;
        ENGINE.submit();
        render(ENGINE, currentLang());
        return;
      }

      if (e.target.closest('.quiz-retake')) {
        ENGINE.retake();
        render(ENGINE, currentLang());
        return;
      }
    });
  }

  function currentLang() {
    return (window.Alpine && Alpine.store('app')?.lang) || 'en';
  }
  function currentPrefix() {
    return (window.Alpine && Alpine.store('app')?.pathPrefix) || '';
  }
  function currentModuleId() {
    return (window.Alpine && Alpine.store('app')?.currentModuleId) || null;
  }

  async function wireAlpine() {
    const moduleId = currentModuleId();
    if (!moduleId) return;        // not on a module page
    bindOnce();
    ENGINE = new QuizEngine(moduleId);
    await ENGINE.load(currentLang(), currentPrefix());
    render(ENGINE, currentLang());

    // Re-render on lang change. Reload JSON for new language but preserve answers.
    Alpine.effect(async () => {
      const lang = Alpine.store('app').lang;
      if (!ENGINE) return;
      // Save current state, reload, restore
      const ans = ENGINE.answers, answered = ENGINE.answered;
      const sub = ENGINE.submitted, score = ENGINE.score;
      await ENGINE.load(lang, currentPrefix());
      ENGINE.answers = ans; ENGINE.answered = answered;
      ENGINE.submitted = sub; ENGINE.score = score;
      render(ENGINE, lang);
    });
  }

  if (typeof Alpine !== 'undefined' && Alpine.store) {
    wireAlpine();
  } else {
    document.addEventListener('alpine:initialized', wireAlpine);
  }
})();
