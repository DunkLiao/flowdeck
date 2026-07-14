# 技術規格書 (Technical Specification)

本文件定義本專案的技術細節、底層架構選擇、資料安全方案與風險分析。

## 1. 技術堆疊 (Technology Stack)
- **前端核心**：標準 HTML5、CSS3 (Vanilla CSS)、JavaScript (ES6+, ES Modules)。
- **資料儲存**：瀏覽器原生 IndexedDB API，用作核心資料庫。
- **動畫與樣式**：CSS Keyframe Animations、CSS Transitions，背景磨砂採用 `backdrop-filter: blur()`。
- **無建置工具**：所有檔案均為靜態，可直接由瀏覽器讀取（使用 `src/flowdeck.bundle.js` standalone classic script 引入 JS 檔案）。

---

## 2. 核心技術方案設計 (Core Technical Solutions)

### 2.1 排序演算法 (Ordering Algorithm)
為了實作拖放排序（欄位與卡片），我們需要決定排序欄位 `order` 的更新策略。
- **策略選擇**：每次拖曳變更排序時，我們重新計算受影響欄位（或卡片）的整數索引值。
- **具體流程**：
  1. 監聽 `dragend` 事件後，獲取容器內所有子節點的全新 DOM 順序。
  2. 根據新的 DOM 順序，依序將每張卡片/欄位的 `order` 屬性更新為由 `0` 開始的整數索引（`0, 1, 2, ...`）。
  3. 將更新後的物件整批寫入 IndexedDB。
  4. 由於本地 IndexedDB 讀寫極快且資料庫結構簡單，此做法能有效避免浮點數精度遺失與極限插入問題，並保證資料庫與 DOM 視圖的絕對一致性。

### 2.2 輕量級 Markdown 解析器 (Lightweight Markdown Parser)
為了不引入第三方 Markdown 函式庫，我們在 `CardComponent` 中實作一個輕量級的正則表達式解析器：
```javascript
export function parseMarkdown(text) {
  if (!text) return '';
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
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // 換行 (Line breaks)
  html = html.replace(/\n/g, '<br>');
  
  return html;
}
```

### 2.3 拖拽實作 (Drag & Drop Implementation)
- 欄位與卡片元素均設定 `draggable="true"`。
- 透過 CSS class (如 `.dragging`) 改變正在拖動的元素外觀（降低不透明度）。
- 監聽 `dragstart`, `dragover`, `dragenter`, `dragleave`, `drop`, `dragend` 事件。
- 使用 `getBoundingClientRect()` 動態判斷滑鼠游標是在卡片上半部還是下半部，從而決定插入在目標卡片之前 (before) 還是之後 (after)。

---

## 3. 資料庫備份 Schema (Backup & Restore Schema)
匯出/匯入的 JSON 結構格式規範如下：
```json
{
  "version": 1,
  "exportedAt": "2026-07-13T15:00:00.000Z",
  "data": {
    "boards": [
      { "id": "uuid-1", "name": "專案看板 A", "createdAt": 1718000000000, "updatedAt": 1718000000000 }
    ],
    "columns": [
      { "id": "uuid-c1", "boardId": "uuid-1", "name": "待處理", "order": 0 }
    ],
    "cards": [
      {
        "id": "uuid-card1",
        "columnId": "uuid-c1",
        "title": "設計 UI 介面",
        "description": "使用 CSS Grid 實作玻璃擬態風格",
        "priority": "高",
        "dueDate": "2026-07-20",
        "createdAt": 1718000000000,
        "updatedAt": 1718000000000,
        "order": 0
      }
    ],
    "tags": [
      { "id": "uuid-tag1", "name": "設計", "color": "#ff4d4d" }
    ],
    "cardTags": [
      { "cardId": "uuid-card1", "tagId": "uuid-tag1" }
    ],
    "checklists": [
      { "id": "uuid-ch1", "cardId": "uuid-card1", "title": "繪製 Wireframe", "checked": true, "order": 0 }
    ]
  }
}
```

---

## 4. 風險分析與安全評估 (Security & Risk Analysis)

### 4.1 XSS 跨站腳本攻擊
- **風險**：卡片標題、描述、待辦項目輸入了惡意 HTML 標記，導致在渲染 Markdown 或文字時執行惡意 JS。
- **應對方案**：
  1. 所有非 Markdown 欄位（如卡片標題、標籤名稱）渲染時，一律使用 DOM 節點的 `textContent` 賦值，避免使用 `innerHTML`。
  2. Markdown 渲染解析前，預先將 `&`、`<`、`>` 替換為 HTML 安全字元實體（如 `&amp;`、`&lt;`、`&gt;`）。

### 4.2 IndexedDB 儲存空間上限與失效
- **風險**：瀏覽器快取被清理，或 IndexedDB 因為隱私模式 (Incognito) 無法寫入，導致資料遺失。
- **應對方案**：
  1. 系統啟動時先嘗試寫入一個暫存 key 以偵測 IndexedDB 可用性，若不可用，自動改為將資料暫存在 LocalStorage 或 Memory 中，並在頂部彈出警示 Toast 提示用戶。
  2. 每當有資料更新，同步在 LocalStorage 中存放最新的備份快照作為雙重保險。
## Standalone Runtime Update

正式使用者入口為專案根目錄的 `index.html`，可直接以 `file://` 開啟，不需要 Python、本機 HTTP server、Node.js、npm 或外部網路。

為了支援直接雙擊執行，`index.html` 載入 `src/flowdeck.bundle.js` classic script。原本的 `src/` feature-based ES Module 原始碼仍保留作為維護來源；若修改模組原始碼，必須同步更新 standalone bundle。

`index.html` 不得引用 Google Fonts、Lucide CDN 或其他外部資源。圖示由 standalone bundle 內建的本地 SVG renderer 產生，字型使用系統字型堆疊。
