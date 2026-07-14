import { tagService } from './tag.service.js';
import { Toast } from '../../ui/toast.js';
import { eventBus } from '../../core/utils/EventBus.js';
import { escapeHtml, normalizeColor } from '../../core/utils/sanitize.js';

/**
 * 標籤視圖與管理元件 (Tag Component)
 */
export class TagComponent {
  constructor() {
    // Card Modal Tags DOM
    this.modalCardTagsContainer = document.getElementById('modal-card-tags');
    this.btnManageTags = document.getElementById('btn-manage-tags');
    
    // Tag Manager Sub-Modal DOM
    this.managerOverlay = document.getElementById('tag-manager-modal');
    this.closeManagerBtn = document.getElementById('btn-close-tag-manager');
    this.inputNewTagName = document.getElementById('input-new-tag-name');
    this.inputNewTagColor = document.getElementById('input-new-tag-color');
    this.btnCreateTag = document.getElementById('btn-create-tag');
    this.tagManagerList = document.getElementById('tag-manager-list');

    // Dashboard Filter Tags DOM
    this.filterTagsList = document.getElementById('filter-tags-list');

    this.cardId = null;

    this.initEvents();
  }

  /**
   * 初始化事件與訂閱
   */
  initEvents() {
    // 訂閱 Modal 開啟/關閉
    eventBus.on('modal:opened', (data) => {
      this.cardId = data.cardId;
      this.render();
    });

    eventBus.on('modal:closed', () => {
      this.cardId = null;
      this.modalCardTagsContainer.innerHTML = '';
    });

    // 訂閱標籤清單更新
    eventBus.on('tag:list-updated', () => {
      this.render();
      this.renderFilterTagsList();
    });

    // 打開/關閉標籤管理介面
    this.btnManageTags.addEventListener('click', () => {
      this.managerOverlay.classList.remove('hidden');
      this.renderTagManagerList();
    });
    this.closeManagerBtn.addEventListener('click', () => {
      this.managerOverlay.classList.add('hidden');
      this.inputNewTagName.value = '';
    });

    // 建立新標籤
    this.btnCreateTag.addEventListener('click', () => this.handleCreateTag());
    this.inputNewTagName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleCreateTag();
    });

    // 管理清單中的刪除事件 (事件委派)
    this.tagManagerList.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('.btn-delete-tag');
      if (deleteBtn) {
        const tagId = deleteBtn.dataset.tagId;
        const tag = await tagService.getTags().then(tags => tags.find(t => t.id === tagId));
        if (tag) {
          await tagService.deleteTag(tagId);
          Toast.success(`標籤「${tag.name}」已從系統刪除`);
          this.renderTagManagerList();
        }
      }
    });

    // 卡片詳情中的標籤選取/取消選取 (事件委派)
    this.modalCardTagsContainer.addEventListener('click', async (e) => {
      const tagBadge = e.target.closest('.modal-tag-badge');
      if (!tagBadge || !this.cardId) return;

      const tagId = tagBadge.dataset.tagId;
      const isInactive = tagBadge.classList.contains('inactive');

      if (isInactive) {
        // 新增關聯
        await tagService.addTagToCard(this.cardId, tagId);
      } else {
        // 移出關聯
        await tagService.removeTagFromCard(this.cardId, tagId);
      }
      this.render();
    });
  }

  /**
   * 建立標籤
   */
  async handleCreateTag() {
    const name = this.inputNewTagName.value.trim();
    const color = this.inputNewTagColor.value;

    if (!name) {
      Toast.error('標籤名稱不可空白！');
      return;
    }

    const tags = await tagService.getTags();
    if (tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      Toast.error('標籤名稱已存在！');
      return;
    }

    try {
      const tag = await tagService.createTag(name, color);
      this.inputNewTagName.value = '';
      Toast.success(`標籤「${tag.name}」已建立`);
      this.renderTagManagerList();
    } catch (err) {
      Toast.error(err.message || '建立標籤失敗');
    }
  }

  /**
   * 渲染全域標籤管理清單
   */
  async renderTagManagerList() {
    const tags = await tagService.getTags();
    this.tagManagerList.innerHTML = '';

    if (tags.length === 0) {
      this.tagManagerList.innerHTML = `<div class="text-muted" style="padding:10px; font-size:12px; text-align:center;">無系統標籤</div>`;
      return;
    }

    tags.forEach(tag => {
      const itemNode = document.createElement('div');
      itemNode.className = 'tag-manager-item';
      const color = normalizeColor(tag.color);
      itemNode.innerHTML = `
        <span class="tag-pill" style="background-color: ${color}1c; color: ${color}; border: 1px solid ${color}50;">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${color}; margin-right:4px;"></span>
          ${escapeHtml(tag.name)}
        </span>
        <button class="btn-delete-tag" data-tag-id="${tag.id}" aria-label="刪除標籤">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      `;
      this.tagManagerList.appendChild(itemNode);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * 渲染篩選選單中的標籤核取方塊
   */
  async renderFilterTagsList() {
    if (!this.filterTagsList) return;
    const tags = await tagService.getTags();
    this.filterTagsList.innerHTML = '';

    if (tags.length === 0) {
      this.filterTagsList.innerHTML = `<div class="text-muted" style="font-size:12px; font-style:italic;">目前無標籤</div>`;
      return;
    }

    tags.forEach(tag => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      const color = normalizeColor(tag.color);
      label.innerHTML = `
        <input type="checkbox" name="filter-tag" value="${tag.id}">
        <span class="custom-checkbox" style="--tag-color: ${color}">
          ${escapeHtml(tag.name)}
        </span>
      `;

      // 支援動態樣式
      const cbSpan = label.querySelector('.custom-checkbox');
      label.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          cbSpan.style.backgroundColor = color;
          cbSpan.style.color = '#fff';
          cbSpan.style.borderColor = color;
        } else {
          cbSpan.style.backgroundColor = '';
          cbSpan.style.color = '';
          cbSpan.style.borderColor = '';
        }
      });

      this.filterTagsList.appendChild(label);
    });
  }

  /**
   * 渲染卡片 Modal 內部的標籤狀態列 (顯示所有標籤，啟用的亮起，未啟用的反灰)
   */
  async render() {
    if (!this.cardId) return;

    const allTags = await tagService.getTags();
    const activeTags = await tagService.getTagsForCard(this.cardId);
    
    this.modalCardTagsContainer.innerHTML = '';

    if (allTags.length === 0) {
      this.modalCardTagsContainer.innerHTML = `<span class="text-muted" style="font-size:12px; font-style:italic;">點擊下方按鈕以建立標籤</span>`;
      return;
    }

    const activeIds = new Set(activeTags.map(t => t.id));

    allTags.forEach(tag => {
      const isActive = activeIds.has(tag.id);
      const badge = document.createElement('span');
      badge.className = `modal-tag-badge ${isActive ? '' : 'inactive'}`;
      badge.dataset.tagId = tag.id;
      const color = normalizeColor(tag.color);
      
      if (isActive) {
        badge.style.backgroundColor = `${color}1c`;
        badge.style.color = color;
        badge.style.borderColor = `${color}50`;
        badge.innerHTML = `
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${color};"></span>
          <span>${escapeHtml(tag.name)}</span>
        `;
      } else {
        badge.innerHTML = `
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:var(--text-disabled);"></span>
          <span>${escapeHtml(tag.name)}</span>
        `;
      }

      this.modalCardTagsContainer.appendChild(badge);
    });
  }
}
