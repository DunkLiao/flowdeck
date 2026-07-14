import { kanbanDB } from './core/db/KanbanDB.js';
import { backupService } from './core/storage/BackupService.js';
import { boardService } from './features/board/board.service.js';
import { BoardComponent } from './features/board/board.component.js';
import { ColumnComponent } from './features/column/column.component.js';
import { CardComponent } from './features/card/card.component.js';
import { ChecklistComponent } from './features/checklist/checklist.component.js';
import { TagComponent } from './features/tag/tag.component.js';
import { searchService } from './features/search/search.service.js';
import { Dialog } from './ui/dialog.js';
import { Toast } from './ui/toast.js';

const THEME_STORAGE_KEY = 'flowdeck:theme';
const THEMES = {
  dark: {
    next: 'light',
    label: '淺色模式',
    icon: 'sun',
    ariaLabel: '切換為淺色模式'
  },
  light: {
    next: 'dark',
    label: '深色模式',
    icon: 'moon',
    ariaLabel: '切換為深色模式'
  }
};

function getStoredTheme() {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme, toggleButton = document.getElementById('btn-theme-toggle')) {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = safeTheme;

  if (!toggleButton) return;

  const themeMeta = THEMES[safeTheme];
  const labelEl = toggleButton.querySelector('span');
  const iconEl = toggleButton.querySelector('.theme-toggle-icon');

  toggleButton.setAttribute('aria-label', themeMeta.ariaLabel);
  if (labelEl) labelEl.textContent = themeMeta.label;
  if (iconEl) iconEl.setAttribute('data-lucide', themeMeta.icon);

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initThemeToggle() {
  const toggleButton = document.getElementById('btn-theme-toggle');
  let currentTheme = getStoredTheme();
  applyTheme(currentTheme, toggleButton);

  if (!toggleButton) return;

  toggleButton.addEventListener('click', () => {
    currentTheme = THEMES[currentTheme].next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (err) {
      console.warn('[Flowdeck] 無法儲存主題偏好:', err);
    }
    applyTheme(currentTheme, toggleButton);
  });
}

function initMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('btn-mobile-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const boardList = document.getElementById('board-list');
  if (!sidebar || !toggleButton || !backdrop) return;

  const closeSidebar = () => {
    sidebar.classList.remove('is-open');
    backdrop.classList.add('hidden');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-label', '開啟看板選單');
  };

  const openSidebar = () => {
    sidebar.classList.add('is-open');
    backdrop.classList.remove('hidden');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.setAttribute('aria-label', '關閉看板選單');
  };

  toggleButton.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  backdrop.addEventListener('click', closeSidebar);
  window.addEventListener('flowdeck:sidebar-close', closeSidebar);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });

  if (boardList) {
    boardList.addEventListener('click', (event) => {
      const boardItem = event.target.closest('.board-item');
      if (boardItem && !event.target.closest('.btn-delete-board')) {
        window.dispatchEvent(new CustomEvent('flowdeck:sidebar-close'));
      }
    });
  }

  const desktopQuery = window.matchMedia('(min-width: 901px)');
  const syncForViewport = () => {
    if (desktopQuery.matches) closeSidebar();
  };
  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', syncForViewport);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(syncForViewport);
  }
  syncForViewport();
}

/**
 * 應用程式引導與初始化 (Bootstrapper)
 */
async function bootstrap() {
  try {
    initThemeToggle();
    initMobileSidebar();

    // 1. 初始化資料庫
    const isIndexedDBOk = await kanbanDB.init();
    if (!isIndexedDBOk) {
      Toast.warning('資料庫連線失敗，目前已自動切換至「記憶體暫存模式」，請記得定期備份資料！');
    }

    // 2. 檢查是否有看板資料，若無則建立預設看板
    let boards = await boardService.getBoards();
    
    if (boards.length === 0) {
      // 檢查是否有 LocalStorage 的自動備份
      if (backupService.hasAutoBackup()) {
        const confirmRestore = await Dialog.confirm(
          '還原資料',
          '偵測到您在瀏覽器中有先前的看板自動備份，是否自動還原備份資料？',
          'info'
        );
        if (confirmRestore) {
          const success = await backupService.restoreFromAutoBackup();
          if (success) {
            boards = await boardService.getBoards();
          }
        }
      }
      
      // 若仍無看板，建立預設的繁體中文「我的工作看板」
      if (boards.length === 0) {
        await backupService.seedInitialState();
        boards = await boardService.getBoards();
      }
    }

    // 3. 設定預設開啟的看板 ID
    const activeId = boardService.getActiveBoardId();
    if (!activeId || !boards.some(b => b.id === activeId)) {
      boardService.setActiveBoardId(boards[0].id);
    } else {
      // 確保將 active board 的狀態載入與廣播
      boardService.setActiveBoardId(activeId);
    }

    // 4. 初始化各視圖元件
    const boardComponent = new BoardComponent();
    const cardComponent = new CardComponent();
    const columnComponent = new ColumnComponent(cardComponent);
    const checklistComponent = new ChecklistComponent();
    const tagComponent = new TagComponent();

    // 5. 綁定側邊欄備份還原按鈕
    const btnExport = document.getElementById('btn-export-data');
    const btnImport = document.getElementById('btn-import-data');
    const btnResetInitial = document.getElementById('btn-reset-initial-data');
    const fileImportInput = document.getElementById('file-import');

    if (btnExport) {
      btnExport.addEventListener('click', async () => {
        await backupService.exportData();
      });
    }

    if (btnImport && fileImportInput) {
      btnImport.addEventListener('click', () => {
        fileImportInput.click();
      });

      fileImportInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          const ok = await backupService.importData(file);
          if (ok) {
            // 延遲重整以確保使用者能看到成功 Toast
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
        // 重設輸入框以支援選取同一個檔案
        fileImportInput.value = '';
      });
    }

    if (btnResetInitial) {
      btnResetInitial.addEventListener('click', async () => {
        const confirmReset = await Dialog.confirm(
          '還原初始設定',
          '您確定要還原初始設定嗎？目前所有看板、欄位、卡片、標籤與待辦清單都會被刪除，且自動備份會被覆寫為初始狀態。',
          'danger'
        );

        if (!confirmReset) return;

        const ok = await backupService.resetToInitialState();
        if (ok) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }

    // 6. 初始渲染視圖
    await boardComponent.render();
    await columnComponent.render();
    await tagComponent.renderFilterTagsList();

    // 7. 初始化模糊搜尋與篩選狀態
    searchService.clearAllFilters();

    // 8. 載入並初始化系統 Lucide 圖標
    if (window.lucide) {
      window.lucide.createIcons();
    }

    console.log('[Flowdeck] 應用程式引導成功，語系：繁體中文。');
  } catch (err) {
    console.error('[Flowdeck] 啟動失敗:', err);
    Toast.error('Flowdeck 啟動失敗，請檢查主控台報錯。');
  }
}

// 當 DOM 載入完畢後啟動
document.addEventListener('DOMContentLoaded', bootstrap);
