/*
 * Flowdeck standalone runtime.
 * Generated from ES module sources for direct file:// execution.
 */
(function () {
  'use strict';

  const ICONS = {
    'alert-triangle': '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
    'align-left': '<line x1="21" y1="6" x2="3" y2="6"></line><line x1="15" y1="12" x2="3" y2="12"></line><line x1="17" y1="18" x2="3" y2="18"></line>',
    'check-square': '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>',
    'grip-vertical': '<circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle>',
    'layout-dashboard': '<rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect>',
    moon: '<path d="M12 3a6 6 0 0 0 9 7.5A9 9 0 1 1 12 3z"></path>',
    'more-horizontal': '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
    'rotate-ccw': '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>',
    search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
    sun: '<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="6.34" y1="17.66" x2="4.93" y2="19.07"></line><line x1="19.07" y1="4.93" x2="17.66" y2="6.34"></line>',
    tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
    'trash-2': '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',
    x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
  };

  function copyAttributes(source, target) {
    for (const attr of Array.from(source.attributes)) {
      if (attr.name !== 'data-lucide') target.setAttribute(attr.name, attr.value);
    }
  }

  function renderIcons(root = document) {
    const nodes = Array.from(root.querySelectorAll('[data-lucide]'));
    for (const node of nodes) {
      const name = node.getAttribute('data-lucide');
      const body = ICONS[name];
      if (!body) {
        console.warn('[Flowdeck] Missing local icon:', name);
        continue;
      }

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      copyAttributes(node, svg);
      svg.setAttribute('data-lucide', name);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', node.style.width || node.getAttribute('width') || '24');
      svg.setAttribute('height', node.style.height || node.getAttribute('height') || '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('aria-hidden', node.getAttribute('aria-hidden') || 'true');
      svg.innerHTML = body;
      node.replaceWith(svg);
    }
  }

  window.lucide = { createIcons: renderIcons };





  /* ===== src/ui/toast.js ===== */
/**
 * 全域 Toast 通知單例
 */
const Toast = {
  /**
   * 顯示 Toast 訊息
   * @param {string} message - 顯示內容
   * @param {'success'|'error'|'warning'|'info'} [type='info'] - 類型
   * @param {number} [duration=3000] - 顯示毫秒數
   */
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // 建立 Toast 元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // 根據類型選擇 SVG 圖標
    let iconSvg = '';
    switch (type) {
      case 'success':
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        break;
      case 'error':
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        break;
      case 'warning':
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        break;
      case 'info':
      default:
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        break;
    }

    toast.innerHTML = iconSvg;
    const messageEl = document.createElement('span');
    messageEl.className = 'toast-message';
    messageEl.textContent = message;
    toast.appendChild(messageEl);

    // 掛載
    container.appendChild(toast);

    // 設定自動淡出並銷毀
    const fadeOutTimeout = setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, duration - 300);

    // 支援手動點擊即可關閉
    toast.addEventListener('click', () => {
      clearTimeout(fadeOutTimeout);
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    });
  },

  success(message) {
    this.show(message, 'success');
  },

  error(message) {
    this.show(message, 'error', 4500);
  },

  warning(message) {
    this.show(message, 'warning', 4000);
  },

  info(message) {
    this.show(message, 'info');
  }
};


  /* ===== src/ui/dialog.js ===== */
/**
 * 全域對話框單例 (Dialogs)
 * 使用 Promise 封裝，支援 async/await 調用。
 */
const Dialog = {
  /**
   * 顯示確認對話框 (如：刪除動作確認)
   * @param {string} title - 對話框標題
   * @param {string} message - 對話框訊息內容
   * @param {'danger'|'warning'|'info'} [type='danger'] - 類型，控制圖標樣式
   * @returns {Promise<boolean>} 使用者是否點選「確定」
   */
  confirm(title, message, type = 'danger') {
    return new Promise((resolve) => {
      const overlay = document.getElementById('dialog-overlay');
      const titleEl = document.getElementById('dialog-title');
      const messageEl = document.getElementById('dialog-message');
      const confirmBtn = document.getElementById('btn-dialog-confirm');
      const cancelBtn = document.getElementById('btn-dialog-cancel');
      const iconContainer = document.getElementById('dialog-icon-container');

      if (!overlay || !confirmBtn || !cancelBtn) return resolve(false);

      // 設定內容
      titleEl.textContent = title;
      messageEl.textContent = message;

      // 設定按鈕配色與圖標
      confirmBtn.className = 'btn';
      if (type === 'danger') {
        confirmBtn.classList.add('btn-danger');
        iconContainer.className = 'dialog-icon danger';
        iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
      } else {
        confirmBtn.classList.add('btn-primary');
        iconContainer.className = 'dialog-icon info';
        iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
      }

      // 顯示
      overlay.classList.remove('hidden');

      const cleanup = (value) => {
        overlay.classList.add('hidden');
        // 解除事件監聽器，避免殘留
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        window.removeEventListener('keydown', onKeyDown);
        resolve(value);
      };

      const onConfirm = () => cleanup(true);
      const onCancel = () => cleanup(false);
      const onKeyDown = (e) => {
        if (e.key === 'Escape') cleanup(false);
        if (e.key === 'Enter') cleanup(true);
      };

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      window.addEventListener('keydown', onKeyDown);
    });
  },

  /**
   * 顯示文字輸入對話框 (如：新建看板、更名)
   * @param {string} title - 對話框標題
   * @param {string} [placeholder=''] - 輸入框佔位符
   * @param {string} [defaultValue=''] - 預設輸入值
   * @returns {Promise<string|null>} 使用者輸入的字串，若點選「取消」或輸入空白則回傳 null
   */
  prompt(title, placeholder = '', defaultValue = '') {
    return new Promise((resolve) => {
      const overlay = document.getElementById('input-dialog-overlay');
      const titleEl = document.getElementById('input-dialog-title');
      const inputEl = document.getElementById('input-dialog-text');
      const confirmBtn = document.getElementById('btn-input-dialog-confirm');
      const cancelBtn = document.getElementById('btn-input-dialog-cancel');

      if (!overlay || !inputEl || !confirmBtn || !cancelBtn) return resolve(null);

      // 設定內容
      titleEl.textContent = title;
      inputEl.placeholder = placeholder;
      inputEl.value = defaultValue;

      // 顯示
      overlay.classList.remove('hidden');
      inputEl.focus();
      inputEl.select();

      const cleanup = (value) => {
        overlay.classList.add('hidden');
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        window.removeEventListener('keydown', onKeyDown);
        resolve(value);
      };

      const onConfirm = () => {
        const val = inputEl.value.trim();
        if (val) {
          cleanup(val);
        } else {
          inputEl.classList.add('error');
          setTimeout(() => inputEl.classList.remove('error'), 300);
        }
      };

      const onCancel = () => cleanup(null);
      const onKeyDown = (e) => {
        if (e.key === 'Escape') cleanup(null);
        if (e.key === 'Enter') onConfirm();
      };

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      window.addEventListener('keydown', onKeyDown);
    });
  }
};


  /* ===== src/core/utils/sanitize.js ===== */
const DEFAULT_TAG_COLOR = '#3b82f6';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function normalizeColor(value, fallback = DEFAULT_TAG_COLOR) {
  return isValidHexColor(value) ? value : fallback;
}

function sanitizeUrl(value) {
  const text = String(value ?? '').trim();
  if (!text) return '#';

  try {
    const url = new URL(text, window.location.origin);
    if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
      return text;
    }
  } catch {
    return '#';
  }

  return '#';
}

function normalizeName(value, fieldName = '名稱', maxLength = 50) {
  const text = String(value ?? '').trim();
  if (!text) {
    throw new Error(`${fieldName}不可為空白`);
  }
  if (text.length > maxLength) {
    throw new Error(`${fieldName}不可超過 ${maxLength} 個字`);
  }
  return text;
}


  /* ===== src/core/utils/EventBus.js ===== */
/**
 * 極簡的發佈-訂閱事件匯流排 (EventBus)
 * 用於解耦模組之間的通訊與視圖同步。
 */
class EventBus {
  constructor() {
    this.listeners = {};
  }

  /**
   * 訂閱事件。
   * @param {string} event - 事件名稱。
   * @param {Function} callback - 回呼函式。
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * 取消訂閱事件。
   * @param {string} event - 事件名稱。
   * @param {Function} callback - 回呼函式。
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * 發佈事件。
   * @param {string} event - 事件名稱。
   * @param {any} [data] - 附帶的參數資料。
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] 執行事件 "${event}" 的回呼函式時出錯:`, err);
      }
    });
  }
}

const eventBus = new EventBus();


  /* ===== src/core/db/KanbanDB.js ===== */
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

const kanbanDB = new KanbanDB();


