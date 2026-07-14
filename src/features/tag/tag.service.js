import { kanbanDB } from '../../core/db/KanbanDB.js';
import { backupService } from '../../core/storage/BackupService.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { normalizeColor, normalizeName } from '../../core/utils/sanitize.js';

/**
 * 標籤服務 (Tag Service)
 */
class TagService {
  /**
   * 取得系統中所有的標籤
   * @returns {Promise<Array>}
   */
  async getTags() {
    return await kanbanDB.getAll('tags');
  }

  /**
   * 建立一個新標籤
   * @param {string} name - 標籤名稱
   * @param {string} color - 色碼
   */
  async createTag(name, color) {
    const id = crypto.randomUUID();
    const tag = { id, name: normalizeName(name, '標籤名稱'), color: normalizeColor(color) };
    
    await kanbanDB.put('tags', tag);
    await backupService.triggerAutoBackup();

    eventBus.emit('tag:list-updated');
    return tag;
  }

  /**
   * 刪除標籤及其與卡片的關聯關係
   * @param {string} id - 標籤 ID
   */
  async deleteTag(id) {
    // 1. 刪除所有使用到該標籤的卡片關聯 (cardTags)
    const cardTags = await kanbanDB.queryByIndex('cardTags', 'tagId', id);
    const affectedCardIds = new Set();
    
    for (const ct of cardTags) {
      affectedCardIds.add(ct.cardId);
      await kanbanDB.delete('cardTags', ct.id);
    }

    // 2. 刪除標籤本體
    await kanbanDB.delete('tags', id);
    await backupService.triggerAutoBackup();

    // 3. 廣播更新
    eventBus.emit('tag:list-updated');
    
    // 觸發所有受影響卡片重繪
    for (const cardId of affectedCardIds) {
      const card = await kanbanDB.get('cards', cardId);
      if (card) {
        eventBus.emit('card:updated', { columnId: card.columnId, cardId });
      }
    }
  }

  /**
   * 取得某張卡片關聯的所有標籤
   * @param {string} cardId - 卡片 ID
   * @returns {Promise<Array>} 標籤物件陣列
   */
  async getTagsForCard(cardId) {
    const relations = await kanbanDB.queryByIndex('cardTags', 'cardId', cardId);
    const tags = [];
    for (const rel of relations) {
      const tag = await kanbanDB.get('tags', rel.tagId);
      if (tag) tags.push(tag);
    }
    return tags;
  }

  /**
   * 為卡片新增標籤關聯
   * @param {string} cardId - 卡片 ID
   * @param {string} tagId - 標籤 ID
   */
  async addTagToCard(cardId, tagId) {
    const id = `${cardId}_${tagId}`;
    const relation = { id, cardId, tagId };

    await kanbanDB.put('cardTags', relation);
    await backupService.triggerAutoBackup();

    const card = await kanbanDB.get('cards', cardId);
    if (card) {
      eventBus.emit('card:updated', { columnId: card.columnId, cardId });
    }
  }

  /**
   * 為卡片移出標籤關聯
   * @param {string} cardId - 卡片 ID
   * @param {string} tagId - 標籤 ID
   */
  async removeTagFromCard(cardId, tagId) {
    const id = `${cardId}_${tagId}`;
    await kanbanDB.delete('cardTags', id);
    await backupService.triggerAutoBackup();

    const card = await kanbanDB.get('cards', cardId);
    if (card) {
      eventBus.emit('card:updated', { columnId: card.columnId, cardId });
    }
  }
}

export const tagService = new TagService();
