/**
 * オートファネル大学 JavaScriptファイル (最適化版)
 * パフォーマンス向上のための最適化を実施
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
  
    // DOM要素の参照をキャッシュ
    const hamburgerButton = document.querySelector('.hamburger-button');
    const body = document.body;
    
    // ハンバーガーメニュー処理 - 要素がある場合のみ実行
    if (hamburgerButton) {
      // ハンバーガーメニュークリックイベント
      hamburgerButton.addEventListener('click', function() {
        this.classList.toggle('active');
        
        // モバイルメニューの表示切替
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.toggle('active');
          // bodyのスクロール制御 (メニュー開閉でスクロールを防止)
          body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
      });
    }
  
    // スムーススクロール
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (anchorLinks.length > 0) {
      anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          // href属性の値からターゲット要素を取得
          const targetId = this.getAttribute('href');
          
          // #だけの場合はトップへのリンクとして扱う
          if (targetId === '#') {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            return;
          }
          
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  
    // FAQアコーディオン - 必要な場合のみ実行
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
      faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
          question.addEventListener('click', function() {
            // 現在の状態を取得
            const isActive = item.classList.contains('active');
            
            // すべてのアイテムを閉じる
            faqItems.forEach(function(faqItem) {
              faqItem.classList.remove('active');
              const icon = faqItem.querySelector('.faq-question span');
              if (icon) {
                icon.textContent = '+';
              }
            });
            
            // クリックされたアイテムが閉じていた場合は開く
            if (!isActive) {
              item.classList.add('active');
              const icon = item.querySelector('.faq-question span');
              if (icon) {
                icon.textContent = '−';
              }
            }
          });
        }
      });
    }
  
    // ページ内アニメーション - Intersection Observer APIを使用
    const animateElements = document.querySelectorAll('.fade-in, .fade-up, .fade-right, .fade-left');
    if (animateElements.length > 0 && 'IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animationObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      animateElements.forEach(function(element) {
        animationObserver.observe(element);
      });
    }
  });