  /* ===== src/core/storage/BackupService.js ===== */

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

const backupService = new BackupService();


  /* ===== src/features/board/board.service.js ===== */

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

const boardService = new BoardService();


  /* ===== src/features/column/column.service.js ===== */

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

const columnService = new ColumnService();


  /* ===== src/features/card/card.service.js ===== */

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

const cardService = new CardService();


  /* ===== src/features/checklist/checklist.service.js ===== */

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

const checklistService = new ChecklistService();


  /* ===== src/features/tag/tag.service.js ===== */

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

const tagService = new TagService();


  /* ===== src/features/search/search.service.js ===== */

/**
 * 搜尋與篩選服務 (Search & Filter Service)
 */
class SearchService {
  constructor() {
    this.filterState = {
      keyword: '',
      priorities: [], // 勾選的優先順序 ["高", "中", "低", "無"]
      tags: [],       // 勾選的標籤 ID 陣列
      dueDates: []    // 勾選的到期日條件 ["overdue", "today", "week"]
    };

    this.debounceTimer = null;
    this.initEvents();
  }

  /**
   * 初始化搜尋與篩選介面的事件
   */
  initEvents() {
    // 監聽卡片更新或重新渲染事件，自動重新套用篩選
    eventBus.on('card:updated', () => {
      this.applyFilters();
    });

    eventBus.on('column:updated', () => {
      // 延遲執行以確保 DOM 已更新
      setTimeout(() => this.applyFilters(), 50);
    });

    // 關鍵字搜尋 (防抖動 150ms)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.filterState.keyword = e.target.value.trim().toLowerCase();
          this.applyFilters();
        }, 150);
      });
    }

    // 篩選選單顯示/隱藏切換
    const filterBtn = document.getElementById('btn-filter-menu');
    const filterDropdown = document.getElementById('filter-dropdown');
    if (filterBtn && filterDropdown) {
      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('hidden');
        filterBtn.classList.toggle('active');
      });

      // 點擊外部關閉選單
      document.addEventListener('click', (e) => {
        if (!filterDropdown.classList.contains('hidden') && !e.target.closest('#filter-dropdown') && !e.target.closest('#btn-filter-menu')) {
          filterDropdown.classList.add('hidden');
          filterBtn.classList.remove('active');
        }
      });
    }

    // 優先權篩選 Checkbox
    document.addEventListener('change', (e) => {
      if (e.target.name === 'filter-priority') {
        const checkboxes = document.querySelectorAll('input[name="filter-priority"]:checked');
        this.filterState.priorities = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
      }

      if (e.target.name === 'filter-tag') {
        const checkboxes = document.querySelectorAll('input[name="filter-tag"]:checked');
        this.filterState.tags = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
      }

      if (e.target.name === 'filter-due-date') {
        const checkboxes = document.querySelectorAll('input[name="filter-due-date"]:checked');
        this.filterState.dueDates = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
      }
    });

    // 清除所有篩選條件
    const clearFiltersBtn = document.getElementById('btn-clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
  }

  /**
   * 清除所有篩選條件與 UI 勾選狀態
   */
  clearAllFilters() {
    this.filterState.keyword = '';
    this.filterState.priorities = [];
    this.filterState.tags = [];
    this.filterState.dueDates = [];

    // 重設 UI
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const checkboxes = document.querySelectorAll('input[name="filter-priority"], input[name="filter-tag"], input[name="filter-due-date"]');
    checkboxes.forEach(cb => {
      cb.checked = false;
      // 還原標籤篩選按鈕樣式
      const cbSpan = cb.nextElementSibling;
      if (cbSpan && cb.name === 'filter-tag') {
        cbSpan.style.backgroundColor = '';
        cbSpan.style.color = '';
        cbSpan.style.borderColor = '';
      }
    });

    this.applyFilters();
  }

  /**
   * 套用篩選邏輯，切換卡片 DOM 的隱藏狀態
   */
  async applyFilters() {
    const cardNodes = document.querySelectorAll('.kanban-card');

    let activeFilterCount = 0;
    if (this.filterState.keyword) activeFilterCount++;
    activeFilterCount += this.filterState.priorities.length;
    activeFilterCount += this.filterState.tags.length;
    activeFilterCount += this.filterState.dueDates.length;

    // 更新篩選徽章 (badge)
    const badge = document.getElementById('active-filters-count');
    const filterBtn = document.getElementById('btn-filter-menu');
    if (badge && filterBtn) {
      if (activeFilterCount > 0) {
        badge.textContent = activeFilterCount;
        badge.style.display = 'inline-block';
        filterBtn.classList.add('active');
      } else {
        badge.style.display = 'none';
        filterBtn.classList.remove('active');
      }
    }

    if (cardNodes.length === 0) return;

    // 依序過濾 DOM 節點
    for (const node of cardNodes) {
      const cardId = node.dataset.cardId;
      if (!cardId) continue;

      const card = await cardService.getCard(cardId);
      if (!card) {
        node.classList.add('hidden');
        continue;
      }

      let matches = true;

      // 1. 關鍵字模糊篩選 (標題、描述)
      if (this.filterState.keyword) {
        const titleMatch = card.title.toLowerCase().includes(this.filterState.keyword);
        const descMatch = card.description.toLowerCase().includes(this.filterState.keyword);
        if (!titleMatch && !descMatch) {
          matches = false;
        }
      }

      // 2. 優先級篩選
      if (matches && this.filterState.priorities.length > 0) {
        if (!this.filterState.priorities.includes(card.priority)) {
          matches = false;
        }
      }

      // 3. 標籤篩選 (聯集：符合任一個即可)
      if (matches && this.filterState.tags.length > 0) {
        const cardTags = await tagService.getTagsForCard(cardId);
        const cardTagIds = cardTags.map(t => t.id);
        const hasTagMatch = this.filterState.tags.some(id => cardTagIds.includes(id));
        if (!hasTagMatch) {
          matches = false;
        }
      }

      // 4. 到期日篩選
      if (matches && this.filterState.dueDates.length > 0) {
        matches = this.matchesDueDateFilter(card.dueDate);
      }

      // 切換 visibility
      if (matches) {
        node.classList.remove('hidden');
      } else {
        node.classList.add('hidden');
      }
    }

    // 重新計算每個欄位目前「可見」的卡片數量並更新計數器
    const columnLists = document.querySelectorAll('.cards-list');
    columnLists.forEach(list => {
      const columnId = list.dataset.columnId;
      const visibleCount = list.querySelectorAll('.kanban-card:not(.hidden)').length;
      const totalCount = list.querySelectorAll('.kanban-card').length;
      const badgeEl = document.getElementById(`count-${columnId}`);
      if (badgeEl) {
        badgeEl.textContent = visibleCount;
      }
      this.renderFilterEmptyState(list, activeFilterCount > 0 && totalCount > 0 && visibleCount === 0);
    });
  }

  matchesDueDateFilter(dueDate) {
    if (!dueDate) return false;

    const today = new Date();
    const todayText = this.formatDate(today);
    const dueText = String(dueDate);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 6);
    const weekEndText = this.formatDate(weekEnd);

    return this.filterState.dueDates.some((filter) => {
      if (filter === 'overdue') return dueText < todayText;
      if (filter === 'today') return dueText === todayText;
      if (filter === 'week') return dueText >= todayText && dueText <= weekEndText;
      return false;
    });
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  renderFilterEmptyState(list, shouldShow) {
    let emptyNode = list.querySelector('.filter-empty-state');
    if (shouldShow) {
      if (!emptyNode) {
        emptyNode = document.createElement('div');
        emptyNode.className = 'filter-empty-state text-muted';
        emptyNode.textContent = '無符合條件之卡片';
        list.appendChild(emptyNode);
      }
      emptyNode.classList.remove('hidden');
    } else if (emptyNode) {
      emptyNode.classList.add('hidden');
    }
  }
}

const searchService = new SearchService();


  /* ===== src/features/board/board.component.js ===== */

/**
 * 看板視圖元件 (Board Component)
 */
class BoardComponent {
  constructor() {
    this.boardListEl = document.getElementById('board-list');
    this.activeTitleEl = document.getElementById('active-board-title');
    this.createBoardBtn = document.getElementById('btn-create-board');

    this.initEvents();
  }

