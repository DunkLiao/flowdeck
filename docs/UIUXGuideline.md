# UI/UX 設計指引與語系對照表 (UI/UX Guideline)

本專案旨在提供極致奢華的視覺體驗，預設採用現代暗色系磨砂玻璃（Dark Mode Glassmorphism）美學，並提供淺色模式切換；所有介面文字以**繁體中文**為唯一語系。

## 1. 視覺設計規範 (Design Tokens)

### 1.1 色彩計畫 (Color Palette)
- **背景底色 (App Background)**: 深邃灰藍色 `hsl(222, 47%, 6%)` 搭配漸層背景。
- **玻璃面板背景 (Glass Pane Background)**: 半透明磨砂 `hsla(222, 47%, 12%, 0.4)`。
- **玻璃面板邊框 (Glass Border)**: 微亮白光邊條 `hsla(0, 0%, 100%, 0.06)`。
- **主色 (Primary Accent)**: 靛藍色 `hsl(217, 91%, 60%)`（用於聚焦、主要按鈕）。
- **警示色 (Danger Accent)**: 胭脂紅 `hsl(354, 84%, 57%)`（用於刪除確認、錯誤警告）。
- **優先權顏色**：
  - **高**：亮紅色 `hsl(0, 84%, 60%)`
  - **中**：琥珀黃 `hsl(38, 92%, 50%)`
  - **低**：薄荷綠 `hsl(142, 71%, 45%)`
  - **無**：石板灰 `hsl(215, 15%, 50%)`

### 1.2 主題切換 (Theme Toggle)
- **預設主題**：深色模式。
- **切換入口**：左側側邊欄底部「淺色模式 / 深色模式」按鈕。
- **偏好保存**：使用 LocalStorage 鍵值 `flowdeck:theme` 保存 `dark` 或 `light`，重新整理後維持使用者最後選擇。
- **套用方式**：以 `<html data-theme="light">` 覆寫 CSS design tokens；未設定或非法值一律回到深色模式。

### 1.3 玻璃擬態 (Glassmorphism) 核心 CSS
```css
.glass-panel {
  background: rgba(18, 22, 33, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### 1.4 字型與字級 (Typography)
- **字型族系 (Font Family)**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft JhengHei" (微軟正黑體), sans-serif`。
- **字級階層**：
  - 看板標題：`24px (1.5rem)`，粗體
  - 欄位標題：`16px (1rem)`，中粗體
  - 卡片標題：`14px (0.875rem)`，中粗體
  - 內文與屬性標籤：`12px (0.75rem)`

---

## 2. 動態效果與微互動 (Animations & Transitions)
- **卡片拖曳懸浮效果**：當卡片處於拖動狀態 (`.dragging`)，降低不透明度至 `0.4`，並加上 `scale(0.98)` 縮放。
- **按鈕與卡片懸停 (Hover)**：加上平滑的位移與陰影擴散。
  - `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);`
  - 懸停時 `transform: translateY(-2px);`，加深陰影。
- **Toast 彈出動畫**：從螢幕右下角向左滑入，淡出時向下退場。

---

## 3. 語系與翻譯對照表 (Traditional Chinese Terminology)

為確保專案 UI 文字的一致性，所有介面元件字串必須遵循以下對照表：

| 英文原詞 | 繁體中文 UI 翻譯 | 套用場景 |
| :--- | :--- | :--- |
| Board | **看板** | 左側側邊欄、新建看板彈窗 |
| Column | **欄位** | 新建狀態欄、排序提示 |
| Card | **卡片** | 任務主體 |
| Checklist | **待辦清單** | 卡片詳情內子任務區 |
| Tag | **標籤** | 卡片關聯與搜尋篩選器 |
| Search | **搜尋** | 頂部搜尋欄 Placeholder: `搜尋卡片標題或描述...` |
| Filter | **篩選** | 標籤、優先權、到期日篩選按鈕 |
| Priority | **優先權** | 卡片屬性，選單包含：「高」、「中」、「低」、「無」 |
| Due Date | **到期日** | 卡片屬性，格式：「YYYY-MM-DD」 |
| Export Data | **匯出資料** | 側邊欄設定按鈕 |
| Import Data | **匯入資料** | 側邊欄設定按鈕 |
| Confirm / Cancel | **確定 / 取消** | 刪除對話框、新增輸入對話框按鈕 |
| Todo (Default Column) | **待處理** | 新建看板預設欄位 1 |
| In Progress (Default Column) | **進行中** | 新建看板預設欄位 2 |
| Done (Default Column) | **已完成** | 新建看板預設欄位 3 |
