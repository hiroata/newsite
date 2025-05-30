// サービスワーカー (service-worker.js)
const CACHE_NAME = 'maeyuki-tools-cache-v1';
const STATIC_ASSETS = [
  // 共通スクリプトとスタイル
  '/js/main.js',
  '/css/style.css',
  // よく使用される外部ライブラリ
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap',
];

// インストール時に静的アセットをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('静的アセットをキャッシュ中');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// フェッチリクエストの処理
self.addEventListener('fetch', event => {
  // 画像、CSS、JSのみをキャッシュ
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // 静的アセットのキャッシング（キャッシュファースト）
  if (STATIC_ASSETS.includes(url.pathname) || 
      /\.(js|css|png|jpg|jpeg|webp|svg|gif|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // キャッシュに存在すればそれを返す
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // ネットワークリクエスト
          return fetch(event.request).then(response => {
            // レスポンスが有効かつGETリクエストの場合のみキャッシュ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスをクローンしてキャッシュに保存（レスポンスは1回しか使用できないため）
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
        })
    );
  }
});
