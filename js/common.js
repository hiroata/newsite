// ヘッダーとフッターを共通化するスクリプト

document.addEventListener('DOMContentLoaded', function() {
    // 現在のディレクトリレベルを検出
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const rootPath = pathParts.length > 1 ? '../'.repeat(pathParts.length - 1) : './';
    
    // ヘッダーを読み込む
    fetch(rootPath + 'includes/header.html')
        .then(response => response.text())
        .then(data => {
            // ルートパスを修正して挿入
            const modifiedData = replaceRelativePaths(data, rootPath);
            document.getElementById('header-placeholder').innerHTML = modifiedData;
            
            // 現在のページにクラスを追加
            activateCurrentPageLink();
            
            // ハンバーガーメニューの初期化
            initHamburgerMenu();
        });
    
    // スマホ用フッター固定CTAを読み込む
    fetch(rootPath + 'includes/sp-fix-cta.html')
        .then(response => response.text())
        .then(data => {
            // ルートパスを修正して挿入
            const modifiedData = replaceRelativePaths(data, rootPath);
            document.getElementById('sp-fix-cta-placeholder').innerHTML = modifiedData;
        });
    
    // フッターを読み込む
    fetch(rootPath + 'includes/footer.html')
        .then(response => response.text())
        .then(data => {
            // ルートパスを修正して挿入
            const modifiedData = replaceRelativePaths(data, rootPath);
            document.getElementById('footer-placeholder').innerHTML = modifiedData;
        });
    
    // 相対パスを修正する関数
    function replaceRelativePaths(html, rootPath) {
        // href属性の修正
        html = html.replace(/href="([^"]*\.html|[^"]*\/)/g, function(match, p1) {
            // 絶対URLは変更しない
            if (p1.startsWith('http') || p1.startsWith('#') || p1.startsWith('mailto:')) {
                return match;
            }
            return 'href="' + rootPath + p1;
        });
        
        // src属性の修正
        html = html.replace(/src="([^"]*)"/g, function(match, p1) {
            // 絶対URLは変更しない
            if (p1.startsWith('http')) {
                return match;
            }
            return 'src="' + rootPath + p1 + '"';
        });
        
        return html;
    }
    
    // 現在のページリンクをアクティブにする関数
    function activateCurrentPageLink() {
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.global-nav a');
        
        navLinks.forEach(link => {
            // リンクの絶対URLを取得
            const linkUrl = new URL(link.href, window.location.origin).pathname;
            
            // 現在のページと一致するか比較
            if (linkUrl === currentPage || 
                (currentPage.endsWith('/') && linkUrl === currentPage + 'index.html') ||
                (linkUrl.endsWith('/index.html') && currentPage === linkUrl.replace('/index.html', '/'))) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
            }
        });
    }
    
    // ハンバーガーメニュー初期化関数
    function initHamburgerMenu() {
        const hamburgerButton = document.querySelector('.hamburger-button');
        if (hamburgerButton) {
            hamburgerButton.addEventListener('click', function() {
                this.classList.toggle('active');
                
                // モバイルメニューの作成と表示
                let mobileMenu = document.querySelector('.mobile-menu');
                
                if (!mobileMenu) {
                    // メニューがまだ存在しない場合は作成
                    mobileMenu = document.createElement('div');
                    mobileMenu.className = 'mobile-menu';
                    
                    // メインナビゲーションのクローンを作成
                    const navClone = document.querySelector('.global-nav').cloneNode(true);
                    navClone.classList.remove('pc-nav');
                    
                    mobileMenu.appendChild(navClone);
                    document.body.appendChild(mobileMenu);
                }
                
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }
    }
});