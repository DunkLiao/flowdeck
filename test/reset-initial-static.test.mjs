import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const backupServiceSource = readFileSync(
  new URL('../src/core/storage/BackupService.js', import.meta.url),
  'utf8'
);
const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const htmlSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(backupServiceSource, /resetToInitialState\(\)/);
assert.match(backupServiceSource, /kanbanDB\.clearAll\(\)/);
assert.match(backupServiceSource, /name:\s*'我的工作看板'/);
assert.match(backupServiceSource, /\['待處理', '進行中', '已完成'\]/);
assert.match(backupServiceSource, /KanbanDB_AutoBackup/);

assert.match(appSource, /btn-reset-initial-data/);
assert.match(appSource, /backupService\.seedInitialState\(\)/);
assert.match(appSource, /backupService\.resetToInitialState\(\)/);

assert.match(htmlSource, /id="btn-reset-initial-data"/);
assert.match(htmlSource, />還原初始設定</);

console.log('reset initial static tests passed');
