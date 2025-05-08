// サイトマップ・講座/記事リスト自動生成用雛形
// 必要に応じてfetchやファイルリスト取得APIと連携して自動生成可能
// 例: サイト全体のHTMLファイル一覧を取得し、ul/liで出力

function generateSitemapList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  // 仮：手動リスト（本番はAPIやビルド時に自動生成）
  const pages = [
    { title: 'ホーム', url: '/index.html' },
    { title: 'ブログ', url: '/blog/index.html' },
    { title: 'オンライン講座', url: '/seminar/index.html' },
    { title: 'ツール集', url: '/tools/index.html' },
    { title: 'お客様の声', url: '/achievement/index.html' },
    { title: '資料請求', url: '/document.html' },
    { title: '無料相談', url: '/free-consultation.html' },
    { title: '無料セミナー', url: '/free-seminar.html' },
    { title: '運営者情報', url: '/owner.html' },
    { title: 'プライバシーポリシー', url: '/privacy.html' },
    { title: '利用規約', url: '/terms.html' },
    { title: '特定商取引法', url: '/tokutei.html' }
  ];
  const ul = document.createElement('ul');
  pages.forEach(page => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = page.url;
    a.textContent = page.title;
    li.appendChild(a);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
// 使い方: <div id="sitemap-list"></div> をHTMLに設置し、generateSitemapList('sitemap-list')を呼び出す
