import { cardService } from './card.service.js';
import { columnService } from '../column/column.service.js';
import { boardService } from '../board/board.service.js';
import { Dialog } from '../../ui/dialog.js';
import { Toast } from '../../ui/toast.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { kanbanDB } from '../../core/db/KanbanDB.js';
import { escapeHtml, normalizeColor, sanitizeUrl } from '../../core/utils/sanitize.js';


// 輕量級 Markdown 解析器
function parseMarkdown(text) {
  if (!text) return '<p class="text-muted" style="font-style: italic;">無任務描述。點擊此處進行編輯...</p>';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // 標題 (Headers)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 粗體與斜體 (Bold & Italic)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 行內代碼 (Inline Code)
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // 連結 (Links)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_, label, url) => {
    return `<a href="${escapeHtml(sanitizeUrl(url))}" target="_blank" rel="noopener">${label}</a>`;
  });
  
  // 換行 (Line breaks)
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * 卡片元件 (Card Component)
 */
export class CardComponent {
  constructor() {
    // 詳情 Modal DOM 物件
    this.modalOverlay = document.getElementById('modal-container');
    this.modalContent = document.getElementById('card-detail-modal');
    this.closeModalBtn = document.getElementById('btn-close-modal');
    
    this.modalCardTitle = document.getElementById('modal-card-title');
    this.modalCardDescPreview = document.getElementById('card-desc-preview');
    this.modalCardDescTextarea = document.getElementById('card-desc-textarea');
    this.btnEditDesc = document.getElementById('btn-edit-desc');
    
    this.modalSelectColumn = document.getElementById('modal-select-column');
    this.modalSelectPriority = document.getElementById('modal-select-priority');
    this.modalInputDueDate = document.getElementById('modal-input-duedate');
    this.btnDeleteCard = document.getElementById('btn-delete-card');

    this.activeCardId = null;
    this.draggedCardId = null;
    this.isClosingModal = false;
    this.columnRenderVersions = new Map();
    this.pendingDueDateCommits = new Map();
    this.touchDrag = {
      cardEl: null,
      cardId: null,
      timerId: null,
      active: false,
      startX: 0,
      startY: 0
    };
    this.suppressCardClickUntil = 0;

    this.initEvents();
  }

