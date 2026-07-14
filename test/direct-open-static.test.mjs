import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const htmlSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bundleSource = readFileSync(new URL('../src/flowdeck.bundle.js', import.meta.url), 'utf8');

assert.doesNotMatch(htmlSource, /type=["']module["']/);
assert.doesNotMatch(htmlSource, /https?:\/\//);
assert.doesNotMatch(htmlSource, /googleapis|gstatic|unpkg|cdn/i);
assert.doesNotMatch(htmlSource, /localhost:8000|python -m http\.server/i);
assert.match(htmlSource, /<script\s+src=["']\.\/src\/flowdeck\.bundle\.js["']\s*><\/script>/);
assert.doesNotMatch(bundleSource, /^import\s/m);
assert.doesNotMatch(bundleSource, /^export\s/m);
assert.match(bundleSource, /window\.lucide\s*=\s*\{\s*createIcons:\s*renderIcons\s*\}/);

console.log('direct open static tests passed');
