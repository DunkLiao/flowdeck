import { kanbanDB } from '../../core/db/KanbanDB.js';
import { backupService } from '../../core/storage/BackupService.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { normalizeName } from '../../core/utils/sanitize.js';

/**
 * 待辦清單服務 (Checklist Service)
 */
class ChecklistService {
  /**
   * 取得特定卡片下的所有待辦子項目
   * @param {string} cardId - 卡片 ID
   * @returns {Promise<Array>}
   */
  async getChecklistByCard(cardId) {
    if (!cardId) return [];
    const items = await kanbanDB.queryByIndex('checklists', 'cardId', cardId);
    return items.sort((a, b) => a.order - b.order);
  }

  /**
   * 新增待辦項目
   * @param {string} cardId - 卡片 ID
   * @param {string} title - 項目標題
   */
  async createChecklistItem(cardId, title) {
    const safeTitle = normalizeName(title, '待辦內容');
    const items = await this.getChecklistByCard(cardId);
    const maxOrder = items.reduce((max, item) => item.order > max ? item.order : max, -1);

    const newItem = {
      id: crypto.randomUUID(),
      cardId: cardId,
      title: safeTitle,
      checked: false,
      order: maxOrder + 1
    };

    await kanbanDB.put('checklists', newItem);
    await backupService.triggerAutoBackup();

    // 觸發卡片與詳情更新
    const card = await kanbanDB.get('cards', cardId);
    if (!card) return newItem;
    eventBus.emit('card:updated', { columnId: card.columnId, cardId });
    return newItem;
  }

  /**
   * 切換待辦項目的勾選狀態
   * @param {string} id - 待辦項目 ID
   */
  async toggleChecklistItem(id) {
    const item = await kanbanDB.get('checklists', id);
    if (!item) return;

    item.checked = !item.checked;
    await kanbanDB.put('checklists', item);
    await backupService.triggerAutoBackup();

    const card = await kanbanDB.get('cards', item.cardId);
    if (!card) return;
    eventBus.emit('card:updated', { columnId: card.columnId, cardId: card.id });
  }

  /**
   * 修改待辦項目名稱
   * @param {string} id - 項目 ID
   * @param {string} newTitle - 新名稱
   */
  async renameChecklistItem(id, newTitle) {
    const item = await kanbanDB.get('checklists', id);
    if (!item) return;

    item.title = normalizeName(newTitle, '待辦內容');
    await kanbanDB.put('checklists', item);
    await backupService.triggerAutoBackup();

    const card = await kanbanDB.get('cards', item.cardId);
    if (!card) return;
    eventBus.emit('card:updated', { columnId: card.columnId, cardId: card.id });
  }

  /**
   * 刪除待辦項目
   * @param {string} id - 待辦項目 ID
   */
  async deleteChecklistItem(id) {
    const item = await kanbanDB.get('checklists', id);
    if (!item) return;

    const cardId = item.cardId;
    await kanbanDB.delete('checklists', id);

    // 重新編排剩餘項目排序
    const remaining = await this.getChecklistByCard(cardId);
    for (let i = 0; i < remaining.length; i++) {
      remaining[i].order = i;
      await kanbanDB.put('checklists', remaining[i]);
    }

    await backupService.triggerAutoBackup();

    const card = await kanbanDB.get('cards', cardId);
    if (!card) return;
    eventBus.emit('card:updated', { columnId: card.columnId, cardId });
  }

  /**
   * 批次更新待辦排序
   * @param {string} cardId - 卡片 ID
   * @param {Array} itemsList - 最新排列之項目陣列
   */
  async updateChecklistOrders(cardId, itemsList) {
    for (const item of itemsList) {
      await kanbanDB.put('checklists', item);
    }
    await backupService.triggerAutoBackup();

    const card = await kanbanDB.get('cards', cardId);
    if (!card) return;
    eventBus.emit('card:updated', { columnId: card.columnId, cardId });
  }
}

export const checklistService = new ChecklistService();
