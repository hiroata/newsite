/**
 * utils.js - サイト共通のユーティリティ関数群
 * サイト全体で共通して使用される機能をまとめたファイル
 */

const Utils = {
  /**
   * ファイルサイズを読みやすい形式にフォーマット
   * @param {number} bytes - バイト数
   * @return {string} フォーマットされたサイズ文字列
   */
  formatFileSize: function(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  },
  
  /**
   * DOM要素生成ヘルパー
   * @param {string} tagName - 作成するタグ名
   * @param {object} attributes - 設定する属性オブジェクト
   * @param {array} children - 子要素の配列
   * @return {HTMLElement} 生成されたDOM要素
   */
  createElement: function(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);
    
    // 属性を設定
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // 子要素を追加
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
    
    return element;
  },
  
  /**
   * URLからクエリパラメータを取得
   * @param {string} name - パラメータ名
   * @param {string} url - URL (省略時は現在のURL)
   * @return {string|null} パラメータの値 (存在しない場合はnull)
   */
  getQueryParam: function(name, url = window.location.href) {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get(name);
  },
  
  /**
   * デバウンス関数 - 連続した呼び出しを間引く
   * @param {Function} func - 実行する関数
   * @param {number} wait - 待機時間(ms)
   * @return {Function} デバウンスされた関数
   */
  debounce: function(func, wait = 300) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  
  /**
   * スロットル関数 - 一定時間ごとに1回だけ実行
   * @param {Function} func - 実行する関数
   * @param {number} limit - 制限時間(ms)
   * @return {Function} スロットルされた関数
   */
  throttle: function(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * 指定要素が画面内に表示されているかチェック
   * @param {HTMLElement} element - チェックする要素
   * @param {number} threshold - しきい値 (0〜1)
   * @return {boolean} 要素が表示されているかどうか
   */
  isElementInViewport: function(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
      rect.bottom > (window.innerHeight || document.documentElement.clientHeight) * threshold
    );
  },
  
  /**
   * クッキーを設定
   * @param {string} name - クッキー名
   * @param {string} value - クッキー値
   * @param {number} days - 有効日数
   */
  setCookie: function(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  },
  
  /**
   * クッキーを取得
   * @param {string} name - クッキー名
   * @return {string} クッキー値 (存在しない場合は空文字)
   */
  getCookie: function(name) {
    const nameWithEquals = name + "=";
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameWithEquals) === 0) {
        return cookie.substring(nameWithEquals.length, cookie.length);
      }
    }
    return "";
  },
  
  /**
   * LocalStorageにデータを保存
   * @param {string} key - キー
   * @param {*} value - 値
   */
  saveToStorage: function(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.error('LocalStorageへの保存に失敗:', e);
    }
  },
  
  /**
   * LocalStorageからデータを取得
   * @param {string} key - キー
   * @param {*} defaultValue - デフォルト値
   * @return {*} 取得した値またはデフォルト値
   */
  getFromStorage: function(key, defaultValue = null) {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized);
    } catch (e) {
      console.error('LocalStorageからの取得に失敗:', e);
      return defaultValue;
    }
  }
};

// ブラウザ環境なら直接グローバルに公開
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}

// モジュール環境ならエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
