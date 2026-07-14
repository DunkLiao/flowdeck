/**
 * 極簡的發佈-訂閱事件匯流排 (EventBus)
 * 用於解耦模組之間的通訊與視圖同步。
 */
class EventBus {
  constructor() {
    this.listeners = {};
  }

  /**
   * 訂閱事件。
   * @param {string} event - 事件名稱。
   * @param {Function} callback - 回呼函式。
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * 取消訂閱事件。
   * @param {string} event - 事件名稱。
   * @param {Function} callback - 回呼函式。
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * 發佈事件。
   * @param {string} event - 事件名稱。
   * @param {any} [data] - 附帶的參數資料。
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] 執行事件 "${event}" 的回呼函式時出錯:`, err);
      }
    });
  }
}

export const eventBus = new EventBus();
