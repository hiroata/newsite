/**
 * ヘッダーとフッターの実装を修正するスクリプト
 * 1. 固定のヘッダーをプレースホルダーに置換
 * 2. インクルードスクリプトを追加
 * 3. フッタープレースホルダーを追加
 */
const fs = require('fs');
const path = require('path');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;

// 処理対象から除外するファイル
const EXCLUDE_FILES = [
  'roulette.html', // 既に修正済み
  'index.html',    // ツールリストページは別途対応
  'fix-headers-footers.js',
  'add-lazy-loading.js',
  'fix-relative-paths.js',
  'optimize.js',
  'test-image-tools.html',
  'tool-template.html',
  'image-tool-template.html'
];

// ヘッダープレースホルダーの文字列
const HEADER_PLACEHOLDER = `<body>
  <!-- ヘッダー -->
  <div id="header-placeholder"></div>`;

// フッタープレースホルダーとリクエストセクション
const FOOTER_PLACEHOLDER = `
    <!-- ツールリクエストセクション -->
    <section class="tool-request">
      <div class="request-card">
        <h3>新しいツールをリクエスト</h3>
        <p>ほしいツールがあれば教えてください！<br>可能な限り対応させていただきます。</p>
        <a href="https://forms.gle/b1VzXaEvLcetLwceA" class="request-button" target="_blank" rel="noopener">ツールをリクエストする</a>
      </div>
    </section>
  </main>

  <!-- フッター -->
  <div id="footer-placeholder"></div>
</body>
</html>`;

// インクルードスクリプトの追加
const INCLUDE_SCRIPT = `  <!-- インクルード処理 -->
  <script src="/js/include.js"></script>
  
  <!-- 画像遅延読み込み -->`;

/**
 * HTML文字列内のヘッダーを置換
 * @param {string} content - HTMLファイルの内容
 * @returns {string} - 置換後のHTML
 */
function replaceHeader(content) {
  // 既存のヘッダーを検出して置換
  const headerRegex = /<body>[\s\S]*?<header[\s\S]*?<\/header>/;
  
  // ヘッダーが見つかった場合は置換
  if (headerRegex.test(content)) {
    return content.replace(headerRegex, HEADER_PLACEHOLDER);
  }
  
  // ヘッダーが見つからない場合は<body>タグの後に追加
  return content.replace(/<body>/, HEADER_PLACEHOLDER);
}

/**
 * HTML文字列内にインクルードスクリプトを追加
 * @param {string} content - HTMLファイルの内容
 * @returns {string} - 置換後のHTML
 */
function addIncludeScript(content) {
  // 画像遅延読み込みスクリプトの前にインクルードスクリプトを追加
  const lazyLoadingRegex = /<!-- 画像遅延読み込み -->/;
  if (lazyLoadingRegex.test(content)) {
    return content.replace(lazyLoadingRegex, INCLUDE_SCRIPT);
  }
  
  // 画像遅延読み込みが見つからない場合は、</head>の前に追加
  return content.replace(/<\/head>/, `  <!-- インクルード処理 -->
  <script src="/js/include.js"></script>
</head>`);
}

/**
 * HTML文字列内にフッタープレースホルダーを追加
 * @param {string} content - HTMLファイルの内容
 * @returns {string} - 置換後のHTML
 */
function addFooterPlaceholder(content) {
  // </body></html>を置換
  const endRegex = /<\/body><\/html>|<\/script>\s*<\/body><\/html>|<\/main><\/body><\/html>/;
  if (endRegex.test(content)) {
    return content.replace(endRegex, FOOTER_PLACEHOLDER);
  }
  
  // 末尾にフッターを追加
  return content.replace(/<\/html>/, `  <!-- フッター -->
  <div id="footer-placeholder"></div>
</body>
</html>`);
}

/**
 * HTMLファイルを処理
 * @param {string} filePath - 処理対象のファイルパス
 */
function processHtmlFile(filePath) {
  try {
    // ファイル読み込み
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 既存のインクルード処理がある場合はスキップ
    if (content.includes('id="header-placeholder"') && content.includes('id="footer-placeholder"')) {
      console.log(`✓ ${path.basename(filePath)} は既に修正済みです`);
      return;
    }
    
    // 各部分を修正
    content = replaceHeader(content);
    content = addIncludeScript(content);
    content = addFooterPlaceholder(content);
    
    // ファイルに書き戻し
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${path.basename(filePath)} を修正しました`);
  } catch (error) {
    console.error(`✗ ${path.basename(filePath)} の処理中にエラーが発生しました:`, error);
  }
}

/**
 * メイン処理
 */
function main() {
  // HTMLファイルをリストアップ
  const files = fs.readdirSync(TOOLS_DIR)
    .filter(file => file.endsWith('.html') && !EXCLUDE_FILES.includes(file))
    .map(file => path.join(TOOLS_DIR, file));
  
  console.log(`処理対象ファイル: ${files.length}件`);
  
  // 各ファイルを処理
  files.forEach(processHtmlFile);
  
  console.log('処理が完了しました');
}

// スクリプト実行
main();
