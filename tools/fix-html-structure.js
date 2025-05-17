/**
 * HTML構造の問題を修正するスクリプト
 */
const fs = require('fs');
const path = require('path');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;

/**
 * HTMLファイルの構造を修正
 * @param {string} filePath - 処理対象のファイルパス
 */
function fixHtmlStructure(filePath) {
  try {
    // ファイル読み込み
    let content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    // 既に正しい形式かどうかを確認
    if (content.match(/<\/body>\s*<\/html>\s*$/)) {
      console.log(`✓ ${filename} は既に正しい構造です`);
      return;
    }
    
    // 修正が必要な場合
    console.log(`✓ ${filename} の構造を修正しています...`);
    
    // 閉じタグの修正
    if (content.includes('</body>') && content.includes('</html>')) {
      // 順序が逆になっている場合は修正
      content = content.replace(/<\/html>[\s\S]*<\/body>/, '</body></html>');
    } else if (!content.includes('</body>') && content.includes('</html>')) {
      // bodyタグが閉じられていない場合
      content = content.replace(/<\/html>/, '</body></html>');
    } else if (content.includes('</body>') && !content.includes('</html>')) {
      // htmlタグが閉じられていない場合
      content = content.replace(/<\/body>/, '</body></html>');
    } else {
      // 両方のタグが閉じられていない場合
      content += '</body></html>';
    }
    
    // フッタープレースホルダーの後に余計なコンテンツがある場合は削除
    content = content.replace(/(<div id="footer-placeholder"><\/div>[\s\S]*?)(<\/body>[\s\S]*?<\/html>)/, '$1</main>$2');
    
    // 余分な</main>タグを削除
    content = content.replace(/<\/main>[\s\S]*?<\/main>/g, '</main>');
    
    // 一貫性のために末尾の空白行を整理
    content = content.replace(/\s*<\/body>\s*<\/html>\s*$/, '\n</body>\n</html>\n');
    
    // ファイルに書き戻し
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`✗ ${path.basename(filePath)} の処理中にエラーが発生しました:`, error);
  }
}

/**
 * index.htmlにプレースホルダーを追加
 */
function fixIndexHTML() {
  const indexPath = path.join(TOOLS_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // ヘッダープレースホルダーがなければ追加
    if (!content.includes('<div id="header-placeholder">')) {
      content = content.replace(/<body[^>]*>/, '<body>\n  <!-- ヘッダー -->\n  <div id="header-placeholder"></div>');
    }
    
    // 構造の修正
    if (!content.match(/<\/body>\s*<\/html>\s*$/)) {
      content = content.replace(/(<\/main>[\s\S]*)$/, '</main>\n\n  <!-- フッター -->\n  <div id="footer-placeholder"></div>\n</body>\n</html>\n');
    }
    
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log('✓ index.html を修正しました');
  } catch (error) {
    console.error('✗ index.html の修正中にエラーが発生しました:', error);
  }
}

/**
 * メイン処理
 */
function main() {
  // テンプレートとテストファイルを除外
  const excludeFiles = [
    'tool-template.html', 
    'image-tool-template.html', 
    'test-image-tools.html',
    'fix-headers-footers.js',
    'fix-duplicate-includes.js',
    'fix-html-structure.js',
    'validate-html.js'
  ];
  
  // HTMLファイルをリストアップ
  const files = fs.readdirSync(TOOLS_DIR)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file))
    .map(file => path.join(TOOLS_DIR, file));
  
  console.log(`処理対象ファイル: ${files.length}件\n`);
  
  // index.htmlの修正
  fixIndexHTML();
  
  // 各ファイルを処理
  files.forEach(fixHtmlStructure);
  
  console.log('\n処理が完了しました');
}

// スクリプト開始メッセージ
console.log('HTML構造の修正を開始します...');

// スクリプト実行
main();
