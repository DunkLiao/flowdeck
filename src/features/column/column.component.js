import { columnService } from './column.service.js';
import { boardService } from '../board/board.service.js';
import { Dialog } from '../../ui/dialog.js';
import { Toast } from '../../ui/toast.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { escapeHtml } from '../../core/utils/sanitize.js';

/**
 * 欄位視圖元件 (Column Component)
 */
export class ColumnComponent {
  /**
   * @param {Object} cardRenderer - 用於渲染卡片的渲染器實例
   */
  constructor(cardRenderer) {
    this.containerEl = document.getElementById('board-columns-container');
    this.cardRenderer = cardRenderer;
    this.activeBoardId = null;
    
    this.draggedColumnEl = null;
    this.touchColumnDrag = {
      columnEl: null,
      timerId: null,
      active: false,
      startX: 0,
      startY: 0
    };

    this.initEvents();
  }

  /**
   * 初始化事件訂閱
   */
  initEvents() {
    eventBus.on('board:changed', (boardId) => {
      this.activeBoardId = boardId;
      this.render();
    });

    eventBus.on('column:updated', () => {
      this.render();
    });

    // 委派事件：新增/刪除/更名欄位
    this.containerEl.addEventListener('click', async (e) => {
      // 1. 刪除欄位按鈕
      const deleteBtn = e.target.closest('.btn-delete-column');
      if (deleteBtn) {
        const columnId = deleteBtn.dataset.columnId;
        const col = await columnService.getColumn(columnId);
        if (!col) return;

        const confirm = await Dialog.confirm(
          '刪除狀態欄位',
          `您確定要刪除欄位「${col.name}」嗎？此動作將會一併永久刪除底下的所有卡片！`,
          'danger'
        );

        if (confirm) {
          await columnService.deleteColumn(columnId);
          Toast.success(`欄位「${col.name}」已刪除`);
        }
        return;
      }

      // 2. 顯示/隱藏新增卡片快捷輸入框
      const addCardTriggerBtn = e.target.closest('.btn-add-card-trigger');
      if (addCardTriggerBtn) {
        const columnId = addCardTriggerBtn.dataset.columnId;
        const formEl = document.getElementById(`quick-creator-${columnId}`);
        const triggerEl = document.getElementById(`btn-trigger-${columnId}`);
        if (formEl && triggerEl) {
          formEl.classList.remove('hidden');
          triggerEl.classList.add('hidden');
          formEl.querySelector('textarea').focus();
        }
        return;
      }


      const cancelAddCardBtn = e.target.closest('.btn-cancel-quick-card');
      if (cancelAddCardBtn) {
        const columnId = cancelAddCardBtn.dataset.columnId;
        this.hideQuickCardCreator(columnId);
        return;
      }
    });

    // 委派雙擊欄位標題進行更名
    this.containerEl.addEventListener('dblclick', (e) => {
      const titleEl = e.target.closest('.column-title');
      if (!titleEl) return;

      titleEl.contentEditable = 'true';
      titleEl.focus();

      // 選取所有文字
      const range = document.createRange();
      range.selectNodeContents(titleEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      const onKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          titleEl.blur();
        }
        if (event.key === 'Escape') {
          titleEl.contentEditable = 'false';
          this.render(); // 重新渲染以還原
        }
      };

      const onBlur = async () => {
        titleEl.contentEditable = 'false';
        titleEl.removeEventListener('keydown', onKeyDown);
        titleEl.removeEventListener('blur', onBlur);

        const newName = titleEl.textContent.trim();
        const columnId = titleEl.dataset.columnId;

        if (!newName) {
          Toast.error('欄位名稱不可為空白！');
          this.render();
          return;
        }

        const col = await columnService.getColumn(columnId);
        if (col && col.name !== newName) {
          try {
            await columnService.renameColumn(columnId, newName);
            Toast.success('欄位名稱已修改');
          } catch (err) {
            Toast.error(err.message || '欄位名稱修改失敗');
            this.render();
          }
        }
      };

      titleEl.addEventListener('keydown', onKeyDown);
      titleEl.addEventListener('blur', onBlur);
    });