  /**
   * 初始化卡片全域事件
   */
  initEvents() {
    // 訂閱卡片更新事件
    eventBus.on('card:updated', (data) => {
      if (data && data.columnId) {
        this.renderCardsForColumn(data.columnId);
      }
      if (data && data.cardId && this.activeCardId === data.cardId) {
        // 如果編輯的是當前打開的卡片，同步更新 Modal
        this.loadCardDetailToModal(data.cardId);
      }
    });

    // 關閉 Modal
    this.closeModalBtn.addEventListener('click', () => {
      void this.closeModal();
    });
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) void this.closeModal();
    });

    // 刪除卡片
    this.btnDeleteCard.addEventListener('click', async () => {
      if (!this.activeCardId) return;
      const card = await cardService.getCard(this.activeCardId);
      if (!card) return;

      const confirm = await Dialog.confirm(
        '刪除卡片',
        `您確定要永久刪除卡片「${card.title}」嗎？此動作將無法還原。`,
        'danger'
      );

      if (confirm) {
        await cardService.deleteCard(this.activeCardId);
        Toast.success('卡片已刪除');
        void this.closeModal();
      }
    });

    // Modal 卡片標題即時更名
    this.modalCardTitle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.modalCardTitle.blur();
      }
    });
    this.modalCardTitle.addEventListener('blur', async () => {
      if (!this.activeCardId) return;
      const newTitle = this.modalCardTitle.textContent.trim();
      if (!newTitle) {
        const card = await cardService.getCard(this.activeCardId);
        this.modalCardTitle.textContent = card ? card.title : '未命名任務';
        Toast.error('任務標題不可為空！');
        return;
      }
      const card = await cardService.getCard(this.activeCardId);
      if (card && card.title !== newTitle) {
        try {
          card.title = newTitle;
          await cardService.updateCard(card);
          Toast.success('標題更新成功');
        } catch (err) {
          this.modalCardTitle.textContent = card.title;
          Toast.error(err.message || '標題更新失敗');
        }
      }
    });

    // 描述編輯模式切換
    this.modalCardDescPreview.addEventListener('click', () => this.enterDescEditMode());
    this.btnEditDesc.addEventListener('click', () => {
      if (this.modalCardDescTextarea.classList.contains('hidden')) {
        this.enterDescEditMode();
      } else {
        this.saveDescription();
      }
    });

    // 屬性更動監聽器
    this.modalSelectColumn.addEventListener('change', async () => {
      if (!this.activeCardId) return;
      const targetColumnId = this.modalSelectColumn.value;
      const card = await cardService.getCard(this.activeCardId);
      if (card && card.columnId !== targetColumnId) {
        // 移動至該欄位最末端
        const siblingCards = await cardService.getCardsByColumn(targetColumnId);
        await cardService.moveCard(this.activeCardId, targetColumnId, siblingCards.length);
        Toast.success('卡片狀態已變更');
      }
    });

    this.modalSelectPriority.addEventListener('change', async () => {
      if (!this.activeCardId) return;
      const val = this.modalSelectPriority.value;
      const card = await cardService.getCard(this.activeCardId);
      if (card && card.priority !== val) {
        card.priority = val;
        await cardService.updateCard(card);
      }
    });

    this.modalInputDueDate.addEventListener('click', () => this.openDueDatePicker());
    this.modalInputDueDate.addEventListener('focus', () => this.openDueDatePicker());
    this.modalInputDueDate.addEventListener('input', () => {
      void this.commitDueDateChange();
    });
    this.modalInputDueDate.addEventListener('change', () => {
      void this.commitDueDateChange();
    });
    this.modalInputDueDate.addEventListener('blur', () => {
      void this.commitDueDateChange();
    });

    // 全域鍵盤事件：Esc 關閉 Modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalOverlay.classList.contains('hidden')) {
        void this.closeModal();
      }
    });

    // 欄位容器的卡片拖拽與點擊開啟詳情
    const columnsContainer = document.getElementById('board-columns-container');
    
    // 事件委派：卡片點擊詳情
    columnsContainer.addEventListener('click', (e) => {
      if (Date.now() < this.suppressCardClickUntil) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const cardEl = e.target.closest('.kanban-card');
      if (cardEl && !e.target.closest('.btn-delete-card') && !e.target.closest('.btn-delete-column')) {
        this.openCardDetail(cardEl.dataset.cardId).catch((err) => {
          console.error('[CardComponent] 開啟卡片詳情失敗:', err);
          Toast.error('開啟卡片詳情失敗，請重新整理後再試。');
        });
      }
    });

    // 卡片 HTML5 拖拽事件
    columnsContainer.addEventListener('dragstart', (e) => {
      const cardEl = e.target.closest('.kanban-card');
      if (cardEl) {
        this.draggedCardId = cardEl.dataset.cardId;
        cardEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.draggedCardId);
      }
    });

    columnsContainer.addEventListener('dragover', (e) => {
      const cardsList = e.target.closest('.cards-list');
      if (!cardsList || !this.draggedCardId) return;
      e.preventDefault();

      // 計算插入位置
      const afterElement = this.getDragAfterElement(cardsList, e.clientY);
      const draggedEl = document.querySelector(`.kanban-card[data-card-id="${this.draggedCardId}"]`);
      if (draggedEl) {
        if (afterElement == null) {
          cardsList.appendChild(draggedEl);
        } else {
          cardsList.insertBefore(draggedEl, afterElement);
        }
      }
    });

    columnsContainer.addEventListener('dragend', async (e) => {
      const cardEl = e.target.closest('.kanban-card');
      if (cardEl && this.draggedCardId) {
        cardEl.classList.remove('dragging');
        
        // 取得拖曳放置的最新 column 與順序
        const targetList = cardEl.closest('.cards-list');
        if (targetList) {
          const targetColumnId = targetList.dataset.columnId;
          const cardNodes = targetList.querySelectorAll('.kanban-card');
          const newOrder = Array.from(cardNodes).indexOf(cardEl);
          
          if (newOrder !== -1) {
            await cardService.moveCard(this.draggedCardId, targetColumnId, newOrder);
          }
        }
        
        this.draggedCardId = null;
      }
    });

    this.setupTouchCardDrag(columnsContainer);
  }

  setupTouchCardDrag(columnsContainer) {
    columnsContainer.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' || event.button !== 0) return;

      const cardEl = event.target.closest('.kanban-card');
      if (!cardEl || event.target.closest('button, input, textarea, select, a')) return;

      this.clearTouchCardDragTimer();
      this.touchDrag.cardEl = cardEl;
      this.touchDrag.cardId = cardEl.dataset.cardId;
      this.touchDrag.active = false;
      this.touchDrag.startX = event.clientX;
      this.touchDrag.startY = event.clientY;

      this.touchDrag.timerId = window.setTimeout(() => {
        if (!this.touchDrag.cardEl) return;
        this.touchDrag.active = true;
        this.draggedCardId = this.touchDrag.cardId;
        this.touchDrag.cardEl.classList.add('touch-dragging');
        try {
          this.touchDrag.cardEl.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is unavailable if the pointer already ended.
        }
      }, 180);
    });

    columnsContainer.addEventListener('pointermove', (event) => {
      if (!this.touchDrag.cardEl) return;

      const deltaX = Math.abs(event.clientX - this.touchDrag.startX);
      const deltaY = Math.abs(event.clientY - this.touchDrag.startY);
      if (!this.touchDrag.active && (deltaX > 8 || deltaY > 8)) {
        this.cancelTouchCardDrag();
        return;
      }

      if (!this.touchDrag.active) return;
      event.preventDefault();

      const targetEl = document.elementFromPoint(event.clientX, event.clientY);
      const cardsList = targetEl ? targetEl.closest('.cards-list') : null;
      if (!cardsList) return;

      const afterElement = this.getDragAfterElement(cardsList, event.clientY);
      if (afterElement == null) {
        cardsList.appendChild(this.touchDrag.cardEl);
      } else {
        cardsList.insertBefore(this.touchDrag.cardEl, afterElement);
      }
    });

    const finish = (event) => {
      if (!this.touchDrag.cardEl) return;
      if (!this.touchDrag.active) {
        this.cancelTouchCardDrag();
        return;
      }

      event.preventDefault();
      this.suppressCardClickUntil = Date.now() + 350;
      void this.finishTouchCardDrag();
    };

    columnsContainer.addEventListener('pointerup', finish);
    columnsContainer.addEventListener('pointercancel', () => this.cancelTouchCardDrag());
  }

  clearTouchCardDragTimer() {
    if (this.touchDrag.timerId) {
      window.clearTimeout(this.touchDrag.timerId);
      this.touchDrag.timerId = null;
    }
  }

  cancelTouchCardDrag() {
    this.clearTouchCardDragTimer();
    if (this.touchDrag.cardEl) {
      this.touchDrag.cardEl.classList.remove('touch-dragging');
    }
    this.touchDrag.cardEl = null;
    this.touchDrag.cardId = null;
    this.touchDrag.active = false;
    this.draggedCardId = null;
  }

  async finishTouchCardDrag() {
    const cardEl = this.touchDrag.cardEl;
    const cardId = this.touchDrag.cardId;
    this.clearTouchCardDragTimer();

    if (!cardEl || !cardId) {
      this.cancelTouchCardDrag();
      return;
    }

    try {
      const targetList = cardEl.closest('.cards-list');
      if (targetList) {
        const targetColumnId = targetList.dataset.columnId;
        const cardNodes = targetList.querySelectorAll('.kanban-card');
        const newOrder = Array.from(cardNodes).indexOf(cardEl);
        if (targetColumnId && newOrder !== -1) {
          await cardService.moveCard(cardId, targetColumnId, newOrder);
        }
      }
    } finally {
      cardEl.classList.remove('touch-dragging');
      this.touchDrag.cardEl = null;
      this.touchDrag.cardId = null;
      this.touchDrag.active = false;
      this.draggedCardId = null;
    }
  }

  /**
   * 計算拖曳點擊時位於哪張卡片的前面或後面
   */
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  openDueDatePicker() {
    if (typeof this.modalInputDueDate.showPicker !== 'function') return;

    try {
      this.modalInputDueDate.showPicker();
    } catch {
      // Some browsers only allow showPicker() during a direct user gesture.
    }
  }

  async commitDueDateChange() {
    const cardId = this.activeCardId;
    if (!cardId) return;

    const val = this.modalInputDueDate.value;
    if (val && !/^\d{4}-\d{2}-\d{2}$/.test(val)) return;
    if (this.pendingDueDateCommits.get(cardId) === val) return;

    this.pendingDueDateCommits.set(cardId, val);
    try {
      const card = await cardService.getCard(cardId);
      if (card && card.dueDate !== val) {
        card.dueDate = val;
        await cardService.updateCard(card);
      }
    } finally {
      if (this.pendingDueDateCommits.get(cardId) === val) {
        this.pendingDueDateCommits.delete(cardId);
      }
    }
  }

  /**
   * 進入描述編輯狀態
   */
  enterDescEditMode() {
    this.modalCardDescPreview.classList.add('hidden');
    this.modalCardDescTextarea.classList.remove('hidden');
    this.modalCardDescTextarea.focus();
    this.btnEditDesc.textContent = '儲存';
    this.btnEditDesc.className = 'btn btn-sm btn-primary';
  }

  /**
   * 儲存描述
   */
  async saveDescription() {
    if (!this.activeCardId) return;
    const card = await cardService.getCard(this.activeCardId);
    if (!card) return;

    const val = this.modalCardDescTextarea.value;
    card.description = val;
    await cardService.updateCard(card);

    this.modalCardDescPreview.innerHTML = parseMarkdown(val);
    this.modalCardDescPreview.classList.remove('hidden');
    this.modalCardDescTextarea.classList.add('hidden');
    this.btnEditDesc.textContent = '編輯';
    this.btnEditDesc.className = 'btn btn-sm btn-tertiary';
    Toast.success('描述已更新');
  }

  /**
   * 開啟卡片詳情彈出視窗
   * @param {string} id - 卡片 ID
   */
  async openCardDetail(id) {
    this.activeCardId = id;
    await this.loadCardDetailToModal(id);

    // 觸發模組間聯動 (Checklist, Tags 等子元件)
    eventBus.emit('modal:opened', { cardId: id });

    this.modalOverlay.classList.remove('hidden');
    this.modalContent.classList.remove('hidden');
  }

  /**
   * 載入卡片資訊填充至 Modal
   */
  async loadCardDetailToModal(id) {
    const card = await cardService.getCard(id);
    if (!card) return;

    this.modalCardTitle.textContent = card.title;
    this.modalCardDescTextarea.value = card.description;
    this.modalCardDescPreview.innerHTML = parseMarkdown(card.description);
    
    // 重設描述編輯按鈕
    this.modalCardDescPreview.classList.remove('hidden');
    this.modalCardDescTextarea.classList.add('hidden');
    this.btnEditDesc.textContent = '編輯';
    this.btnEditDesc.className = 'btn btn-sm btn-tertiary';

    // 填充欄位選擇下拉選單
    const activeBoardId = boardService.getActiveBoardId();
    const columns = await columnService.getColumnsByBoard(activeBoardId);
    
    this.modalSelectColumn.innerHTML = '';
    columns.forEach(col => {
      const option = document.createElement('option');
      option.value = col.id;
      option.textContent = col.name;
      if (col.id === card.columnId) option.selected = true;
      this.modalSelectColumn.appendChild(option);
    });

    // 優先權與到期日
    this.modalSelectPriority.value = card.priority;
    this.modalInputDueDate.value = card.dueDate || '';
  }

  /**
   * 關閉 Modal
   */
  async closeModal() {
    if (this.isClosingModal) return;
    this.isClosingModal = true;
    try {
      // 檢查如果在描述編輯模式，自動保存
      if (!this.modalCardDescTextarea.classList.contains('hidden')) {
        await this.saveDescription();
      }
      this.modalOverlay.classList.add('hidden');
      this.modalContent.classList.add('hidden');
      this.activeCardId = null;
      eventBus.emit('modal:closed');
    } catch (err) {
      Toast.error(err.message || '關閉卡片視窗時儲存失敗');
    } finally {
      this.isClosingModal = false;
    }
  }

  /**
   * 外部呼叫建立卡片 API
   */
  async createCard(columnId, title) {
    await cardService.createCard(columnId, title);
    Toast.success('卡片建立成功');
  }

  /**
   * 渲染特定欄位底下的所有卡片
   */
  async renderCardsForColumn(columnId) {
    try {
      const cardsListEl = document.getElementById(`cards-list-${columnId}`);
      const countBadgeEl = document.getElementById(`count-${columnId}`);
      if (!cardsListEl) return;

      const renderVersion = (this.columnRenderVersions.get(columnId) || 0) + 1;
      this.columnRenderVersions.set(columnId, renderVersion);

      const cards = await cardService.getCardsByColumn(columnId);
      if (this.columnRenderVersions.get(columnId) !== renderVersion) return;

      if (countBadgeEl) {
        countBadgeEl.textContent = cards.length;
      }

      if (cards.length === 0) {
        const emptyNode = document.createElement('div');
        emptyNode.className = 'cards-empty text-muted';
        emptyNode.style.cssText = 'text-align:center; padding: 10px; font-size:12px; pointer-events: none;';
        emptyNode.textContent = '無任務';
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
        cardsListEl.replaceChildren(emptyNode);
        return;
      }

      const fragment = document.createDocumentFragment();
      for (const card of cards) {
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;

        const cardNode = document.createElement('div');
        cardNode.className = 'kanban-card';
        cardNode.draggable = true;
        cardNode.dataset.cardId = card.id;

        let isOverdue = false;
        let formattedDate = '';
        if (card.dueDate) {
          const today = new Date().toISOString().split('T')[0];
          isOverdue = card.dueDate < today && card.priority !== '已完成';
          const dateObj = new Date(card.dueDate);
          formattedDate = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
        }

        const checklists = await kanbanDB.queryByIndex('checklists', 'cardId', card.id);
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
        const totalCheck = checklists.length;
        const checkedCount = checklists.filter(item => item.checked).length;
        const hasChecklist = totalCheck > 0;

        const cardTags = await kanbanDB.queryByIndex('cardTags', 'cardId', card.id);
        if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
        let tagDotsHtml = '';
        for (const ct of cardTags) {
          const tag = await kanbanDB.get('tags', ct.tagId);
          if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
          if (tag) {
            tagDotsHtml += `<span class="card-tag" style="background-color: ${normalizeColor(tag.color)};" title="${escapeHtml(tag.name)}"></span>`;
          }
        }

        const priority = ['高', '中', '低', '無'].includes(card.priority) ? card.priority : '無';
        cardNode.innerHTML = `
          <div class="card-title">${escapeHtml(card.title)}</div>
          <div class="card-meta">
            <div class="card-left-meta">
              <span class="card-badge badge-priority-${priority}">${priority}</span>
              ${card.dueDate ? `
                <span class="card-duedate ${isOverdue ? 'overdue' : ''}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>${formattedDate}</span>
                </span>
              ` : ''}
              ${hasChecklist ? `
                <span class="card-checklist-summary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>${checkedCount}/${totalCheck}</span>
                </span>
              ` : ''}
            </div>
            <div class="card-tags">
              ${tagDotsHtml}
            </div>
          </div>
        `;

        fragment.appendChild(cardNode);
      }

      if (this.columnRenderVersions.get(columnId) !== renderVersion) return;
      cardsListEl.replaceChildren(fragment);
    } catch (err) {
      console.error('[CardComponent] renderCardsForColumn failed:', err);
      Toast.error('卡片渲染失敗，請檢查主控台錯誤。');
    }
  }
}