  /**
   * 初始化事件訂閱
   */
  initEvents() {
    // 訂閱看板清單更新事件
    eventBus.on('board:list-updated', () => this.render());
    // 訂閱看板名稱修改事件
    eventBus.on('board:name-changed', (board) => {
      const activeId = boardService.getActiveBoardId();
      if (activeId === board.id) {
        this.activeTitleEl.textContent = board.name;
      }
    });

    // 頂部標題編輯事件 (ContentEditable)
    this.activeTitleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.activeTitleEl.blur();
      }
      if (e.key === 'Escape') {
        // 還原為當前名稱
        const activeId = boardService.getActiveBoardId();
        boardService.getBoard(activeId).then(board => {
          if (board) this.activeTitleEl.textContent = board.name;
        });
        this.activeTitleEl.blur();
      }
    });

    this.activeTitleEl.addEventListener('blur', async () => {
      const activeId = boardService.getActiveBoardId();
      if (!activeId) return;

      const newName = this.activeTitleEl.textContent.trim();
      if (!newName) {
        // 空白名稱還原
        const board = await boardService.getBoard(activeId);
        this.activeTitleEl.textContent = board ? board.name : '未命名看板';
        Toast.error('看板名稱不可為空！');
        return;
      }

      const board = await boardService.getBoard(activeId);
      if (board && board.name !== newName) {
        try {
          await boardService.renameBoard(activeId, newName);
          Toast.success('看板更名成功');
        } catch (err) {
          this.activeTitleEl.textContent = board.name;
          Toast.error(err.message || '看板更名失敗');
        }
      }
    });

    // 建立新看板按鈕
    this.createBoardBtn.addEventListener('click', async () => {
      const name = await Dialog.prompt('建立新看板', '請輸入看板名稱...', '');
      if (name) {
        try {
          const board = await boardService.createBoard(name);
          boardService.setActiveBoardId(board.id);
          Toast.success(`已建立看板「${board.name}」`);
        } catch (err) {
          Toast.error(err.message || '建立看板失敗');
        }
      }
    });

    // 事件委派：點擊看板項目或刪除看板
    this.boardListEl.addEventListener('click', async (e) => {
      const itemEl = e.target.closest('.board-item');
      if (!itemEl) return;

      const boardId = itemEl.dataset.boardId;

      // 點擊刪除按鈕
      const deleteBtn = e.target.closest('.btn-delete-board');
      if (deleteBtn) {
        e.stopPropagation(); // 阻止氣泡觸發切換看板
        const board = await boardService.getBoard(boardId);
        if (!board) return;

        const confirm = await Dialog.confirm(
          '刪除看板',
          `您確定要刪除看板「${board.name}」嗎？此動作將連同底下的欄位及卡片一併永久刪除。`,
          'danger'
        );

        if (confirm) {
          await boardService.deleteBoard(boardId);
          Toast.success(`看板「${board.name}」已刪除`);
        }
        return;
      }

      // 點擊切換看板
      boardService.setActiveBoardId(boardId);
    });
  }

  /**
   * 渲染看板清單與主標題
   */
  async render() {
    const boards = await boardService.getBoards();
    const activeId = boardService.getActiveBoardId();

    // 1. 渲染頂部當前看板標題
    if (activeId) {
      const activeBoard = await boardService.getBoard(activeId);
      if (activeBoard) {
        this.activeTitleEl.textContent = activeBoard.name;
        this.activeTitleEl.style.display = 'block';
      } else {
        this.activeTitleEl.textContent = '選擇看板';
      }
    } else {
      this.activeTitleEl.textContent = '請先建立看板';
    }

    // 2. 渲染側邊欄清單
    this.boardListEl.innerHTML = '';
    
    if (boards.length === 0) {
      this.boardListEl.innerHTML = `<div class="sidebar-empty text-muted" style="padding: 10px; font-size: 13px;">無看板資料</div>`;
      return;
    }

    boards.forEach(board => {
      const isActive = board.id === activeId;
      const itemNode = document.createElement('div');
      itemNode.className = `board-item ${isActive ? 'active' : ''}`;
      itemNode.dataset.boardId = board.id;

      const nameNode = document.createElement('span');
      nameNode.className = 'board-item-name';
      nameNode.textContent = board.name;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete-board';
      deleteBtn.setAttribute('aria-label', '刪除看板');
      deleteBtn.innerHTML = '<i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>';

      itemNode.append(nameNode, deleteBtn);
      this.boardListEl.appendChild(itemNode);
    });

    // 重新繪製 Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}


  /* ===== src/features/card/card.component.js ===== */


// 輕量級 Markdown 解析器
function parseMarkdown(text) {
  if (!text) return '<p class="text-muted" style="font-style: italic;">無任務描述。點擊此處進行編輯...</p>';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // 標題 (Headers)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 粗體與斜體 (Bold & Italic)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 行內代碼 (Inline Code)
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // 連結 (Links)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_, label, url) => {
    return `<a href="${escapeHtml(sanitizeUrl(url))}" target="_blank" rel="noopener">${label}</a>`;
  });
  
  // 換行 (Line breaks)
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * 卡片元件 (Card Component)
 */
class CardComponent {
  constructor() {
    // 詳情 Modal DOM 物件
    this.modalOverlay = document.getElementById('modal-container');
    this.modalContent = document.getElementById('card-detail-modal');
    this.closeModalBtn = document.getElementById('btn-close-modal');
    
    this.modalCardTitle = document.getElementById('modal-card-title');
    this.modalCardDescPreview = document.getElementById('card-desc-preview');
    this.modalCardDescTextarea = document.getElementById('card-desc-textarea');
    this.btnEditDesc = document.getElementById('btn-edit-desc');
    
    this.modalSelectColumn = document.getElementById('modal-select-column');
    this.modalSelectPriority = document.getElementById('modal-select-priority');
    this.modalInputDueDate = document.getElementById('modal-input-duedate');
    this.btnDeleteCard = document.getElementById('btn-delete-card');

    this.activeCardId = null;
    this.draggedCardId = null;
    this.isClosingModal = false;
    this.columnRenderVersions = new Map();
    this.pendingDueDateCommits = new Map();

    this.initEvents();
  }

