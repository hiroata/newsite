/**
 * オートファネル大学 JavaScriptファイル (モバイル最適化版)
 */
(function() {
    'use strict';
    
    // 読み込み完了後に実行
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
    }
    
    // ハンバーガーメニューの初期化
    function initHamburgerMenu() {
      const hamburgerBtn = document.querySelector('.hamburger-button');
      if (!hamburgerBtn) return;
      
      const body = document.body;
      const mobileMenu = document.querySelector('.mobile-menu');
      
      hamburgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        if (mobileMenu) {
          mobileMenu.classList.toggle('active');
          body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
      });
    }
    
    // スムーススクロールの初期化
    function initSmoothScroll() {
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      if (!anchorLinks.length) return;
      
      anchorLinks.forEach(function(link) {
        link.addEventListener('click', handleAnchorClick);
      });
    }
    
    // アンカーリンククリック処理
    function handleAnchorClick(e) {
      const targetId = this.getAttribute('href');
      
      // #だけの場合はトップへスクロール
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      
      // ヘッダーの高さを考慮してスクロール
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    // FAQアコーディオンの初期化
    function initFaq() {
      const faqItems = document.querySelectorAll('.faq-item');
      if (!faqItems.length) return;
      
      faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', function() {
          // 現在の状態を取得
          const isActive = item.classList.contains('active');
          
          // すべてのアイテムを閉じる
          faqItems.forEach(closeAccordionItem);
          
          // クリックされたアイテムが閉じていた場合は開く
          if (!isActive) {
            openAccordionItem(item);
          }
        });
      });
    }
    
    // アコーディオンアイテムを閉じる
    function closeAccordionItem(item) {
      item.classList.remove('active');
      const icon = item.querySelector('.faq-question span');
      if (icon) {
        icon.textContent = '+';
      }
    }
    
    // アコーディオンアイテムを開く
    function openAccordionItem(item) {
      item.classList.add('active');
      const icon = item.querySelector('.faq-question span');
      if (icon) {
        icon.textContent = '−';
      }
    }
    
    // アニメーション要素の初期化
    function initAnimations() {
      if (!('IntersectionObserver' in window)) return;
      
      const animElements = document.querySelectorAll('.fade-in, .fade-up, .fade-right, .fade-left');
      if (!animElements.length) return;
      
      // 要素が画面内に入ったらアニメーション適用
      const animObserver = new IntersectionObserver(handleIntersection, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px' // スマートフォン向けにマージンを調整
      });
      
      // 読み込み直後はビューポート内の要素をすぐに表示
      setTimeout(function() {
        animElements.forEach(function(el) {
          if (isElementInViewport(el)) {
            el.classList.add('visible');
          } else {
            animObserver.observe(el);
          }
        });
      }, 100);
    }
    
    // 交差監視のハンドラー
    function handleIntersection(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }
    
    // 要素がビューポート内にあるか確認
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  })();