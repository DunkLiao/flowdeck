import { cardService } from '../card/card.service.js';
import { tagService } from '../tag/tag.service.js';
import { eventBus } from '../../core/utils/EventBus.js';

/**
 * 搜尋與篩選服務 (Search & Filter Service)
 */
class SearchService {
  constructor() {
    this.filterState = {
      keyword: '',
      priorities: [], // 勾選的優先順序 ["高", "中", "低", "無"]
      tags: [],       // 勾選的標籤 ID 陣列
      dueDates: []    // 勾選的到期日條件 ["overdue", "today", "week"]
    };

    this.debounceTimer = null;
    this.initEvents();
  }

  /**
   * 初始化搜尋與篩選介面的事件
   */
  initEvents() {
    // 監聽卡片更新或重新渲染事件，自動重新套用篩選
    eventBus.on('card:updated', () => {
      this.applyFilters();
    });

    eventBus.on('column:updated', () => {
      // 延遲執行以確保 DOM 已更新
      setTimeout(() => this.applyFilters(), 50);
    });

    // 關鍵字搜尋 (防抖動 150ms)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.filterState.keyword = e.target.value.trim().toLowerCase();
          this.applyFilters();
        }, 150);
      });
    }

    // 篩選選單顯示/隱藏切換
    const filterBtn = document.getElementById('btn-filter-menu');
    const filterDropdown = document.getElementById('filter-dropdown');
    if (filterBtn && filterDropdown) {
      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('hidden');
        filterBtn.classList.toggle('active');
      });

      // 點擊外部關閉選單
      document.addEventListener('click', (e) => {
        if (!filterDropdown.classList.contains('hidden') && !e.target.closest('#filter-dropdown') && !e.target.closest('#btn-filter-menu')) {
          filterDropdown.classList.add('hidden');
          filterBtn.classList.remove('active');
        }
      });
    }

    // 優先權篩選 Checkbox
    document.addEventListener('change', (e) => {
      if (e.target.name === 'filter-priority') {
        const checkboxes = document.querySelectorAll('input[name="filter-priority"]:checked');
        this.filterState.priorities = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
      }

      if (e.target.name === 'filter-tag') {
        const checkboxes = document.querySelectorAll('input[name="filter-tag"]:checked');
        this.filterState.tags = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
      }

      if (e.target.name === 'filter-due-date') {
        const checkboxes = document.querySelectorAll('input[name="filter-due-date"]:checked');
        this.filterState.dueDates = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
      }
    });

    // 清除所有篩選條件
    const clearFiltersBtn = document.getElementById('btn-clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
  }

  /**
   * 清除所有篩選條件與 UI 勾選狀態
   */
  clearAllFilters() {
    this.filterState.keyword = '';
    this.filterState.priorities = [];
    this.filterState.tags = [];
    this.filterState.dueDates = [];

    // 重設 UI
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const checkboxes = document.querySelectorAll('input[name="filter-priority"], input[name="filter-tag"], input[name="filter-due-date"]');
    checkboxes.forEach(cb => {
      cb.checked = false;
      // 還原標籤篩選按鈕樣式
      const cbSpan = cb.nextElementSibling;
      if (cbSpan && cb.name === 'filter-tag') {
        cbSpan.style.backgroundColor = '';
        cbSpan.style.color = '';
        cbSpan.style.borderColor = '';
      }
    });

    this.applyFilters();
  }

  /**
   * 套用篩選邏輯，切換卡片 DOM 的隱藏狀態
   */
  async applyFilters() {
    const cardNodes = document.querySelectorAll('.kanban-card');

    let activeFilterCount = 0;
    if (this.filterState.keyword) activeFilterCount++;
    activeFilterCount += this.filterState.priorities.length;
    activeFilterCount += this.filterState.tags.length;
    activeFilterCount += this.filterState.dueDates.length;

    // 更新篩選徽章 (badge)
    const badge = document.getElementById('active-filters-count');
    const filterBtn = document.getElementById('btn-filter-menu');
    if (badge && filterBtn) {
      if (activeFilterCount > 0) {
        badge.textContent = activeFilterCount;
        badge.style.display = 'inline-block';
        filterBtn.classList.add('active');
      } else {
        badge.style.display = 'none';
        filterBtn.classList.remove('active');
      }
    }

    if (cardNodes.length === 0) return;

    // 依序過濾 DOM 節點
    for (const node of cardNodes) {
      const cardId = node.dataset.cardId;
      if (!cardId) continue;

      const card = await cardService.getCard(cardId);
      if (!card) {
        node.classList.add('hidden');
        continue;
      }

      let matches = true;

      // 1. 關鍵字模糊篩選 (標題、描述)
      if (this.filterState.keyword) {
        const titleMatch = card.title.toLowerCase().includes(this.filterState.keyword);
        const descMatch = card.description.toLowerCase().includes(this.filterState.keyword);
        if (!titleMatch && !descMatch) {
          matches = false;
        }
      }

      // 2. 優先級篩選
      if (matches && this.filterState.priorities.length > 0) {
        if (!this.filterState.priorities.includes(card.priority)) {
          matches = false;
        }
      }

      // 3. 標籤篩選 (聯集：符合任一個即可)
      if (matches && this.filterState.tags.length > 0) {
        const cardTags = await tagService.getTagsForCard(cardId);
        const cardTagIds = cardTags.map(t => t.id);
        const hasTagMatch = this.filterState.tags.some(id => cardTagIds.includes(id));
        if (!hasTagMatch) {
          matches = false;
        }
      }

      // 4. 到期日篩選
      if (matches && this.filterState.dueDates.length > 0) {
        matches = this.matchesDueDateFilter(card.dueDate);
      }

      // 切換 visibility
      if (matches) {
        node.classList.remove('hidden');
      } else {
        node.classList.add('hidden');
      }
    }

    // 重新計算每個欄位目前「可見」的卡片數量並更新計數器
    const columnLists = document.querySelectorAll('.cards-list');
    columnLists.forEach(list => {
      const columnId = list.dataset.columnId;
      const visibleCount = list.querySelectorAll('.kanban-card:not(.hidden)').length;
      const totalCount = list.querySelectorAll('.kanban-card').length;
      const badgeEl = document.getElementById(`count-${columnId}`);
      if (badgeEl) {
        badgeEl.textContent = visibleCount;
      }
      this.renderFilterEmptyState(list, activeFilterCount > 0 && totalCount > 0 && visibleCount === 0);
    });
  }

  matchesDueDateFilter(dueDate) {
    if (!dueDate) return false;

    const today = new Date();
    const todayText = this.formatDate(today);
    const dueText = String(dueDate);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 6);
    const weekEndText = this.formatDate(weekEnd);

    return this.filterState.dueDates.some((filter) => {
      if (filter === 'overdue') return dueText < todayText;
      if (filter === 'today') return dueText === todayText;
      if (filter === 'week') return dueText >= todayText && dueText <= weekEndText;
      return false;
    });
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  renderFilterEmptyState(list, shouldShow) {
    let emptyNode = list.querySelector('.filter-empty-state');
    if (shouldShow) {
      if (!emptyNode) {
        emptyNode = document.createElement('div');
        emptyNode.className = 'filter-empty-state text-muted';
        emptyNode.textContent = '無符合條件之卡片';
        list.appendChild(emptyNode);
      }
      emptyNode.classList.remove('hidden');
    } else if (emptyNode) {
      emptyNode.classList.add('hidden');
    }
  }
}

export const searchService = new SearchService();