  /**
   * 初始化卡片全域事件
   */
  initEvents() {
    // 訂閱卡片更新事件
    eventBus.on('card:updated', (data) => {
      if (data && data.columnId) {
        this.renderCardsForColumn(data.columnId);
      }
      if (data && data.cardId && this.activeCardId === data.cardId) {
        // 如果編輯的是當前打開的卡片，同步更新 Modal
        this.loadCardDetailToModal(data.cardId);
      }
    });

    // 關閉 Modal
    this.closeModalBtn.addEventListener('click', () => {
      void this.closeModal();
    });
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) void this.closeModal();
    });

    // 刪除卡片
    this.btnDeleteCard.addEventListener('click', async () => {
      if (!this.activeCardId) return;
      const card = await cardService.getCard(this.activeCardId);
      if (!card) return;

      const confirm = await Dialog.confirm(
        '刪除卡片',
        `您確定要永久刪除卡片「${card.title}」嗎？此動作將無法還原。`,
        'danger'
      );

      if (confirm) {
        await cardService.deleteCard(this.activeCardId);
        Toast.success('卡片已刪除');
        void this.closeModal();
      }
    });

    // Modal 卡片標題即時更名
    this.modalCardTitle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.modalCardTitle.blur();
      }
    });
    this.modalCardTitle.addEventListener('blur', async () => {
      if (!this.activeCardId) return;
      const newTitle = this.modalCardTitle.textContent.trim();
      if (!newTitle) {
        const card = await cardService.getCard(this.activeCardId);
        this.modalCardTitle.textContent = card ? card.title : '未命名任務';
        Toast.error('任務標題不可為空！');
        return;
      }
      const card = await cardService.getCard(this.activeCardId);
      if (card && card.title !== newTitle) {
        try {
          card.title = newTitle;
          await cardService.updateCard(card);
          Toast.success('標題更新成功');
        } catch (err) {
          this.modalCardTitle.textContent = card.title;
          Toast.error(err.message || '標題更新失敗');
        }
      }
    });

    // 描述編輯模式切換
    this.modalCardDescPreview.addEventListener('click', () => this.enterDescEditMode());
    this.btnEditDesc.addEventListener('click', () => {
      if (this.modalCardDescTextarea.classList.contains('hidden')) {
        this.enterDescEditMode();
      } else {
        this.saveDescription();
      }
    });

    // 屬性更動監聽器
    this.modalSelectColumn.addEventListener('change', async () => {
      if (!this.activeCardId) return;
      const targetColumnId = this.modalSelectColumn.value;
      const card = await cardService.getCard(this.activeCardId);
      if (card && card.columnId !== targetColumnId) {
        // 移動至該欄位最末端
        const siblingCards = await cardService.getCardsByColumn(targetColumnId);
        await cardService.moveCard(this.activeCardId, targetColumnId, siblingCards.length);
        Toast.success('卡片狀態已變更');
      }
    });

    this.modalSelectPriority.addEventListener('change', async () => {
      if (!this.activeCardId) return;
      const val = this.modalSelectPriority.value;
      const card = await cardService.getCard(this.activeCardId);
      if (card && card.priority !== val) {
        card.priority = val;
        await cardService.updateCard(card);
      }
    });

    this.modalInputDueDate.addEventListener('click', () => this.openDueDatePicker());
    this.modalInputDueDate.addEventListener('focus', () => this.openDueDatePicker());
    this.modalInputDueDate.addEventListener('input', () => {
      void this.commitDueDateChange();
    });
    this.modalInputDueDate.addEventListener('change', () => {
      void this.commitDueDateChange();
    });
    this.modalInputDueDate.addEventListener('blur', () => {
      void this.commitDueDateChange();
    });

    // 全域鍵盤事件：Esc 關閉 Modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalOverlay.classList.contains('hidden')) {
        void this.closeModal();
      }
    });

    // 欄位容器的卡片拖拽與點擊開啟詳情
    const columnsContainer = document.getElementById('board-columns-container');
    
    // 事件委派：卡片點擊詳情
    columnsContainer.addEventListener('click', (e) => {
      const cardEl = e.target.closest('.kanban-card');
      if (cardEl && !e.target.closest('.btn-delete-card') && !e.target.closest('.btn-delete-column')) {
        this.openCardDetail(cardEl.dataset.cardId).catch((err) => {
          console.error('[CardComponent] 開啟卡片詳情失敗:', err);
          Toast.error('開啟卡片詳情失敗，請重新整理後再試。');
        });
      }
    });

    // 卡片 HTML5 拖拽事件
    columnsContainer.addEventListener('dragstart', (e) => {
      const cardEl = e.target.closest('.kanban-card');
      if (cardEl) {
        this.draggedCardId = cardEl.dataset.cardId;
        cardEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.draggedCardId);
      }
    });

    columnsContainer.addEventListener('dragover', (e) => {
      const cardsList = e.target.closest('.cards-list');
      if (!cardsList || !this.draggedCardId) return;
      e.preventDefault();

      // 計算插入位置
      const afterElement = this.getDragAfterElement(cardsList, e.clientY);
      const draggedEl = document.querySelector(`.kanban-card[data-card-id="${this.draggedCardId}"]`);
      if (draggedEl) {
        if (afterElement == null) {
          cardsList.appendChild(draggedEl);
        } else {
          cardsList.insertBefore(draggedEl, afterElement);
        }
      }
    });

    columnsContainer.addEventListener('dragend', async (e) => {
      const cardEl = e.target.closest('.kanban-card');
      if (cardEl && this.draggedCardId) {
        cardEl.classList.remove('dragging');
        
        // 取得拖曳放置的最新 column 與順序
        const targetList = cardEl.closest('.cards-list');
        if (targetList) {
          const targetColumnId = targetList.dataset.columnId;
          const cardNodes = targetList.querySelectorAll('.kanban-card');
          const newOrder = Array.from(cardNodes).indexOf(cardEl);
          
          if (newOrder !== -1) {
            await cardService.moveCard(this.draggedCardId, targetColumnId, newOrder);
          }
        }
        
        this.draggedCardId = null;
      }
    });
  }

  /**
   * 計算拖曳點擊時位於哪張卡片的前面或後面
   */
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  openDueDatePicker() {
    if (typeof this.modalInputDueDate.showPicker !== 'function') return;

    try {
      this.modalInputDueDate.showPicker();
    } catch {
      // Some browsers only allow showPicker() during a direct user gesture.
    }
  }

  async commitDueDateChange() {
    const cardId = this.activeCardId;
    if (!cardId) return;

    const val = this.modalInputDueDate.value;
    if (val && !/^\d{4}-\d{2}-\d{2}$/.test(val)) return;
    if (this.pendingDueDateCommits.get(cardId) === val) return;

    this.pendingDueDateCommits.set(cardId, val);
    try {
      const card = await cardService.getCard(cardId);
      if (card && card.dueDate !== val) {
        card.dueDate = val;
        await cardService.updateCard(card);
      }
    } finally {
      if (this.pendingDueDateCommits.get(cardId) === val) {
        this.pendingDueDateCommits.delete(cardId);
      }
    }
  }

  /**
   * 進入描述編輯狀態
   */
  enterDescEditMode() {
    this.modalCardDescPreview.classList.add('hidden');
    this.modalCardDescTextarea.classList.remove('hidden');
    this.modalCardDescTextarea.focus();
    this.btnEditDesc.textContent = '儲存';
    this.btnEditDesc.className = 'btn btn-sm btn-primary';
  }

  /**
   * 儲存描述
   */
  async saveDescription() {
    if (!this.activeCardId) return;
    const card = await cardService.getCard(this.activeCardId);
    if (!card) return;

    const val = this.modalCardDescTextarea.value;
    card.description = val;
    await cardService.updateCard(card);

    this.modalCardDescPreview.innerHTML = parseMarkdown(val);
    this.modalCardDescPreview.classList.remove('hidden');
    this.modalCardDescTextarea.classList.add('hidden');
    this.btnEditDesc.textContent = '編輯';
    this.btnEditDesc.className = 'btn btn-sm btn-tertiary';
    Toast.success('描述已更新');
  }

  /**
   * 開啟卡片詳情彈出視窗
   * @param {string} id - 卡片 ID
   */
  async openCardDetail(id) {
    this.activeCardId = id;
    await this.loadCardDetailToModal(id);

    // 觸發模組間聯動 (Checklist, Tags 等子元件)
    eventBus.emit('modal:opened', { cardId: id });

    this.modalOverlay.classList.remove('hidden');
    this.modalContent.classList.remove('hidden');
  }

  /**
   * 載入卡片資訊填充至 Modal
   */
  async loadCardDetailToModal(id) {
    const card = await cardService.getCard(id);
    if (!card) return;

    this.modalCardTitle.textContent = card.title;
    this.modalCardDescTextarea.value = card.description;
    this.modalCardDescPreview.innerHTML = parseMarkdown(card.description);
    
    // 重設描述編輯按鈕
    this.modalCardDescPreview.classList.remove('hidden');
    this.modalCardDescTextarea.classList.add('hidden');
    this.btnEditDesc.textContent = '編輯';
    this.btnEditDesc.className = 'btn btn-sm btn-tertiary';

    // 填充欄位選擇下拉選單
    const activeBoardId = boardService.getActiveBoardId();
    const columns = await columnService.getColumnsByBoard(activeBoardId);
    
    this.modalSelectColumn.innerHTML = '';
    columns.forEach(col => {
      const option = document.createElement('option');
      option.value = col.id;
      option.textContent = col.name;
      if (col.id === card.columnId) option.selected = true;
      this.modalSelectColumn.appendChild(option);
    });

    // 優先權與到期日
    this.modalSelectPriority.value = card.priority;
    this.modalInputDueDate.value = card.dueDate || '';
  }

  /**
   * 關閉 Modal
   */
  async closeModal() {
    if (this.isClosingModal) return;
    this.isClosingModal = true;
    try {
      // 檢查如果在描述編輯模式，自動保存
      if (!this.modalCardDescTextarea.classList.contains('hidden')) {
        await this.saveDescription();
      }
      this.modalOverlay.classList.add('hidden');
      this.modalContent.classList.add('hidden');
      this.activeCardId = null;
      eventBus.emit('modal:closed');
    } catch (err) {
      Toast.error(err.message || '關閉卡片視窗時儲存失敗');
    } finally {
      this.isClosingModal = false;
    }
  }

  /**
   * 外部呼叫建立卡片 API
   */
  async createCard(columnId, title) {
    await cardService.createCard(columnId, title);
    Toast.success('卡片建立成功');
  }

  /**
   * 渲染特定欄位底下的所有卡片
   */
  async renderCardsForColumn(columnId) {
    try {
      const cardsListEl = document.getElementById(`cards-list-${columnId}`);
      const countBadgeEl = document.getElementById(`count-${columnId}`);
      if (!cardsListEl) return;

      const renderVersion = (this.columnRenderVersions.get(columnId) || 0) + 1;
      this.columnRenderVersions.set(columnId, renderVersion);

      const cards = await cardService.getCardsByColumn(columnId);
      if (this.columnRenderVersions.get(columnId) !== renderVersion) return;

      if (countBadgeEl) {
        countBadgeEl.textContent = cards.length;
      }

      if (cards.length === 0) {
        const emptyNode = document.createElement('div');
        emptyNode.className = 'cards-empty text-muted';
        emptyNode.style.cssText = 'text-align:center; padding: 10px; font-size:12px; pointer-events: none;';
        emptyNode.textContent = '無任務';
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
        cardsListEl.replaceChildren(emptyNode);
        return;
      }

      const fragment = document.createDocumentFragment();
      for (const card of cards) {
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;

        const cardNode = document.createElement('div');
        cardNode.className = 'kanban-card';
        cardNode.draggable = true;
        cardNode.dataset.cardId = card.id;

        let isOverdue = false;
        let formattedDate = '';
        if (card.dueDate) {
          const today = new Date().toISOString().split('T')[0];
          isOverdue = card.dueDate < today && card.priority !== '已完成';
          const dateObj = new Date(card.dueDate);
          formattedDate = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
        }

        const checklists = await kanbanDB.queryByIndex('checklists', 'cardId', card.id);
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
        const totalCheck = checklists.length;
        const checkedCount = checklists.filter(item => item.checked).length;
        const hasChecklist = totalCheck > 0;

        const cardTags = await kanbanDB.queryByIndex('cardTags', 'cardId', card.id);
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
        let tagDotsHtml = '';
        for (const ct of cardTags) {
          const tag = await kanbanDB.get('tags', ct.tagId);
          if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
          if (tag) {
            tagDotsHtml += `<span class="card-tag" style="background-color: ${normalizeColor(tag.color)};" title="${escapeHtml(tag.name)}"></span>`;
          }
        }

        const priority = ['高', '中', '低', '無'].includes(card.priority) ? card.priority : '無';
        cardNode.innerHTML = `
          <div class="card-title">${escapeHtml(card.title)}</div>
          <div class="card-meta">
            <div class="card-left-meta">
              <span class="card-badge badge-priority-${priority}">${priority}</span>
              ${card.dueDate ? `
                <span class="card-duedate ${isOverdue ? 'overdue' : ''}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>${formattedDate}</span>
                </span>
              ` : ''}
              ${hasChecklist ? `
                <span class="card-checklist-summary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>${checkedCount}/${totalCheck}</span>
                </span>
              ` : ''}
            </div>
            <div class="card-tags">
              ${tagDotsHtml}
            </div>
          </div>
        `;

        fragment.appendChild(cardNode);
      }

      if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
      cardsListEl.replaceChildren(fragment);
    } catch (err) {
      console.error('[CardComponent] renderCardsForColumn failed:', err);
      Toast.error('卡片渲染失敗，請檢查主控台錯誤。');
    }
  }
}


  /* ===== src/features/column/column.component.js ===== */

