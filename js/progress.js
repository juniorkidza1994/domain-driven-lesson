// js/progress.js — DRE-30: progress bar + smart Start/Continue/Restart button on index.html.
// Vanilla JS only. Reads Alpine.store('app') reactively via Alpine.effect().

(function () {
  'use strict';

  function start() {
    const root = document.getElementById('progress-widget');
    if (!root) return; // Only runs on pages that opt-in (index.html).

    // Build skeleton once — Alpine.effect() updates the inner text/width on store changes.
    root.className = 'progress-widget card card-primary';
    root.innerHTML = [
      '<h2 class="progress-widget__title">Your progress</h2>',
      '<p class="progress-widget__label" data-role="label">0 / 7 modules completed</p>',
      '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="7" aria-valuenow="0">',
      '  <div class="progress-bar__track">',
      '    <div class="progress-bar__fill" data-role="fill" style="width:0%"></div>',
      '  </div>',
      '</div>',
      '<button type="button" class="btn-primary" data-role="cta">Start Learning</button>'
    ].join('');

    const labelEl = root.querySelector('[data-role="label"]');
    const fillEl  = root.querySelector('[data-role="fill"]');
    const barEl   = root.querySelector('.progress-bar');
    const ctaEl   = root.querySelector('[data-role="cta"]');

    let currentAction = null; // 'start' | 'continue' | 'restart'

    ctaEl.addEventListener('click', function () {
      if (currentAction === 'start') {
        window.location.href = 'modules/01-intro.html';
      } else if (currentAction === 'continue') {
        const modules = Alpine.store('modules').list;
        const progress = Alpine.store('app').progress;
        const firstIncomplete = modules.find(function (m) {
          return !progress[m.id] || !progress[m.id].quizCompleted;
        });
        if (firstIncomplete) {
          window.location.href = 'modules/' + firstIncomplete.href;
        }
      } else if (currentAction === 'restart') {
        Alpine.store('app').clearProgress();
      }
    });

    Alpine.effect(function render() {
      // Reading .progress here ensures Alpine.effect() tracks this reactive property.
      const progress = Alpine.store('app').progress;
      const modules  = Alpine.store('modules').list;
      const total    = modules.length;
      const done     = modules.filter(function (m) {
        return progress[m.id] && progress[m.id].quizCompleted === true;
      }).length;

      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      labelEl.textContent = done + ' / ' + total + ' modules completed';
      fillEl.style.width  = pct + '%';
      barEl.setAttribute('aria-valuenow', done);

      if (done === 0) {
        currentAction       = 'start';
        ctaEl.textContent   = 'Start Learning';
      } else if (done < total) {
        currentAction       = 'continue';
        ctaEl.textContent   = 'Continue Learning';
      } else {
        currentAction       = 'restart';
        ctaEl.textContent   = 'Restart';
      }
    });
  }

  // Guard for already-initialized case (Alpine loaded synchronously before this script).
  if (typeof Alpine !== 'undefined' && Alpine.store) {
    start();
  } else {
    document.addEventListener('alpine:initialized', start, { once: true });
  }
}());
