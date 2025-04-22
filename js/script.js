/**
 * オートファネル大学 JavaScriptファイル
 * 各種インタラクティブ機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニュートグル機能
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
                
                // スタイルを追加
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-menu {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(13, 50, 131, 0.95);
                        z-index: 99;
                        padding-top: 80px;
                        transform: translateY(-100%);
                        transition: transform 0.3s ease;
                        overflow-y: auto;
                    }
                    .mobile-menu.active {
                        transform: translateY(0);
                    }
                    .mobile-menu .global-nav {
                        display: block;
                        width: 100%;
                    }
                    .mobile-menu .global-nav ul {
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        padding: 0 20px;
                    }
                    .mobile-menu .global-nav li {
                        margin: 15px 0;
                        text-align: center;
                        width: 100%;
                    }
                    .mobile-menu .global-nav a {
                        color: #fff;
                        font-size: 18px;
                        display: block;
                        padding: 10px;
                    }
                    .mobile-menu .btn-nav {
                        margin-top: 10px;
                        width: 100%;
                        text-align: center;
                    }
                    .hamburger-button.active span:nth-child(1) {
                        transform: translateY(10px) rotate(45deg);
                        background-color: #fff;
                    }
                    .hamburger-button.active span:nth-child(2) {
                        opacity: 0;
                    }
                    .hamburger-button.active span:nth-child(3) {
                        transform: translateY(-10px) rotate(-45deg);
                        background-color: #fff;
                    }
                `;
                document.head.appendChild(style);
            }
            
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // コーススライダー機能
    const courseSlider = document.querySelector('.course-slider-container');
    const courseThumbnails = document.querySelectorAll('.course-thumbnail');
    
    if (courseSlider && courseThumbnails.length > 0) {
        courseThumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                // アクティブなサムネイルをリセット
                courseThumbnails.forEach(thumb => thumb.style.opacity = '0.6');
                // クリックされたサムネイルをアクティブに
                this.style.opacity = '1';
                
                // スライダーをスクロール
                const slideWidth = courseSlider.querySelector('.course-slide').offsetWidth;
                const scrollPos = slideWidth * index;
                
                courseSlider.scrollTo({
                    left: scrollPos,
                    behavior: 'smooth'
                });
            });
        });
        
        // スクロールイベントでアクティブサムネイルを更新
        courseSlider.addEventListener('scroll', function() {
            const scrollPos = this.scrollLeft;
            const slideWidth = this.querySelector('.course-slide').offsetWidth;
            const activeIndex = Math.round(scrollPos / slideWidth);
            
            courseThumbnails.forEach((thumb, i) => {
                thumb.style.opacity = i === activeIndex ? '1' : '0.6';
            });
        });
    }
    
    // アコーディオントグル機能
    const accordionToggle = document.querySelector('.accordion-toggle');
    if (accordionToggle) {
        const achievementTabs = document.querySelector('.achievement-tabs');
        
        accordionToggle.addEventListener('click', function() {
            // プラスアイコンをトグル
            const icon = this.querySelector('.accordion-icon-plus');
            if (icon) {
                icon.textContent = icon.textContent === '+' ? '−' : '+';
            }
            
            // タブを表示/非表示
            if (achievementTabs) {
                achievementTabs.style.display = achievementTabs.style.display === 'none' ? 'flex' : 'none';
            }
        });
    }
    
    // 実績タブ切り替え機能
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // アクティブボタンの切り替え
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // タブに基づいてカードをフィルタリング
                const selectedCategory = this.textContent.trim();
                
                // アニメーション効果
                achievementCards.forEach(card => {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        // カテゴリでフィルタリング（実際のサイトではここでフィルタリングロジックを実装）
                        // デモのためにすべてのカードを表示
                        card.style.display = 'block';
                        card.style.opacity = '1';
                    }, 300);
                });
            });
        });
    }
    
    // FAQ切り替え機能
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    // 現在のアクティブ状態を切り替え
                    item.classList.toggle('active');
                    
                    // プラス/マイナスアイコンの切り替え
                    const icon = this.querySelector('span:last-child');
                    if (icon) {
                        icon.textContent = item.classList.contains('active') ? '−' : '+';
                    }
                    
                    // アコーディオンスタイルで他のFAQを閉じる（任意）
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherIcon = otherItem.querySelector('.faq-question span:last-child');
                            if (otherIcon) {
                                otherIcon.textContent = '+';
                            }
                        }
                    });
                });
            }
        });
    }
    
    // フィルターボタン機能（書籍、セミナーページなど）
    const filterButtons = document.querySelectorAll('.category-button, .filter-button');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // アクティブボタンの切り替え
                const siblingButtons = Array.from(this.parentElement.children);
                siblingButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // フィルタリング機能（実際のサイトではここでフィルタリングロジックを実装）
                // デモのためのコンソール出力
                console.log('フィルター: ' + this.textContent.trim() + ' が選択されました');
                
                // コンテンツ要素のアニメーション（任意）
                const contentElements = document.querySelectorAll('.book-card, .seminar-card, .achievement-card');
                if (contentElements.length > 0) {
                    contentElements.forEach(element => {
                        element.style.opacity = '0.5';
                        setTimeout(() => {
                            element.style.opacity = '1';
                        }, 300);
                    });
                }
            });
        });
    }
    
    // ページネーション機能
    const paginationLinks = document.querySelectorAll('.pagination .page-number');
    if (paginationLinks.length > 0) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // アクティブページの切り替え
                paginationLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // ページネーション機能（実際のサイトではここでページ切り替えロジックを実装）
                // デモのためのコンソール出力
                console.log('ページ: ' + this.textContent.trim() + ' が選択されました');
                
                // コンテンツ要素のアニメーション（任意）
                const contentContainer = document.querySelector('.achievement-card-list, .book-grid, .seminar-list');
                if (contentContainer) {
                    contentContainer.style.opacity = '0';
                    setTimeout(() => {
                        contentContainer.style.opacity = '1';
                    }, 300);
                }
            });
        });
    }
    
    // 画像ギャラリー機能
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length > 0) {
        galleryItems.forEach(img => {
            img.addEventListener('click', function() {
                // ライトボックスの作成
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                
                const lightboxImg = document.createElement('img');
                lightboxImg.src = this.src;
                
                const closeButton = document.createElement('span');
                closeButton.className = 'lightbox-close';
                closeButton.innerHTML = '&times;';
                
                lightbox.appendChild(lightboxImg);
                lightbox.appendChild(closeButton);
                document.body.appendChild(lightbox);
                
                // スタイルを追加
                const style = document.createElement('style');
                style.textContent = `
                    .lightbox {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.9);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 999;
                    }
                    .lightbox img {
                        max-width: 90%;
                        max-height: 80vh;
                        object-fit: contain;
                    }
                    .lightbox-close {
                        position: absolute;
                        top: 20px;
                        right: 30px;
                        color: white;
                        font-size: 40px;
                        cursor: pointer;
                    }
                `;
                document.head.appendChild(style);
                
                // 閉じるボタンの機能
                closeButton.addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                });
                
                // 背景クリックでも閉じる
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        document.body.removeChild(lightbox);
                    }
                });
            });
        });
    }
    
    // スライドショー機能（トップページなど）
    const slideshow = document.querySelector('.slideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.slide');
        const prevButton = slideshow.querySelector('.prev-button');
        const nextButton = slideshow.querySelector('.next-button');
        let currentSlide = 0;
        
        // 初期表示
        if (slides.length > 0) {
            slides.forEach((slide, index) => {
                slide.style.display = index === 0 ? 'block' : 'none';
            });
            
            // スライド切り替え関数
            function showSlide(n) {
                slides.forEach(slide => slide.style.display = 'none');
                
                currentSlide = (n + slides.length) % slides.length;
                slides[currentSlide].style.display = 'block';
            }
            
            // 前後ボタンの機能
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    showSlide(currentSlide - 1);
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    showSlide(currentSlide + 1);
                });
            }
            
            // 自動スライド切り替え
            setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        }
    }
    
    // スムーススクロール機能
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    if (smoothScrollLinks.length > 0) {
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // "#"だけの場合はスクロールしない
                if (this.getAttribute('href') === '#') return;
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // ヘッダー高さを考慮してスクロール位置を調整
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // URLをアップデート（任意）
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    // スクロールアニメーション効果
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in');
    if (animatedElements.length > 0) {
        // 要素が画面内に入ったかチェックする関数
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // 初期チェック
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animated');
            }
        });
        
        // スクロール時のチェック
        window.addEventListener('scroll', () => {
            animatedElements.forEach(element => {
                if (isElementInViewport(element) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                }
            });
        });
    }
    
    // フォーム検証機能
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                
                // 必須項目チェック
                const requiredFields = form.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        // エラースタイルの適用
                        field.classList.add('error');
                        
                        // エラーメッセージの表示
                        let errorMessage = field.nextElementSibling;
                        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                            errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message';
                            errorMessage.textContent = '必須項目です';
                            field.parentNode.insertBefore(errorMessage, field.nextSibling);
                        }
                    } else {
                        // エラースタイルの削除
                        field.classList.remove('error');
                        
                        // エラーメッセージの削除
                        const errorMessage = field.nextElementSibling;
                        if (errorMessage && errorMessage.classList.contains('error-message')) {
                            errorMessage.remove();
                        }
                    }
                });
                
                // メールフォーマットチェック
                const emailFields = form.querySelectorAll('input[type="email"]');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                emailFields.forEach(field => {
                    if (field.value.trim() && !emailRegex.test(field.value)) {
                        isValid = false;
                        // エラースタイルの適用
                        field.classList.add('error');
                        
                        // エラーメッセージの表示
                        let errorMessage = field.nextElementSibling;
                        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                            errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message';
                            errorMessage.textContent = 'メールアドレスの形式が正しくありません';
                            field.parentNode.insertBefore(errorMessage, field.nextSibling);
                        }
                    }
                });
                
                // フォーム送信の制御
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    }
});