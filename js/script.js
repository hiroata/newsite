/**
 * オートファネル大学 JavaScriptファイル (最適化版)
 * パフォーマンス向上のための最適化を実施
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // DOM要素の参照をキャッシュ
    const hamburgerButton = document.querySelector('.hamburger-button');
    const body = document.body;
    
    // モバイルメニュー要素 (配列で取得することで存在チェックを簡素化)
    const mobileMenu = document.querySelectorAll('.mobile-menu');
    
    // ハンバーガーメニュー処理 - 要素がある場合のみ実行
    if (hamburgerButton && mobileMenu.length > 0) {
        // モバイルメニュー参照を確定
        const mobileMenuEl = mobileMenu[0];
        
        // ハンバーガーメニュークリックイベント
        hamburgerButton.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenuEl.classList.toggle('active');
            
            // bodyのスクロール制御 (メニュー開閉でスクロールを防止)
            body.style.overflow = mobileMenuEl.classList.contains('active') ? 'hidden' : '';
            
            // アクセシビリティ対応
            this.setAttribute('aria-expanded', this.classList.contains('active'));
        });

        // メニュー内のリンククリック時の処理 - イベント委譲で効率化
        mobileMenuEl.addEventListener('click', function(e) {
            // リンク要素のクリックかどうかを確認
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                hamburgerButton.classList.remove('active');
                mobileMenuEl.classList.remove('active');
                body.style.overflow = '';
                hamburgerButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // フォームバリデーション - フォームが存在する場合のみ実行
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(function(form) {
            form.addEventListener('submit', validateForm);
        });
    }

    // 遅延読み込み用の設定 - Intersection Observer API
    setupLazyLoading();
    
    // スムーススクロール設定
    setupSmoothScroll();
    
    // ページ読み込み完了時の処理
    window.addEventListener('load', function() {
        // ページ内アニメーションの実行
        animateOnScroll();
    });
});

/**
 * フォームバリデーション関数
 * @param {Event} e - イベントオブジェクト
 */
function validateForm(e) {
    let valid = true;
    const form = e.target;
    const requiredFields = form.querySelectorAll('[required]');
    
    // 必須フィールドのチェック
    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            valid = false;
            // エラー表示を追加
            field.classList.add('error');
            
            // エラーメッセージがまだ無い場合のみ追加
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = '入力必須項目です';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else {
            // エラー表示をクリア
            field.classList.remove('error');
            const errorMsg = field.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });
    
    // メールアドレス形式のチェック
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(function(field) {
        if (field.value.trim() && !isValidEmail(field.value)) {
            valid = false;
            field.classList.add('error');
            
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = '有効なメールアドレスを入力してください';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        }
    });
    
    if (!valid) {
        e.preventDefault();
    }
}

/**
 * メールアドレスバリデーション
 * @param {string} email - チェックするメールアドレス
 * @return {boolean} - 有効なメールアドレスならtrue
 */
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

/**
 * 遅延読み込み設定
 * Intersection Observer APIを使用して画面に入った時に画像を読み込む
 */
function setupLazyLoading() {
    // ブラウザがIntersection Observerをサポートしているか確認
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        // data-srcがある場合はそれをsrcに設定
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.removeAttribute('data-src');
                        }
                        
                        // data-srcsetがある場合はそれをsrcsetに設定
                        if (lazyImage.dataset.srcset) {
                            lazyImage.srcset = lazyImage.dataset.srcset;
                            lazyImage.removeAttribute('data-srcset');
                        }
                        
                        lazyImage.classList.add('loaded');
                        imageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(function(lazyImage) {
                imageObserver.observe(lazyImage);
            });
        }
    }
}

/**
 * スムーススクロール設定
 * ページ内リンクをクリックした際に滑らかにスクロールする
 */
function setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // href属性の値からターゲット要素を取得
            const targetId = this.getAttribute('href');
            
            // #だけの場合はトップへのリンクとして扱う
            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * スクロールアニメーション
 * 画面に入った要素にアニメーションを適用
 */
function animateOnScroll() {
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-up, .fade-right, .fade-left');
        
        if (animatedElements.length > 0) {
            const animationObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            animatedElements.forEach(function(element) {
                animationObserver.observe(element);
            });
        }
    }
}

// FAQアコーディオン機能 - 必要な場合のみ実行するように遅延初期化
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // 現在の状態を取得
                const isActive = item.classList.contains('active');
                
                // すべてのアイテムを閉じる
                faqItems.forEach(function(faqItem) {
                    faqItem.classList.remove('active');
                    const icon = faqItem.querySelector('.faq-question span');
                    if (icon) {
                        icon.textContent = '+';
                    }
                });
                
                // クリックされたアイテムが閉じていた場合は開く
                if (!isActive) {
                    item.classList.add('active');
                    const icon = item.querySelector('.faq-question span');
                    if (icon) {
                        icon.textContent = '−';
                    }
                }
            });
        });
    }
}

// FAQセクションが表示された時だけアコーディオン機能を初期化
document.addEventListener('DOMContentLoaded', function() {
    const faqSection = document.querySelector('.faq-section');
    
    if (faqSection) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    initFaqAccordion();
                    observer.disconnect();
                }
            });
            
            observer.observe(faqSection);
        } else {
            // IntersectionObserver非対応のブラウザ用のフォールバック
            initFaqAccordion();
        }
    }
});