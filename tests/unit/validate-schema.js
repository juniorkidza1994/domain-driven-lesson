// tests/unit/validate-schema.js — DRE-6: JSON content schema validator
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SECTION_TYPES = new Set(['text', 'diagram', 'infographic', 'comparison', 'callout', 'es-board', 'flow']);
const DIAGRAM_TYPES = new Set(['mermaid', 'es-board', 'svg']);
const QUESTION_TYPES = new Set(['mcq', 'true-false']);

// ─── helpers ────────────────────────────────────────────────────────────────

function assertBilingual(obj, fieldPath) {
  assert.ok(obj && typeof obj === 'object', `${fieldPath}: must be an object`);
  assert.equal(typeof obj.en, 'string', `${fieldPath}.en: missing or not string`);
  assert.equal(typeof obj.th, 'string', `${fieldPath}.th: missing or not string`);
  assert.ok(obj.en.length > 0, `${fieldPath}.en: must be non-empty`);
  // th is allowed to be "" (populated in DRE-25)
}

function assertKebab(id, fieldPath) {
  assert.ok(typeof id === 'string' && KEBAB.test(id), `${fieldPath}: "${id}" is not kebab-case`);
}

// ─── lesson ─────────────────────────────────────────────────────────────────

function validateLesson(doc, filename) {
  const stem = path.basename(filename, '.json');
  assert.ok(doc && typeof doc === 'object', 'lesson: root must be object');
  assert.ok(doc.module && typeof doc.module === 'object', 'lesson: module: required object');

  const m = doc.module;

  // module.id
  assert.ok(typeof m.id === 'string' && m.id.length > 0, 'module.id: required non-empty string');
  assertKebab(m.id, 'module.id');

  // module.number
  assert.ok(typeof m.number === 'number' && Number.isInteger(m.number) && m.number >= 1 && m.number <= 7,
    'module.number: required integer 1..7');

  // module.title
  assertBilingual(m.title, 'module.title');

  // module.estimatedMinutes
  assert.ok(typeof m.estimatedMinutes === 'number' && m.estimatedMinutes > 0,
    'module.estimatedMinutes: required positive number');

  // module.sections
  assert.ok(Array.isArray(m.sections), 'module.sections: required array');
  assert.ok(m.sections.length >= 1, 'module.sections: must have at least 1 section');

  const sectionIds = new Set();
  for (let i = 0; i < m.sections.length; i++) {
    const s = m.sections[i];
    const sp = `module.sections[${i}]`;
    assert.ok(s && typeof s === 'object', `${sp}: must be object`);
    assertKebab(s.id, `${sp}.id`);
    assert.ok(!sectionIds.has(s.id), `${sp}.id: "${s.id}" is not unique within module`);
    sectionIds.add(s.id);
    assert.ok(SECTION_TYPES.has(s.type), `${sp}.type: "${s.type}" not in allowed enum`);
    assertBilingual(s.title, `${sp}.title`);
    assertBilingual(s.content, `${sp}.content`);

    // diagram field — required when type is diagram, es-board, or flow
    if (['diagram', 'es-board', 'flow'].includes(s.type)) {
      assert.ok(s.diagram && typeof s.diagram === 'object', `${sp}.diagram: required when type is ${s.type}`);
    }
    if (s.diagram) {
      assert.ok(DIAGRAM_TYPES.has(s.diagram.type), `${sp}.diagram.type: must be mermaid|es-board|svg`);
      assert.ok(typeof s.diagram.source === 'string' && s.diagram.source.length > 0,
        `${sp}.diagram.source: required non-empty string`);
    }

    // tooltipRefs — optional, must be array of kebab-case strings if present
    if (s.tooltipRefs !== undefined) {
      assert.ok(Array.isArray(s.tooltipRefs), `${sp}.tooltipRefs: must be array`);
      s.tooltipRefs.forEach((ref, ri) => {
        assertKebab(ref, `${sp}.tooltipRefs[${ri}]`);
      });
    }
  }
}

// ─── quiz ────────────────────────────────────────────────────────────────────

