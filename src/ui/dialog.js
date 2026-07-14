/**
 * 全域對話框單例 (Dialogs)
 * 使用 Promise 封裝，支援 async/await 調用。
 */
export const Dialog = {
  /**
   * 顯示確認對話框 (如：刪除動作確認)
   * @param {string} title - 對話框標題
   * @param {string} message - 對話框訊息內容
   * @param {'danger'|'warning'|'info'} [type='danger'] - 類型，控制圖標樣式
   * @returns {Promise<boolean>} 使用者是否點選「確定」
   */
  confirm(title, message, type = 'danger') {
    return new Promise((resolve) => {
      const overlay = document.getElementById('dialog-overlay');
      const titleEl = document.getElementById('dialog-title');
      const messageEl = document.getElementById('dialog-message');
      const confirmBtn = document.getElementById('btn-dialog-confirm');
      const cancelBtn = document.getElementById('btn-dialog-cancel');
      const iconContainer = document.getElementById('dialog-icon-container');

      if (!overlay || !confirmBtn || !cancelBtn) return resolve(false);

      // 設定內容
      titleEl.textContent = title;
      messageEl.textContent = message;

      // 設定按鈕配色與圖標
      confirmBtn.className = 'btn';
      if (type === 'danger') {
        confirmBtn.classList.add('btn-danger');
        iconContainer.className = 'dialog-icon danger';
        iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
      } else {
        confirmBtn.classList.add('btn-primary');
        iconContainer.className = 'dialog-icon info';
        iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
      }

      // 顯示
      overlay.classList.remove('hidden');

      const cleanup = (value) => {
        overlay.classList.add('hidden');
        // 解除事件監聽器，避免殘留
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        window.removeEventListener('keydown', onKeyDown);
        resolve(value);
      };

      const onConfirm = () => cleanup(true);
      const onCancel = () => cleanup(false);
      const onKeyDown = (e) => {
        if (e.key === 'Escape') cleanup(false);
        if (e.key === 'Enter') cleanup(true);
      };

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      window.addEventListener('keydown', onKeyDown);
    });
  },

  /**
   * 顯示文字輸入對話框 (如：新建看板、更名)
   * @param {string} title - 對話框標題
   * @param {string} [placeholder=''] - 輸入框佔位符
   * @param {string} [defaultValue=''] - 預設輸入值
   * @returns {Promise<string|null>} 使用者輸入的字串，若點選「取消」或輸入空白則回傳 null
   */
  prompt(title, placeholder = '', defaultValue = '') {
    return new Promise((resolve) => {
      const overlay = document.getElementById('input-dialog-overlay');
      const titleEl = document.getElementById('input-dialog-title');
      const inputEl = document.getElementById('input-dialog-text');
      const confirmBtn = document.getElementById('btn-input-dialog-confirm');
      const cancelBtn = document.getElementById('btn-input-dialog-cancel');

      if (!overlay || !inputEl || !confirmBtn || !cancelBtn) return resolve(null);

      // 設定內容
      titleEl.textContent = title;
      inputEl.placeholder = placeholder;
      inputEl.value = defaultValue;

      // 顯示
      overlay.classList.remove('hidden');
      inputEl.focus();
      inputEl.select();

      const cleanup = (value) => {
        overlay.classList.add('hidden');
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        window.removeEventListener('keydown', onKeyDown);
        resolve(value);
      };

      const onConfirm = () => {
        const val = inputEl.value.trim();
        if (val) {
          cleanup(val);
        } else {
          inputEl.classList.add('error');
          setTimeout(() => inputEl.classList.remove('error'), 300);
        }
      };

      const onCancel = () => cleanup(null);
      const onKeyDown = (e) => {
        if (e.key === 'Escape') cleanup(null);
        if (e.key === 'Enter') onConfirm();
      };

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      window.addEventListener('keydown', onKeyDown);
    });
  }
};
