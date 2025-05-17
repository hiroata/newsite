/**
 * 全てのHTMLファイルを修正して統一する最終チェックスクリプト
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;

// 直接修正するファイルとスキップするファイル
const SKIP_FILES = [
  'fix-headers-footers.js',
  'fix-duplicate-includes.js', 
  'fix-html-structure.js', 
  'validate-html.js',
  'fix-all-tools.js',
  'test-image-tools.html',
  'tool-template.html',
  'image-tool-template.html'
];

/**
 * 指定したファイルを修正する
 */
function fixFile(filePath) {
  try {
    const filename = path.basename(filePath);
    console.log(`--------------------`);
    console.log(`処理: ${filename}`);
    
    // ファイル読み込み
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // 1. インクルードスクリプトの追加
    if (!content.includes('src="/js/include.js"')) {
      console.log(`- インクルードスクリプトを追加`);
      content = content.replace(
        /(<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>)\s*(<link|<script src="\/js\/lazy-loading\.js")/,
        '$1\n\n  <!-- インクルード処理 -->\n  <script src="/js/include.js"></script>\n\n  $2'
      );
    }
    
    // 2. ヘッダープレースホルダーの修正
    if (content.includes('<header class="site-header">')) {
      console.log(`- ヘッダーをプレースホルダーに変更`);
      content = content.replace(
        /<body>[\s\S]*?<header class="site-header">[\s\S]*?<\/header>/,
        '<body>\n  <!-- ヘッダー -->\n  <div id="header-placeholder"></div>'
      );
    } else if (!content.includes('<div id="header-placeholder">')) {
      console.log(`- ヘッダープレースホルダーを追加`);
      content = content.replace(
        /<body>/,
        '<body>\n  <!-- ヘッダー -->\n  <div id="header-placeholder"></div>'
      );
    }
    
    // 3. 重複ヘッダーの削除
    if ((content.match(/<div id="header-placeholder">/g) || []).length > 1) {
      console.log(`- 重複ヘッダーを削除`);
      // 2回目以降のヘッダープレースホルダーを削除
      let firstIndex = content.indexOf('<div id="header-placeholder">');
      if (firstIndex !== -1) {
        let restOfContent = content.substring(firstIndex + '<div id="header-placeholder">'.length);
        restOfContent = restOfContent.replace(/<div id="header-placeholder">[^<]*<\/div>/g, '');
        content = content.substring(0, firstIndex + '<div id="header-placeholder">'.length) + restOfContent;
      }
    }
    
    // 4. フッタープレースホルダーの追加
    if (!content.includes('<div id="footer-placeholder">')) {
      console.log(`- フッタープレースホルダーを追加`);
      // </main>の後に追加
      if (content.includes('</main>')) {
        content = content.replace(
          /<\/main>/,
          '</main>\n\n  <!-- フッター -->\n  <div id="footer-placeholder"></div>'
        );
      } else {
        // </body>の前に追加
        content = content.replace(
          /<\/body>/,
          '  <!-- フッター -->\n  <div id="footer-placeholder"></div>\n</body>'
        );
      }
    }
    
    // 5. HTMLタグの閉じタグの修正
    if (!content.match(/<\/body>\s*<\/html>\s*$/)) {
      console.log(`- HTML構造を修正`);
      // bodyとhtmlの閉じタグを修正
      if (content.includes('</body>') && content.includes('</html>')) {
        content = content.replace(/<\/body>[\s\S]*?<\/html>[\s\S]*?$/, '</body>\n</html>\n');
      } else if (!content.includes('</body>')) {
        content = content.replace(/<\/html>[\s\S]*?$/, '</body>\n</html>\n');
      } else if (!content.includes('</html>')) {
        content = content.replace(/<\/body>[\s\S]*?$/, '</body>\n</html>\n');
      }
    }
    
    // 変更があれば保存
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${filename} を更新しました`);
    } else {
      console.log(`✓ ${filename} は変更なし`);
    }
  } catch (error) {
    console.error(`✗ ${path.basename(filePath)} の処理中にエラー:`, error);
  }
}

/**
 * メイン処理
 */
function main() {
  // HTMLファイルをリストアップ
  const files = fs.readdirSync(TOOLS_DIR)
    .filter(file => file.endsWith('.html') && !SKIP_FILES.includes(file))
    .map(file => path.join(TOOLS_DIR, file));
  
  console.log(`処理対象ファイル: ${files.length}件\n`);
  
  // 各ファイルを処理
  for (const file of files) {
    fixFile(file);
  }
  
  console.log('\n全てのファイルの処理が完了しました');
}

// スクリプト実行
main();