function validateQuiz(doc, filename) {
  assert.ok(doc && typeof doc === 'object', 'quiz: root must be object');

  // moduleId
  assert.ok(typeof doc.moduleId === 'string' && doc.moduleId.length > 0,
    'moduleId: required non-empty string');
  assertKebab(doc.moduleId, 'moduleId');

  // questions
  assert.ok(Array.isArray(doc.questions), 'questions: required array');
  assert.ok(doc.questions.length >= 1, 'questions: must have at least 1 question');

  const questionIds = new Set();
  for (let i = 0; i < doc.questions.length; i++) {
    const q = doc.questions[i];
    const qp = `questions[${i}]`;
    assert.ok(q && typeof q === 'object', `${qp}: must be object`);

    // id
    assert.ok(typeof q.id === 'string' && q.id.length > 0, `${qp}.id: required`);
    assertKebab(q.id, `${qp}.id`);
    assert.ok(!questionIds.has(q.id), `${qp}.id: "${q.id}" is not unique within file`);
    questionIds.add(q.id);

    // type
    assert.ok(QUESTION_TYPES.has(q.type), `${qp}.type: must be mcq|true-false`);

    // question
    assertBilingual(q.question, `${qp}.question`);

    // options
    assert.ok(Array.isArray(q.options), `${qp}.options: required array`);
    if (q.type === 'true-false') {
      assert.equal(q.options.length, 2, `${qp}.options: true-false must have exactly 2 options`);
      const ids = q.options.map(o => o.id);
      assert.ok(ids.includes('true') && ids.includes('false'),
        `${qp}.options: true-false options must have ids "true" and "false"`);
    } else {
      assert.ok(q.options.length >= 2 && q.options.length <= 6,
        `${qp}.options: mcq must have 2..6 options`);
    }

    const optionIds = new Set();
    for (let oi = 0; oi < q.options.length; oi++) {
      const o = q.options[oi];
      assert.ok(o && typeof o === 'object', `${qp}.options[${oi}]: must be object`);
      assertKebab(o.id, `${qp}.options[${oi}].id`);
      assert.ok(!optionIds.has(o.id), `${qp}.options[${oi}].id: "${o.id}" is not unique`);
      optionIds.add(o.id);
      assertBilingual(o.text, `${qp}.options[${oi}].text`);
    }

    // correctOption
    assert.ok(typeof q.correctOption === 'string' && q.correctOption.length > 0,
      `${qp}.correctOption: required non-empty string`);
    assert.ok(optionIds.has(q.correctOption),
      `${qp}.correctOption: "${q.correctOption}" must match one option id`);

    // explanation
    assertBilingual(q.explanation, `${qp}.explanation`);
  }
}

// ─── tooltips ────────────────────────────────────────────────────────────────

function validateTooltips(doc) {
  assert.ok(doc && typeof doc === 'object', 'tooltips: root must be object');
  assert.ok(Array.isArray(doc.tooltips), 'tooltips: required array');
  assert.ok(doc.tooltips.length >= 1, 'tooltips: must have at least 1 tooltip');

  const tooltipIds = new Set();
  for (let i = 0; i < doc.tooltips.length; i++) {
    const t = doc.tooltips[i];
    const tp = `tooltips[${i}]`;
    assert.ok(t && typeof t === 'object', `${tp}: must be object`);
    assertKebab(t.id, `${tp}.id`);
    assert.ok(!tooltipIds.has(t.id), `${tp}.id: "${t.id}" is not unique`);
    tooltipIds.add(t.id);
    assertBilingual(t.term, `${tp}.term`);
    assertBilingual(t.short, `${tp}.short`);
    assertBilingual(t.full, `${tp}.full`);
  }
  return tooltipIds;
}

// ─── glossary ────────────────────────────────────────────────────────────────

function validateGlossary(doc) {
  assert.ok(doc && typeof doc === 'object', 'glossary: root must be object');
  assert.ok(Array.isArray(doc.categories), 'categories: required array');
  assert.ok(doc.categories.length >= 1, 'categories: must have at least 1 category');

  const allTermIds = new Set();
  const categoryIds = new Set();

  for (let ci = 0; ci < doc.categories.length; ci++) {
    const cat = doc.categories[ci];
    const cp = `categories[${ci}]`;
    assert.ok(cat && typeof cat === 'object', `${cp}: must be object`);
    assertKebab(cat.id, `${cp}.id`);
    assert.ok(!categoryIds.has(cat.id), `${cp}.id: "${cat.id}" is not unique`);
    categoryIds.add(cat.id);
    assertBilingual(cat.name, `${cp}.name`);
    assert.ok(Array.isArray(cat.terms), `${cp}.terms: required array`);
    assert.ok(cat.terms.length >= 1, `${cp}.terms: must have at least 1 term`);

    for (let ti = 0; ti < cat.terms.length; ti++) {
      const term = cat.terms[ti];
      const termP = `${cp}.terms[${ti}]`;
      assert.ok(term && typeof term === 'object', `${termP}: must be object`);
      assertKebab(term.id, `${termP}.id`);
      assert.ok(!allTermIds.has(term.id), `${termP}.id: "${term.id}" is not unique across glossary`);
      allTermIds.add(term.id);
      assertBilingual(term.term, `${termP}.term`);
      assertBilingual(term.definition, `${termP}.definition`);

      if (term.relatedTerms !== undefined) {
        assert.ok(Array.isArray(term.relatedTerms), `${termP}.relatedTerms: must be array`);
        term.relatedTerms.forEach((ref, ri) => {
          assert.ok(typeof ref === 'string', `${termP}.relatedTerms[${ri}]: must be string`);
        });
      }
    }
  }
  return allTermIds;
}

