// tests/unit/validate-claude-md.js — DRE-28: CLAUDE.md completeness validator
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(path.resolve(__dirname, '../../'), 'CLAUDE.md');

let content = '';

test.before(() => {
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    throw new Error('CLAUDE.md not found at project root');
  }
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

test('contains Behavioral Rules (R1–R5)', () => {
  assert.ok(
    content.includes('## Behavioral Rules') || content.includes('### R1'),
    'missing ## Behavioral Rules or ### R1 heading'
  );
});

test('contains all 5 rule identifiers R1–R5', () => {
  for (const r of ['R1', 'R2', 'R3', 'R4', 'R5']) {
    assert.ok(content.includes(r), `missing rule identifier ${r}`);
  }
});

test('contains Do Not Rules / Hard Constraints', () => {
  assert.ok(
    content.includes('## Do Not Rules') || content.includes('## Hard Constraints'),
    'missing ## Do Not Rules or ## Hard Constraints heading'
  );
});

const REQUIRED_STRINGS = [
  '## Tech Stack',
  '## Testing Strategy',
  '## Development Commands',
  '## Alpine.js Rules',
  '## Mermaid.js Rules',
  '## ES Board Rules',
  '## Quiz Rules',
  '## Tooltip Rules',
  '## Deployment',
  'node --test',
  'npx playwright test',
  'python3 -m http.server',
  'DO NOT',
];

for (const str of REQUIRED_STRINGS) {
  test(`contains "${str}"`, () => {
    assert.ok(content.includes(str), `missing required string: ${str}`);
  });
}
