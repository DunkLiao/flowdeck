# 專案資料夾結構規範 (Folder Structure)

本專案採用**功能導向架構 (Feature-Based Architecture)**，所有的功能程式碼（JS 控制器、元件、服務）皆按照 Feature 模組進行封裝，確保高內聚、低耦合。

## 1. 資料夾結構圖

```text
flowdeck/
├── docs/                      # 規格與設計文件目錄
│   ├── ProductRequirement.md
│   ├── FunctionalSpecification.md
│   ├── TechnicalSpecification.md
│   └── ... (其餘 10 份文件)
│
├── src/                       # 前端原始碼目錄
│   ├── core/                  # 核心底層基礎設施
│   │   ├── db/
│   │   │   └── KanbanDB.js    # IndexedDB 封裝
│   │   └── storage/
│   │       └── BackupService.js # 匯入匯出與自動備份服務
│   │
│   ├── features/              # 業務功能模組
│   │   ├── board/             # 看板管理功能
│   │   │   ├── board.service.js
│   │   │   └── board.component.js
│   │   ├── column/            # 欄位管理與拖曳排序
│   │   │   ├── column.service.js
│   │   │   └── column.component.js
│   │   ├── card/              # 卡片 CRUD 與 Markdown 詳情
│   │   │   ├── card.service.js
│   │   │   └── card.component.js
│   │   ├── checklist/         # 待辦清單子系統
│   │   │   ├── checklist.service.js
│   │   │   └── checklist.component.js
│   │   ├── tag/               # 標籤子系統
│   │   │   ├── tag.service.js
│   │   │   └── tag.component.js
│   │   └── search/            # 模糊搜尋與進階篩選
│   │       └── search.service.js
│   │
│   ├── ui/                    # 全域 UI 元件與設計系統
│   │   ├── global.css         # 設計系統 CSS 變數、基礎重設、玻璃擬態樣式
│   │   ├── toast.js           # 繁體中文 Toast 提示元件
│   │   └── dialog.js          # 自訂雙擊/刪除確認 Modal
│   │
│   └── app.js                 # 應用程式進入點與引導核心
│
├── index.html                 # 主頁面 (靜態進入點)
└── Spec.md                    # 原始需求 SPEC 文件
```

---

## 2. 目錄職責說明

### 2.1 `src/core/`
- **職責**：提供應用程式與瀏覽器底層 API (IndexedDB, LocalStorage, File I/O) 的封裝介面。
- **規則**：
  - 核心層程式碼不直接處理 UI DOM 渲染。
  - 核心層程式碼不應依賴 `features/` 目錄內部的模組。

### 2.2 `src/features/`
- **職責**：將看板、欄位、卡片、標籤、搜尋等業務單元，按照其業務職責分組。
- **內部檔案劃分**：
  - `*.service.js`：處理資料驗證、結構組裝與呼叫 `KanbanDB` 儲存，並發佈變更廣播。
  - `*.component.js`：處理特定功能區塊的 HTML 生成、CSS class 切換與 DOM 事件綁定（事件委派）。

### 2.3 `src/ui/`
- **職責**：提供跨功能模組共用的全域樣式與互動回饋元件。
- **內部檔案劃分**：
  - `global.css`：定義主題色彩、陰影、圓角、磨砂玻璃效果等設計系統。
  - `toast.js` 和 `dialog.js`：提供一致性、無阻塞的通知與防呆確認機制。