// ─── Unit-level fixtures (happy & sad paths) ────────────────────────────────

test('SCHEMA.md exists and is non-empty', () => {
  const schemaPath = path.join(ROOT, 'content', 'SCHEMA.md');
  assert.ok(fs.existsSync(schemaPath), 'content/SCHEMA.md must exist');
  const stat = fs.statSync(schemaPath);
  assert.ok(stat.size > 0, 'content/SCHEMA.md must be non-empty');
});

// Lesson fixtures
test('valid lesson fixture passes', () => {
  const doc = {
    module: {
      id: 'module-01',
      number: 1,
      title: { en: 'Intro to DDD', th: '' },
      estimatedMinutes: 20,
      sections: [
        {
          id: 'intro',
          type: 'text',
          title: { en: 'Introduction', th: '' },
          content: { en: 'Some content here.', th: '' }
        }
      ]
    }
  };
  assert.doesNotThrow(() => validateLesson(doc, 'module-01.json'));
});

test('lesson missing module.id throws', () => {
  const doc = {
    module: {
      number: 1,
      title: { en: 'Intro', th: '' },
      estimatedMinutes: 20,
      sections: [{ id: 'intro', type: 'text', title: { en: 'T', th: '' }, content: { en: 'C', th: '' } }]
    }
  };
  assert.throws(() => validateLesson(doc, 'module-01.json'), /module\.id/);
});

test('lesson missing module.sections throws', () => {
  const doc = {
    module: { id: 'module-01', number: 1, title: { en: 'T', th: '' }, estimatedMinutes: 15 }
  };
  assert.throws(() => validateLesson(doc, 'module-01.json'), /module\.sections/);
});

test('lesson with invalid section type throws', () => {
  const doc = {
    module: {
      id: 'module-01', number: 1, title: { en: 'T', th: '' }, estimatedMinutes: 15,
      sections: [{ id: 'intro', type: 'video', title: { en: 'T', th: '' }, content: { en: 'C', th: '' } }]
    }
  };
  assert.throws(() => validateLesson(doc, 'module-01.json'), /type/);
});

// Quiz fixtures
test('valid quiz fixture passes', () => {
  const doc = {
    moduleId: 'module-01',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: { en: 'What is DDD?', th: '' },
        options: [
          { id: 'a', text: { en: 'Domain-Driven Design', th: '' } },
          { id: 'b', text: { en: 'Data-Driven Design', th: '' } }
        ],
        correctOption: 'a',
        explanation: { en: 'DDD stands for Domain-Driven Design.', th: '' }
      }
    ]
  };
  assert.doesNotThrow(() => validateQuiz(doc, 'module-01.json'));
});

test('quiz question missing correctOption throws', () => {
  const doc = {
    moduleId: 'module-01',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: { en: 'What?', th: '' },
        options: [
          { id: 'a', text: { en: 'A', th: '' } },
          { id: 'b', text: { en: 'B', th: '' } }
        ],
        explanation: { en: 'Because.', th: '' }
      }
    ]
  };
  assert.throws(() => validateQuiz(doc, 'module-01.json'), /correctOption/);
});

test('quiz missing moduleId throws', () => {
  const doc = { questions: [{ id: 'q1', type: 'mcq', question: { en: 'X', th: '' }, options: [{ id: 'a', text: { en: 'A', th: '' } }, { id: 'b', text: { en: 'B', th: '' } }], correctOption: 'a', explanation: { en: 'E', th: '' } }] };
  assert.throws(() => validateQuiz(doc, 'module-01.json'), /moduleId/);
});

// Tooltip fixtures
test('valid tooltip fixture passes', () => {
  const doc = {
    tooltips: [
      { id: 'bounded-context', term: { en: 'Bounded Context', th: '' }, short: { en: 'A boundary.', th: '' }, full: { en: 'A full explanation.', th: '' } }
    ]
  };
  assert.doesNotThrow(() => validateTooltips(doc));
});

test('tooltip missing id throws', () => {
  const doc = {
    tooltips: [
      { term: { en: 'Bounded Context', th: '' }, short: { en: 'S', th: '' }, full: { en: 'F', th: '' } }
    ]
  };
  assert.throws(() => validateTooltips(doc), /tooltips\[0\]\.id/);
});

test('tooltip non-kebab id throws', () => {
  const doc = {
    tooltips: [
      { id: 'Bounded Context', term: { en: 'Bounded Context', th: '' }, short: { en: 'S', th: '' }, full: { en: 'F', th: '' } }
    ]
  };
  assert.throws(() => validateTooltips(doc), /kebab/);
});

