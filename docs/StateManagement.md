# 狀態管理說明書 (State Management)

本專案為無框架架構，狀態管理不採用 Redux 或 Pinia，而是實作一個簡單、高效的**發佈-訂閱模式 (Publish-Subscribe Pattern)**，利用原生瀏覽器的 `CustomEvent` 或自訂 `EventBus` 來維持元件間的狀態同步。

## 1. 單一資料源與狀態流程 (Single Source of Truth)
- **單一資料源**：所有的應用程式狀態（Boards, Columns, Cards 等）最終儲存在 IndexedDB (`KanbanDB`) 中。
- **記憶體狀態快取 (In-Memory Cache)**：
  - 各個 Service (如 `BoardService`) 可以維護一個本地變數（如 `activeBoardId`），用作快速讀取。
  - 當元件需要渲染時，一律向 Service 請求最新資料，Service 則向 IndexedDB 讀取。
- **更新流程**：
  1. 元件呼叫 Service 方法修改資料（如：`BoardService.renameBoard(...)`）。
  2. Service 完成 IndexedDB 的非同步寫入。
  3. Service 透過全域 `EventBus` 發布變更通知（如：`"board:updated"`）。
  4. 訂閱此通知的元件（如 `BoardComponent`）重新載入資料並更新 UI。

---

## 2. 核心 EventBus 實作
我們將在 `src/core/utils/EventBus.js` 實作一個極簡的事件匯流排：

```javascript
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
   * 取消訂閱。
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
   * @param {any} data - 附帶資料。
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();
```

---

## 3. 全域事件清單 (Global Events Registry)

為避免事件混亂，專案中限制只能發布與訂閱以下事件：

| 事件名稱 | 發佈者 | 訂閱者 | 觸發時機 |
| :--- | :--- | :--- | :--- |
| `board:changed` | `BoardService` | `App`, `ColumnComponent` | 使用者切換當前看板，需要完全重繪欄位與卡片 |
| `board:list-updated` | `BoardService` | `BoardComponent` (Sidebar) | 新增、重新命名或刪除看板，側邊欄清單需要重繪 |
| `column:updated` | `ColumnService` | `ColumnComponent` | 欄位新增、更名、刪除或排序變更，看板欄位區域重繪 |
| `card:updated` | `CardService` | `ColumnComponent`, `CardComponent` | 卡片新增、內容編輯、拖曳移欄、排序變更，卡片重繪 |
| `data:imported` | `BackupService` | `App` | 使用者成功匯入 JSON 備份檔，整頁重新載入 |
