import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/features/card/card.component.js', import.meta.url), 'utf8');

assert.match(source, /boardService\.getActiveBoardId\(\)/);
assert.match(
  source,
  /import\s+\{\s*boardService\s*\}\s+from\s+['"]\.\.\/board\/board\.service\.js['"];/
);

console.log('card component static tests passed');
