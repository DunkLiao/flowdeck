export const DEFAULT_TAG_COLOR = '#3b82f6';

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isValidHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function normalizeColor(value, fallback = DEFAULT_TAG_COLOR) {
  return isValidHexColor(value) ? value : fallback;
}

export function sanitizeUrl(value) {
  const text = String(value ?? '').trim();
  if (!text) return '#';

  try {
    const url = new URL(text, window.location.origin);
    if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
      return text;
    }
  } catch {
    return '#';
  }

  return '#';
}

export function normalizeName(value, fieldName = '名稱', maxLength = 50) {
  const text = String(value ?? '').trim();
  if (!text) {
    throw new Error(`${fieldName}不可為空白`);
  }
  if (text.length > maxLength) {
    throw new Error(`${fieldName}不可超過 ${maxLength} 個字`);
  }
  return text;
}
