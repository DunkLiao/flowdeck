# 本地端直接執行說明

## 1. 使用者啟動方式

Flowdeck 現在可以直接雙擊專案根目錄的 `index.html` 執行。

不需要：

- Python
- Node.js
- npm
- 本機 HTTP server
- 外部網路
- CDN

目前正式入口就是根目錄的 `index.html`，不需要額外批次檔。

## 2. 為什麼可以直接雙擊

瀏覽器用 `file://` 開啟網頁時，ES Modules 的跨檔 `import` 載入常會被限制。為了支援直接雙擊，正式入口改為：

```html
<script src="./src/flowdeck.bundle.js"></script>
```

`src/flowdeck.bundle.js` 是 standalone runtime，已把原本的應用模組與本地圖示渲染整合在同一個 classic script 中，因此不需要 HTTP server。

## 3. 資料儲存位置

主要業務資料存在瀏覽器本機 IndexedDB 的 `KanbanDB`：

- `boards`
- `columns`
- `cards`
- `tags`
- `cardTags`
- `checklists`

輔助狀態存在 `localStorage`：

- `flowdeck:active-board-id`：目前選中的看板 ID
- `KanbanDB_AutoBackup`：自動備份快照
- `flowdeck:theme`：深色 / 淺色模式偏好

資料不會送到外部服務。

## 4. 離線資源

`index.html` 不再載入 Google Fonts 或 Lucide CDN。

- 字型：使用系統字型，例如 Windows 的 Microsoft JhengHei。
- 圖示：由 `src/flowdeck.bundle.js` 內建的本地 SVG 圖示渲染器產生。

因此，即使電腦沒有網路，介面仍可正常顯示。

## 5. 注意事項

IndexedDB 在一般 Chrome、Edge、Firefox 桌面瀏覽器中可從 `file://` 使用。若瀏覽器或企業安全政策封鎖 `file://` 的 IndexedDB，Flowdeck 會退回記憶體模式；當次操作仍可使用，但關閉或重新整理後資料可能無法保留。

若需要開發除錯，仍可選擇從專案根目錄執行：

```powershell
python -m http.server 8000
```

再開啟：

```text
http://localhost:8000/index.html
```

這只是開發選項，不是一般使用必要條件。
