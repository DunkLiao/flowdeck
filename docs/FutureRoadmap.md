# 未來擴充計畫 (Future Roadmap)

本文件描述 Kanban Board 在本地端 MVP 階段完成後，未來可升級與擴充的技術方向。

## 1. 雲端同步與備份整合 (Cloud Sync)
- **雲端硬碟同步**：支援使用者連接個人 Google Drive、OneDrive 或 Dropbox，定期非同步將 IndexedDB 的 JSON 備份寫入雲端目錄，實現跨裝置同步。
- **WebDAV 支援**：允許使用者輸入自訂 WebDAV 伺服器網址與金鑰，實作去中心化的私有雲端同步。

## 2. 多人協作與即時通訊 (Collaboration)
- **WebRTC P2P 協作**：在不架設中央伺服器的前提下，藉由 WebRTC 連接，讓兩台處於同一區域網路（或透過 STUN/TURN 伺服器）的瀏覽器能即時同步看板畫面。
- **CRDT 衝突解決**：引入 Y.js 或 Automerge，實作衝突無關複製資料類型 (Conflict-Free Replicated Data Types)，確保多人同時拖曳或編輯同一張卡片時，資料不會產生覆蓋衝突。

## 3. UI/UX 升級與個人化主題 (Theming)
- **自訂背景**：支援自訂背景圖片（如 Unsplash API 串接）與動態毛玻璃透明度調整。
- **卡片自訂版型**：除了一般看板模式，未來提供「日曆模式」與「清單模式」一鍵切換。
- **富文本 Markdown 編輯器**：由正則解析器升級為雙向 WYSIWYG（所見即所得）編輯器，整合代碼高亮 (Code Highlighting)。

## 4. 自動化測試與 CI 部署 (CI/CD)
- **Playwright 端對端測試**：加入 CI 流程，自動啟動 Headless Chrome 模擬拖曳、搜尋與資料備份操作。
- **PWA (Progressive Web App) 支援**：新增 `manifest.json` 與 Service Worker，讓看板能像桌面應用程式一樣離線安裝與開啟。
