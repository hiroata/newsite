/**
 * オートファネル大学 JavaScriptファイル (最適化済み)
 * Note: ブログページでは blog-optimized.js を使用
 */
(function() {
  'use strict';
  
  // ブログページかどうかを判定
  const isBlogPage = window.location.pathname.includes('/blog/') || 
                    document.body.classList.contains('blog-page') ||
                    document.querySelector('.article-container');
  
  // ブログページの場合は blog-optimized.js に処理を委譲
  if (isBlogPage && typeof window.blogOptimizer !== 'undefined') {
    console.log('📄 ブログページ検出: blog-optimized.js を使用');
    return;
  }
  
  // 読み込み完了後に実行（非ブログページのみ）
  document.addEventListener('DOMContentLoaded', initPage);
  
  function initPage() {
    // ハンバーガーメニュー初期化
    initHamburgerMenu();
    
    // スムーススクロール初期化
    initSmoothScroll();
    
    // FAQ初期化 (存在する場合のみ)
    initFaq();
    
    // アニメーション初期化 (IntersectionObserverがサポートされている場合のみ)
    initAnimations();
    
    // モバイルメニューの改善
    enhanceMobileMenu();
    
    // フッターエフェクト初期化
    initFooterEffects();
    
    console.log('🚀 メインサイトJS初期化完了');
  }
  
  // ハンバーガーメニューの初期化
  function initHamburgerMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-button');
    if (!hamburgerBtn) return;
    
    const body = document.body;
    const mobileMenu = document.querySelector('.mobile-menu') || createMobileMenu();
    
    hamburgerBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      
      if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
      }
    });
    
    // 画面リサイズ時にモバイルメニューを閉じる
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  }
  
  // モバイルメニューが存在しない場合に作成
  function createMobileMenu() {
    const header = document.querySelector('.site-header');
    if (!header) return null;
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // グローバルナビゲーションの内容をコピー
    const globalNav = document.querySelector('.global-nav');
    if (globalNav) {
      const navClone = globalNav.cloneNode(true);
      navClone.classList.remove('pc-nav');
      mobileMenu.appendChild(navClone);
    }
    
    // CTAボタンもコピー
    const headerCta = document.querySelector('.header-cta');
    if (headerCta) {
      const ctaClone = headerCta.cloneNode(true);
      ctaClone.style.display = 'flex';
      ctaClone.style.flexDirection = 'column';
      ctaClone.style.margin = '20px 0';
      ctaClone.style.gap = '10px';
      mobileMenu.appendChild(ctaClone);
    }
    
    // ヘッダーの後に挿入
    document.body.insertBefore(mobileMenu, header.nextSibling);
    
    return mobileMenu;
  }
  
  // モバイルメニューの改善（リンククリック時にメニューを閉じるなど）
  function enhanceMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) return;
    
    // モバイルメニュー内のすべてのリンクにクリックイベントを設定
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    const hamburgerBtn = document.querySelector('.hamburger-button');
    
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        if (hamburgerBtn) {
          hamburgerBtn.classList.remove('active');
        }
        document.body.classList.remove('menu-open');
      });
    });
  }
  
  // スムーススクロールの初期化
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        // コンテンツ内のハッシュリンクの場合のみ処理（メニューなど）
        const href = this.getAttribute('href');
        if (href === '#' || href.length <= 1) return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // ヘッダーの高さを考慮したスクロール位置
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // FAQの初期化（アコーディオン）
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (question && answer) {
        question.addEventListener('click', function() {
          // 他のアイテムを閉じる（オプション）
          // faqItems.forEach(otherItem => {
          //   if (otherItem !== item) {
          //     otherItem.classList.remove('active');
          //     otherItem.querySelector('.faq-answer').style.maxHeight = null;
          //   }
          // });
          
          item.classList.toggle('active');
          
          if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          } else {
            answer.style.maxHeight = null;
          }
        });
      }
    });
  }
  
  // 要素出現時のアニメーション
  function initAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const elements = document.querySelectorAll('.fade-in, .slide-in, .zoom-in');
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // 一度表示したら監視を解除
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * フッターのホバーエフェクト強化
   * footer-effects.js から統合
   */
  function initFooterEffects() {
    // 右からインサート用のエフェクト（footer-widget-3）
    const widget3Links = document.querySelectorAll('.footer-widget-3 ul li a');
    widget3Links.forEach(link => {
      link.innerHTML = '→ ' + link.innerHTML;
      link.style.paddingLeft = '0';
      link.style.transform = 'translateX(0)';
      link.style.transition = 'all 0.075s ease-out';
      
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateX(8px)';
        link.style.paddingLeft = '5px';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateX(0)';
        link.style.paddingLeft = '0';
      });
    });
    
    // 左からインサート用のエフェクト（footer-widget-4）
    const widget4Links = document.querySelectorAll('.footer-widget-4 ul li a');
    widget4Links.forEach(link => {
      link.innerHTML = link.innerHTML + ' ←';
      link.style.paddingRight = '0';
      link.style.transform = 'translateX(0)';
      link.style.transition = 'all 0.075s ease-out';
      
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateX(-8px)';
        link.style.paddingRight = '5px';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateX(0)';
        link.style.paddingRight = '0';
      });
    });
  }
})();