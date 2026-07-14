import { kanbanDB } from '../db/KanbanDB.js';
import { Toast } from '../../ui/toast.js';
import { normalizeColor, normalizeName } from '../utils/sanitize.js';

/**
 * 備份與還原服務 (Backup & Restore Service)
 */
class BackupService {
  constructor() {
    this.activeBoardKey = 'flowdeck:active-board-id';
  }

  createInitialStateData() {
    const now = Date.now();
    const board = {
      id: crypto.randomUUID(),
      name: '我的工作看板',
      createdAt: now,
      updatedAt: now
    };

    const columns = ['待處理', '進行中', '已完成'].map((name, index) => ({
      id: crypto.randomUUID(),
      boardId: board.id,
      name,
      order: index
    }));

    return {
      boards: [board],
      columns,
      cards: [],
      tags: [],
      cardTags: [],
      checklists: []
    };
  }

  async writeInitialStateData() {
    const initialData = this.createInitialStateData();

    for (const item of initialData.boards) await kanbanDB.put('boards', item);
    for (const item of initialData.columns) await kanbanDB.put('columns', item);

    localStorage.setItem(this.activeBoardKey, initialData.boards[0].id);
    this.triggerAutoBackupDirectly(initialData);

    return initialData;
  }

  async seedInitialState() {
    return await this.writeInitialStateData();
  }

  async resetToInitialState() {
    try {
      await kanbanDB.clearAll();
      await this.writeInitialStateData();
      Toast.success('已還原初始設定。');
      return true;
    } catch (err) {
      console.error('[BackupService] 還原初始設定失敗:', err);
      Toast.error('還原初始設定失敗，請檢查主控台說明。');
      return false;
    }
  }

  validateBackupPayload(importObj) {
    if (!importObj || importObj.version !== 1 || !importObj.data) {
      throw new Error('不合法的備份檔案版本或結構。');
    }

    const data = importObj.data;
    const arrayFields = ['boards', 'columns', 'cards', 'tags', 'cardTags', 'checklists'];
    for (const field of arrayFields) {
      if (data[field] !== undefined && !Array.isArray(data[field])) {
        const labelMap = {
          boards: '看板資料',
          columns: '欄位資料',
          cards: '卡片資料',
          tags: '標籤資料',
          cardTags: '卡片標籤關聯資料',
          checklists: '待辦清單資料'
        };
        throw new Error(`${labelMap[field]}必須是陣列`);
      }
    }

    if (!Array.isArray(data.boards) || !Array.isArray(data.columns) || !Array.isArray(data.cards)) {
      throw new Error('必要的看板、欄位或卡片資料缺失。');
    }

    const boards = data.boards.map((board) => ({
      id: this.requireId(board?.id, '看板 ID'),
      name: normalizeName(board?.name, '看板名稱'),
      createdAt: this.normalizeTimestamp(board?.createdAt),
      updatedAt: this.normalizeTimestamp(board?.updatedAt)
    }));
    this.ensureUniqueIds(boards, '看板 ID');

    const boardIds = new Set(boards.map((board) => board.id));
    const columns = data.columns.map((column, index) => {
      const boardId = this.requireId(column?.boardId, '欄位所屬看板 ID');
      if (!boardIds.has(boardId)) throw new Error('欄位資料包含不存在的看板關聯。');
      return {
        id: this.requireId(column?.id, '欄位 ID'),
        boardId,
        name: normalizeName(column?.name, '欄位名稱'),
        order: this.normalizeOrder(column?.order, index)
      };
    });
    this.ensureUniqueIds(columns, '欄位 ID');

    const columnIds = new Set(columns.map((column) => column.id));
    const allowedPriorities = new Set(['高', '中', '低', '無']);
    const cards = data.cards.map((card, index) => {
      const columnId = this.requireId(card?.columnId, '卡片所屬欄位 ID');
      if (!columnIds.has(columnId)) throw new Error('卡片資料包含不存在的欄位關聯。');
      const priority = allowedPriorities.has(card?.priority) ? card.priority : '無';
      return {
        id: this.requireId(card?.id, '卡片 ID'),
        columnId,
        title: normalizeName(card?.title, '卡片標題'),
        description: String(card?.description ?? ''),
        priority,
        dueDate: this.normalizeDueDate(card?.dueDate),
        order: this.normalizeOrder(card?.order, index),
        createdAt: this.normalizeTimestamp(card?.createdAt),
        updatedAt: this.normalizeTimestamp(card?.updatedAt)
      };
    });
    this.ensureUniqueIds(cards, '卡片 ID');

    const cardIds = new Set(cards.map((card) => card.id));
    const tags = (data.tags || []).map((tag) => ({
      id: this.requireId(tag?.id, '標籤 ID'),
      name: normalizeName(tag?.name, '標籤名稱'),
      color: normalizeColor(tag?.color)
    }));
    this.ensureUniqueIds(tags, '標籤 ID');

    const tagIds = new Set(tags.map((tag) => tag.id));
    const cardTags = (data.cardTags || []).map((relation) => {
      const cardId = this.requireId(relation?.cardId, '卡片標籤的卡片 ID');
      const tagId = this.requireId(relation?.tagId, '卡片標籤的標籤 ID');
      if (!cardIds.has(cardId) || !tagIds.has(tagId)) {
        throw new Error('卡片標籤關聯包含不存在的卡片或標籤。');
      }
      return {
        id: relation?.id ? String(relation.id) : `${cardId}_${tagId}`,
        cardId,
        tagId
      };
    });
    this.ensureUniqueIds(cardTags, '卡片標籤關聯 ID');

    const checklists = (data.checklists || []).map((item, index) => {
      const cardId = this.requireId(item?.cardId, '待辦項目所屬卡片 ID');
      if (!cardIds.has(cardId)) throw new Error('待辦清單包含不存在的卡片關聯。');
      return {
        id: this.requireId(item?.id, '待辦項目 ID'),
        cardId,
        title: normalizeName(item?.title, '待辦內容'),
        checked: Boolean(item?.checked),
        order: this.normalizeOrder(item?.order, index)
      };
    });
    this.ensureUniqueIds(checklists, '待辦項目 ID');

    return { boards, columns, cards, tags, cardTags, checklists };
  }

