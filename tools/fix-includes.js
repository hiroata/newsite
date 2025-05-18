/**
 * 重複するinclude.js参照修正スクリプト
 */

const fs = require('fs');
const path = require('path');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;
const LOG_FILE = path.join(TOOLS_DIR, 'include-js-fix-report.md');

// スキップするファイル
const SKIP_FILES = [
  'fix-headers-footers.js',
  'fix-duplicate-includes.js', 
  'fix-html-structure.js', 
  'validate-html.js',
  'fix-all-tools.js',
  'html-validation.js',
  'final-fix.js',
  'fix-includes.js',
  'test-image-tools.html',
  'tool-template.html',
  'image-tool-template.html'
];

// レポート内容
let reportContent = '# include.js修正レポート\n\n';
reportContent += `実行日時: ${new Date().toLocaleString()}\n\n`;

/**
 * HTMLファイル内の重複するinclude.js参照を修正
 */
function fixIncludes(filePath) {
  const filename = path.basename(filePath);
  console.log(`処理: ${filename}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // include.jsの参照を全て探す
    const includeMatches = content.match(/<script src="\/js\/include\.js"><\/script>/g) || [];
    
    if (includeMatches.length > 1) {
      console.log(`  - 重複するinclude.js参照を削除 (${includeMatches.length}個の参照を検出)`);
      
      // 最初の参照だけを残し、他は削除
      let tempContent = '';
      let foundFirst = false;
      
      // 行ごとに処理
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.includes('<script src="/js/include.js"></script>')) {
          if (!foundFirst) {
            tempContent += line + '\n';
            foundFirst = true;
          }
          // 最初以外は削除
        } else {
          tempContent += line + '\n';
        }
      }
      
      content = tempContent;
      
      // ヘッダー用とフッター用のinclude.jsをそれぞれ1つずつ配置
      // ヘッダープレースホルダーの直後に1つ
      if (content.includes('<div id="header-placeholder"></div>') && 
          !content.includes('<div id="header-placeholder"></div>\n<script src="/js/include.js"></script>') &&
          !content.includes('<div id="header-placeholder"></div>\n  <script src="/js/include.js"></script>')) {
        
        content = content.replace(
          '<div id="header-placeholder"></div>',
          '<div id="header-placeholder"></div>\n  <script src="/js/include.js"></script>'
        );
        console.log('  - ヘッダープレースホルダー後にinclude.jsを追加');
      }
      
      // フッタープレースホルダーの直後に1つ
      if (content.includes('<div id="footer-placeholder"></div>') && 
          !content.includes('<div id="footer-placeholder"></div>\n<script src="/js/include.js"></script>') &&
          !content.includes('<div id="footer-placeholder"></div>\n  <script src="/js/include.js"></script>')) {
        
        content = content.replace(
          '<div id="footer-placeholder"></div>',
          '<div id="footer-placeholder"></div>\n  <script src="/js/include.js"></script>'
        );
        console.log('  - フッタープレースホルダー後にinclude.jsを追加');
      }
      
      // 変更があれば保存
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✓ ${filename} を更新しました`);
        return true;
      }
    } else {
      console.log(`  ✓ ${filename} は問題なし`);
    }
    
    return false;
  } catch (error) {
    console.error(`  ✗ ${filename} の処理中にエラー:`, error);
    return false;
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
  
  let modifiedFiles = [];
  
  // 各ファイルを処理
  for (const file of files) {
    if (fixIncludes(file)) {
      modifiedFiles.push(path.basename(file));
    }
  }
  
  // レポートに追加
  if (modifiedFiles.length > 0) {
    reportContent += '## 修正したファイル\n\n';
    modifiedFiles.forEach(file => {
      reportContent += `- ${file}\n`;
    });
  } else {
    reportContent += '修正の必要があるファイルはありませんでした。\n';
  }
  
  // サマリー
  reportContent += `\n## サマリー\n`;
  reportContent += `- 処理したファイル: ${files.length} 件\n`;
  reportContent += `- 修正したファイル: ${modifiedFiles.length} 件\n`;
  
  // レポートを保存
  fs.writeFileSync(LOG_FILE, reportContent, 'utf8');
  
  console.log(`\n処理が完了しました。`);
  console.log(`修正したファイル: ${modifiedFiles.length}/${files.length}`);
  console.log(`詳細レポート: ${path.basename(LOG_FILE)}`);
}

// スクリプト実行
main();
