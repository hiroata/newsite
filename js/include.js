// js/include.js
document.addEventListener('DOMContentLoaded', function() {
    // SVG定義をロード
    fetch('/common/svg-defs.html')
        .then(response => response.text())
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            document.body.prepend(tempDiv.firstChild);
        });
    
    // ヘッダーをロード
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('/common/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.outerHTML = data;
                // ハンバーガーメニューの初期化を実行（もしJSで制御している場合）
                if (typeof initHamburgerMenu === 'function') {
                    initHamburgerMenu();
                }
            });
    }
    
    // フッターをロード
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/common/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.outerHTML = data;
            });
    }
});