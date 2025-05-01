// ヘッダーとフッターを共通化するスクリプト

document.addEventListener('DOMContentLoaded', function() {
    // 現在のディレクトリレベルを検出
    // ルート直下の場合: pathParts = ['ファイル名'] または [] (index.htmlの場合)
    // サブディレクトリの場合: pathParts = ['ディレクトリ名', 'ファイル名'] または ['ディレクトリ名'] (index.htmlの場合)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    
    // ルートパスを設定: ルート直下なら './', サブディレクトリなら '../', '../../' など
    const isRoot = pathParts.length <= 1 ||
                   (pathParts.length === 2 && pathParts[1].endsWith('.html')); // index.html以外のHTMLも考慮
    
    // ディレクトリ階層数を正しく計算
    let depth = pathParts.length;
    if (pathParts.length > 0 && pathParts[pathParts.length - 1].endsWith('.html')) {
       depth--; // ファイル名の場合は階層数にカウントしない
    } else if (pathParts.length === 0 || pathParts[0] === 'index.html') {
       depth = 0; // ルート直下
    }

    const rootPath = depth > 0 ? '../'.repeat(depth) : './';


    // HTMLインクルード関数 (非同期処理に修正)
    async function includeHTML(selector, filePath) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Target element with selector "${selector}" not found.`);
            return; // 要素が見つからなければ処理を中断
        }

        try {
            const response = await fetch(rootPath + filePath);

            if (!response.ok) {
                // HTTPエラーが発生した場合
                console.error(`HTTP error! status: ${response.status} while fetching ${filePath}`);
                element.innerHTML = `<div>Error loading ${filePath}</div>`; // エラー表示
                return;
            }

            let html = await response.text();

            // インクルードされたHTML内の相対パスを修正
            html = replaceRelativePaths(html, rootPath);

            // 修正したHTMLを要素に挿入
            element.innerHTML = html;

            // ヘッダーが読み込まれた後にナビゲーションをアクティブにする
            if (selector === 'header') { // セレクタを 'header' に変更する想定
                 activateCurrentPageLink(); // activateCurrentNav の代わりにこちらを使用
                 initHamburgerMenu(); // header が読み込まれた後にハンバーガーメニューを初期化
            }

             // 固定CTAが読み込まれた後に何か処理が必要ならここに追加
             if (selector === '.sp-fix-cta') { // セレクタを '.sp-fix-cta' に変更する想定
                 // 例: イベントリスナー追加など
             }

             // フッターが読み込まれた後に何か処理が必要ならここに追加
             if (selector === 'footer') { // セレクタを 'footer' に変更する想定
                 // 例: イベントリスナー追加など
             }

        } catch (error) {
            console.error('Error loading include file:', filePath, error);
            element.innerHTML = `<div>Error loading ${filePath}</div>`; // エラー表示
        }
    }

    // 相対パスを修正する関数
    function replaceRelativePaths(html, rootPath) {
        // href属性の修正 (a, linkタグなど)
        html = html.replace(/href="([^"]*)"/g, function(match, p1) {
            // 絶対URL、アンカーリンク、mailtoなどを変更しない
            if (p1.startsWith('http://') || p1.startsWith('https://') || p1.startsWith('#') || p1.startsWith('mailto:') || p1.startsWith('/') || p1 === '') {
                return match;
            }
            // ルートからのパスでなければ相対パスとみなしてrootPathを付加
             if (!p1.startsWith('./') && !p1.startsWith('../')) {
                 p1 = './' + p1; // './' がついていない場合は補完
             }

            return 'href="' + rootPath + p1.replace('./', ''); // './' は不要になるため削除
        });

        // src属性の修正 (img, script, linkタグなど)
        html = html.replace(/src="([^"]*)"/g, function(match, p1) {
            // 絶対URL、ルートからのパスなどを変更しない
            if (p1.startsWith('http://') || p1.startsWith('https://') || p1.startsWith('/') || p1 === '') {
                return match;
            }
            // ルートからのパスでなければ相対パスとみなしてrootPathを付加
             if (!p1.startsWith('./') && !p1.startsWith('../')) {
                 p1 = './' + p1; // './' がついていない場合は補完
             }
            return 'src="' + rootPath + p1.replace('./', '') + '"'; // './' は不要になるため削除
        });

        // その他の属性（例: data-srcなど、必要に応じて追加）
        // html = html.replace(/data-src="([^"]*)"/g, function(match, p1) { ... });

        return html;
    }

    // 現在のページリンクをアクティブにする関数 (activateCurrentPageLinkにリネーム)
    function activateCurrentPageLink() {
        // ヘッダーが実際にDOMに追加されてから実行されることを前提とする
        const currentPage = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html'; // ファイル名を取得、ルートは'index.html'とみなす
        const navLinks = document.querySelectorAll('.global-nav a');

        navLinks.forEach(link => {
            // リンクの絶対URLパスを取得
            const linkUrl = new URL(link.href, window.location.origin).pathname;

            // リンクパスのファイル名部分を取得
            const linkFileName = linkUrl.split('/').filter(Boolean).pop() || 'index.html';

            // 現在のページのファイル名とリンク先のファイル名を比較して一致判定
            // 例: /about.html と /about.html
            // 例: / と /index.html
            // 例: /seminar/ と /seminar/index.html
            // 例: /blog/article-1.html と /blog/article-1.html
            const isCurrent = linkUrl === window.location.pathname ||
                              (window.location.pathname.endsWith('/') && linkUrl === window.location.pathname + 'index.html') ||
                              (linkUrl.endsWith('/index.html') && window.location.pathname === linkUrl.replace('/index.html', '/')) ||
                              (linkFileName !== 'index.html' && linkFileName === currentPage); // index以外のファイル名が一致する場合も

            if (isCurrent) {
                 link.setAttribute('aria-current', 'page'); // WAI-ARIA属性
                 link.classList.add('active'); // CSSでのスタイル指定用クラス
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });
    }


    // ハンバーガーメニュー初期化関数 (common.jsで一元管理)
    function initHamburgerMenu() {
        const hamburgerButton = document.querySelector('.hamburger-button');
        // モバイルメニューのDOMはHTMLにあらかじめ存在することを想定
        const mobileMenu = document.querySelector('.mobile-menu');

        if (hamburgerButton && mobileMenu) {
            hamburgerButton.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                // bodyのoverflow制御（メニュー開閉で背景スクロールを止める）
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });

            // メニュー内のリンクをクリックしたらメニューを閉じる（任意）
            mobileMenu.querySelectorAll('a').forEach(link => {
                 link.addEventListener('click', () => {
                     hamburgerButton.classList.remove('active');
                     mobileMenu.classList.remove('active');
                     document.body.style.overflow = '';
                 });
            });
        } else {
             if (!hamburgerButton) console.warn('Hamburger button not found.');
             if (!mobileMenu) console.warn('Mobile menu element not found.');
        }
    }


    // インクルードファイルの読み込み実行
    // HTML側のプレースホルダーID/クラス名と合わせる必要があります。
    // 前計画のHTML最適化例に合わせてセレクタを修正します。
    includeHTML('header', 'includes/header.html'); // <header class="site-header" id="header"></header> を想定
    includeHTML('.sp-fix-cta', 'includes/sp-fix-cta.html'); // <div class="sp-fix-cta"></div> を想定
    includeHTML('footer', 'includes/footer.html'); // <footer class="site-footer" id="footer"></footer> を想定

});