/**
 * 欄位視圖元件 (Column Component)
 */
class ColumnComponent {
  /**
   * @param {Object} cardRenderer - 用於渲染卡片的渲染器實例
   */
  constructor(cardRenderer) {
    this.containerEl = document.getElementById('board-columns-container');
    this.cardRenderer = cardRenderer;
    this.activeBoardId = null;
    
    this.draggedColumnEl = null;

    this.initEvents();
  }

  /**
   * 初始化事件訂閱
   */
  initEvents() {
    eventBus.on('board:changed', (boardId) => {
      this.activeBoardId = boardId;
      this.render();
    });

    eventBus.on('column:updated', () => {
      this.render();
    });

    // 委派事件：新增/刪除/更名欄位
    this.containerEl.addEventListener('click', async (e) => {
      // 1. 刪除欄位按鈕
      const deleteBtn = e.target.closest('.btn-delete-column');
      if (deleteBtn) {
        const columnId = deleteBtn.dataset.columnId;
        const col = await columnService.getColumn(columnId);
        if (!col) return;

        const confirm = await Dialog.confirm(
          '刪除狀態欄位',
          `您確定要刪除欄位「${col.name}」嗎？此動作將會一併永久刪除底下的所有卡片！`,
          'danger'
        );

        if (confirm) {
          await columnService.deleteColumn(columnId);
          Toast.success(`欄位「${col.name}」已刪除`);
        }
        return;
      }

      // 2. 顯示/隱藏新增卡片快捷輸入框
      const addCardTriggerBtn = e.target.closest('.btn-add-card-trigger');
      if (addCardTriggerBtn) {
        const columnId = addCardTriggerBtn.dataset.columnId;
        const formEl = document.getElementById(`quick-creator-${columnId}`);
        const triggerEl = document.getElementById(`btn-trigger-${columnId}`);
        if (formEl && triggerEl) {
          formEl.classList.remove('hidden');
          triggerEl.classList.add('hidden');
          formEl.querySelector('textarea').focus();
        }
        return;
      }


      const cancelAddCardBtn = e.target.closest('.btn-cancel-quick-card');
      if (cancelAddCardBtn) {
        const columnId = cancelAddCardBtn.dataset.columnId;
        this.hideQuickCardCreator(columnId);
        return;
      }
    });

    // 委派雙擊欄位標題進行更名
    this.containerEl.addEventListener('dblclick', (e) => {
      const titleEl = e.target.closest('.column-title');
      if (!titleEl) return;

      titleEl.contentEditable = 'true';
      titleEl.focus();

      // 選取所有文字
      const range = document.createRange();
      range.selectNodeContents(titleEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      const onKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          titleEl.blur();
        }
        if (event.key === 'Escape') {
          titleEl.contentEditable = 'false';
          this.render(); // 重新渲染以還原
        }
      };

      const onBlur = async () => {
        titleEl.contentEditable = 'false';
        titleEl.removeEventListener('keydown', onKeyDown);
        titleEl.removeEventListener('blur', onBlur);

        const newName = titleEl.textContent.trim();
        const columnId = titleEl.dataset.columnId;

        if (!newName) {
          Toast.error('欄位名稱不可為空白！');
          this.render();
          return;
        }

        const col = await columnService.getColumn(columnId);
        if (col && col.name !== newName) {
          try {
            await columnService.renameColumn(columnId, newName);
            Toast.success('欄位名稱已修改');
          } catch (err) {
            Toast.error(err.message || '欄位名稱修改失敗');
            this.render();
          }
        }
      };

      titleEl.addEventListener('keydown', onKeyDown);
      titleEl.addEventListener('blur', onBlur);
    });

