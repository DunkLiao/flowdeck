import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/features/card/card.component.js', import.meta.url), 'utf8');
const bundleSource = readFileSync(new URL('../src/flowdeck.bundle.js', import.meta.url), 'utf8');

assert.match(source, /commitDueDateChange\(/);
assert.match(source, /openDueDatePicker\(/);
assert.match(source, /modalInputDueDate\.addEventListener\('input'/);
assert.match(source, /modalInputDueDate\.addEventListener\('change'/);
assert.match(source, /modalInputDueDate\.addEventListener\('blur'/);
assert.match(source, /showPicker\(\)/);

assert.match(bundleSource, /commitDueDateChange\(/);
assert.match(bundleSource, /openDueDatePicker\(/);
assert.match(bundleSource, /modalInputDueDate\.addEventListener\('input'/);
assert.match(bundleSource, /showPicker\(\)/);

console.log('due date static tests passed');
