# 程式碼編寫規範 (Coding Convention)

為確保專案程式碼的可讀性、可維護性，本專案必須嚴格遵守以下編寫規範。

## 1. 命名規範 (Naming Conventions)

### 1.1 JavaScript 命名
- **類別 (Classes)**：使用 **PascalCase**。
  - 例：`class KanbanDB {}`, `class BoardService {}`
- **變數與函式 (Variables & Functions)**：使用 **camelCase**。
  - 例：`const currentBoardId = 'abc';`, `function renderCardList() {}`
- **常數 (Constants)**：使用 **UPPER_SNAKE_CASE**。
  - 例：`const DEFAULT_PRIORITY = '無';`, `const DB_VERSION = 1;`
- **DOM 元素變數**：在變數名稱後方加上 `El` 或 `Node` 字尾，以便與一般變數區分。
  - 例：`const submitBtnEl = document.getElementById('submit-btn');`

### 1.2 檔案命名
- 業務功能檔案使用 **點分隔命名法 (dot-convention)**，均使用小寫字母。
  - 例：`board.service.js`, `card.component.js`
- 核心與全域工具類別使用 **PascalCase** 或 **camelCase**。
  - 例：`KanbanDB.js`, `toast.js`

---

## 2. ES Modules 與程式碼組織 (Modular Guidelines)
- 嚴禁使用全域變數（即綁定在 `window` 或未宣告的變數）。
- 模組之間必須使用 ES6 `import` / `export` 進行依賴管理。
- 每個 JS 檔案開頭應有明確的 import 宣告，並依照：
  1. 核心底層 (`core/`)
  2. 業務服務 (`features/*/service`)
  3. UI 元件 (`ui/`)
  的順序分組排列。

---

## 3. JSDoc 規範 (Documentation Standards)
所有類別、公開方法及複雜函式，均必須撰寫標準的 JSDoc 註解，標明參數類型與返回值。

### 範例：
```javascript
/**
 * 更新指定卡片的所在欄位與排序。
 * 
 * @param {string} cardId - 卡片唯一的 UUID。
 * @param {string} targetColumnId - 目標欄位的 UUID。
 * @param {number} newOrder - 卡片在目標欄位中的新排序索引。
 * @returns {Promise<boolean>} 是否更新成功。
 */
async function updateCardPosition(cardId, targetColumnId, newOrder) {
  // 實作邏輯...
}
```

---

## 4. 異步處理與錯誤控制 (Async & Error Control)
- 一律使用 `async` / `await` 語法處理 IndexedDB 或 File I/O 的異步操作，避免 Callback Hell（回呼地獄）。
- `await` 表達式必須使用 `try...catch` 區塊進行包覆，並在 `catch` 中呼叫全域 `Toast` 通知使用者，確保系統不會無預警崩潰。
- 不得使用 `then()` 和 `catch()` 鏈式呼叫，保持程式碼結構扁平。
