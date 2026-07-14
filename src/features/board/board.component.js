import { boardService } from './board.service.js';
import { Dialog } from '../../ui/dialog.js';
import { Toast } from '../../ui/toast.js';
import { eventBus } from '../../core/utils/EventBus.js';

/**
 * 看板視圖元件 (Board Component)
 */
export class BoardComponent {
  constructor() {
    this.boardListEl = document.getElementById('board-list');
    this.activeTitleEl = document.getElementById('active-board-title');
    this.createBoardBtn = document.getElementById('btn-create-board');

    this.initEvents();
  }

  /**
   * 初始化事件訂閱
   */
  initEvents() {
    // 訂閱看板清單更新事件
    eventBus.on('board:list-updated', () => this.render());
    // 訂閱看板名稱修改事件
    eventBus.on('board:name-changed', (board) => {
      const activeId = boardService.getActiveBoardId();
      if (activeId === board.id) {
        this.activeTitleEl.textContent = board.name;
      }
    });

    // 頂部標題編輯事件 (ContentEditable)
    this.activeTitleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.activeTitleEl.blur();
      }
      if (e.key === 'Escape') {
        // 還原為當前名稱
        const activeId = boardService.getActiveBoardId();
        boardService.getBoard(activeId).then(board => {
          if (board) this.activeTitleEl.textContent = board.name;
        });
        this.activeTitleEl.blur();
      }
    });

    this.activeTitleEl.addEventListener('blur', async () => {
      const activeId = boardService.getActiveBoardId();
      if (!activeId) return;

      const newName = this.activeTitleEl.textContent.trim();
      if (!newName) {
        // 空白名稱還原
        const board = await boardService.getBoard(activeId);
        this.activeTitleEl.textContent = board ? board.name : '未命名看板';
        Toast.error('看板名稱不可為空！');
        return;
      }

      const board = await boardService.getBoard(activeId);
      if (board && board.name !== newName) {
        try {
          await boardService.renameBoard(activeId, newName);
          Toast.success('看板更名成功');
        } catch (err) {
          this.activeTitleEl.textContent = board.name;
          Toast.error(err.message || '看板更名失敗');
        }
      }
    });

    // 建立新看板按鈕
    this.createBoardBtn.addEventListener('click', async () => {
      const name = await Dialog.prompt('建立新看板', '請輸入看板名稱...', '');
      if (name) {
        try {
          const board = await boardService.createBoard(name);
          boardService.setActiveBoardId(board.id);
          Toast.success(`已建立看板「${board.name}」`);
        } catch (err) {
          Toast.error(err.message || '建立看板失敗');
        }
      }
    });

    // 事件委派：點擊看板項目或刪除看板
    this.boardListEl.addEventListener('click', async (e) => {
      const itemEl = e.target.closest('.board-item');
      if (!itemEl) return;

      const boardId = itemEl.dataset.boardId;

      // 點擊刪除按鈕
      const deleteBtn = e.target.closest('.btn-delete-board');
      if (deleteBtn) {
        e.stopPropagation(); // 阻止氣泡觸發切換看板
        const board = await boardService.getBoard(boardId);
        if (!board) return;

        const confirm = await Dialog.confirm(
          '刪除看板',
          `您確定要刪除看板「${board.name}」嗎？此動作將連同底下的欄位及卡片一併永久刪除。`,
          'danger'
        );

        if (confirm) {
          await boardService.deleteBoard(boardId);
          Toast.success(`看板「${board.name}」已刪除`);
        }
        return;
      }

      // 點擊切換看板
      boardService.setActiveBoardId(boardId);
    });
  }

  /**
   * 渲染看板清單與主標題
   */
  async render() {
    const boards = await boardService.getBoards();
    const activeId = boardService.getActiveBoardId();

    // 1. 渲染頂部當前看板標題
    if (activeId) {
      const activeBoard = await boardService.getBoard(activeId);
      if (activeBoard) {
        this.activeTitleEl.textContent = activeBoard.name;
        this.activeTitleEl.style.display = 'block';
      } else {
        this.activeTitleEl.textContent = '選擇看板';
      }
    } else {
      this.activeTitleEl.textContent = '請先建立看板';
    }

    // 2. 渲染側邊欄清單
    this.boardListEl.innerHTML = '';
    
    if (boards.length === 0) {
      this.boardListEl.innerHTML = `<div class="sidebar-empty text-muted" style="padding: 10px; font-size: 13px;">無看板資料</div>`;
      return;
    }

    boards.forEach(board => {
      const isActive = board.id === activeId;
      const itemNode = document.createElement('div');
      itemNode.className = `board-item ${isActive ? 'active' : ''}`;
      itemNode.dataset.boardId = board.id;

      const nameNode = document.createElement('span');
      nameNode.className = 'board-item-name';
      nameNode.textContent = board.name;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete-board';
      deleteBtn.setAttribute('aria-label', '刪除看板');
      deleteBtn.innerHTML = '<i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>';

      itemNode.append(nameNode, deleteBtn);
      this.boardListEl.appendChild(itemNode);
    });

    // 重新繪製 Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}