    // 綁定拖曳欄位 (Drag & Drop) 事件
    this.setupColumnDragAndDrop();
    this.setupTouchColumnDrag();
  }

  /**
   * 隱藏新增卡片輸入框
   */
  hideQuickCardCreator(columnId) {
    const formEl = document.getElementById(`quick-creator-${columnId}`);
    const triggerEl = document.getElementById(`btn-trigger-${columnId}`);
    if (formEl && triggerEl) {
      formEl.classList.add('hidden');
      triggerEl.classList.remove('hidden');
      const field = formEl.querySelector('textarea, input');
      if (field) field.value = '';
    }
  }

  /**
   * 設置欄位之間的拖拽重新排序
   */
  setupColumnDragAndDrop() {
    this.containerEl.addEventListener('dragstart', (e) => {
      const columnEl = e.target.closest('.kanban-column');
      // 確保拖曳的是欄位 header，且不是卡片拖曳
      if (columnEl && e.target.closest('.column-header')) {
        this.draggedColumnEl = columnEl;
        columnEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', columnEl.dataset.columnId);
      }
    });

    this.containerEl.addEventListener('dragover', (e) => {
      if (!this.draggedColumnEl) return;
      e.preventDefault();
      
      const targetColumn = e.target.closest('.kanban-column');
      if (targetColumn && targetColumn !== this.draggedColumnEl) {
        if (this.shouldInsertBeforeColumn(targetColumn, e.clientX, e.clientY)) {
          this.containerEl.insertBefore(this.draggedColumnEl, targetColumn);
        } else {
          this.containerEl.insertBefore(this.draggedColumnEl, targetColumn.nextSibling);
        }
      }
    });

    this.containerEl.addEventListener('dragend', async (e) => {
      const columnEl = e.target.closest('.kanban-column');
      if (columnEl && this.draggedColumnEl) {
        columnEl.classList.remove('dragging');
        this.draggedColumnEl = null;

        // 當拖放結束，從 DOM 結構獲取最新順序並更新資料庫
        await this.saveDOMColumnOrder();
      }
    });
  }

  setupTouchColumnDrag() {
    this.containerEl.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' || event.button !== 0) return;
      if (!event.target.closest('.column-header') || event.target.closest('button')) return;

      const columnEl = event.target.closest('.kanban-column');
      if (!columnEl) return;

      this.clearTouchColumnDragTimer();
      this.touchColumnDrag.columnEl = columnEl;
      this.touchColumnDrag.active = false;
      this.touchColumnDrag.startX = event.clientX;
      this.touchColumnDrag.startY = event.clientY;

      this.touchColumnDrag.timerId = window.setTimeout(() => {
        if (!this.touchColumnDrag.columnEl) return;
        this.touchColumnDrag.active = true;
        this.draggedColumnEl = columnEl;
        columnEl.classList.add('touch-dragging');
        try {
          columnEl.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is unavailable if the pointer already ended.
        }
      }, 220);
    });

    this.containerEl.addEventListener('pointermove', (event) => {
      if (!this.touchColumnDrag.columnEl) return;

      const deltaX = Math.abs(event.clientX - this.touchColumnDrag.startX);
      const deltaY = Math.abs(event.clientY - this.touchColumnDrag.startY);
      if (!this.touchColumnDrag.active && (deltaX > 8 || deltaY > 8)) {
        this.cancelTouchColumnDrag();
        return;
      }

      if (!this.touchColumnDrag.active) return;
      event.preventDefault();

      const targetEl = document.elementFromPoint(event.clientX, event.clientY);
      const targetColumn = targetEl ? targetEl.closest('.kanban-column') : null;
      if (!targetColumn || targetColumn === this.touchColumnDrag.columnEl) return;

      if (this.shouldInsertBeforeColumn(targetColumn, event.clientX, event.clientY)) {
        this.containerEl.insertBefore(this.touchColumnDrag.columnEl, targetColumn);
      } else {
        this.containerEl.insertBefore(this.touchColumnDrag.columnEl, targetColumn.nextSibling);
      }
    });

    const finish = (event) => {
      if (!this.touchColumnDrag.columnEl) return;
      if (!this.touchColumnDrag.active) {
        this.cancelTouchColumnDrag();
        return;
      }

      event.preventDefault();
      void this.finishTouchColumnDrag();
    };

    this.containerEl.addEventListener('pointerup', finish);
    this.containerEl.addEventListener('pointercancel', () => this.cancelTouchColumnDrag());
  }

  clearTouchColumnDragTimer() {
    if (this.touchColumnDrag.timerId) {
      window.clearTimeout(this.touchColumnDrag.timerId);
      this.touchColumnDrag.timerId = null;
    }
  }

  cancelTouchColumnDrag() {
    this.clearTouchColumnDragTimer();
    if (this.touchColumnDrag.columnEl) {
      this.touchColumnDrag.columnEl.classList.remove('touch-dragging');
    }
    this.touchColumnDrag.columnEl = null;
    this.touchColumnDrag.active = false;
    this.draggedColumnEl = null;
  }

  async finishTouchColumnDrag() {
    const columnEl = this.touchColumnDrag.columnEl;
    this.clearTouchColumnDragTimer();

    if (!columnEl) {
      this.cancelTouchColumnDrag();
      return;
    }

    try {
      await this.saveDOMColumnOrder();
    } finally {
      columnEl.classList.remove('touch-dragging');
      this.touchColumnDrag.columnEl = null;
      this.touchColumnDrag.active = false;
      this.draggedColumnEl = null;
    }
  }

  shouldInsertBeforeColumn(targetColumn, clientX, clientY) {
    const rect = targetColumn.getBoundingClientRect();
    const isVertical = getComputedStyle(this.containerEl).flexDirection.startsWith('column');
    if (isVertical) {
      return clientY < rect.top + rect.height / 2;
    }
    return clientX < rect.left + rect.width / 2;
  }

  /**
   * 將目前的 DOM 欄位順序儲存至資料庫
   */
  async saveDOMColumnOrder() {
    const colNodes = this.containerEl.querySelectorAll('.kanban-column');
    const updatedColumns = [];

    for (let i = 0; i < colNodes.length; i++) {
      const columnId = colNodes[i].dataset.columnId;
      const col = await columnService.getColumn(columnId);
      if (col) {
        col.order = i;
        updatedColumns.push(col);
      }
    }

    if (updatedColumns.length > 0) {
      await columnService.updateColumnOrders(updatedColumns);
    }
  }

  /**
   * 渲染看板內的所有欄位與新增欄位按鈕
   */
  async render() {
    this.activeBoardId = boardService.getActiveBoardId();
    if (!this.activeBoardId) {
      this.containerEl.innerHTML = `
        <div class="empty-state" style="text-align: center; width: 100%; padding: 60px 20px;">
          <h2 class="text-muted">請先在左側建立或選擇一個看板</h2>
        </div>
      `;
      return;
    }

    const columns = await columnService.getColumnsByBoard(this.activeBoardId);
    this.containerEl.innerHTML = '';

    // 1. 繪製所有欄位
    for (const col of columns) {
      const columnNode = document.createElement('div');
      columnNode.className = 'kanban-column glass-panel';
      columnNode.dataset.columnId = col.id;
      
      columnNode.innerHTML = `
        <div class="column-header">
          <div class="column-title-container">
            <span class="column-title" data-column-id="${col.id}">${escapeHtml(col.name)}</span>
            <span class="column-card-count" id="count-${col.id}">0</span>
          </div>
          <button class="btn-delete-column" data-column-id="${col.id}" aria-label="刪除欄位">
            <i data-lucide="more-horizontal" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
        
        <!-- 卡片放置容器 -->
        <div class="cards-list" data-column-id="${col.id}" id="cards-list-${col.id}">
          <!-- 卡片內容將動態渲染 -->
        </div>

        <!-- 卡片新增控制器 -->
        <div class="column-footer" style="margin-top: 10px;">
          <button class="btn btn-add-card-trigger" id="btn-trigger-${col.id}" data-column-id="${col.id}">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            <span>新增卡片</span>
          </button>
          
          <div class="quick-card-creator hidden" id="quick-creator-${col.id}">
            <textarea class="quick-card-input" id="input-title-${col.id}" placeholder="輸入卡片標題..." rows="2"></textarea>
            <div class="quick-card-actions">
              <button class="btn btn-sm btn-secondary btn-cancel-quick-card" data-column-id="${col.id}">取消</button>
              <button class="btn btn-sm btn-primary btn-save-quick-card" data-column-id="${col.id}">新增</button>
            </div>
          </div>
        </div>
      `;

      this.containerEl.appendChild(columnNode);

      // 綁定保存卡片按鈕事件
      const saveBtn = columnNode.querySelector('.btn-save-quick-card');
      const inputEl = columnNode.querySelector('.quick-card-input');
      
      const saveAction = async () => {
        const title = inputEl.value.trim();
        if (!title) {
          Toast.error('卡片標題不可為空！');
          return;
        }
        if (this.cardRenderer && this.cardRenderer.createCard) {
          try {
            await this.cardRenderer.createCard(col.id, title);
            this.hideQuickCardCreator(col.id);
          } catch (err) {
            Toast.error(err.message || '卡片建立失敗');
          }
        }
      };

      saveBtn.addEventListener('click', saveAction);
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          saveAction();
        }
        if (e.key === 'Escape') {
          this.hideQuickCardCreator(col.id);
        }
      });

      // 呼叫卡片渲染器載入卡片
      if (this.cardRenderer && this.cardRenderer.renderCardsForColumn) {
        this.cardRenderer.renderCardsForColumn(col.id);
      }
    }

    // 2. 繪製「+ 新增欄位」按鈕
    const addColNode = document.createElement('div');
    addColNode.style.display = 'flex';
    addColNode.style.flexShrink = '0';
    addColNode.innerHTML = `
      <button class="btn btn-add-column-trigger" id="btn-add-column-trigger">
        <i data-lucide="plus"></i>
        <span>新增欄位</span>
      </button>
      <div class="column-creator hidden" id="column-creator-form">
        <input type="text" id="input-new-column-name" placeholder="輸入欄位名稱..." autocomplete="off">
        <div class="quick-card-actions">
          <button class="btn btn-sm btn-secondary" id="btn-cancel-column">取消</button>
          <button class="btn btn-sm btn-primary" id="btn-save-column">確定</button>
        </div>
      </div>
    `;
    this.containerEl.appendChild(addColNode);

    // 綁定「+ 新增欄位」點擊與表單事件
    const addTrigger = addColNode.querySelector('#btn-add-column-trigger');
    const form = addColNode.querySelector('#column-creator-form');
    const cancel = addColNode.querySelector('#btn-cancel-column');
    const save = addColNode.querySelector('#btn-save-column');
    const input = addColNode.querySelector('#input-new-column-name');

    addTrigger.addEventListener('click', () => {
      addTrigger.classList.add('hidden');
      form.classList.remove('hidden');
      input.focus();
    });

    const hideForm = () => {
      form.classList.add('hidden');
      addTrigger.classList.remove('hidden');
      input.value = '';
    };

    cancel.addEventListener('click', hideForm);

    const saveCol = async () => {
      const name = input.value.trim();
      if (!name) {
        Toast.error('欄位名稱不可空白！');
        return;
      }
      try {
        const column = await columnService.createColumn(this.activeBoardId, name);
        Toast.success(`欄位「${column.name}」已建立`);
        hideForm();
      } catch (err) {
        Toast.error(err.message || '建立欄位失敗');
      }
    };

    save.addEventListener('click', saveCol);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveCol();
      if (e.key === 'Escape') hideForm();
    });

    // 重新繪製 Lucide 圖標
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}
