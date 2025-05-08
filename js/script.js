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
    
    // モバイルメニューの改善（新規追加）
    enhanceMobileMenu();

    // 目次ハイライト機能の初期化（ブログページ用）
    initTocHighlight();
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
    
    // CTAボタンもコピー（モバイルで使いやすいように調整）
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
    
    const hamburgerBtn = document.querySelector('.hamburger-button');
    const body = document.body;
    
    // モバイルメニュー内のリンクをクリックしたときにメニューを閉じる
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        body.classList.remove('menu-open');
      });
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
    // モバイルとPC表示でヘッダーの高さが違うため、現在のウィンドウサイズに応じて調整
    const headerHeight = window.innerWidth <= 768 ? 50 : 60;
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

  // 目次ハイライト機能の初期化
  function initTocHighlight() {
    // ブログ記事の目次とセクション見出しを取得
    const tocLinks = document.querySelectorAll('.toc-list a');
    if (tocLinks.length === 0) return; // 目次がなければ終了

    const sections = [];
    
    // 各セクションの対象要素を収集
    tocLinks.forEach(function(link) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      sections.push({
        id: targetId,
        element: targetElement,
        link: link
      });
    });
    
    if (sections.length === 0) return; // セクションが見つからなければ終了
    
    // スクロールイベントでセクション位置を確認し目次をハイライト
    window.addEventListener('scroll', function() {
      highlightActiveTocItem(sections);
    });
    
    // 初期表示時にも実行
    highlightActiveTocItem(sections);
  }
  
  // アクティブなセクションに対応する目次項目をハイライト
  function highlightActiveTocItem(sections) {
    // 現在のスクロール位置を取得（少し余裕を持たせる）
    const scrollPosition = window.scrollY + 100;
    
    // 画面下端のスクロール位置
    const scrollBottom = scrollPosition + window.innerHeight;
    
    // ページ全体の高さ
    const pageHeight = document.documentElement.scrollHeight;
    
    // 一番下までスクロールした場合は最後のセクションをハイライト
    if (scrollBottom >= pageHeight - 10) {
      setActiveTocItem(sections[sections.length - 1]);
      return;
    }
    
    // 現在表示されているセクションを探す
    let activeSection = null;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.element.getBoundingClientRect().top + window.scrollY;
      
      // このセクションがまだ表示位置に来ていなければ終了
      if (sectionTop > scrollPosition) {
        if (i === 0) {
          activeSection = section; // 最初のセクションもハイライト
        }
        break;
      }
      
      activeSection = section;
    }
    
    if (activeSection) {
      setActiveTocItem(activeSection);
    }
  }
  
  // アクティブな目次項目を設定
  function setActiveTocItem(activeSection) {
    // すべての目次項目からアクティブクラスを削除
    const allTocLinks = document.querySelectorAll('.toc-list a');
    allTocLinks.forEach(function(link) {
      link.classList.remove('active');
    });
    
    // アクティブセクションの目次項目にアクティブクラスを追加
    if (activeSection && activeSection.link) {
      activeSection.link.classList.add('active');
    }
  }
})();