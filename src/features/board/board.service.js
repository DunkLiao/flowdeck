import { kanbanDB } from '../../core/db/KanbanDB.js';
import { backupService } from '../../core/storage/BackupService.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { normalizeName } from '../../core/utils/sanitize.js';

/**
 * 看板服務 (Board Service)
 */
class BoardService {
  constructor() {
    this.activeBoardKey = 'flowdeck:active-board-id';
  }

  /**
   * 取得所有看板
   * @returns {Promise<Array>}
   */
  async getBoards() {
    const boards = await kanbanDB.getAll('boards');
    // 依據建立時間排序
    return boards.sort((a, b) => a.createdAt - b.createdAt);
  }

  /**
   * 根據 ID 取得單一看板
   * @param {string} id - 看板 ID
   */
  async getBoard(id) {
    return await kanbanDB.get('boards', id);
  }

  /**
   * 建立一個新看板，並給予三個預設欄位
   * @param {string} name - 看板名稱
   * @returns {Promise<any>} 建立好的看板物件
   */
  async createBoard(name) {
    const safeName = normalizeName(name, '看板名稱');
    const now = Date.now();
    const board = {
      id: crypto.randomUUID(),
      name: safeName,
      createdAt: now,
      updatedAt: now
    };

    // 1. 寫入看板表
    await kanbanDB.put('boards', board);

    // 2. 建立預設三個欄位：「待處理」、「進行中」、「已完成」
    const defaultCols = ['待處理', '進行中', '已完成'];
    for (let i = 0; i < defaultCols.length; i++) {
      const column = {
        id: crypto.randomUUID(),
        boardId: board.id,
        name: defaultCols[i],
        order: i
      };
      await kanbanDB.put('columns', column);
    }

    // 3. 觸發備份與事件
    await backupService.triggerAutoBackup();
    eventBus.emit('board:list-updated');

    return board;
  }

  /**
   * 重新命名看板
   * @param {string} id - 看板 ID
   * @param {string} newName - 新看板名稱
   */
  async renameBoard(id, newName) {
    const board = await this.getBoard(id);
    if (!board) return;

    board.name = normalizeName(newName, '看板名稱');
    board.updatedAt = Date.now();

    await kanbanDB.put('boards', board);
    await backupService.triggerAutoBackup();
    
    eventBus.emit('board:list-updated');
    eventBus.emit('board:name-changed', board);
  }

  /**
   * 刪除看板與其底下所有關聯資料 (級聯刪除)
   * @param {string} id - 看板 ID
   */
  async deleteBoard(id) {
    // 1. 取得該看板的所有欄位
    const columns = await kanbanDB.queryByIndex('columns', 'boardId', id);
    
    for (const col of columns) {
      // 2. 取得該欄位的所有卡片
      const cards = await kanbanDB.queryByIndex('cards', 'columnId', col.id);
      
      for (const card of cards) {
        // 3. 刪除卡片底下的 checklists
        const checklists = await kanbanDB.queryByIndex('checklists', 'cardId', card.id);
        for (const item of checklists) {
          await kanbanDB.delete('checklists', item.id);
        }
        
        // 4. 刪除卡片的標籤關聯
        const cardTags = await kanbanDB.queryByIndex('cardTags', 'cardId', card.id);
        for (const ct of cardTags) {
          await kanbanDB.delete('cardTags', ct.id);
        }

        // 5. 刪除卡片本身
        await kanbanDB.delete('cards', card.id);
      }

      // 6. 刪除欄位本身
      await kanbanDB.delete('columns', col.id);
    }

    // 7. 刪除看板本身
    await kanbanDB.delete('boards', id);

    // 8. 重新計算 active board
    const currentActiveId = this.getActiveBoardId();
    if (currentActiveId === id) {
      const remainingBoards = await this.getBoards();
      if (remainingBoards.length > 0) {
        this.setActiveBoardId(remainingBoards[0].id);
      } else {
        localStorage.removeItem(this.activeBoardKey);
        eventBus.emit('board:changed', null);
      }
    }

    await backupService.triggerAutoBackup();
    eventBus.emit('board:list-updated');
  }

  /**
   * 取得目前選定的看板 ID
   * @returns {string|null}
   */
  getActiveBoardId() {
    return localStorage.getItem(this.activeBoardKey);
  }

  /**
   * 設定目前選定的看板 ID，並觸發全域事件
   * @param {string} id - 看板 ID
   */
  setActiveBoardId(id) {
    localStorage.setItem(this.activeBoardKey, id);
    eventBus.emit('board:changed', id);
    eventBus.emit('board:list-updated'); // 重繪 sidebar 狀態
  }
}

export const boardService = new BoardService();
