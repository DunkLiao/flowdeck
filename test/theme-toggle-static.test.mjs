import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const htmlSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const cssSource = readFileSync(new URL('../src/ui/global.css', import.meta.url), 'utf8');

assert.match(htmlSource, /id="btn-theme-toggle"/);
assert.match(htmlSource, />淺色模式</);

assert.match(appSource, /flowdeck:theme/);
assert.match(appSource, /document\.documentElement\.dataset\.theme/);
assert.match(appSource, /btn-theme-toggle/);

assert.match(cssSource, /\[data-theme="light"\]/);
assert.match(cssSource, /--bg-app:\s*hsl\(210,\s*40%,\s*96%\)/);
assert.match(cssSource, /\.theme-toggle-icon/);

console.log('theme toggle static tests passed');
