# 錯誤處理與 Toast 機制說明 (Error Handling)

看板系統在瀏覽器本地運行，可能面臨 IndexedDB 權限受阻（如隱私模式）、JSON 檔案結構損毀、或是未預期的 DOM 狀態異常。本文件規範錯誤擷取、邊緣處理與全域 Toast 提示設計。

## 1. 錯誤攔截策略 (Exception Catching Strategy)
- 所有調用 `KanbanDB` 或對外部 JSON 檔案進行讀寫的方法，均必須以 `try...catch` 包覆。
- 不得讓 Unhandled Promise Rejection (未處理的 Promise 拒絕) 出現在主執行緒中。
- `catch` 到錯誤後，必須同時執行兩件事：
  1. 呼叫 `console.error` 記錄詳細錯誤追蹤（堆疊資訊）。
  2. 呼叫全域 `Toast.error(...)` 向使用者展示友善且明確的**繁體中文**提示，說明失敗的原因。

---

## 2. IndexedDB 唯讀/不可用降級方案 (Fallback Mechanism)
若瀏覽器處於極致隱私模式 (Private Window) 且停用了 IndexedDB：
1. `KanbanDB.init()` 捕捉到開啟資料庫失敗之錯誤。
2. 系統自動切換降級引擎為 `LocalStorage`（若 LocalStorage 亦不可用，則降級為 `MemoryStorage`，即宣告一個全域記憶體變數作為暫存器）。
3. 頂部彈出持久性 (Persistent) 的警告 Toast，提示使用者：「偵測到瀏覽器 IndexedDB 停用，目前資料將暫存在瀏覽器快取中，關閉分頁可能導致資料遺失，建議定期匯出備份。」

---

## 3. 全域 Toast 提示規格

我們將在 `src/ui/toast.js` 實作一個全域單例 (Singleton) Toast 提示元件，包含以下狀態：

```javascript
export const Toast = {
  show(message, type = 'info', duration = 3000) {
    // 動態建立 DOM 節點，滑入右下角並自動於 duration 後淡出銷毀
  },
  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error', 5000); },
  warning(message) { this.show(message, 'warning', 4000); },
  info(message) { this.show(message, 'info'); }
};
```

### 常見錯誤提示對照表：

| 觸發事件 | Toast 類型 | 繁體中文 UI 提示文字 |
| :--- | :--- | :--- |
| 資料庫初始化失敗 | `error` | `資料庫連線失敗，正在切換至本地快取暫存模式...` |
| 新建看板成功 | `success` | `看板建立成功` |
| 刪除看板成功 | `success` | `看板已成功刪除` |
| 匯入資料成功 | `success` | `資料還原成功，正在載入最新看板...` |
| 匯入 JSON 格式錯誤 | `error` | `匯入失敗：檔案格式不符合看板備份 Schema` |
| 卡片拖曳儲存失敗 | `warning` | `拖放狀態未成功儲存，請重試` |
| 欄位名稱空白 | `error` | `名稱欄位不可為空白` |
