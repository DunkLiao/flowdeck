import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/features/card/card.component.js', import.meta.url), 'utf8');
const bundleSource = readFileSync(new URL('../src/flowdeck.bundle.js', import.meta.url), 'utf8');

assert.match(source, /columnRenderVersions\s*=\s*new Map\(\)/);
assert.match(source, /pendingDueDateCommits\s*=\s*new Map\(\)/);
assert.match(source, /renderVersion/);
assert.match(source, /replaceChildren\(/);
assert.match(source, /pendingDueDateCommits\.get\(cardId\)\s*===\s*val/);

assert.match(bundleSource, /columnRenderVersions\s*=\s*new Map\(\)/);
assert.match(bundleSource, /pendingDueDateCommits\s*=\s*new Map\(\)/);
assert.match(bundleSource, /renderVersion/);
assert.match(bundleSource, /replaceChildren\(/);

console.log('card render race static tests passed');
