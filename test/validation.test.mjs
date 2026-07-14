import assert from 'node:assert/strict';
import { escapeHtml, normalizeColor } from '../src/core/utils/sanitize.js';
import { backupService } from '../src/core/storage/BackupService.js';

assert.equal(
  escapeHtml('<img src=x onerror=alert(1)>&"\''),
  '&lt;img src=x onerror=alert(1)&gt;&amp;&quot;&#39;'
);

assert.equal(normalizeColor('#ABCDEF'), '#ABCDEF');
assert.equal(normalizeColor('javascript:alert(1)'), '#3b82f6');

const normalized = backupService.validateBackupPayload({
  version: 1,
  data: {
    boards: [{ id: 'b1', name: '看板', createdAt: 1, updatedAt: 1 }],
    columns: [{ id: 'c1', boardId: 'b1', name: '待處理', order: 0 }],
    cards: [{ id: 'card1', columnId: 'c1', title: '任務', description: '', priority: '高', dueDate: '', order: 0, createdAt: 1, updatedAt: 1 }],
    tags: [{ id: 't1', name: '標籤', color: 'bad-color' }],
    cardTags: [{ id: 'card1_t1', cardId: 'card1', tagId: 't1' }],
    checklists: [{ id: 'ch1', cardId: 'card1', title: '項目', checked: false, order: 0 }]
  }
});

assert.equal(normalized.tags[0].color, '#3b82f6');

assert.throws(
  () => backupService.validateBackupPayload({ version: 1, data: { boards: [], columns: [], cards: 'bad' } }),
  /卡片資料必須是陣列/
);

assert.throws(
  () => backupService.validateBackupPayload({
    version: 1,
    data: {
      boards: [
        { id: 'same', name: 'A', createdAt: 1, updatedAt: 1 },
        { id: 'same', name: 'B', createdAt: 1, updatedAt: 1 }
      ],
      columns: [],
      cards: []
    }
  }),
  /看板 ID不可重複/
);

console.log('validation tests passed');
