// js/diagrams.js — DRE-9: Mermaid theme + on-demand render
(function () {
  if (typeof mermaid === 'undefined') {
    console.error('[diagrams] mermaid CDN not loaded');
    return;
  }
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      primaryColor:       '#e0e7ff', // --color-primary-100
      primaryTextColor:   '#1e1b4b', // --color-text
      primaryBorderColor: '#6366f1', // --color-primary
      lineColor:          '#6366f1',
      secondaryColor:     '#ccfbf1', // --color-secondary-light
      tertiaryColor:      '#faf9f7', // --color-bg
      fontFamily:         "'Inter', system-ui, sans-serif"
    }
  });

  let lastFocus = null;

  function ensureOverlay() {
    if (document.querySelector('.diagram-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'diagram-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Diagram fullscreen view');
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="diagram-overlay__backdrop"></div>
      <div class="diagram-overlay__content">
        <button class="diagram-overlay__close" aria-label="Close">✕</button>
        <div class="diagram-overlay__body"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.diagram-overlay__backdrop').addEventListener('click', closeOverlay);
    overlay.querySelector('.diagram-overlay__close').addEventListener('click', closeOverlay);
    overlay.querySelector('.diagram-overlay__content').addEventListener('click', e => e.stopPropagation());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !document.querySelector('.diagram-overlay').hidden) closeOverlay();
    });
  }

  function openOverlay(svgEl) {
    ensureOverlay();
    const overlay = document.querySelector('.diagram-overlay');
    const body = overlay.querySelector('.diagram-overlay__body');
    const clone = svgEl.cloneNode(true);
    clone.removeAttribute('style');
    clone.setAttribute('width', '100%');
    clone.removeAttribute('height');
    body.innerHTML = '';
    body.appendChild(clone);
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('diagram-overlay-open');
    requestAnimationFrame(() => overlay.querySelector('.diagram-overlay__close').focus());
  }

  function closeOverlay() {
    const overlay = document.querySelector('.diagram-overlay');
    if (!overlay) return;
    overlay.hidden = true;
    overlay.querySelector('.diagram-overlay__body').innerHTML = '';
    document.body.classList.remove('diagram-overlay-open');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function attachExpandButton(el) {
    if (el.querySelector('.diagram-expand-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'diagram-expand-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Expand diagram');
    btn.title = 'Expand';
    btn.textContent = '⛶';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const svg = el.querySelector('svg');
      if (svg) openOverlay(svg);
    });
    el.appendChild(btn);
    ensureOverlay();
  }

  // Render every .mermaid-block[data-source] in document order.
  // Caller (page or content-loader) decides WHEN to call this.
  window.renderDiagrams = async function renderDiagrams(root) {
    const scope = root || document;
    const blocks = scope.querySelectorAll('.mermaid-block[data-source]');
    let i = 0;
    for (const el of blocks) {
      if (el.dataset.rendered === 'true') continue;
      const id = 'mermaid-' + Date.now() + '-' + (i++);
      try {
        const { svg } = await mermaid.render(id, el.dataset.source);
        el.innerHTML = svg;
        el.dataset.rendered = 'true';
        attachExpandButton(el);
      } catch (err) {
        console.error('[diagrams] render failed', err);
      }
    }
  };

  // Auto-render any .mermaid-block[data-source] elements present at load time.
  // (defer scripts run after DOMContentLoaded, so DOM is already ready here.)
  window.renderDiagrams();
})();
