/**
 * 全域 Toast 通知單例
 */
export const Toast = {
  /**
   * 顯示 Toast 訊息
   * @param {string} message - 顯示內容
   * @param {'success'|'error'|'warning'|'info'} [type='info'] - 類型
   * @param {number} [duration=3000] - 顯示毫秒數
   */
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // 建立 Toast 元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // 根據類型選擇 SVG 圖標
    let iconSvg = '';
    switch (type) {
      case 'success':
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        break;
      case 'error':
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        break;
      case 'warning':
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        break;
      case 'info':
      default:
        iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        break;
    }

    toast.innerHTML = iconSvg;
    const messageEl = document.createElement('span');
    messageEl.className = 'toast-message';
    messageEl.textContent = message;
    toast.appendChild(messageEl);

    // 掛載
    container.appendChild(toast);

    // 設定自動淡出並銷毀
    const fadeOutTimeout = setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, duration - 300);

    // 支援手動點擊即可關閉
    toast.addEventListener('click', () => {
      clearTimeout(fadeOutTimeout);
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    });
  },

  success(message) {
    this.show(message, 'success');
  },

  error(message) {
    this.show(message, 'error', 4500);
  },

  warning(message) {
    this.show(message, 'warning', 4000);
  },

  info(message) {
    this.show(message, 'info');
  }
};
