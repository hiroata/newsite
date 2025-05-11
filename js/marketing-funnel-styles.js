/**
 * ブログ記事固有のスタイル調整（marketing-funnel-basics.html用）
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // サイドバートックを追従させる設定を強化
        const tocElement = document.querySelector('.sidebar-toc');
        if (tocElement) {
            tocElement.style.position = 'sticky';
            tocElement.style.top = '20px';
        }
        
        // サイドバー全体のバランス調整
        const rightSidebar = document.querySelector('.article-right-sidebar');
        if (rightSidebar) {
            rightSidebar.style.paddingTop = '20px';
        }
    });
})();