    // 綁定拖曳欄位 (Drag & Drop) 事件
    this.setupColumnDragAndDrop();
  }

  /**
   * 隱藏新增卡片輸入框
   */
  hideQuickCardCreator(columnId) {
    const formEl = document.getElementById(`quick-creator-${columnId}`);
    const triggerEl = document.getElementById(`btn-trigger-${columnId}`);
    if (formEl && triggerEl) {
      formEl.classList.add('hidden');
      triggerEl.classList.remove('hidden');
      const field = formEl.querySelector('textarea, input');
      if (field) field.value = '';
    }
  }

  /**
   * 設置欄位之間的拖拽重新排序
   */
  setupColumnDragAndDrop() {
    this.containerEl.addEventListener('dragstart', (e) => {
      const columnEl = e.target.closest('.kanban-column');
      // 確保拖曳的是欄位 header，且不是卡片拖曳
      if (columnEl && e.target.closest('.column-header')) {
        this.draggedColumnEl = columnEl;
        columnEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', columnEl.dataset.columnId);
      }
    });

    this.containerEl.addEventListener('dragover', (e) => {
      if (!this.draggedColumnEl) return;
      e.preventDefault();
      
      const targetColumn = e.target.closest('.kanban-column');
      if (targetColumn && targetColumn !== this.draggedColumnEl) {
        const rect = targetColumn.getBoundingClientRect();
        const midpoint = rect.left + rect.width / 2;
        
        // 根據滑鼠在目標欄位左側或右側，決定插入位置
        if (e.clientX < midpoint) {
          this.containerEl.insertBefore(this.draggedColumnEl, targetColumn);
        } else {
          this.containerEl.insertBefore(this.draggedColumnEl, targetColumn.nextSibling);
        }
      }
    });

    this.containerEl.addEventListener('dragend', async (e) => {
      const columnEl = e.target.closest('.kanban-column');
      if (columnEl && this.draggedColumnEl) {
        columnEl.classList.remove('dragging');
        this.draggedColumnEl = null;

        // 當拖放結束，從 DOM 結構獲取最新順序並更新資料庫
        await this.saveDOMColumnOrder();
      }
    });
  }

  /**
   * 將目前的 DOM 欄位順序儲存至資料庫
   */
  async saveDOMColumnOrder() {
    const colNodes = this.containerEl.querySelectorAll('.kanban-column');
    const updatedColumns = [];

    for (let i = 0; i < colNodes.length; i++) {
      const columnId = colNodes[i].dataset.columnId;
      const col = await columnService.getColumn(columnId);
      if (col) {
        col.order = i;
        updatedColumns.push(col);
      }
    }

    if (updatedColumns.length > 0) {
      await columnService.updateColumnOrders(updatedColumns);
    }
  }

  /**
   * 渲染看板內的所有欄位與新增欄位按鈕
   */
  async render() {
    this.activeBoardId = boardService.getActiveBoardId();
    if (!this.activeBoardId) {
      this.containerEl.innerHTML = `
        <div class="empty-state" style="text-align: center; width: 100%; padding: 60px 20px;">
          <h2 class="text-muted">請先在左側建立或選擇一個看板</h2>
        </div>
      `;
      return;
    }

    const columns = await columnService.getColumnsByBoard(this.activeBoardId);
    this.containerEl.innerHTML = '';

    // 1. 繪製所有欄位
    for (const col of columns) {
      const columnNode = document.createElement('div');
      columnNode.className = 'kanban-column glass-panel';
      columnNode.dataset.columnId = col.id;
      
      columnNode.innerHTML = `
        <div class="column-header">
          <div class="column-title-container">
            <span class="column-title" data-column-id="${col.id}">${escapeHtml(col.name)}</span>
            <span class="column-card-count" id="count-${col.id}">0</span>
          </div>
          <button class="btn-delete-column" data-column-id="${col.id}" aria-label="刪除欄位">
            <i data-lucide="more-horizontal" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
        
        <!-- 卡片放置容器 -->
        <div class="cards-list" data-column-id="${col.id}" id="cards-list-${col.id}">
          <!-- 卡片內容將動態渲染 -->
        </div>

        <!-- 卡片新增控制器 -->
        <div class="column-footer" style="margin-top: 10px;">
          <button class="btn btn-add-card-trigger" id="btn-trigger-${col.id}" data-column-id="${col.id}">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            <span>新增卡片</span>
          </button>
          
          <div class="quick-card-creator hidden" id="quick-creator-${col.id}">
            <textarea class="quick-card-input" id="input-title-${col.id}" placeholder="輸入卡片標題..." rows="2"></textarea>
            <div class="quick-card-actions">
              <button class="btn btn-sm btn-secondary btn-cancel-quick-card" data-column-id="${col.id}">取消</button>
              <button class="btn btn-sm btn-primary btn-save-quick-card" data-column-id="${col.id}">新增</button>
            </div>
          </div>
        </div>
      `;

      this.containerEl.appendChild(columnNode);

      // 綁定保存卡片按鈕事件
      const saveBtn = columnNode.querySelector('.btn-save-quick-card');
      const inputEl = columnNode.querySelector('.quick-card-input');
      
      const saveAction = async () => {
        const title = inputEl.value.trim();
        if (!title) {
          Toast.error('卡片標題不可為空！');
          return;
        }
        if (this.cardRenderer && this.cardRenderer.createCard) {
          try {
            await this.cardRenderer.createCard(col.id, title);
            this.hideQuickCardCreator(col.id);
          } catch (err) {
            Toast.error(err.message || '卡片建立失敗');
          }
        }
      };

      saveBtn.addEventListener('click', saveAction);
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          saveAction();
        }
        if (e.key === 'Escape') {
          this.hideQuickCardCreator(col.id);
        }
      });

      // 呼叫卡片渲染器載入卡片
      if (this.cardRenderer && this.cardRenderer.renderCardsForColumn) {
        this.cardRenderer.renderCardsForColumn(col.id);
      }
    }

    // 2. 繪製「+ 新增欄位」按鈕
    const addColNode = document.createElement('div');
    addColNode.style.display = 'flex';
    addColNode.style.flexShrink = '0';
    addColNode.innerHTML = `
      <button class="btn btn-add-column-trigger" id="btn-add-column-trigger">
        <i data-lucide="plus"></i>
        <span>新增欄位</span>
      </button>
      <div class="column-creator hidden" id="column-creator-form">
        <input type="text" id="input-new-column-name" placeholder="輸入欄位名稱..." autocomplete="off">
        <div class="quick-card-actions">
          <button class="btn btn-sm btn-secondary" id="btn-cancel-column">取消</button>
          <button class="btn btn-sm btn-primary" id="btn-save-column">確定</button>
        </div>
      </div>
    `;
    this.containerEl.appendChild(addColNode);

    // 綁定「+ 新增欄位」點擊與表單事件
    const addTrigger = addColNode.querySelector('#btn-add-column-trigger');
    const form = addColNode.querySelector('#column-creator-form');
    const cancel = addColNode.querySelector('#btn-cancel-column');
    const save = addColNode.querySelector('#btn-save-column');
    const input = addColNode.querySelector('#input-new-column-name');

    addTrigger.addEventListener('click', () => {
      addTrigger.classList.add('hidden');
      form.classList.remove('hidden');
      input.focus();
    });

    const hideForm = () => {
      form.classList.add('hidden');
      addTrigger.classList.remove('hidden');
      input.value = '';
    };

    cancel.addEventListener('click', hideForm);

    const saveCol = async () => {
      const name = input.value.trim();
      if (!name) {
        Toast.error('欄位名稱不可空白！');
        return;
      }
      try {
        const column = await columnService.createColumn(this.activeBoardId, name);
        Toast.success(`欄位「${column.name}」已建立`);
        hideForm();
      } catch (err) {
        Toast.error(err.message || '建立欄位失敗');
      }
    };

    save.addEventListener('click', saveCol);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveCol();
      if (e.key === 'Escape') hideForm();
    });

    // 重新繪製 Lucide 圖標
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}


  /* ===== src/features/checklist/checklist.component.js ===== */

/**
 * 待辦清單元件 (Checklist Component)
 */
class ChecklistComponent {
  constructor() {
    this.containerEl = document.getElementById('modal-checklist-items');
    this.inputNewItem = document.getElementById('input-new-checklist-item');
    this.btnAddItem = document.getElementById('btn-add-checklist-item');
    this.progressBar = document.getElementById('checklist-progress-bar');
    this.progressText = document.getElementById('checklist-progress-text');

    this.cardId = null;
    this.draggedItemId = null;

    this.initEvents();
  }

