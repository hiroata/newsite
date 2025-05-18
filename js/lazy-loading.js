/**
 * 画像の遅延読み込みを実装するスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  // IntersectionObserverがサポートされているか確認
  if ('IntersectionObserver' in window) {
    // 遅延読み込み対象の画像を取得
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // IntersectionObserverの設定
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // 画像が表示範囲に入った場合
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // data-srcの値をsrcに設定
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // data-srcsetがある場合はsrcsetにも設定
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // この画像の監視を終了
          observer.unobserve(img);
        }
      });
    });
    
    // 各画像を監視対象に追加
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // IntersectionObserverがサポートされていない場合のフォールバック
    // 全ての遅延読み込み画像を即時読み込み
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  }
});
