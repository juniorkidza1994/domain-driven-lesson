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
      } catch (err) {
        console.error('[diagrams] render failed', err);
      }
    }
  };

  // Auto-render any .mermaid-block[data-source] elements present at load time.
  // (defer scripts run after DOMContentLoaded, so DOM is already ready here.)
  window.renderDiagrams();
})();
