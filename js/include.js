// js/include.js
document.addEventListener('DOMContentLoaded', function() {
    // SVG定義を読み込む関数
    function loadSvgDefs() {
        fetch('/common/svg-defs.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                // bodyの最初にSVG定義を追加
                const svgContainer = document.createElement('div');
                svgContainer.innerHTML = data;
                // SVG要素自体を直接bodyの先頭に追加
                const svgElement = svgContainer.querySelector('svg');
                if (svgElement) {
                    document.body.insertBefore(svgElement, document.body.firstChild);
                }
            })
            .catch(error => console.error('Error loading SVG definitions:', error));
    }

    // ヘッダーを読み込む関数
    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            fetch('/common/header.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    headerPlaceholder.innerHTML = data;
                    // ヘッダー読み込み後に関数を実行する必要があればここに追加
                    initializeHamburgerMenu(); // 例: ハンバーガーメニューの初期化
                })
                .catch(error => console.error('Error loading header:', error));
        }
    }

    // フッターを読み込む関数
    function loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            fetch('/common/footer.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    footerPlaceholder.innerHTML = data;
                })
                .catch(error => console.error('Error loading footer:', error));
        }
    }

    // ハンバーガーメニューの初期化関数（header.html読み込み後に実行）
    function initializeHamburgerMenu() {
        const hamburgerButton = document.querySelector('.hamburger-button');
        const mobileMenu = document.querySelector('.mobile-menu'); // header.html内にこの要素がある想定

        if (hamburgerButton && mobileMenu) {
            hamburgerButton.addEventListener('click', () => {
                hamburgerButton.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });
        } else {
            // 要素が見つからない場合、少し待って再試行するか、エラーログを出す
            // console.warn('Hamburger menu elements not found immediately after header load.');
            // setTimeout(initializeHamburgerMenu, 100); // 必要に応じて再試行
        }
    }

    // 各パーツを読み込む
    loadSvgDefs();
    loadHeader();
    loadFooter();
});