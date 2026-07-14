import { kanbanDB } from '../../core/db/KanbanDB.js';
import { backupService } from '../../core/storage/BackupService.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { normalizeName } from '../../core/utils/sanitize.js';

/**
 * 欄位服務 (Column Service)
 */
class ColumnService {
  /**
   * 取得特定看板下的所有欄位
   * @param {string} boardId - 看板 ID
   * @returns {Promise<Array>}
   */
  async getColumnsByBoard(boardId) {
    if (!boardId) return [];
    const columns = await kanbanDB.queryByIndex('columns', 'boardId', boardId);
    return columns.sort((a, b) => a.order - b.order);
  }

  /**
   * 取得單一欄位
   * @param {string} id - 欄位 ID
   */
  async getColumn(id) {
    return await kanbanDB.get('columns', id);
  }

  /**
   * 建立一個新欄位
   * @param {string} boardId - 看板 ID
   * @param {string} name - 欄位名稱
   */
  async createColumn(boardId, name) {
    const safeName = normalizeName(name, '欄位名稱');
    const columns = await this.getColumnsByBoard(boardId);
    const maxOrder = columns.reduce((max, col) => col.order > max ? col.order : max, -1);

    const column = {
      id: crypto.randomUUID(),
      boardId: boardId,
      name: safeName,
      order: maxOrder + 1
    };

    await kanbanDB.put('columns', column);
    await backupService.triggerAutoBackup();

    eventBus.emit('column:updated');
    return column;
  }

  /**
   * 重新命名欄位
   * @param {string} id - 欄位 ID
   * @param {string} newName - 新名稱
   */
  async renameColumn(id, newName) {
    const col = await this.getColumn(id);
    if (!col) return;

    col.name = normalizeName(newName, '欄位名稱');
    await kanbanDB.put('columns', col);
    await backupService.triggerAutoBackup();

    eventBus.emit('column:updated');
  }

  /**
   * 刪除欄位及其底下所有卡片
   * @param {string} id - 欄位 ID
   */
  async deleteColumn(id) {
    // 1. 取得該欄位的所有卡片並進行刪除
    const cards = await kanbanDB.queryByIndex('cards', 'columnId', id);
    for (const card of cards) {
      // 刪除 checklists
      const checklists = await kanbanDB.queryByIndex('checklists', 'cardId', card.id);
      for (const ch of checklists) {
        await kanbanDB.delete('checklists', ch.id);
      }
      // 刪除標籤關聯
      const cardTags = await kanbanDB.queryByIndex('cardTags', 'cardId', card.id);
      for (const ct of cardTags) {
        await kanbanDB.delete('cardTags', ct.id);
      }
      // 刪除卡片
      await kanbanDB.delete('cards', card.id);
    }

    // 2. 刪除欄位本身
    await kanbanDB.delete('columns', id);
    await backupService.triggerAutoBackup();

    eventBus.emit('column:updated');
    eventBus.emit('card:updated');
  }

  /**
   * 批次更新多個欄位排序
   * @param {Array} columnsList - 欄位清單
   */
  async updateColumnOrders(columnsList) {
    for (const col of columnsList) {
      await kanbanDB.put('columns', col);
    }
    await backupService.triggerAutoBackup();
    eventBus.emit('column:updated');
  }
}

export const columnService = new ColumnService();
