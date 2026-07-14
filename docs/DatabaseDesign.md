# 資料庫設計說明書 (Database Design)

本項目使用瀏覽器原生的 IndexedDB 進行本地資料持久化。

## 1. 資料庫基礎資訊
- **資料庫名稱 (Database Name)**: `KanbanDB`
- **初始版本號 (Version)**: `1`

---

## 2. 物件儲存庫設計 (Object Stores & Indexes)

### 2.1 Boards (看板表)
儲存多個看板的後設資料。
- **Key Path**: `id` (UUID 字串)
- **屬性與資料類型**：
  - `id`: `String`
  - `name`: `String`
  - `createdAt`: `Number` (Timestamp)
  - `updatedAt`: `Number` (Timestamp)
- **索引**：無特別索引，以 id 主鍵查詢。

### 2.2 Columns (欄位表)
儲存看板內的各個狀態欄。
- **Key Path**: `id` (UUID 字串)
- **屬性與資料類型**：
  - `id`: `String`
  - `boardId`: `String` (關聯 Boards.id)
  - `name`: `String`
  - `order`: `Number` (排序索引)
- **索引**：
  - `boardId`: 用於快速獲取指定看板下的所有欄位。

### 2.3 Cards (卡片表)
儲存具體的任務內容。
- **Key Path**: `id` (UUID 字串)
- **屬性與資料類型**：
  - `id`: `String`
  - `columnId`: `String` (關聯 Columns.id)
  - `title`: `String`
  - `description`: `String` (Markdown 內文)
  - `priority`: `String` ("高" | "中" | "低" | "無")
  - `dueDate`: `String` (格式: "YYYY-MM-DD" 或空字串)
  - `order`: `Number` (在欄位內的排序索引)
  - `createdAt`: `Number` (Timestamp)
  - `updatedAt`: `Number` (Timestamp)
- **索引**：
  - `columnId`: 用於快速獲取指定欄位下的所有卡片。

### 2.4 Tags (標籤表)
全域標籤定義。
- **Key Path**: `id` (UUID 字串)
- **屬性與資料類型**：
  - `id`: `String`
  - `name`: `String`
  - `color`: `String` (十六進位色碼，例如 `#ff4d4d`)
- **索引**：無。

### 2.5 CardTags (卡片與標籤關係表)
多對多關聯表。
- **Key Path**: `id` (UUID 字串，自動生成，或 `cardId + '_' + tagId` 的組合鍵)
- **屬性與資料類型**：
  - `id`: `String` (格式: `${cardId}_${tagId}`)
  - `cardId`: `String` (關聯 Cards.id)
  - `tagId`: `String` (關聯 Tags.id)
- **索引**：
  - `cardId`: 用於獲取特定卡片的所有標籤。
  - `tagId`: 用於搜尋/篩選具有特定標籤的所有卡片。

### 2.6 Checklist (待辦清單表)
卡片內的子任務清單。
- **Key Path**: `id` (UUID 字串)
- **屬性與資料類型**：
  - `id`: `String`
  - `cardId`: `String` (關聯 Cards.id)
  - `title`: `String`
  - `checked`: `Boolean` (是否已勾選)
  - `order`: `Number` (排序索引)
- **索引**：
  - `cardId`: 用於快速載入特定卡片下的待辦清單項目。

---

## 3. 資料庫版本升級與 Migration 機制
系統中在開啟資料庫時，會透過 `onupgradeneeded` 監聽器執行 Migration。

### 初始版本 (V1) 初始化程式碼範例：
```javascript
const request = indexedDB.open('KanbanDB', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  
  // 1. Boards
  if (!db.objectStoreNames.contains('boards')) {
    db.createObjectStore('boards', { keyPath: 'id' });
  }
  
  // 2. Columns
  if (!db.objectStoreNames.contains('columns')) {
    const colStore = db.createObjectStore('columns', { keyPath: 'id' });
    colStore.createIndex('boardId', 'boardId', { unique: false });
  }
  
  // 3. Cards
  if (!db.objectStoreNames.contains('cards')) {
    const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
    cardStore.createIndex('columnId', 'columnId', { unique: false });
  }
  
  // 4. Tags
  if (!db.objectStoreNames.contains('tags')) {
    db.createObjectStore('tags', { keyPath: 'id' });
  }
  
  // 5. CardTags
  if (!db.objectStoreNames.contains('cardTags')) {
    const cardTagStore = db.createObjectStore('cardTags', { keyPath: 'id' });
    cardTagStore.createIndex('cardId', 'cardId', { unique: false });
    cardTagStore.createIndex('tagId', 'tagId', { unique: false });
  }
  
  // 6. Checklist
  if (!db.objectStoreNames.contains('checklists')) {
    const checklistStore = db.createObjectStore('checklists', { keyPath: 'id' });
    checklistStore.createIndex('cardId', 'cardId', { unique: false });
  }
};
```
未來如需擴充欄位（例如將版本升至 2），可在此方法中判斷 `event.oldVersion` 並逐級套用 Migration。
