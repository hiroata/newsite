// sticky-toc.js - サイドバーの目次を追従させるためのスクリプト
document.addEventListener('DOMContentLoaded', function() {
    // 目次要素とサイドバーを取得
    const tocElement = document.querySelector('.sidebar-toc');
    const sidebar = document.querySelector('.article-right-sidebar');
    const article = document.querySelector('.article-main');
    
    if (!tocElement || !sidebar || !article) return;
    
    // モバイル表示かどうかを判定する関数
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // 目次の高さを調整する関数
    function adjustTocHeight() {
        if (isMobile()) {
            tocElement.style.maxHeight = '';
            return;
        }
        
        const viewportHeight = window.innerHeight;
        const tocTop = tocElement.getBoundingClientRect().top;
        const maxHeight = viewportHeight - tocTop - 20; // 下部に20pxの余白
        
        tocElement.style.maxHeight = `${maxHeight}px`;
    }
    
    // スクロール時のイベントハンドラ
    function handleScroll() {
        if (isMobile()) return;
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const articleRect = article.getBoundingClientRect();
        
        // サイドバーの下端がビューポートを超える場合、目次をstickyに
        if (articleRect.bottom > window.innerHeight) {
            tocElement.classList.add('is-sticky');
            adjustTocHeight();
        } else {
            tocElement.classList.remove('is-sticky');
        }
    }
    
    // 初期化時にも高さを調整
    adjustTocHeight();
    
    // イベントリスナーを追加
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', function() {
        adjustTocHeight();
        handleScroll();
    });
});
