/**
 * KanbanDB - IndexedDB 封裝類別
 * 提供基於 Promise 的 CRUD 操作，並在 IndexedDB 被停用時自動降級至記憶體儲存模式。
 */
class KanbanDB {
  constructor() {
    this.dbName = 'KanbanDB';
    this.dbVersion = 1;
    this.db = null;
    this.isFallbackMode = false;
    
    // 記憶體降級儲存器 (Fallback memory store)
    this.fallbackStore = {
      boards: {},
      columns: {},
      cards: {},
      tags: {},
      cardTags: {},
      checklists: {}
    };
  }

  /**
   * 初始化資料庫。
   * @returns {Promise<boolean>} 是否成功以 IndexedDB 啟動。
   */
  init() {
    return new Promise((resolve) => {
      // 1. 偵測瀏覽器環境
      if (!window.indexedDB) {
        console.warn('[KanbanDB] 瀏覽器不支援 IndexedDB，切換至記憶體儲存模式。');
        this.enableFallbackMode();
        return resolve(false);
      }

      try {
        const request = window.indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = (event) => {
          console.error('[KanbanDB] 無法開啟 IndexedDB:', event.target.error);
          this.enableFallbackMode();
          resolve(false);
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(true);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // 建立 boards 儲存庫
          if (!db.objectStoreNames.contains('boards')) {
            db.createObjectStore('boards', { keyPath: 'id' });
          }

          // 建立 columns 儲存庫
          if (!db.objectStoreNames.contains('columns')) {
            const store = db.createObjectStore('columns', { keyPath: 'id' });
            store.createIndex('boardId', 'boardId', { unique: false });
          }

          // 建立 cards 儲存庫
          if (!db.objectStoreNames.contains('cards')) {
            const store = db.createObjectStore('cards', { keyPath: 'id' });
            store.createIndex('columnId', 'columnId', { unique: false });
          }

          // 建立 tags 儲存庫
          if (!db.objectStoreNames.contains('tags')) {
            db.createObjectStore('tags', { keyPath: 'id' });
          }

          // 建立 cardTags 關係儲存庫
          if (!db.objectStoreNames.contains('cardTags')) {
            const store = db.createObjectStore('cardTags', { keyPath: 'id' });
            store.createIndex('cardId', 'cardId', { unique: false });
            store.createIndex('tagId', 'tagId', { unique: false });
          }

          // 建立 checklists 儲存庫
          if (!db.objectStoreNames.contains('checklists')) {
            const store = db.createObjectStore('checklists', { keyPath: 'id' });
            store.createIndex('cardId', 'cardId', { unique: false });
          }
        };
      } catch (err) {
        console.error('[KanbanDB] 初始化過程中發生未預期錯誤:', err);
        this.enableFallbackMode();
        resolve(false);
      }
    });
  }

  /**
   * 啟用記憶體降級模式。
   */
  enableFallbackMode() {
    this.isFallbackMode = true;
    console.warn('[KanbanDB] 目前已啟用「記憶體暫存模式」，所有變更將在重新整理後消失！');
  }

  /**
   * 取得特定 Store 的交易物件。
   * @private
   */
  getTransaction(storeName, mode = 'readonly') {
    if (this.isFallbackMode || !this.db) return null;
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // ==========================================
  // 核心 CRUD 方法
  // ==========================================

  /**
   * 讀取所有資料。
   * @param {string} storeName - 儲存庫名稱。
   * @returns {Promise<Array>}
   */
  getAll(storeName) {
    return new Promise((resolve, reject) => {
      if (this.isFallbackMode) {
        return resolve(Object.values(this.fallbackStore[storeName] || {}));
      }

      const store = this.getTransaction(storeName, 'readonly');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * 根據 ID 讀取單筆資料。
   * @param {string} storeName - 儲存庫名稱。
   * @param {string} id - 資料主鍵。
   * @returns {Promise<any>}
   */
  get(storeName, id) {
    return new Promise((resolve, reject) => {
      if (this.isFallbackMode) {
        return resolve(this.fallbackStore[storeName]?.[id] || null);
      }

      const store = this.getTransaction(storeName, 'readonly');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * 新增或更新單筆資料。
   * @param {string} storeName - 儲存庫名稱。
   * @param {any} data - 要儲存的資料物件（必須包含 id 欄位）。
   * @returns {Promise<any>}
   */
  put(storeName, data) {
    return new Promise((resolve, reject) => {
      if (this.isFallbackMode) {
        if (!data.id) data.id = crypto.randomUUID();
        this.fallbackStore[storeName][data.id] = JSON.parse(JSON.stringify(data));
        return resolve(data);
      }

      const store = this.getTransaction(storeName, 'readwrite');
      const request = store.put(data);

      request.onsuccess = () => resolve(data);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * 根據 ID 刪除資料。
   * @param {string} storeName - 儲存庫名稱。
   * @param {string} id - 主鍵。
   * @returns {Promise<boolean>} 是否成功刪除。
   */
  delete(storeName, id) {
    return new Promise((resolve, reject) => {
      if (this.isFallbackMode) {
        if (this.fallbackStore[storeName]?.[id]) {
          delete this.fallbackStore[storeName][id];
          return resolve(true);
        }
        return resolve(false);
      }

      const store = this.getTransaction(storeName, 'readwrite');
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * 使用索引進行條件查詢。
   * @param {string} storeName - 儲存庫名稱。
   * @param {string} indexName - 索引欄位名稱。
   * @param {any} value - 匹配的值。
   * @returns {Promise<Array>} 匹配的資料陣列。
   */
  queryByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      if (this.isFallbackMode) {
        const results = Object.values(this.fallbackStore[storeName] || {})
          .filter(item => item[indexName] === value);
        return resolve(results);
      }

      const store = this.getTransaction(storeName, 'readonly');
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * 清空所有儲存庫（用於匯入還原）。
   */
  async clearAll() {
    if (this.isFallbackMode) {
      Object.keys(this.fallbackStore).forEach(key => {
        this.fallbackStore[key] = {};
      });
      return true;
    }

    const stores = ['boards', 'columns', 'cards', 'tags', 'cardTags', 'checklists'];
    for (const name of stores) {
      await new Promise((resolve, reject) => {
        const store = this.getTransaction(name, 'readwrite');
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
      });
    }
    return true;
  }
}

export const kanbanDB = new KanbanDB();
