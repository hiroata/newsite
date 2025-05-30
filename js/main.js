/*!
 * オートウェビナー大学 - メインスクリプト
 * 作成日: 2025年5月31日
 */

(function() {
  'use strict';
  
  /**
   * サイト全体の管理クラス
   */
  class SiteManager {
    constructor() {
      this.init();
    }
    
    /**
     * サイト初期化
     */
    init() {
      this.componentLoader = new ComponentLoader();
      this.componentLoader.loadAll();
      
      this.initLazyLoading();
      this.initMainSite();
      
      console.log('🚀 サイト初期化完了');
    }
    
    /**
     * メインサイト機能の初期化
     */
    initMainSite() {
      this.initHamburgerMenu();
      this.initSmoothScroll();
      this.initFaq();
      this.initAnimations();
      this.initFooterEffects();
    }
    
    /**
     * 画像の遅延読み込み初期化
     */
    initLazyLoading() {
      if (!('IntersectionObserver' in window)) {
        // フォールバック: 即時読み込み
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          if (img.dataset.src) img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        });
        return;
      }
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            observer.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    /**
     * ハンバーガーメニューの初期化
     */
    initHamburgerMenu() {
      const hamburgerBtn = document.querySelector('.hamburger-button');
      if (!hamburgerBtn) return;
      
      const body = document.body;
      const mobileMenu = document.querySelector('.mobile-menu') || this.createMobileMenu();
      
      hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        this.toggleMenu(!isOpen, mobileMenu, body, hamburgerBtn);
      });
      
      // メニュー外クリックで閉じる
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
          this.toggleMenu(false, mobileMenu, body, hamburgerBtn);
        }
      });
      
      // ESCキーでメニューを閉じる
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          this.toggleMenu(false, mobileMenu, body, hamburgerBtn);
        }
      });
    }
    
    /**
     * メニューの開閉
     */
    toggleMenu(isOpen, mobileMenu, body, hamburgerBtn) {
      if (isOpen) {
        mobileMenu.classList.add('active');
        body.classList.add('menu-open');
        hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');
      } else {
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
        hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
      }
    }
    
    /**
     * モバイルメニューの動的作成
     */
    createMobileMenu() {
      const mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      
      const nav = document.querySelector('.global-nav');
      if (nav) {
        const navClone = nav.cloneNode(true);
        mobileMenu.appendChild(navClone);
      }
      
      const contactBtn = document.querySelector('.btn-contact');
      if (contactBtn) {
        const ctaDiv = document.createElement('div');
        ctaDiv.className = 'mobile-cta';
        const btnClone = contactBtn.cloneNode(true);
        ctaDiv.appendChild(btnClone);
        mobileMenu.appendChild(ctaDiv);
      }
      
      document.body.appendChild(mobileMenu);
      return mobileMenu;
    }
    
    /**
     * スムーススクロール初期化
     */
    initSmoothScroll() {
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        const targetId = anchor.getAttribute('href').substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
    
    /**
     * FAQ機能の初期化
     */
    initFaq() {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          
          // 他のFAQを閉じる
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // クリックされたFAQの開閉
          item.classList.toggle('active', !isOpen);
        });
      });
    }
    
    /**
     * アニメーション初期化
     */
    initAnimations() {
      if (!('IntersectionObserver' in window)) return;
      
      const fadeElements = document.querySelectorAll('.fade-in');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });
      
      fadeElements.forEach(element => observer.observe(element));
    }
    
    /**
     * フッターエフェクトの初期化
     */
    initFooterEffects() {
      const footer = document.querySelector('.site-footer');
      if (!footer || !('IntersectionObserver' in window)) return;
      
      const footerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            footer.classList.add('footer-visible');
          }
        });
      }, { threshold: 0.2 });
      
      footerObserver.observe(footer);
    }
  }
  
  /**
   * 共通コンポーネント管理クラス
   */
  class ComponentLoader {
    constructor() {
      this.loadSvgDefs();
    }
    
    /**
     * 全ての共通コンポーネントを読み込み
     */
    loadAll() {
      this.loadHeader();
      this.loadFooter();
    }
    
    /**
     * テンプレートファイルを読み込み、指定セレクタの要素に挿入
     */
    async loadComponent(templatePath, targetSelector, callback) {
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;
      
      try {
        const response = await fetch(templatePath);
        if (!response.ok) {
          throw new Error(`${templatePath} の読み込みに失敗: ${response.status}`);
        }
        
        const data = await response.text();
        targetElement.innerHTML = data;
        
        if (callback && typeof callback === 'function') {
          callback(targetElement);
        }
      } catch (error) {
        console.error('テンプレート読み込みエラー:', error);
      }
    }
    
    /**
     * SVG定義を読み込み
     */
    async loadSvgDefs() {
      try {
        const response = await fetch('/common/svg-defs.html');
        if (!response.ok) return;
        
        const data = await response.text();
        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = data;
        
        const svgElement = svgContainer.querySelector('svg');
        if (svgElement) {
          document.body.insertBefore(svgElement, document.body.firstChild);
        }
      } catch (error) {
        console.error('SVG定義読み込みエラー:', error);
      }
    }
    
    /**
     * ヘッダーを読み込み
     */
    loadHeader() {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        this.loadComponent('/common/header.html', '#header-placeholder', () => {
          this.setActiveNavItem();
          this.initializeHamburgerMenu();
        });
      }
    }
    
    /**
     * フッターを読み込み
     */
    loadFooter() {
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        const currentPath = window.location.pathname;
        const isSubpage = this.isSubpagePath(currentPath);
        const footerPath = isSubpage ? '../common/footer.html' : '/common/footer.html';
        this.loadComponent(footerPath, '#footer-placeholder');
      }
    }
    
    /**
     * サブページかどうかを判定
     */
    isSubpagePath(path) {
      return path.includes('/blog/') || 
             path.includes('/tools/') ||
             path.includes('/achievement/') ||
             path.includes('/course/') ||
             path.includes('blog/') ||
             path.includes('tools/') ||
             path.includes('achievement/') ||
             path.includes('course/');
    }
    
    /**
     * アクティブなナビゲーションアイテムを設定
     */
    setActiveNavItem() {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.global-nav a');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('index.html', '').replace('.html', ''))) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
    
    /**
     * ヘッダー読み込み後のハンバーガーメニュー初期化
     */
    initializeHamburgerMenu() {
      if (window.siteManager) {
        window.siteManager.initHamburgerMenu();
      }
    }
  }
  
  // DOM読み込み完了後に初期化
  document.addEventListener('DOMContentLoaded', () => {
    window.siteManager = new SiteManager();
  });
  
  // グローバルに公開
  window.SiteManager = SiteManager;
  window.ComponentLoader = ComponentLoader;
  
})();
