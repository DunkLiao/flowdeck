# Flowdeck

Flowdeck 是一個可離線使用的本地端 Kanban 看板。它使用純 HTML、CSS、Vanilla JavaScript、IndexedDB 與 localStorage，不需要後端、不需要安裝套件，也不需要 Python 或 Node.js 才能正常使用。

## 快速開始

1. 開啟專案資料夾。
2. 直接雙擊 `index.html`。
3. 瀏覽器會以 `file://` 開啟 Flowdeck。

一般使用不需要：

- Python
- Node.js
- npm
- 本機 HTTP server
- 外部網路
- CDN

## 主要功能

- 看板、欄位、卡片的新增、編輯、刪除與切換。
- 卡片拖曳排序與跨欄位移動。
- 卡片描述、優先權、到期日、標籤與待辦清單。
- 搜尋與篩選。
- 深色 / 淺色模式。
- JSON 匯出與匯入。
- 自動備份與還原初始設定。

## 本地資料儲存

核心資料儲存在瀏覽器本機 IndexedDB 的 `KanbanDB`：

- `boards`
- `columns`
- `cards`
- `tags`
- `cardTags`
- `checklists`

輔助狀態儲存在 `localStorage`：

- `flowdeck:active-board-id`
- `KanbanDB_AutoBackup`
- `flowdeck:theme`

資料不會送到外部服務。

## 離線執行方式

正式入口是根目錄的 `index.html`：

```html
<script src="./src/flowdeck.bundle.js"></script>
```

`src/flowdeck.bundle.js` 是 standalone runtime，已整合原本 `src/` 下的應用模組與本地 SVG 圖示渲染器，因此可以直接從 `file://` 執行。

`index.html` 不載入 Google Fonts、Lucide CDN 或其他外部資源。字型使用系統字型，圖示由本地 SVG 產生。

## 開發結構

```text
flowdeck/
  index.html
  src/
    app.js
    flowdeck.bundle.js
    core/
    features/
    ui/
  docs/
  test/
```

- `index.html`：使用者入口。
- `src/flowdeck.bundle.js`：雙擊執行使用的 standalone runtime。
- `src/app.js` 與 `src/features/`：模組化原始碼。
- `docs/`：產品、技術、資料庫、測試與本地執行文件。
- `test/`：Node 靜態檢查與回歸測試。

如果修改 `src/` 下的模組原始碼，必須同步更新 `src/flowdeck.bundle.js`，否則雙擊 `index.html` 的實際行為不會包含最新修改。

## 測試與驗證

本專案沒有 package manager 與測試框架安裝需求，但可用本機 Node.js 執行靜態回歸測試：

```powershell
node test\*.mjs
node --check src\flowdeck.bundle.js
```

手動驗證請至少確認：

- 雙擊 `index.html` 可正常載入。
- 新增看板、欄位、卡片後重新整理仍保留資料。
- 卡片到期日可設定，關閉並重新開啟卡片後仍保留。
- 只修改到期日不會讓同一張卡片重複顯示。
- DevTools Network 不出現外部字型、外部圖示或 CDN 請求。

更多測試案例見 `docs/TestingStrategy.md`。

## 注意事項

一般 Chrome、Edge、Firefox 桌面瀏覽器可從 `file://` 使用 IndexedDB。若瀏覽器或企業安全政策封鎖 `file://` 的 IndexedDB，Flowdeck 會退回記憶體模式；當次操作仍可使用，但關閉或重新整理後資料可能無法保留。
