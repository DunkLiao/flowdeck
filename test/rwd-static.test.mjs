import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const htmlSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const cssSource = readFileSync(new URL('../src/ui/global.css', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const cardSource = readFileSync(new URL('../src/features/card/card.component.js', import.meta.url), 'utf8');
const columnSource = readFileSync(new URL('../src/features/column/column.component.js', import.meta.url), 'utf8');
const bundleSource = readFileSync(new URL('../src/flowdeck.bundle.js', import.meta.url), 'utf8');

assert.match(htmlSource, /id="btn-mobile-sidebar"/);
assert.match(htmlSource, /id="sidebar-backdrop"/);

assert.match(cssSource, /@media\s*\(max-width:\s*900px\)/);
assert.match(cssSource, /@media\s*\(max-width:\s*640px\)/);
assert.match(cssSource, /\.sidebar\.is-open/);
assert.match(cssSource, /touch-action:\s*pan-x/);
assert.match(cssSource, /flex-direction:\s*column/);
assert.match(cssSource, /touch-action:\s*pan-y/);
assert.match(cssSource, /\.modal-grid[\s\S]*grid-template-columns:\s*1fr/);

assert.match(appSource, /initMobileSidebar/);
assert.match(appSource, /flowdeck:sidebar-close/);

assert.match(cardSource, /setupTouchCardDrag/);
assert.match(cardSource, /pointerdown/);
assert.match(cardSource, /touch-dragging/);

assert.match(columnSource, /setupTouchColumnDrag/);
assert.match(columnSource, /pointerdown/);
assert.match(columnSource, /touch-dragging/);
assert.match(columnSource, /shouldInsertBeforeColumn/);

assert.match(bundleSource, /initMobileSidebar/);
assert.match(bundleSource, /setupTouchCardDrag/);
assert.match(bundleSource, /setupTouchColumnDrag/);
assert.match(bundleSource, /menu:\s*'<line x1="4" y1="6"/);
assert.match(bundleSource, /shouldInsertBeforeColumn/);

console.log('rwd static tests passed');
