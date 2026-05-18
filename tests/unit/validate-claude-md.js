// tests/unit/validate-claude-md.js — DRE-28: CLAUDE.md completeness validator
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../');
const filePath = path.join(ROOT, 'CLAUDE.md');

let content = '';

test('CLAUDE.md exists', () => {
  assert.ok(fs.existsSync(filePath), 'CLAUDE.md not found at project root');
  content = fs.readFileSync(filePath, 'utf8');
});

test('word count > 500', () => {
  const words = content.trim().split(/\s+/).length;
  assert.ok(words > 500, `word count is ${words}, expected > 500`);
});

test('contains Project Overview heading', () => {
  assert.ok(
    content.includes('## Project Overview') || content.includes('# DDD Learning Website'),
    'missing ## Project Overview or # DDD Learning Website heading'
  );
});

test('contains ## Tech Stack', () => {
  assert.ok(content.includes('## Tech Stack'), 'missing ## Tech Stack heading');
});

test('contains ## Testing Strategy', () => {
  assert.ok(content.includes('## Testing Strategy'), 'missing ## Testing Strategy heading');
});

test('contains Behavioral Rules (R1–R5)', () => {
  const hasBehavioral = content.includes('## Behavioral Rules') || content.includes('### R1');
  assert.ok(hasBehavioral, 'missing ## Behavioral Rules or ### R1 heading');
});

test('contains all 5 rule identifiers R1–R5', () => {
  for (const r of ['R1', 'R2', 'R3', 'R4', 'R5']) {
    assert.ok(content.includes(r), `missing rule identifier ${r}`);
  }
});

test('contains Do Not Rules / Hard Constraints', () => {
  const hasDoNot = content.includes('## Do Not Rules') || content.includes('## Hard Constraints');
  assert.ok(hasDoNot, 'missing ## Do Not Rules or ## Hard Constraints heading');
});

test('contains ## Development Commands', () => {
  assert.ok(content.includes('## Development Commands'), 'missing ## Development Commands heading');
});

test('contains ## Alpine.js Rules', () => {
  assert.ok(content.includes('## Alpine.js Rules'), 'missing ## Alpine.js Rules heading');
});

test('contains ## Mermaid.js Rules', () => {
  assert.ok(content.includes('## Mermaid.js Rules'), 'missing ## Mermaid.js Rules heading');
});

test('contains ## ES Board Rules', () => {
  assert.ok(content.includes('## ES Board Rules'), 'missing ## ES Board Rules heading');
});

test('contains ## Quiz Rules', () => {
  assert.ok(content.includes('## Quiz Rules'), 'missing ## Quiz Rules heading');
});

test('contains ## Tooltip Rules', () => {
  assert.ok(content.includes('## Tooltip Rules'), 'missing ## Tooltip Rules heading');
});

test('contains ## Deployment', () => {
  assert.ok(content.includes('## Deployment'), 'missing ## Deployment heading');
});

test('contains node --test (unit test command)', () => {
  assert.ok(content.includes('node --test'), 'missing node --test in content');
});

test('contains npx playwright test (e2e command)', () => {
  assert.ok(content.includes('npx playwright test'), 'missing npx playwright test in content');
});

test('contains python3 -m http.server (dev command)', () => {
  assert.ok(content.includes('python3 -m http.server'), 'missing python3 -m http.server in content');
});

test('contains DO NOT hard constraints', () => {
  assert.ok(content.includes('DO NOT'), 'missing DO NOT hard constraints section');
});
