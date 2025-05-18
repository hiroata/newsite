/**
 * include.js - 共通コンポーネントのテンプレート読み込みを管理
 * サイト全体で使用される共通コンポーネントをHTMLファイルから動的に読み込み
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * 共通コンポーネント管理オブジェクト
     */
    const ComponentLoader = {
        /**
         * テンプレートファイルを読み込み、指定セレクタの要素に挿入
         * @param {string} templatePath - テンプレートファイルのパス
         * @param {string} targetSelector - 挿入先要素のセレクタ
         * @param {Function} callback - 処理完了後のコールバック
         */
        loadComponent: function(templatePath, targetSelector, callback) {
            const targetElement = document.querySelector(targetSelector);
            if (!targetElement) return;
            
            fetch(templatePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`${templatePath} の読み込みに失敗: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    targetElement.innerHTML = data;
                    if (callback && typeof callback === 'function') {
                        callback(targetElement);
                    }
                })
                .catch(error => console.error('テンプレート読み込みエラー:', error));
        },
        
        /**
         * SVG定義を読み込み、body先頭に挿入
         */
        loadSvgDefs: function() {
            fetch('/common/svg-defs.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('SVG定義の読み込みに失敗: ' + response.statusText);
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
                .catch(error => console.error('SVG定義読み込みエラー:', error));
        },
        
        /**
         * ヘッダーを読み込み
         */
        loadHeader: function() {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                this.loadComponent('/common/header.html', '#header-placeholder', element => {
                    // 現在のパスに基づいてアクティブなナビアイテムを設定
                    this.setActiveNavItem();
                    
                    // ハンバーガーメニューの初期化
                    this.initializeHamburgerMenu();
                });
            }
        },
        
        /**
         * フッターを読み込み
         */
        loadFooter: function() {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                this.loadComponent('/common/footer.html', '#footer-placeholder');
            }
        },
        
        /**
         * 現在のページパスに基づいてナビゲーションのアクティブ項目を設定
         */
        setActiveNavItem: function() {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.global-nav a, .mobile-menu a');
            
            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                if (linkPath === currentPath || 
                    (currentPath.includes('/blog/') && linkPath === '/blog/index.html') ||
                    (currentPath.includes('/tools/') && linkPath === '/tools/index.html')) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        },
        
        /**
         * ハンバーガーメニューの初期化
         */
        initializeHamburgerMenu: function() {
            const hamburgerButton = document.querySelector('.hamburger-button');
            const mobileMenu = document.querySelector('.mobile-menu');
            
            if (hamburgerButton && mobileMenu) {
                hamburgerButton.addEventListener('click', () => {
                    hamburgerButton.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                    document.body.classList.toggle('menu-open');
                });
                
                // メニュー内のリンククリックでメニューを閉じる
                const mobileMenuLinks = mobileMenu.querySelectorAll('a');
                mobileMenuLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        hamburgerButton.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    });
                });
            }
        },
        
        /**
         * CTAセクションを読み込み
         */
        loadCTASection: function(selector) {
            const ctaPlaceholder = document.querySelector(selector);
            if (ctaPlaceholder) {
                const ctaPath = '/components/ui/cta-default.html';
                this.loadComponent(ctaPath, selector);
            }
        },
        
        /**
         * data-include属性を持つ要素にインクルードコンテンツを読み込む
         */
        handleIncludeElements: function() {
            const includeElements = document.querySelectorAll('.include[data-include]');
            
            includeElements.forEach(element => {
                const templatePath = element.getAttribute('data-include');
                if (templatePath) {
                    fetch(templatePath)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`${templatePath} の読み込みに失敗: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(data => {
                            element.innerHTML = data;
                            
                            // SVGを処理
                            const svgs = element.querySelectorAll('svg');
                            svgs.forEach(svg => {
                                svg.setAttribute('aria-hidden', 'true');
                            });
                            
                            // ヘッダーの場合、ナビゲーションとハンバーガーメニューを設定
                            if (templatePath.includes('header.html')) {
                                this.setActiveNavItem();
                                this.initializeHamburgerMenu();
                            }
                        })
                        .catch(error => console.error(`テンプレート読み込みエラー (${templatePath}):`, error));
                }
            });
        }
    };

    // コンポーネントの読み込みを実行
    ComponentLoader.loadSvgDefs();
    
    // 従来の方法でプレースホルダーを処理
    if (document.getElementById('header-placeholder')) {
        ComponentLoader.loadHeader();
    }
    
    if (document.getElementById('footer-placeholder')) {
        ComponentLoader.loadFooter();
    }
    
    // CTA要素があれば読み込み
    if (document.querySelector('.cta-placeholder')) {
        ComponentLoader.loadCTASection('.cta-placeholder');
    }
    
    // data-include属性を使った新しい方法でインクルード要素を処理
    ComponentLoader.handleIncludeElements();
});