  /**
   * 初始化事件與訂閱
   */
  initEvents() {
    // 監聽 Modal 開啟，載入該卡片的 Checklist
    eventBus.on('modal:opened', (data) => {
      this.cardId = data.cardId;
      this.render();
    });

    eventBus.on('modal:closed', () => {
      this.cardId = null;
      this.containerEl.innerHTML = '';
      this.progressBar.style.width = '0%';
      this.progressText.textContent = '0/0';
    });

    // 新增項目按鈕
    this.btnAddItem.addEventListener('click', () => this.handleAddItem());
    this.inputNewItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleAddItem();
      }
    });

    // 事件委派：勾選、刪除、雙擊更名
    this.containerEl.addEventListener('click', async (e) => {
      const itemNode = e.target.closest('.checklist-item');
      if (!itemNode) return;

      const itemId = itemNode.dataset.itemId;

      // 1. 勾選核取方塊
      if (e.target.type === 'checkbox') {
        await checklistService.toggleChecklistItem(itemId);
        this.render();
        return;
      }

      // 2. 刪除按鈕
      const deleteBtn = e.target.closest('.btn-delete-checklist-item');
      if (deleteBtn) {
        await checklistService.deleteChecklistItem(itemId);
        this.render();
        return;
      }
    });

    // 委派雙擊名稱更名
    this.containerEl.addEventListener('dblclick', (e) => {
      const titleEl = e.target.closest('.checklist-item-title');
      if (!titleEl) return;

      const itemNode = titleEl.closest('.checklist-item');
      const itemId = itemNode.dataset.itemId;

      titleEl.contentEditable = 'true';
      titleEl.focus();

      const onKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          titleEl.blur();
        }
        if (event.key === 'Escape') {
          titleEl.contentEditable = 'false';
          this.render();
        }
      };

      const onBlur = async () => {
        titleEl.contentEditable = 'false';
        titleEl.removeEventListener('keydown', onKeyDown);
        titleEl.removeEventListener('blur', onBlur);

        const newName = titleEl.textContent.trim();
        if (!newName) {
          Toast.error('待辦內容不可空白！');
          this.render();
          return;
        }

        try {
          await checklistService.renameChecklistItem(itemId, newName);
          this.render();
        } catch (err) {
          Toast.error(err.message || '待辦內容修改失敗');
          this.render();
        }
      };

      titleEl.addEventListener('keydown', onKeyDown);
      titleEl.addEventListener('blur', onBlur);
    });

    // 垂直拖曳排序
    this.setupVerticalDragAndDrop();
  }

  /**
   * 垂直拖曳事件設定
   */
  setupVerticalDragAndDrop() {
    this.containerEl.addEventListener('dragstart', (e) => {
      const itemEl = e.target.closest('.checklist-item');
      if (itemEl && e.target.closest('.checklist-item-drag-handle')) {
        this.draggedItemId = itemEl.dataset.itemId;
        itemEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.draggedItemId);
      }
    });

    this.containerEl.addEventListener('dragover', (e) => {
      if (!this.draggedItemId) return;
      e.preventDefault();

      const targetItem = e.target.closest('.checklist-item');
      const container = this.containerEl;
      
      if (targetItem && targetItem !== container.querySelector('.checklist-item.dragging')) {
        const rect = targetItem.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        const draggedEl = container.querySelector(`.checklist-item[data-item-id="${this.draggedItemId}"]`);
        if (draggedEl) {
          if (e.clientY < midpoint) {
            container.insertBefore(draggedEl, targetItem);
          } else {
            container.insertBefore(draggedEl, targetItem.nextSibling);
          }
        }
      }
    });

    this.containerEl.addEventListener('dragend', async (e) => {
      const itemEl = e.target.closest('.checklist-item');
      if (itemEl && this.draggedItemId) {
        itemEl.classList.remove('dragging');
        
        // 儲存新順序
        await this.saveDOMChecklistOrder();
        this.draggedItemId = null;
      }
    });
  }

  /**
   * 將 DOM 排列順序同步寫入資料庫
   */
  async saveDOMChecklistOrder() {
    const itemNodes = this.containerEl.querySelectorAll('.checklist-item');
    const updatedItems = [];

    for (let i = 0; i < itemNodes.length; i++) {
      const itemId = itemNodes[i].dataset.itemId;
      const item = await checklistService.getChecklistByCard(this.cardId).then(items => items.find(x => x.id === itemId));
      if (item) {
        item.order = i;
        updatedItems.push(item);
      }
    }

    if (updatedItems.length > 0) {
      await checklistService.updateChecklistOrders(this.cardId, updatedItems);
    }
  }

  /**
   * 新增待辦項目
   */
  async handleAddItem() {
    if (!this.cardId) return;
    const title = this.inputNewItem.value.trim();
    if (!title) {
      Toast.error('待辦內容不可為空！');
      return;
    }

    try {
      await checklistService.createChecklistItem(this.cardId, title);
      this.inputNewItem.value = '';
      this.render();
    } catch (err) {
      Toast.error(err.message || '新增待辦失敗');
    }
  }

  /**
   * 渲染待辦列表與進度條
   */
  async render() {
    if (!this.cardId) return;

    const items = await checklistService.getChecklistByCard(this.cardId);
    this.containerEl.innerHTML = '';

    // 1. 計算進度
    const total = items.length;
    const checked = items.filter(x => x.checked).length;
    const progress = total === 0 ? 0 : Math.round((checked / total) * 100);

    this.progressBar.style.width = `${progress}%`;
    this.progressText.textContent = `${checked}/${total}`;

    // 2. 渲染項目
    items.forEach(item => {
      const itemNode = document.createElement('div');
      itemNode.className = `checklist-item ${item.checked ? 'checked' : ''}`;
      itemNode.dataset.itemId = item.id;
      
      itemNode.innerHTML = `
        <span class="checklist-item-drag-handle" draggable="true">
          <i data-lucide="grip-vertical" style="width: 14px; height: 14px;"></i>
        </span>
        <input type="checkbox" ${item.checked ? 'checked' : ''}>
        <span class="checklist-item-title">${escapeHtml(item.title)}</span>
        <button class="btn-delete-checklist-item" aria-label="刪除待辦">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      `;

      this.containerEl.appendChild(itemNode);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}


  /* ===== src/features/tag/tag.component.js ===== */

/**
 * 標籤視圖與管理元件 (Tag Component)
 */
class TagComponent {
  constructor() {
    // Card Modal Tags DOM
    this.modalCardTagsContainer = document.getElementById('modal-card-tags');
    this.btnManageTags = document.getElementById('btn-manage-tags');
    
    // Tag Manager Sub-Modal DOM
    this.managerOverlay = document.getElementById('tag-manager-modal');
    this.closeManagerBtn = document.getElementById('btn-close-tag-manager');
    this.inputNewTagName = document.getElementById('input-new-tag-name');
    this.inputNewTagColor = document.getElementById('input-new-tag-color');
    this.btnCreateTag = document.getElementById('btn-create-tag');
    this.tagManagerList = document.getElementById('tag-manager-list');

    // Dashboard Filter Tags DOM
    this.filterTagsList = document.getElementById('filter-tags-list');

    this.cardId = null;

    this.initEvents();
  }

  /**
   * 初始化事件與訂閱
   */
  initEvents() {
    // 訂閱 Modal 開啟/關閉
    eventBus.on('modal:opened', (data) => {
      this.cardId = data.cardId;
      this.render();
    });

    eventBus.on('modal:closed', () => {
      this.cardId = null;
      this.modalCardTagsContainer.innerHTML = '';
    });

    // 訂閱標籤清單更新
    eventBus.on('tag:list-updated', () => {
      this.render();
      this.renderFilterTagsList();
    });

    // 打開/關閉標籤管理介面
    this.btnManageTags.addEventListener('click', () => {
      this.managerOverlay.classList.remove('hidden');
      this.renderTagManagerList();
    });
    this.closeManagerBtn.addEventListener('click', () => {
      this.managerOverlay.classList.add('hidden');
      this.inputNewTagName.value = '';
    });

    // 建立新標籤
    this.btnCreateTag.addEventListener('click', () => this.handleCreateTag());
    this.inputNewTagName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleCreateTag();
    });

    // 管理清單中的刪除事件 (事件委派)
    this.tagManagerList.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('.btn-delete-tag');
      if (deleteBtn) {
        const tagId = deleteBtn.dataset.tagId;
        const tag = await tagService.getTags().then(tags => tags.find(t => t.id === tagId));
        if (tag) {
          await tagService.deleteTag(tagId);
          Toast.success(`標籤「${tag.name}」已從系統刪除`);
          this.renderTagManagerList();
        }
      }
    });

    // 卡片詳情中的標籤選取/取消選取 (事件委派)
    this.modalCardTagsContainer.addEventListener('click', async (e) => {
      const tagBadge = e.target.closest('.modal-tag-badge');
      if (!tagBadge || !this.cardId) return;

      const tagId = tagBadge.dataset.tagId;
      const isInactive = tagBadge.classList.contains('inactive');

      if (isInactive) {
        // 新增關聯
        await tagService.addTagToCard(this.cardId, tagId);
      } else {
        // 移出關聯
        await tagService.removeTagFromCard(this.cardId, tagId);
      }
      this.render();
    });
  }

  /**
   * 建立標籤
   */
  async handleCreateTag() {
    const name = this.inputNewTagName.value.trim();
    const color = this.inputNewTagColor.value;

    if (!name) {
      Toast.error('標籤名稱不可空白！');
      return;
    }

    const tags = await tagService.getTags();
    if (tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      Toast.error('標籤名稱已存在！');
      return;
    }

    try {
      const tag = await tagService.createTag(name, color);
      this.inputNewTagName.value = '';
      Toast.success(`標籤「${tag.name}」已建立`);
      this.renderTagManagerList();
    } catch (err) {
      Toast.error(err.message || '建立標籤失敗');
    }
  }

  /**
   * 渲染全域標籤管理清單
   */
  async renderTagManagerList() {
    const tags = await tagService.getTags();
    this.tagManagerList.innerHTML = '';

    if (tags.length === 0) {
      this.tagManagerList.innerHTML = `<div class="text-muted" style="padding:10px; font-size:12px; text-align:center;">無系統標籤</div>`;
      return;
    }

    tags.forEach(tag => {
      const itemNode = document.createElement('div');
      itemNode.className = 'tag-manager-item';
      const color = normalizeColor(tag.color);
      itemNode.innerHTML = `
        <span class="tag-pill" style="background-color: ${color}1c; color: ${color}; border: 1px solid ${color}50;">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${color}; margin-right:4px;"></span>
          ${escapeHtml(tag.name)}
        </span>
        <button class="btn-delete-tag" data-tag-id="${tag.id}" aria-label="刪除標籤">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      `;
      this.tagManagerList.appendChild(itemNode);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * 渲染篩選選單中的標籤核取方塊
   */
  async renderFilterTagsList() {
    if (!this.filterTagsList) return;
    const tags = await tagService.getTags();
    this.filterTagsList.innerHTML = '';

    if (tags.length === 0) {
      this.filterTagsList.innerHTML = `<div class="text-muted" style="font-size:12px; font-style:italic;">目前無標籤</div>`;
      return;
    }

    tags.forEach(tag => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      const color = normalizeColor(tag.color);
      label.innerHTML = `
        <input type="checkbox" name="filter-tag" value="${tag.id}">
        <span class="custom-checkbox" style="--tag-color: ${color}">
          ${escapeHtml(tag.name)}
        </span>
      `;

      // 支援動態樣式
      const cbSpan = label.querySelector('.custom-checkbox');
      label.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          cbSpan.style.backgroundColor = color;
          cbSpan.style.color = '#fff';
          cbSpan.style.borderColor = color;
        } else {
          cbSpan.style.backgroundColor = '';
          cbSpan.style.color = '';
          cbSpan.style.borderColor = '';
        }
      });

      this.filterTagsList.appendChild(label);
    });
  }

  /**
   * 渲染卡片 Modal 內部的標籤狀態列 (顯示所有標籤，啟用的亮起，未啟用的反灰)
   */
  async render() {
    if (!this.cardId) return;

    const allTags = await tagService.getTags();
    const activeTags = await tagService.getTagsForCard(this.cardId);
    
    this.modalCardTagsContainer.innerHTML = '';

    if (allTags.length === 0) {
      this.modalCardTagsContainer.innerHTML = `<span class="text-muted" style="font-size:12px; font-style:italic;">點擊下方按鈕以建立標籤</span>`;
      return;
    }

    const activeIds = new Set(activeTags.map(t => t.id));

    allTags.forEach(tag => {
      const isActive = activeIds.has(tag.id);
      const badge = document.createElement('span');
      badge.className = `modal-tag-badge ${isActive ? '' : 'inactive'}`;
      badge.dataset.tagId = tag.id;
      const color = normalizeColor(tag.color);
      
      if (isActive) {
        badge.style.backgroundColor = `${color}1c`;
        badge.style.color = color;
        badge.style.borderColor = `${color}50`;
        badge.innerHTML = `
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${color};"></span>
          <span>${escapeHtml(tag.name)}</span>
        `;
      } else {
        badge.innerHTML = `
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:var(--text-disabled);"></span>
          <span>${escapeHtml(tag.name)}</span>
        `;
      }

      this.modalCardTagsContainer.appendChild(badge);
    });
  }
}


  /* ===== src/app.js ===== */

