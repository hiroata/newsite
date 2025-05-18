/**
 * ツールキャッシング戦略
 * ブラウザキャッシュを活用して画像ツールの読み込みを高速化します
 */

// キャッシュ名
const CACHE_NAME = 'maeyuki-tools-cache-v1';
const STATIC_ASSETS = [
  // 共通スクリプトとスタイル
  '/js/image-tools-utils.js',
  '/css/image-tools-styles.css',
  '/css/tools-common.css',
  '/js/lazy-loading.js',
  '/css/style.css',
  // よく使用される外部ライブラリ
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap',
];

/**
 * サービスワーカー登録
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('サービスワーカー登録成功:', registration.scope);
        })
        .catch(error => {
          console.log('サービスワーカー登録失敗:', error);
        });
    });
  }
}

/**
 * ブラウザキャッシュの設定を最適化
 * @param {string} cacheName - キャッシュ名
 */
function optimizeCache(cacheName = CACHE_NAME) {
  // Cache-Control ヘッダーを確認
  fetch('/js/image-tools-utils.js', { method: 'HEAD' })
    .then(response => {
      const cacheControl = response.headers.get('Cache-Control');
      console.log('現在のキャッシュ設定:', cacheControl);
    })
    .catch(err => console.error('キャッシュ確認エラー:', err));
}

// キャッシュストレージAPI用のヘルパー関数
/**
 * アセットのキャッシュ
 * @param {Array} assets - キャッシュするファイルURLの配列
 * @param {string} cacheName - キャッシュ名
 */
async function cacheAssets(assets = STATIC_ASSETS, cacheName = CACHE_NAME) {
  try {
    const cache = await caches.open(cacheName);
    console.log(`キャッシュ[${cacheName}]を開きました`);
    await cache.addAll(assets);
    console.log('ツール用の静的アセットをキャッシュしました');
  } catch (error) {
    console.error('キャッシュ保存エラー:', error);
  }
}

/**
 * キャッシュ済みアセットの取得
 * @param {string} url - アセットURL
 * @param {string} cacheName - キャッシュ名
 * @return {Promise<Response>} レスポンスオブジェクト
 */
async function fetchFromCache(url, cacheName = CACHE_NAME) {
  const cacheResponse = await caches.match(url);
  if (cacheResponse) {
    return cacheResponse;
  }
  
  // キャッシュにない場合はネットワークからフェッチ
  const networkResponse = await fetch(url);
  
  // レスポンスをクローンしてキャッシュに保存
  const cache = await caches.open(cacheName);
  cache.put(url, networkResponse.clone());
  
  return networkResponse;
}

// エクスポート
export {
  registerServiceWorker,
  optimizeCache,
  cacheAssets,
  fetchFromCache,
  CACHE_NAME,
  STATIC_ASSETS
};
