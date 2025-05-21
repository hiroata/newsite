/**
 * 成功事例ページの機能拡張
 * フィルタリング機能とカード操作の実装
 */
document.addEventListener('DOMContentLoaded', function() {
    // AOS初期化 - モバイルでは無効化してパフォーマンス向上
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 450,
                easing: 'ease-out',
                once: true,
                offset: 60,
                disable: window.innerWidth < 768 ? 'phone' : false
            });
        } else {
            console.warn('AOS ライブラリが読み込まれていません。アニメーション効果は無効化されます。');
        }
    } catch (error) {
        console.error('AOSの初期化中にエラーが発生しました:', error);
    }
    
    // フィルタリング機能
    // 業種別で探すセクションを削除したため、フィルタリング機能はコメントアウト (2024/06/30)
    /*
    const filterButtons = document.querySelectorAll('.filter-button');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                try {
                    // アクティブクラスの切り替え
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                      // フィルタリング処理
                    const filterCategory = this.getAttribute('data-filter') || this.textContent.trim();
                    const cards = document.querySelectorAll('.achievement-card');
                    let visibleCount = 0;
                    
                    cards.forEach(card => {
                        const tagElement = card.querySelector('.achievement-tag');
                        if (!tagElement) {
                            console.warn('カードにカテゴリータグが見つかりません:', card);
                            return;
                        }
                          const cardCategory = tagElement.textContent.trim();
                        console.log(`フィルタリング比較: "${filterCategory}" と "${cardCategory}"`);
                        
                        if (filterCategory === 'すべて' || cardCategory.indexOf(filterCategory) !== -1) {
                            // 表示する場合
                            card.style.display = '';
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                card.style.transform = '';
                            });
                            visibleCount++;
                        } else {
                            // 非表示にする場合
                            card.style.opacity = '0.3';
                            card.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 250);
                        }
                    });
                    
                    // フィルタリング結果が0件の場合の処理
                    const achievementGrid = document.querySelector('.achievement-grid');
                    if (achievementGrid) {
                        if (visibleCount === 0) {
                            if (!document.querySelector('.no-results')) {
                                const noResults = document.createElement('p');
                                noResults.className = 'no-results';
                                noResults.style.textAlign = 'center';
                                noResults.style.gridColumn = '1 / -1';
                                noResults.style.padding = '2em 0';
                                noResults.style.color = '#666';
                                noResults.textContent = '該当する事例はありません。';
                                achievementGrid.appendChild(noResults);
                            }
                        } else {
                            const noResults = document.querySelector('.no-results');
                            if (noResults) {
                                noResults.remove();
                            }
                        }
                    }
                } catch (error) {
                    console.error('フィルタリング処理中にエラーが発生しました:', error);
                }
            });
        });
    }
    */
    
    // カードクリック処理（イベント委任で実装）
    const achievementGrid = document.querySelector('.achievement-grid');
    if (achievementGrid) {
        achievementGrid.addEventListener('click', function(e) {
            try {
                const card = e.target.closest('.achievement-card');
                if (card && !e.target.closest('.achievement-tag')) {
                    const link = card.querySelector('.achievement-card-link');
                    if (link && e.target !== link) {
                        link.click();
                    }
                }
            } catch (error) {
                console.error('カードクリック処理中にエラーが発生しました:', error);
            }
        });
    }
    
    // パフォーマンス最適化: 画像の遅延読み込み状態を監視
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.achievement-image img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // 表示領域に入ったらローディング属性を削除して完全に読み込む
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});
