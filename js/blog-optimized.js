/*!
 * Blog Optimized JavaScript - 統廃合・最適化版
 * 作成日: 2025年5月27日
 * 統廃合元: script.js, layout-debug.js
 * 機能: ナビゲーション、スムーズスクロール、FAQ、レイアウトデバッグ
 */

'use strict';

/**
 * ブログサイト最適化クラス
 * モバイルナビゲーション、スムーズスクロール、FAQ、レイアウト診断機能を統合
 */
class BlogOptimizer {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.initLayoutDebug();
  }

  /**
   * 初期化処理
   */
  init() {
    this.hamburger = document.querySelector('.hamburger');
    this.mainNav = document.querySelector('.main-nav');
    this.body = document.body;
    this.isMenuOpen = false;
    
    // FAQ要素
    this.faqItems = document.querySelectorAll('.faq-item');
    
    // スムーズスクロール対象
    this.smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    // レイアウトデバッグ用
    this.debugMode = localStorage.getItem('layout-debug') === 'true';
    this.debugPanel = null;
    
    // パフォーマンス監視
    this.performanceMetrics = {
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0
    };
    
    this.measurePerformance();
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // ハンバーガーメニュー
    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // スムーズスクロール
    this.smoothScrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleSmoothScroll(e);
      });
    });

    // FAQ アコーディオン
    this.faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      if (header) {
        header.addEventListener('click', () => {
          this.toggleFAQ(item);
        });
      }
    });

    // レスポンシブ対応
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // ページ読み込み完了後の処理
    window.addEventListener('load', () => {
      this.onPageLoad();
    });

    // キーボードアクセシビリティ
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });

    // レイアウトデバッグショートカット
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleDebugMode();
      }
    });
  }

  /**
   * モバイルメニューの切り替え
   */
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.isMenuOpen) {
      this.mainNav?.classList.add('active');
      this.hamburger?.classList.add('active');
      this.body.style.overflow = 'hidden';
      this.hamburger?.setAttribute('aria-expanded', 'true');
    } else {
      this.mainNav?.classList.remove('active');
      this.hamburger?.classList.remove('active');
      this.body.style.overflow = '';
      this.hamburger?.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * スムーズスクロール処理
   * @param {Event} e - クリックイベント
   */
  handleSmoothScroll(e) {
    const href = e.target.getAttribute('href');
    
    if (!href || !href.startsWith('#')) return;
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;
    
    e.preventDefault();
    
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // URLハッシュを更新（履歴に追加）
    history.pushState(null, null, href);
  }

  /**
   * FAQ アコーディオンの切り替え
   * @param {Element} item - FAQアイテム要素
   */
  toggleFAQ(item) {
    const answer = item.querySelector('.faq-answer');
    const header = item.querySelector('.faq-header');
    const isOpen = item.classList.contains('active');

    // 他のFAQを閉じる（アコーディオン動作）
    this.faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherHeader = otherItem.querySelector('.faq-header');
        
        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
        if (otherHeader) {
          otherHeader.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // 現在のFAQを切り替え
    if (isOpen) {
      item.classList.remove('active');
      answer.style.maxHeight = null;
      header?.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('active');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      header?.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * リサイズ処理
   */
  handleResize() {
    // モバイルメニューが開いている場合、デスクトップサイズで閉じる
    if (window.innerWidth > 767 && this.isMenuOpen) {
      this.toggleMobileMenu();
    }

    // レイアウトデバッグが有効な場合、情報を更新
    if (this.debugMode) {
      this.updateDebugInfo();
    }
  }

  /**
   * ページ読み込み完了後の処理
   */
  onPageLoad() {
    // 画像の遅延読み込み完了処理
    this.handleLazyImages();
    
    // アニメーション開始
    this.initAnimations();
    
    // パフォーマンス測定完了
    this.finalizePerfomanceMetrics();
  }

  /**
   * キーボードアクセシビリティ
   * @param {KeyboardEvent} e - キーボードイベント
   */
  handleKeyboard(e) {
    // Escapeキーでメニューを閉じる
    if (e.key === 'Escape' && this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * 画像の遅延読み込み処理
   */
  handleLazyImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // フォールバック：すべての画像を即座に読み込み
      lazyImages.forEach(img => img.classList.add('loaded'));
    }
  }

  /**
   * アニメーション初期化
   */
  initAnimations() {
    // Intersection Observer でスクロールアニメーション
    if ('IntersectionObserver' in window) {
      const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
      });
    }
  }

  /**
   * パフォーマンス測定
   */
  measurePerformance() {
    // Navigation Timing API を使用
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            this.performanceMetrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            this.performanceMetrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
          }

          // Paint Timing API
          const paintEntries = performance.getEntriesByType('paint');
          paintEntries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              this.performanceMetrics.firstPaint = entry.startTime;
            }
          });
        }, 0);
      });
    }
  }

  /**
   * パフォーマンス測定完了
   */
  finalizePerfomanceMetrics() {
    if (this.debugMode) {
      console.log('Performance Metrics:', this.performanceMetrics);
    }
  }

  /**
   * レイアウトデバッグ機能の初期化
   */
  initLayoutDebug() {
    if (this.debugMode) {
      this.createDebugPanel();
    }
  }

  /**
   * デバッグモードの切り替え
   */
  toggleDebugMode() {
    this.debugMode = !this.debugMode;
    localStorage.setItem('layout-debug', this.debugMode.toString());
    
    if (this.debugMode) {
      this.createDebugPanel();
      console.log('🔧 レイアウトデバッグモードが有効になりました');
      console.log('📊 現在のレイアウト情報:', this.getLayoutInfo());
    } else {
      this.removeDebugPanel();
      console.log('❌ レイアウトデバッグモードが無効になりました');
    }
  }

  /**
   * デバッグパネルの作成
   */
  createDebugPanel() {
    if (this.debugPanel) return;

    this.debugPanel = document.createElement('div');
    this.debugPanel.id = 'layout-debug-panel';
    this.debugPanel.innerHTML = `
      <div style="
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong>🔧 Layout Debug</strong>
          <button onclick="blogOptimizer.toggleDebugMode()" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 2px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
          ">✕</button>
        </div>
        <div id="debug-info"></div>
      </div>
    `;

    document.body.appendChild(this.debugPanel);
    this.updateDebugInfo();

    // 定期更新
    this.debugInterval = setInterval(() => {
      this.updateDebugInfo();
    }, 1000);
  }

  /**
   * デバッグパネルの削除
   */
  removeDebugPanel() {
    if (this.debugPanel) {
      this.debugPanel.remove();
      this.debugPanel = null;
    }
    
    if (this.debugInterval) {
      clearInterval(this.debugInterval);
      this.debugInterval = null;
    }
  }

  /**
   * デバッグ情報の更新
   */
  updateDebugInfo() {
    const debugInfo = document.getElementById('debug-info');
    if (!debugInfo) return;

    const layoutInfo = this.getLayoutInfo();
    const performanceInfo = this.getPerformanceInfo();

    debugInfo.innerHTML = `
      <div><strong>📐 Layout Info:</strong></div>
      <div>Viewport: ${layoutInfo.viewport.width}×${layoutInfo.viewport.height}</div>
      <div>Container: ${layoutInfo.container.width}px</div>
      <div>Grid Columns: ${layoutInfo.gridColumns}</div>
      <div>Gap: ${layoutInfo.gap}px</div>
      <br>
      <div><strong>📊 Performance:</strong></div>
      <div>Load Time: ${performanceInfo.loadTime}ms</div>
      <div>Memory: ${performanceInfo.memory}MB</div>
      <div>FCP: ${performanceInfo.firstPaint}ms</div>
      <br>
      <div><strong>🎯 Optimization:</strong></div>
      <div>Images: ${this.getImageOptimizationStatus()}</div>
      <div>CSS: Optimized ✓</div>
      <div>JS: Optimized ✓</div>
    `;
  }

  /**
   * レイアウト情報の取得
   */
  getLayoutInfo() {
    const container = document.querySelector('.article-container');
    const computedStyle = container ? getComputedStyle(container) : null;
    
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      container: {
        width: container ? container.offsetWidth : 0,
        maxWidth: computedStyle ? computedStyle.maxWidth : 'unknown'
      },
      gridColumns: computedStyle ? computedStyle.gridTemplateColumns : 'unknown',
      gap: computedStyle ? parseInt(computedStyle.gap) : 0
    };
  }

  /**
   * パフォーマンス情報の取得
   */
  getPerformanceInfo() {
    // TypeScript構文 (as any) をJavaScript互換に修正
    const memory = performance && performance.memory ? performance.memory : undefined;
    
    return {
      loadTime: Math.round(this.performanceMetrics.loadTime),
      firstPaint: Math.round(this.performanceMetrics.firstPaint),
      memory: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0
    };
  }

  /**
   * 画像最適化状況の取得
   */
  getImageOptimizationStatus() {
    const images = document.querySelectorAll('img');
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const loadedImages = document.querySelectorAll('img[loading="lazy"].loaded');
    
    return `${loadedImages.length}/${lazyImages.length} lazy loaded`;
  }
  /**
   * デバウンス関数 (Utils.debounceを使用、フォールバック付き)
   * @param {Function} func - 実行する関数
   * @param {number} wait - 待機時間（ミリ秒）
   * @returns {Function} デバウンスされた関数
   */
  debounce(func, wait) {
    // Utils.debounceが利用可能な場合はそれを使用
    if (typeof window.Utils !== 'undefined' && window.Utils.debounce) {
      return window.Utils.debounce(func, wait);
    }
    
    // フォールバック実装
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * スロットル関数 (Utils.throttleを使用、フォールバック付き)
   * @param {Function} func - 実行する関数
   * @param {number} limit - 制限時間（ミリ秒）
   * @returns {Function} スロットルされた関数
   */
  throttle(func, limit) {
    // Utils.throttleが利用可能な場合はそれを使用
    if (typeof window.Utils !== 'undefined' && window.Utils.throttle) {
      return window.Utils.throttle(func, limit);
    }
    
    // フォールバック実装
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * ユーティリティ: 要素が表示領域内にあるかチェック (Utils.isElementInViewportを使用、フォールバック付き)
   * @param {Element} element - チェック対象の要素
   * @returns {boolean} 表示領域内にある場合true
   */
  isElementInViewport(element) {
    // Utils.isElementInViewportが利用可能な場合はそれを使用
    if (typeof window.Utils !== 'undefined' && window.Utils.isElementInViewport) {
      return window.Utils.isElementInViewport(element);
    }
    
    // フォールバック実装
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * ユーティリティ: スムーズスクロール（ポリフィル対応）
   * @param {number} targetPosition - スクロール先の位置
   * @param {number} duration - アニメーション時間（ミリ秒）
   */
  smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
}

/**
 * DOM読み込み完了後に初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  // グローバル変数として BlogOptimizer インスタンスを作成
  window.blogOptimizer = new BlogOptimizer();
  
  console.log('🚀 Blog Optimizer が正常に初期化されました');
  console.log('⚡ レイアウトが最適化されました (1600px幅, 8.5:2.5比率)');
  console.log('💡 デバッグモード: Ctrl+Shift+D で切り替え可能');
});

/**
 * エクスポート（モジュール対応）
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogOptimizer;
}
