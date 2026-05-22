// js/content-loader.js — DRE-14: JSON content renderer
(function () {
  'use strict';

  // ── helpers ──────────────────────────────────────────────────────────────
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
  function el(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  }

  function renderTipMarkup(html) {
    return html.replace(
      /\{\{tip:([a-z0-9-]+)\|([^}]+)\}\}/g,
      (_, id, label) =>
        `<span class="tooltip-trigger" data-tooltip="${id}" tabindex="0" role="button">${label}</span>`
    );
  }

  function renderMd(text) {
    if (!text) return '';
    let html = (window.marked && typeof window.marked.parse === 'function')
      ? window.marked.parse(text)
      : esc(text).replace(/\n/g, '<br>');
    if (window.DOMPurify) html = window.DOMPurify.sanitize(html);
    return renderTipMarkup(html);
  }

  function renderMdInline(text) {
    if (!text) return '';
    let html = (window.marked && typeof window.marked.parseInline === 'function')
      ? window.marked.parseInline(text)
      : esc(text);
    if (window.DOMPurify) html = window.DOMPurify.sanitize(html);
    return renderTipMarkup(html);
  }

  // ── section renderers ────────────────────────────────────────────────────
  function renderText(s, lang) {
    return `<section class="content-section" data-section-id="${esc(s.id)}">
      ${s.title ? `<h2>${esc(pick(s.title, lang))}</h2>` : ''}
      <div class="prose">${renderMd(pick(s.content, lang))}</div>
    </section>`;
  }

  function renderCallout(s, lang) {
    const variant = s.variant === 'warning' ? ' callout-warning' : '';
    return `<section class="content-section" data-section-id="${esc(s.id)}">
      <div class="callout${variant}">
        ${s.title ? `<strong>${esc(pick(s.title, lang))}</strong>` : ''}
        <div class="prose">${renderMd(pick(s.content, lang))}</div>
      </div>
    </section>`;
  }

  function renderDiagram(s, lang) {
    const src = (s.diagram && typeof s.diagram === 'object' ? s.diagram.source : s.diagram) || pick(s.content, lang) || '';
    const prose = s.diagram ? pick(s.content, lang) : '';
    const node = el(`<section class="content-section" data-section-id="${esc(s.id)}">
      ${s.title ? `<h2>${esc(pick(s.title, lang))}</h2>` : ''}
      ${prose ? `<div class="prose">${renderMd(prose)}</div>` : ''}
      <div class="mermaid-block"></div>
    </section>`);
    node.querySelector('.mermaid-block').setAttribute('data-source', src);
    return node.outerHTML;
  }

  function renderFlow(s, lang) {
    const prose = pick(s.content, lang);
    const items = (s.steps || []).map((step, i) => `
      <li class="step-flow-item">
        <span class="step-flow-item__num">${i + 1}</span>
        <div class="step-flow-item__body">
          <div class="step-flow-item__label">${renderTipMarkup(esc(pick(step.label, lang)))}</div>
          <div>${renderTipMarkup(esc(pick(step.body, lang)))}</div>
        </div>
      </li>`).join('');
    const diagramSrc = s.diagram
      ? (typeof s.diagram === 'object' ? s.diagram.source : s.diagram)
      : null;
    const node = el(`<section class="content-section" data-section-id="${esc(s.id)}">
      ${s.title ? `<h2>${esc(pick(s.title, lang))}</h2>` : ''}
      ${prose ? `<div class="prose">${renderMd(prose)}</div>` : ''}
      ${items ? `<ol class="step-flow">${items}</ol>` : ''}
      ${diagramSrc ? `<div class="mermaid-block"></div>` : ''}
    </section>`);
    if (diagramSrc) {
      node.querySelector('.mermaid-block').setAttribute('data-source', diagramSrc);
    }
    return node.outerHTML;
  }

  function renderComparison(s, lang) {
    const col = (c) => `
      <div class="comparison-col">
        <h3>${esc(pick(c.heading, lang))}</h3>
        <ul>${(c.items || []).map(it => `<li>${renderMdInline(pick(it, lang))}</li>`).join('')}</ul>
      </div>`;
    const cols = Array.isArray(s.columns) && s.columns.length
      ? s.columns.map(col).join('')
      : col(s.left || {}) + col(s.right || {});
    return `<section class="content-section" data-section-id="${esc(s.id)}">
      ${s.title ? `<h2>${esc(pick(s.title, lang))}</h2>` : ''}
      <div class="comparison">${cols}</div>
    </section>`;
  }

  function renderInfographic(s, lang) {
    const items = (s.items || []).map(it => `
      <div class="infographic-item">
        <div class="infographic-icon">${esc(it.icon || '•')}</div>
        <div class="infographic-label">${esc(pick(it.label, lang))}</div>
        <div class="infographic-body">${renderMdInline(pick(it.body, lang))}</div>
      </div>`).join('');
    return `<section class="content-section" data-section-id="${esc(s.id)}">
      ${s.title ? `<h2>${esc(pick(s.title, lang))}</h2>` : ''}
      <div class="infographic">${items}</div>
    </section>`;
  }

  function renderEsBoard(s, lang) {
    // Legend is fixed (one entry per sticky kind).
    const LEGEND = [
      { kind: 'event',     en: 'Event',           th: 'เหตุการณ์' },
      { kind: 'command',   en: 'Command',         th: 'คำสั่ง' },
      { kind: 'actor',     en: 'Actor',           th: 'ผู้กระทำ' },
      { kind: 'policy',    en: 'Policy',          th: 'นโยบาย' },
      { kind: 'hotspot',   en: 'Hotspot',         th: 'จุดร้อน' },
      { kind: 'readmodel', en: 'Read Model',      th: 'โมเดลอ่าน' },
      { kind: 'external',  en: 'External System', th: 'ระบบภายนอก' },
      { kind: 'aggregate', en: 'Aggregate',       th: 'แอกกรีเกต' }
    ];

    function noteHtml(kind, text) {
      return `<span class="sticky-note sticky-${esc(kind || 'event')}">${esc(text)}</span>`;
    }

    // Normalise: accept either `s.lanes[].items[]` (new) or flat `s.notes[]` (legacy).
    let lanesHtml;
    if (Array.isArray(s.lanes) && s.lanes.length) {
      lanesHtml = s.lanes.map(lane => {
        const items = (lane.items || []).map(it =>
          noteHtml(it.type, pick(it.text, lang))
        ).join('');
        return `<div class="es-board-lane">
        <div class="es-board-lane__label">${esc(pick(lane.label, lang))}</div>
        <div class="es-board-lane__items">${items}</div>
      </div>`;
      }).join('');
    } else {
      // Legacy flat format (kept for backward compat with existing test fixture).
      const items = (s.notes || []).map(n =>
        noteHtml(n.kind, pick(n.label, lang))
      ).join('');
      lanesHtml = `<div class="es-board-lane">
      <div class="es-board-lane__items">${items}</div>
    </div>`;
    }

    const legendHtml = LEGEND.map(l =>
      `<li><span class="sticky-swatch sticky-${l.kind}">&nbsp;</span> ${esc(lang === 'th' ? l.th : l.en)}</li>`
    ).join('');

    return `<section class="content-section" data-section-id="${esc(s.id)}">
      ${s.title ? `<h2>${esc(pick(s.title, lang))}</h2>` : ''}
      <div class="es-board-container">
        <div class="es-board">${lanesHtml}</div>
      </div>
      <ul class="es-board-legend">${legendHtml}</ul>
    </section>`;
  }

  const RENDERERS = {
    text: renderText,
    callout: renderCallout,
    diagram: renderDiagram,
    flow: renderFlow,
    comparison: renderComparison,
    infographic: renderInfographic,
    'es-board': renderEsBoard
  };

  function renderSections(sections, lang) {
    return sections.map(s => {
      const fn = RENDERERS[s.type];
      if (!fn) {
        console.warn('[content-loader] unknown section type:', s.type);
        return `<section class="content-section content-section--unknown" data-section-id="${esc(s.id)}">
          <em>Unknown section type: ${esc(s.type)}</em></section>`;
      }
      return fn(s, lang);
    }).join('');
  }

  // ── loading / error states ───────────────────────────────────────────────
  function renderLoading(container) {
    container.innerHTML = '<div class="content-loading" role="status">Loading…</div>';
  }

  function renderError(container, msg) {
    container.innerHTML = `<div class="content-error" role="alert">
      <strong>Content unavailable</strong><br/>${esc(msg || '')}
    </div>`;
  }

  // ── main loader ──────────────────────────────────────────────────────────
  let activeRequestId = 0;

  async function loadModule(moduleId, lang, pathPrefix) {
    if (!moduleId || !/^module-0[1-7]$/.test(moduleId)) return;
    lang = (lang === 'th') ? 'th' : 'en';
    const container = document.getElementById('sections-container');
    if (!container) return;
    const myReq = ++activeRequestId;
    renderLoading(container);

    const url = `${pathPrefix}content/lessons/${lang}/${moduleId}.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (myReq !== activeRequestId) return;
      const sections = (data && data.module && data.module.sections) || [];
      container.innerHTML = renderSections(sections, lang);
      if (typeof window.renderDiagrams === 'function') {
        await window.renderDiagrams(container);
      }
      if (typeof window.initTooltips === 'function') {
        window.initTooltips();
      }
    } catch (err) {
      if (myReq !== activeRequestId) return;
      console.warn('[content-loader] load failed', url, err);
      renderError(container, err && err.message);
    }
  }

  // ── Alpine wiring ────────────────────────────────────────────────────────
  function wireAlpine() {
    const store = Alpine.store('app');
    if (!store || !store.currentModuleId) return;
    Alpine.effect(function () {
      const lang = store.lang;
      loadModule(store.currentModuleId, lang, store.pathPrefix || '');
    });
  }

  // Alpine CDN and content-loader are both deferred, so alpine:initialized
  // may have already fired before this script runs. Check both cases.
  if (typeof Alpine !== 'undefined' && Alpine.store) {
    // Alpine already initialized — wire up immediately
    wireAlpine();
  } else {
    document.addEventListener('alpine:initialized', wireAlpine);
  }
})();