const THEME_STORAGE_KEY = 'flowdeck:theme';
const THEMES = {
  dark: {
    next: 'light',
    label: '淺色模式',
    icon: 'sun',
    ariaLabel: '切換為淺色模式'
  },
  light: {
    next: 'dark',
    label: '深色模式',
    icon: 'moon',
    ariaLabel: '切換為深色模式'
  }
};

function getStoredTheme() {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme, toggleButton = document.getElementById('btn-theme-toggle')) {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = safeTheme;

  if (!toggleButton) return;

  const themeMeta = THEMES[safeTheme];
  const labelEl = toggleButton.querySelector('span');
  const iconEl = toggleButton.querySelector('.theme-toggle-icon');

  toggleButton.setAttribute('aria-label', themeMeta.ariaLabel);
  if (labelEl) labelEl.textContent = themeMeta.label;
  if (iconEl) iconEl.setAttribute('data-lucide', themeMeta.icon);

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initThemeToggle() {
  const toggleButton = document.getElementById('btn-theme-toggle');
  let currentTheme = getStoredTheme();
  applyTheme(currentTheme, toggleButton);

  if (!toggleButton) return;

  toggleButton.addEventListener('click', () => {
    currentTheme = THEMES[currentTheme].next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (err) {
      console.warn('[Flowdeck] 無法儲存主題偏好:', err);
    }
    applyTheme(currentTheme, toggleButton);
  });
}

/**
 * 應用程式引導與初始化 (Bootstrapper)
 */
async function bootstrap() {
  try {
    initThemeToggle();

    // 1. 初始化資料庫
    const isIndexedDBOk = await kanbanDB.init();
    if (!isIndexedDBOk) {
      Toast.warning('資料庫連線失敗，目前已自動切換至「記憶體暫存模式」，請記得定期備份資料！');
    }

    // 2. 檢查是否有看板資料，若無則建立預設看板
    let boards = await boardService.getBoards();
    
    if (boards.length === 0) {
      // 檢查是否有 LocalStorage 的自動備份
      if (backupService.hasAutoBackup()) {
        const confirmRestore = await Dialog.confirm(
          '還原資料',
          '偵測到您在瀏覽器中有先前的看板自動備份，是否自動還原備份資料？',
          'info'
        );
        if (confirmRestore) {
          const success = await backupService.restoreFromAutoBackup();
          if (success) {
            boards = await boardService.getBoards();
          }
        }
      }
      
      // 若仍無看板，建立預設的繁體中文「我的工作看板」
      if (boards.length === 0) {
        await backupService.seedInitialState();
        boards = await boardService.getBoards();
      }
    }

    // 3. 設定預設開啟的看板 ID
    const activeId = boardService.getActiveBoardId();
    if (!activeId || !boards.some(b => b.id === activeId)) {
      boardService.setActiveBoardId(boards[0].id);
    } else {
      // 確保將 active board 的狀態載入與廣播
      boardService.setActiveBoardId(activeId);
    }

    // 4. 初始化各視圖元件
    const boardComponent = new BoardComponent();
    const cardComponent = new CardComponent();
    const columnComponent = new ColumnComponent(cardComponent);
    const checklistComponent = new ChecklistComponent();
    const tagComponent = new TagComponent();

    // 5. 綁定側邊欄備份還原按鈕
    const btnExport = document.getElementById('btn-export-data');
    const btnImport = document.getElementById('btn-import-data');
    const btnResetInitial = document.getElementById('btn-reset-initial-data');
    const fileImportInput = document.getElementById('file-import');

    if (btnExport) {
      btnExport.addEventListener('click', async () => {
        await backupService.exportData();
      });
    }

    if (btnImport && fileImportInput) {
      btnImport.addEventListener('click', () => {
        fileImportInput.click();
      });

      fileImportInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          const ok = await backupService.importData(file);
          if (ok) {
            // 延遲重整以確保使用者能看到成功 Toast
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
        // 重設輸入框以支援選取同一個檔案
        fileImportInput.value = '';
      });
    }

    if (btnResetInitial) {
      btnResetInitial.addEventListener('click', async () => {
        const confirmReset = await Dialog.confirm(
          '還原初始設定',
          '您確定要還原初始設定嗎？目前所有看板、欄位、卡片、標籤與待辦清單都會被刪除，且自動備份會被覆寫為初始狀態。',
          'danger'
        );

        if (!confirmReset) return;

        const ok = await backupService.resetToInitialState();
        if (ok) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }

    // 6. 初始渲染視圖
    await boardComponent.render();
    await columnComponent.render();
    await tagComponent.renderFilterTagsList();

    // 7. 初始化模糊搜尋與篩選狀態
    searchService.clearAllFilters();

    // 8. 載入並初始化系統 Lucide 圖標
    if (window.lucide) {
      window.lucide.createIcons();
    }

    console.log('[Flowdeck] 應用程式引導成功，語系：繁體中文。');
  } catch (err) {
    console.error('[Flowdeck] 啟動失敗:', err);
    Toast.error('Flowdeck 啟動失敗，請檢查主控台報錯。');
  }
}

// 當 DOM 載入完畢後啟動
document.addEventListener('DOMContentLoaded', bootstrap);

}());
