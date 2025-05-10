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
  }  // 目次ハイライト機能の初期化
  function initTocHighlight() {
    console.log('目次ハイライト機能を初期化します');
    // ブログ記事の目次とセクション見出しを取得
    const tocLinks = document.querySelectorAll('.toc-list a');
    if (tocLinks.length === 0) {
      console.log('目次が見つかりません');
      return; // 目次がなければ終了
    }

    console.log(`目次リンク数: ${tocLinks.length}件`);

    // セクション情報を格納する配列
    const sections = [];
    const headingLevels = {}; // 見出しレベルを記録
    let headingHierarchy = []; // 見出しの階層関係を記録
    
    // 目次構造の解析: 親子関係を特定する
    let currentLevel = 0;
    let prevLevel = 0;
    
    // 各セクションと階層関係の把握
    tocLinks.forEach(function(link, idx) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) {
        console.log(`ID: ${targetId} の要素が見つかりません`);
        return;
      }
      
      // 見出しレベルを特定 (h2=2, h3=3, ...)
      const tagName = targetElement.tagName.toLowerCase();
      const level = parseInt(tagName.charAt(1), 10);
      
      // 階層関係の更新
      if (sections.length === 0) {
        // 最初の見出し
        currentLevel = level;
        headingHierarchy = [sections.length];
      } else if (level > prevLevel) {
        // 子見出し
        headingHierarchy.push(sections.length - 1);
        currentLevel = level;
      } else if (level < prevLevel) {
        // 親見出しに戻る
        while (headingHierarchy.length > 0 && headingLevels[headingHierarchy[headingHierarchy.length - 1]] >= level) {
          headingHierarchy.pop();
        }
        currentLevel = level;
      }
      
      prevLevel = level;
      headingLevels[sections.length] = level;
      
      // 親要素を特定
      const parentIndex = headingHierarchy.length > 0 ? headingHierarchy[headingHierarchy.length - 1] : null;
      
      // セクション情報を追加
      sections.push({
        id: targetId,
        element: targetElement,
        link: link,
        level: level,
        parentIndex: parentIndex,
        childrenIndices: [] // 子見出しのインデックスを格納する配列
      });
      
      // 親要素に子要素のインデックスを追加
      if (parentIndex !== null) {
        sections[parentIndex].childrenIndices.push(sections.length - 1);
      }
    });
    
    if (sections.length === 0) {
      console.log('有効なセクションが見つかりません');
      return; // セクションが見つからなければ終了
    }

    console.log(`有効なセクション数: ${sections.length}件`);

    // Intersection Observer APIの設定
    const observerOptions = {
      root: null, // ビューポートを基準に
      rootMargin: '-10% 0px -70% 0px', // より正確にトップ付近の見出しを検出
      threshold: [0, 0.25, 0.5, 0.75, 1] // 複数のしきい値でより精密に監視
    };
    
    // 現在見えている見出し要素を追跡する
    let visibleHeadings = new Map();
    // スロットリング用タイマー
    let throttledUpdateTimeout = null;
    
    // アクティブな目次項目を設定（親子関係を考慮）
    function setActiveTocItem(activeSection) {
      if (!activeSection) return;
      
      // すべての目次項目からアクティブクラスを削除
      const allTocLinks = document.querySelectorAll('.toc-list a');
      allTocLinks.forEach(function(link) {
        link.classList.remove('active');
        link.classList.remove('active-parent');
      });
      
      // アクティブな見出し自体をハイライト
      if (activeSection.link) {
        activeSection.link.classList.add('active');
        
        // 親見出しにも active-parent クラスを追加
        let currentSection = activeSection;
        while (currentSection.parentIndex !== null) {
          const parentSection = sections[currentSection.parentIndex];
          if (parentSection && parentSection.link) {
            parentSection.link.classList.add('active-parent');
          }
          currentSection = parentSection;
        }
      }
    }
    
    // アクティブな見出しの更新
    function updateActiveHeading() {
      // 現在表示中の見出しがない場合
      if (visibleHeadings.size === 0) {
        // スクロール位置に基づいてアクティブな見出しを見つける（バックアップ方法）
        const scrollPosition = window.scrollY + 100;
        const pageHeight = document.documentElement.scrollHeight;
        const scrollBottom = window.scrollY + window.innerHeight;
        
        // ページ最下部まで来たら最後の項目をハイライト
        if (scrollBottom >= pageHeight - 20) {
          setActiveTocItem(sections[sections.length - 1]);
          return;
        }
        
        // スクロール位置に基づいて最適な見出しを見つける
        let activeSection = null;
        let minDistance = Infinity;
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const sectionTop = section.element.getBoundingClientRect().top + window.scrollY;
          const distance = Math.abs(sectionTop - scrollPosition);
          
          // スクロール位置より上の最も近い見出しを優先
          if (sectionTop <= scrollPosition && distance < minDistance) {
            minDistance = distance;
            activeSection = section;
          }
        }
        
        if (activeSection) {
          setActiveTocItem(activeSection);
        } else if (sections.length > 0) {
          // デフォルトでは最初の見出しをハイライト
          setActiveTocItem(sections[0]);
        }
        return;
      }
      
      // 表示中の見出しがある場合、最適な見出しを判定
      let bestSectionIndex = -1;
      let bestScore = -Infinity;
      
      // 各表示中の見出しの評価
      visibleHeadings.forEach((info, index) => {
        // スコア計算（優先順位: 交差率 > Y座標（上部ほど優先）> レベル（上位見出しほど優先））
        const levelBonus = 6 - sections[index].level; // h2が最優先
        const positionScore = (window.innerHeight - info.y) / window.innerHeight; // 上部ほど高スコア
        const visibilityScore = info.ratio * 2; // 表示率が高いほど高スコア
        
        const totalScore = visibilityScore + positionScore + levelBonus * 0.5;
        
        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestSectionIndex = index;
        }
      });
      
      // 最適なセクションが見つかった場合
      if (bestSectionIndex !== -1) {
        setActiveTocItem(sections[bestSectionIndex]);
      }
    }
    
    // スロットリング処理
    function throttledUpdate() {
      updateActiveHeading();
      throttledUpdateTimeout = null;
    }

    // Intersection Observerの設定
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        const targetId = entry.target.getAttribute('id');
        const sectionIndex = sections.findIndex(section => section.id === `#${targetId}`);
        
        if (sectionIndex !== -1) {
          if (entry.isIntersecting) {
            // 要素が表示されたらMapに追加（位置情報付き）
            const boundingRect = entry.boundingClientRect;
            visibleHeadings.set(sectionIndex, {
              y: boundingRect.y,
              height: boundingRect.height,
              ratio: entry.intersectionRatio
            });
          } else {
            // 要素が非表示になったらMapから削除
            visibleHeadings.delete(sectionIndex);
          }
          
          // スロットリングされた関数を呼び出し
          if (!throttledUpdateTimeout) {
            throttledUpdateTimeout = setTimeout(throttledUpdate, 50);
          }
        }
      });
    }, observerOptions);
    
    // 見出し要素を監視開始
    sections.forEach(section => {
      const targetElement = section.element;
      if (targetElement) {
        observer.observe(targetElement);
      }
    });
    
    // ページ全体のスクロールハンドリング（追加の検証用）
    window.addEventListener('scroll', function() {
      if (!throttledUpdateTimeout) {
        throttledUpdateTimeout = setTimeout(throttledUpdate, 100);
      }
    }, { passive: true });
    
    // 目次項目クリック時のスムーススクロール改善
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // ヘッダーの高さを考慮してスクロール
          const headerHeight = window.innerWidth <= 768 ? 60 : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          // より滑らかなスクロール動作のためのオプション
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // URLのハッシュを更新（履歴に追加せず）
          history.replaceState(null, null, targetId);
          
          // クリックされた項目をすぐにハイライト
          setActiveTocItem(sections.find(section => section.id === targetId));
        }
      });
    });
    
    // 初期表示時のハイライト
    setTimeout(updateActiveHeading, 200);
    console.log('目次ハイライト機能の初期化が完了しました');
  }
  
})();