// Glossary fixtures
test('valid glossary fixture passes', () => {
  const doc = {
    categories: [
      {
        id: 'ddd-strategic',
        name: { en: 'DDD Strategic', th: '' },
        terms: [
          { id: 'bounded-context', term: { en: 'Bounded Context', th: '' }, definition: { en: 'A boundary.', th: '' } }
        ]
      }
    ]
  };
  assert.doesNotThrow(() => validateGlossary(doc));
});

test('glossary missing categories throws', () => {
  const doc = {};
  assert.throws(() => validateGlossary(doc), /categories/);
});

test('glossary term missing definition throws', () => {
  const doc = {
    categories: [
      {
        id: 'ddd-strategic',
        name: { en: 'DDD Strategic', th: '' },
        terms: [
          { id: 'bounded-context', term: { en: 'Bounded Context', th: '' } }
        ]
      }
    ]
  };
  assert.throws(() => validateGlossary(doc), /definition/);
});

// ─── Integration: walk real files on disk ───────────────────────────────────

const LESSON_DIRS = [
  path.join(ROOT, 'content', 'lessons', 'en'),
  path.join(ROOT, 'content', 'lessons', 'th')
];
const QUIZ_DIRS = [
  path.join(ROOT, 'content', 'quizzes', 'en'),
  path.join(ROOT, 'content', 'quizzes', 'th')
];

for (const dir of LESSON_DIRS) {
  const label = dir.replace(ROOT, '');
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    : [];
  for (const filename of files) {
    test(`lesson file: ${label}/${filename}`, () => {
      const filepath = path.join(dir, filename);
      let doc;
      try {
        doc = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      } catch (e) {
        assert.fail(`${filepath}: invalid JSON — ${e.message}`);
      }
      validateLesson(doc, filename);
    });
  }
  // Ensure there are exactly 7 lesson files per language dir
  test(`${label}: must have exactly 7 lesson files`, () => {
    assert.equal(files.length, 7, `Expected 7 lesson JSON files in ${dir}, got ${files.length}`);
  });
}

for (const dir of QUIZ_DIRS) {
  const label = dir.replace(ROOT, '');
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    : [];
  for (const filename of files) {
    test(`quiz file: ${label}/${filename}`, () => {
      const filepath = path.join(dir, filename);
      let doc;
      try {
        doc = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      } catch (e) {
        assert.fail(`${filepath}: invalid JSON — ${e.message}`);
      }
      validateQuiz(doc, filename);
    });
  }
  // Ensure there are exactly 7 quiz files per language dir
  test(`${label}: must have exactly 7 quiz files`, () => {
    assert.equal(files.length, 7, `Expected 7 quiz JSON files in ${dir}, got ${files.length}`);
  });
}

test('tooltips/en.json is valid', () => {
  const filepath = path.join(ROOT, 'content', 'tooltips', 'en.json');
  assert.ok(fs.existsSync(filepath), 'content/tooltips/en.json must exist');
  const doc = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  validateTooltips(doc);
});

test('tooltips/th.json is valid', () => {
  const filepath = path.join(ROOT, 'content', 'tooltips', 'th.json');
  assert.ok(fs.existsSync(filepath), 'content/tooltips/th.json must exist');
  const doc = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  validateTooltips(doc);
});

test('tooltips en.json and th.json have same IDs in same order', () => {
  const enDoc = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'tooltips', 'en.json'), 'utf8'));
  const thDoc = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'tooltips', 'th.json'), 'utf8'));
  const enIds = enDoc.tooltips.map(t => t.id);
  const thIds = thDoc.tooltips.map(t => t.id);
  assert.deepEqual(enIds, thIds, 'tooltips en.json and th.json must have same IDs in same order');
});

test('tooltips/en.json has the 3 required tooltips', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'tooltips', 'en.json'), 'utf8'));
  const ids = new Set(doc.tooltips.map(t => t.id));
  for (const required of ['bounded-context', 'aggregate', 'ubiquitous-language']) {
    assert.ok(ids.has(required), `tooltips/en.json must include tooltip id: ${required}`);
  }
});

test('glossary/en.json is valid', () => {
  const filepath = path.join(ROOT, 'content', 'glossary', 'en.json');
  assert.ok(fs.existsSync(filepath), 'content/glossary/en.json must exist');
  const doc = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  validateGlossary(doc);
});

test('glossary/th.json is valid', () => {
  const filepath = path.join(ROOT, 'content', 'glossary', 'th.json');
  assert.ok(fs.existsSync(filepath), 'content/glossary/th.json must exist');
  const doc = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  validateGlossary(doc);
});
