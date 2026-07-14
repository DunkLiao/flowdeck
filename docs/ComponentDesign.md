# 元件化設計與事件委派說明 (Component Design)

本項目不使用三大框架，而是透過原生 JavaScript ES Modules 的物件導向設計實作「宣告式元件化」。

## 1. 元件設計原則
- **獨立 DOM 容器 (Mounting Point)**：每個元件都接受一個父 DOM 容器作為構造參數，並在其內部進行渲染。
- **內部狀態與外部參數**：元件有自己的內部屬性，當 Service 層發佈資料更新通知時，元件將重新載入資料並重繪 (Re-render)。
- **生命週期 (Lifecycle)**：
  - `constructor(containerEl, service)`: 初始化元件，綁定服務。
  - `render()`: 組裝 HTML 字串並插入 DOM，或是更新特定節點。
  - `bindEvents()`: 使用事件委派 (Event Delegation) 綁定 DOM 事件。

---

## 2. 核心元件詳細規格

### 2.1 BoardComponent (看板元件)
- **職責**：渲染看板側邊欄（看板清單）與主看板工作區的外框。
- **DOM 掛載點**：`#app`
- **主要方法**：
  - `renderSidebar()`: 繪製看板清單與匯出/匯入選項。
  - `renderBoardArea()`: 繪製當前選定看板的頂部操作列與欄位容器。

### 2.2 ColumnComponent (欄位元件)
- **職責**：在工作區內渲染多個狀態欄。
- **DOM 掛載點**：`#board-columns-container`
- **主要事件監聽**：
  - `dblclick` 於欄位標題：進入重命名模式。
  - `click` 於「刪除欄位」選單：觸發 ColumnService 刪除。
  - `dragstart` / `dragover` / `drop` / `dragend`：欄位本身的水平拖曳重排。

### 2.3 CardComponent (卡片元件)
- **職責**：渲染單張任務卡片，並處理卡片詳情 Modal 的開啟與編輯。
- **主要事件監聽（事件委派至 Column 容器）**：
  - `click` 於卡片本體：開啟 `CardDetailModal`。
  - `dragstart` / `dragend` 於卡片：記錄拖動狀態。
- **CardDetailModal 互動**：
  - 雙點擊標題直接編輯。
  - 描述區域切換 Markdown 編輯器/預覽區。
  - 待辦清單 (Checklist) 的即時新增、刪除、勾選與上下拖曳排序。

---

## 3. 事件委派 (Event Delegation) 機制
為避免 DOM 節點頻繁更新導致事件監聽器殘留並造成記憶體洩漏 (Memory Leak)，本項目主要在各個主容器（如 `#board-columns-container`）上綁定全域監聽器，透過 `event.target.closest()` 來判斷點擊的是哪一張卡片或哪一個按鈕。

### 程式碼範例：
```javascript
// 在 ColumnComponent 中統一處理卡片點擊與新增
this.containerEl.addEventListener('click', (event) => {
  // 1. 新增卡片按鈕
  const addCardBtn = event.target.closest('.add-card-btn');
  if (addCardBtn) {
    const columnId = addCardBtn.dataset.columnId;
    this.handleCreateCard(columnId);
    return;
  }
  
  // 2. 點擊卡片開啟編輯詳情
  const cardNode = event.target.closest('.kanban-card');
  if (cardNode) {
    const cardId = cardNode.dataset.cardId;
    this.openCardDetailModal(cardId);
  }
});
```
此設計能大幅減少監聽器數量，提升渲染效能與記憶體安全。
