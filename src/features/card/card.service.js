import { kanbanDB } from '../../core/db/KanbanDB.js';
import { backupService } from '../../core/storage/BackupService.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { normalizeName } from '../../core/utils/sanitize.js';

/**
 * 卡片服務 (Card Service)
 */
class CardService {
  normalizePriority(priority) {
    return ['高', '中', '低', '無'].includes(priority) ? priority : '無';
  }

  normalizeDueDate(dueDate) {
    const value = String(dueDate ?? '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';
  }

  /**
   * 取得特定欄位下的所有卡片
   * @param {string} columnId - 欄位 ID
   * @returns {Promise<Array>}
   */
  async getCardsByColumn(columnId) {
    if (!columnId) return [];
    const cards = await kanbanDB.queryByIndex('cards', 'columnId', columnId);
    return cards.sort((a, b) => a.order - b.order);
  }

  /**
   * 取得單一卡片
   * @param {string} id - 卡片 ID
   */
  async getCard(id) {
    return await kanbanDB.get('cards', id);
  }

  /**
   * 建立一張新卡片
   * @param {string} columnId - 欄位 ID
   * @param {string} title - 卡片標題
   */
  async createCard(columnId, title) {
    const safeTitle = normalizeName(title, '卡片標題');
    const cards = await this.getCardsByColumn(columnId);
    const maxOrder = cards.reduce((max, card) => card.order > max ? card.order : max, -1);
    const now = Date.now();

    const card = {
      id: crypto.randomUUID(),
      columnId: columnId,
      title: safeTitle,
      description: '',
      priority: this.normalizePriority('無'),
      dueDate: '',
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };

    await kanbanDB.put('cards', card);
    await backupService.triggerAutoBackup();

    eventBus.emit('card:updated', { columnId });
    return card;
  }

  /**
   * 更新卡片內容
   * @param {Object} card - 卡片物件
   */
  async updateCard(card) {
    card.title = normalizeName(card.title, '卡片標題');
    card.priority = this.normalizePriority(card.priority);
    card.dueDate = this.normalizeDueDate(card.dueDate);
    card.updatedAt = Date.now();
    await kanbanDB.put('cards', card);
    await backupService.triggerAutoBackup();
    eventBus.emit('card:updated', { columnId: card.columnId, cardId: card.id });
  }

  /**
   * 刪除卡片與其所有相關 Checklist、標籤關聯
   * @param {string} id - 卡片 ID
   */
  async deleteCard(id) {
    const card = await this.getCard(id);
    if (!card) return;

    const columnId = card.columnId;

    // 1. 刪除 checklists
    const checklists = await kanbanDB.queryByIndex('checklists', 'cardId', id);
    for (const item of checklists) {
      await kanbanDB.delete('checklists', item.id);
    }

    // 2. 刪除標籤關聯
    const cardTags = await kanbanDB.queryByIndex('cardTags', 'cardId', id);
    for (const ct of cardTags) {
      await kanbanDB.delete('cardTags', ct.id);
    }

    // 3. 刪除卡片本體
    await kanbanDB.delete('cards', id);

    // 4. 重算該欄位剩餘卡片的排序
    const remainingCards = await this.getCardsByColumn(columnId);
    for (let i = 0; i < remainingCards.length; i++) {
      remainingCards[i].order = i;
      await kanbanDB.put('cards', remainingCards[i]);
    }

    await backupService.triggerAutoBackup();
    eventBus.emit('card:updated', { columnId });
  }

  /**
   * 拖曳移動卡片位置與排序 (支援跨欄位與同欄位移動)
   * @param {string} cardId - 被移動的卡片 ID
   * @param {string} targetColumnId - 目標欄位 ID
   * @param {number} newOrder - 新的排序位置 (Index)
   */
  async moveCard(cardId, targetColumnId, newOrder) {
    const card = await this.getCard(cardId);
    if (!card) return;

    const sourceColumnId = card.columnId;

    // 1. 獲取來源與目標欄位的所有卡片
    const sourceCards = await this.getCardsByColumn(sourceColumnId);
    let targetCards = sourceColumnId === targetColumnId 
      ? sourceCards 
      : await this.getCardsByColumn(targetColumnId);

    // 2. 在陣列中處理位置變更
    if (sourceColumnId === targetColumnId) {
      // 同欄位內部排序
      const idx = sourceCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        sourceCards.splice(idx, 1);
        sourceCards.splice(newOrder, 0, card);
        
        // 更新所有人順序並存入資料庫
        for (let i = 0; i < sourceCards.length; i++) {
          sourceCards[i].order = i;
          await kanbanDB.put('cards', sourceCards[i]);
        }
      }
    } else {
      // 跨欄位移動
      const idx = sourceCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        sourceCards.splice(idx, 1);
      }
      
      // 更新舊欄位的所有排序
      for (let i = 0; i < sourceCards.length; i++) {
        sourceCards[i].order = i;
        await kanbanDB.put('cards', sourceCards[i]);
      }

      // 卡片更新目標欄位資訊
      card.columnId = targetColumnId;
      targetCards.splice(newOrder, 0, card);

      // 更新新欄位的所有排序並寫入資料庫
      for (let i = 0; i < targetCards.length; i++) {
        targetCards[i].order = i;
        targetCards[i].columnId = targetColumnId;
        await kanbanDB.put('cards', targetCards[i]);
      }
    }

    await backupService.triggerAutoBackup();
    
    // 廣播變更事件
    eventBus.emit('card:updated', { columnId: sourceColumnId });
    if (sourceColumnId !== targetColumnId) {
      eventBus.emit('card:updated', { columnId: targetColumnId });
    }
  }
}

export const cardService = new CardService();