  ensureUniqueIds(items, fieldName) {
    const ids = new Set();
    for (const item of items) {
      if (ids.has(item.id)) {
        throw new Error(`${fieldName}不可重複`);
      }
      ids.add(item.id);
    }
  }

  requireId(value, fieldName) {
    const id = String(value ?? '').trim();
    if (!id) throw new Error(`${fieldName}不可為空白`);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) {
      throw new Error(`${fieldName}只能包含英文字母、數字、底線或連字號`);
    }
    return id;
  }

  normalizeTimestamp(value) {
    return Number.isFinite(Number(value)) ? Number(value) : Date.now();
  }

  normalizeOrder(value, fallback) {
    return Number.isFinite(Number(value)) ? Number(value) : fallback;
  }

  normalizeDueDate(value) {
    const text = String(value ?? '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : '';
  }

  /**
   * 匯出資料庫內容為 JSON 檔案
   */
  async exportData() {
    try {
      // 1. 讀取所有 Store 的資料
      const boards = await kanbanDB.getAll('boards');
      const columns = await kanbanDB.getAll('columns');
      const cards = await kanbanDB.getAll('cards');
      const tags = await kanbanDB.getAll('tags');
      const cardTags = await kanbanDB.getAll('cardTags');
      const checklists = await kanbanDB.getAll('checklists');

      // 2. 組裝 Schema
      const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
          boards,
          columns,
          cards,
          tags,
          cardTags,
          checklists
        }
      };

      // 3. 建立下載連結
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const dateStr = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
      const exportFileDefaultName = `kanban_backup_${dateStr}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      Toast.success('資料備份匯出成功！');
    } catch (err) {
      console.error('[BackupService] 匯出失敗:', err);
      Toast.error('資料匯出失敗，請檢查主控台說明。');
    }
  }

  /**
   * 從 JSON 檔案還原資料
   * @param {File} file - 上傳的 JSON 檔案物件
   * @returns {Promise<boolean>} 是否成功還原
   */
  importData(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const importObj = JSON.parse(event.target.result);
          
          const { boards, columns, cards, tags, cardTags, checklists } = this.validateBackupPayload(importObj);

          // 2. 清空現有資料庫
          await kanbanDB.clearAll();

          // 3. 批次寫入新資料
          for (const item of boards) await kanbanDB.put('boards', item);
          for (const item of columns) await kanbanDB.put('columns', item);
          for (const item of cards) await kanbanDB.put('cards', item);
          if (Array.isArray(tags)) {
            for (const item of tags) await kanbanDB.put('tags', item);
          }
          if (Array.isArray(cardTags)) {
            for (const item of cardTags) await kanbanDB.put('cardTags', item);
          }
          if (Array.isArray(checklists)) {
            for (const item of checklists) await kanbanDB.put('checklists', item);
          }

          // 4. 重置 auto backup 避免混淆
          this.triggerAutoBackupDirectly({ boards, columns, cards, tags, cardTags, checklists });

          Toast.success('資料匯入還原成功！正在重新載入頁面...');
          resolve(true);
        } catch (err) {
          console.error('[BackupService] 匯入解析失敗:', err);
          Toast.error(`匯入失敗：${err.message || '檔案格式不符合看板備份 Schema'}`);
          resolve(false);
        }
      };

      reader.onerror = () => {
        Toast.error('讀取備份檔案失敗。');
        resolve(false);
      };

      reader.readAsText(file);
    });
  }

  /**
   * 觸發自動備份至 LocalStorage (由各 Service 呼叫)
   */
  async triggerAutoBackup() {
    try {
      const boards = await kanbanDB.getAll('boards');
      const columns = await kanbanDB.getAll('columns');
      const cards = await kanbanDB.getAll('cards');
      const tags = await kanbanDB.getAll('tags');
      const cardTags = await kanbanDB.getAll('cardTags');
      const checklists = await kanbanDB.getAll('checklists');

      const backupObj = {
        boards,
        columns,
        cards,
        tags,
        cardTags,
        checklists
      };
      
      this.triggerAutoBackupDirectly(backupObj);
    } catch (err) {
      console.warn('[BackupService] 自動備份出錯:', err);
    }
  }

  /**
   * 直接寫入 LocalStorage
   * @private
   */
  triggerAutoBackupDirectly(dataObj) {
    try {
      localStorage.setItem('KanbanDB_AutoBackup', JSON.stringify({
        version: 1,
        savedAt: new Date().getTime(),
        data: dataObj
      }));
    } catch (err) {
      console.warn('[BackupService] 寫入 LocalStorage 自動備份失敗:', err);
    }
  }

  /**
   * 檢查是否有 LocalStorage 的自動備份
   * @returns {boolean}
   */
  hasAutoBackup() {
    try {
      return localStorage.getItem('KanbanDB_AutoBackup') !== null;
    } catch {
      return false;
    }
  }

  /**
   * 從自動備份還原
   */
  async restoreFromAutoBackup() {
    try {
      const backupStr = localStorage.getItem('KanbanDB_AutoBackup');
      if (!backupStr) return false;

      const backupObj = JSON.parse(backupStr);
      if (!backupObj || !backupObj.data) return false;

      const { boards, columns, cards, tags, cardTags, checklists } = this.validateBackupPayload({
        version: 1,
        data: backupObj.data
      });

      await kanbanDB.clearAll();

      for (const item of boards) await kanbanDB.put('boards', item);
      for (const item of columns) await kanbanDB.put('columns', item);
      for (const item of cards) await kanbanDB.put('cards', item);
      if (Array.isArray(tags)) {
        for (const item of tags) await kanbanDB.put('tags', item);
      }
      if (Array.isArray(cardTags)) {
        for (const item of cardTags) await kanbanDB.put('cardTags', item);
      }
      if (Array.isArray(checklists)) {
        for (const item of checklists) await kanbanDB.put('checklists', item);
      }

      Toast.success('已成功從自動備份中還原資料。');
      return true;
    } catch (err) {
      console.error('[BackupService] 從自動備份還原失敗:', err);
      return false;
    }
  }
}

export const backupService = new BackupService();
