const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const DDD_MD = path.join(__dirname, '../../research/ddd.md');

let content;
test('research/ddd.md exists', () => {
  assert.ok(fs.existsSync(DDD_MD), 'research/ddd.md not found');
  content = fs.readFileSync(DDD_MD, 'utf8');
  assert.ok(content.length > 10000, `ddd.md too short: ${content.length} chars`);
});

test('ddd.md has required top-level heading', () => {
  assert.ok(content.includes('# Domain-Driven Design'), 'Missing h1 heading');
});

test('ddd.md has Table of Contents', () => {
  assert.ok(content.includes('## Table of Contents'), 'Missing Table of Contents');
});

test('ddd.md has all 6 category sections', () => {
  const required = [
    '## Strategic Design',
    '## Tactical Design',
    '## Architecture',
    '## Collaborative Tools',
    '## Misconceptions',
    '## Ecosystem',
  ];
  for (const heading of required) {
    assert.ok(content.includes(heading), `Missing category: ${heading}`);
  }
});

test('ddd.md has all 32 expected items', () => {
  const requiredItems = [
    '### Domain',
    '### Subdomain Types',
    '### Bounded Context',
    '### Context Mapping Patterns',
    '### Ubiquitous Language',
    '### When to Use DDD',
    '### Strategic Distillation Tools',
    '### DDD Starter Modelling Process',
    '### Wardley Mapping and Core Domain Positioning',
    "### Conway's Law and Team Topologies Alignment",
    '### Entity',
    '### Value Object',
    '### Aggregate',
    '### Repository',
    '### Domain Service',
    '### Application Service',
    '### Domain Event',
    '### Factory',
    '### Specification Pattern',
    '### Integration Event',
    '### Saga and Process Manager',
    '### Architecture Patterns',
    '### CQRS',
    '### Event Sourcing',
    '### Supple Design',
    '### Model Exploration Whirlpool',
    '### Domain Storytelling',
    '### Bounded Context Canvas and DDD Crew Tools',
    '### Common Misconceptions',
    '### Domain Event vs Integration Event Distinction',
    '### Data Mesh',
    '### Wardley Mapping Legacy Modernization',
  ];
  for (const item of requiredItems) {
    assert.ok(content.includes(item), `Missing item section: ${item}`);
  }
});

test('ddd.md has core field labels present', () => {
  const requiredFields = [
    '**Definition**',
    '**Primary Citation**',
    '**E-commerce Example**',
    '**Common Mistake**',
    '**Anti-Pattern**',
  ];
  for (const field of requiredFields) {
    assert.ok(content.includes(field), `Missing field label: ${field}`);
  }
});

test('ddd.md has no raw [uncertain] values in output', () => {
  const lines = content.split('\n');
  const badLines = lines.filter(l => l.includes('[uncertain]'));
  assert.equal(badLines.length, 0, `Found [uncertain] in output:\n${badLines.join('\n')}`);
});
