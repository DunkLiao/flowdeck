import { checklistService } from './checklist.service.js';
import { Toast } from '../../ui/toast.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { escapeHtml } from '../../core/utils/sanitize.js';

/**
 * 待辦清單元件 (Checklist Component)
 */
export class ChecklistComponent {
  constructor() {
    this.containerEl = document.getElementById('modal-checklist-items');
    this.inputNewItem = document.getElementById('input-new-checklist-item');
    this.btnAddItem = document.getElementById('btn-add-checklist-item');
    this.progressBar = document.getElementById('checklist-progress-bar');
    this.progressText = document.getElementById('checklist-progress-text');

    this.cardId = null;
    this.draggedItemId = null;

    this.initEvents();
  }

  /**
   * 初始化事件與訂閱
   */
  initEvents() {
    // 監聽 Modal 開啟，載入該卡片的 Checklist
    eventBus.on('modal:opened', (data) => {
      this.cardId = data.cardId;
      this.render();
    });

    eventBus.on('modal:closed', () => {
      this.cardId = null;
      this.containerEl.innerHTML = '';
      this.progressBar.style.width = '0%';
      this.progressText.textContent = '0/0';
    });

    // 新增項目按鈕
    this.btnAddItem.addEventListener('click', () => this.handleAddItem());
    this.inputNewItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleAddItem();
      }
    });

    // 事件委派：勾選、刪除、雙擊更名
    this.containerEl.addEventListener('click', async (e) => {
      const itemNode = e.target.closest('.checklist-item');
      if (!itemNode) return;

      const itemId = itemNode.dataset.itemId;

      // 1. 勾選核取方塊
      if (e.target.type === 'checkbox') {
        await checklistService.toggleChecklistItem(itemId);
        this.render();
        return;
      }

      // 2. 刪除按鈕
      const deleteBtn = e.target.closest('.btn-delete-checklist-item');
      if (deleteBtn) {
        await checklistService.deleteChecklistItem(itemId);
        this.render();
        return;
      }
    });

    // 委派雙擊名稱更名
    this.containerEl.addEventListener('dblclick', (e) => {
      const titleEl = e.target.closest('.checklist-item-title');
      if (!titleEl) return;

      const itemNode = titleEl.closest('.checklist-item');
      const itemId = itemNode.dataset.itemId;

      titleEl.contentEditable = 'true';
      titleEl.focus();

      const onKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          titleEl.blur();
        }
        if (event.key === 'Escape') {
          titleEl.contentEditable = 'false';
          this.render();
        }
      };

      const onBlur = async () => {
        titleEl.contentEditable = 'false';
        titleEl.removeEventListener('keydown', onKeyDown);
        titleEl.removeEventListener('blur', onBlur);

        const newName = titleEl.textContent.trim();
        if (!newName) {
          Toast.error('待辦內容不可空白！');
          this.render();
          return;
        }

        try {
          await checklistService.renameChecklistItem(itemId, newName);
          this.render();
        } catch (err) {
          Toast.error(err.message || '待辦內容修改失敗');
          this.render();
        }
      };

      titleEl.addEventListener('keydown', onKeyDown);
      titleEl.addEventListener('blur', onBlur);
    });

    // 垂直拖曳排序
    this.setupVerticalDragAndDrop();
  }

  /**
   * 垂直拖曳事件設定
   */
  setupVerticalDragAndDrop() {
    this.containerEl.addEventListener('dragstart', (e) => {
      const itemEl = e.target.closest('.checklist-item');
      if (itemEl && e.target.closest('.checklist-item-drag-handle')) {
        this.draggedItemId = itemEl.dataset.itemId;
        itemEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.draggedItemId);
      }
    });

    this.containerEl.addEventListener('dragover', (e) => {
      if (!this.draggedItemId) return;
      e.preventDefault();

      const targetItem = e.target.closest('.checklist-item');
      const container = this.containerEl;
      
      if (targetItem && targetItem !== container.querySelector('.checklist-item.dragging')) {
        const rect = targetItem.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        const draggedEl = container.querySelector(`.checklist-item[data-item-id="${this.draggedItemId}"]`);
        if (draggedEl) {
          if (e.clientY < midpoint) {
            container.insertBefore(draggedEl, targetItem);
          } else {
            container.insertBefore(draggedEl, targetItem.nextSibling);
          }
        }
      }
    });

    this.containerEl.addEventListener('dragend', async (e) => {
      const itemEl = e.target.closest('.checklist-item');
      if (itemEl && this.draggedItemId) {
        itemEl.classList.remove('dragging');
        
        // 儲存新順序
        await this.saveDOMChecklistOrder();
        this.draggedItemId = null;
      }
    });
  }

  /**
   * 將 DOM 排列順序同步寫入資料庫
   */
  async saveDOMChecklistOrder() {
    const itemNodes = this.containerEl.querySelectorAll('.checklist-item');
    const updatedItems = [];

    for (let i = 0; i < itemNodes.length; i++) {
      const itemId = itemNodes[i].dataset.itemId;
      const item = await checklistService.getChecklistByCard(this.cardId).then(items => items.find(x => x.id === itemId));
      if (item) {
        item.order = i;
        updatedItems.push(item);
      }
    }

    if (updatedItems.length > 0) {
      await checklistService.updateChecklistOrders(this.cardId, updatedItems);
    }
  }

  /**
   * 新增待辦項目
   */
  async handleAddItem() {
    if (!this.cardId) return;
    const title = this.inputNewItem.value.trim();
    if (!title) {
      Toast.error('待辦內容不可為空！');
      return;
    }

    try {
      await checklistService.createChecklistItem(this.cardId, title);
      this.inputNewItem.value = '';
      this.render();
    } catch (err) {
      Toast.error(err.message || '新增待辦失敗');
    }
  }

  /**
   * 渲染待辦列表與進度條
   */
  async render() {
    if (!this.cardId) return;

    const items = await checklistService.getChecklistByCard(this.cardId);
    this.containerEl.innerHTML = '';

    // 1. 計算進度
    const total = items.length;
    const checked = items.filter(x => x.checked).length;
    const progress = total === 0 ? 0 : Math.round((checked / total) * 100);

    this.progressBar.style.width = `${progress}%`;
    this.progressText.textContent = `${checked}/${total}`;

    // 2. 渲染項目
    items.forEach(item => {
      const itemNode = document.createElement('div');
      itemNode.className = `checklist-item ${item.checked ? 'checked' : ''}`;
      itemNode.dataset.itemId = item.id;
      
      itemNode.innerHTML = `
        <span class="checklist-item-drag-handle" draggable="true">
          <i data-lucide="grip-vertical" style="width: 14px; height: 14px;"></i>
        </span>
        <input type="checkbox" ${item.checked ? 'checked' : ''}>
        <span class="checklist-item-title">${escapeHtml(item.title)}</span>
        <button class="btn-delete-checklist-item" aria-label="刪除待辦">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      `;

      this.containerEl.appendChild(itemNode);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}
