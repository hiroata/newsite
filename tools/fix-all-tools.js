/**
 * 全てのHTMLファイルを修正して統一する最終チェックスクリプト
 * 
 * このスクリプトは以下の問題を修正します：
 * 1. インクルードスクリプトの適切な配置
 * 2. ヘッダー/フッタープレースホルダーの修正
 * 3. 重複する<main>タグの削除
 * 4. 重複するフッターの削除
 * 5. 不適切なスクリプトタグ構造の修正
 * 6. HTML構造の修正
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

// レポートファイル
const REPORT_FILE = path.join(TOOLS_DIR, 'html-fix-report.md');
let reportContent = '# HTML構造修正レポート\n\n';
reportContent += `実行日時: ${new Date().toLocaleString()}\n\n`;
reportContent += '## 修正されたファイル\n\n';

/**
 * 指定したファイルを修正する
 */
function fixFile(filePath) {
  try {
    const filename = path.basename(filePath);
    console.log(`--------------------`);
    console.log(`処理: ${filename}`);
    
    // ファイル修正内容のログ
    let fileChanges = [];
    
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
      fileChanges.push('インクルードスクリプトを追加');
    }
    
    // 2. ヘッダープレースホルダーの修正
    if (content.includes('<header class="site-header">')) {
      console.log(`- ヘッダーをプレースホルダーに変更`);
      content = content.replace(
        /<body>[\s\S]*?<header class="site-header">[\s\S]*?<\/header>/,
        '<body>\n  <!-- ヘッダー -->\n  <div id="header-placeholder"></div>'
      );
      fileChanges.push('ヘッダーをプレースホルダーに変更');
    } else if (!content.includes('<div id="header-placeholder">')) {
      console.log(`- ヘッダープレースホルダーを追加`);
      content = content.replace(
        /<body>/,
        '<body>\n  <!-- ヘッダー -->\n  <div id="header-placeholder"></div>'
      );
      fileChanges.push('ヘッダープレースホルダーを追加');
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
      fileChanges.push('重複するヘッダープレースホルダーを削除');
    }
    
    // 4. 重複する<main>タグの修正
    const mainTagMatches = content.match(/<main[^>]*>[\s\S]*?<\/main>/g);
    if (mainTagMatches && mainTagMatches.length > 1) {
      console.log(`- 重複する<main>タグを修正`);
      
      // 最初のmainタグと内容を抽出
      const firstMainMatch = mainTagMatches[0];
      const firstMainContent = firstMainMatch.replace(/<\/?main[^>]*>/g, '');
      
      // 2つ目以降のmainタグの内容を抽出して連結
      let additionalContent = '';
      for (let i = 1; i < mainTagMatches.length; i++) {
        const mainContent = mainTagMatches[i].replace(/<\/?main[^>]*>/g, '');
        additionalContent += mainContent;
      }
      
      // オリジナルのmainタグを削除
      content = content.replace(/<main[^>]*>[\s\S]*?<\/main>/g, '');
      
      // 新しい単一のmainタグを適切な位置に挿入
      const bodyStartIndex = content.indexOf('<body>') + 6;
      const headerPlaceholderIndex = content.indexOf('<div id="header-placeholder">');
      const insertPosition = headerPlaceholderIndex !== -1 ? 
        content.indexOf('</div>', headerPlaceholderIndex) + 6 :
        bodyStartIndex;
      
      // ヘッダーの後に新しいmainタグを挿入
      content = content.substring(0, insertPosition) + 
               '\n\n  <main class="site-main">\n    ' + 
               firstMainContent + additionalContent + 
               '\n  </main>\n' + 
               content.substring(insertPosition);
      
      fileChanges.push('重複する<main>タグを単一のタグに統合');
    }
    
    // 5. フッタープレースホルダーの追加と重複修正
    const footerPlaceholderMatches = content.match(/<div id="footer-placeholder"><\/div>/g);
    
    if (!footerPlaceholderMatches) {
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
      fileChanges.push('フッタープレースホルダーを追加');
    } else if (footerPlaceholderMatches.length > 1) {
      console.log(`- 重複フッタープレースホルダーを削除`);
      // 最初のフッタープレースホルダーを見つける
      let firstIndex = content.indexOf('<div id="footer-placeholder"></div>');
      
      // 2回目以降のプレースホルダーを削除
      let processed = content.substring(0, firstIndex + '<div id="footer-placeholder"></div>'.length);
      let remaining = content.substring(firstIndex + '<div id="footer-placeholder"></div>'.length);
      remaining = remaining.replace(/<div id="footer-placeholder"><\/div>/g, '');
      content = processed + remaining;
      
      fileChanges.push('重複するフッタープレースホルダーを削除');
    }
    
    // 6. 重複するfooterタグの削除
    const footerTagMatches = content.match(/<footer[^>]*>[\s\S]*?<\/footer>/g);
    if (footerTagMatches && footerTagMatches.length > 1) {
      console.log(`- 重複するfooterタグを削除`);
      
      // 最初の1つだけを残す
      const firstFooter = footerTagMatches[0];
      content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, (match, index) => {
        if (index === content.indexOf(firstFooter)) {
          return match; // 最初のfooterは保持
        }
        return ''; // それ以外は削除
      });
      
      fileChanges.push('重複するfooterタグを削除');
    }
    
    // 7. スクリプトタグ内の不正なコメントを修正
    const scriptCommentRegex = /<script([^>]*)>\s*<!--/g;
    if (scriptCommentRegex.test(content)) {
      console.log(`- スクリプトタグ内の不正なコメントを修正`);
      content = content.replace(scriptCommentRegex, (match, attrs) => {
        return `<!-- スクリプト開始 -->\n<script${attrs}>`;
      });
      fileChanges.push('スクリプトタグ内の不正なコメントを修正');
    }
    
    // 8. HTMLタグの閉じタグの修正
    if (!content.match(/<\/body>\s*<\/html>\s*$/)) {
      console.log(`- HTML構造を修正`);
      // bodyとhtmlの閉じタグを修正
      if (content.includes('</body>') && content.includes('</html>')) {
        content = content.replace(/<\/body>[\s\S]*?<\/html>[\s\S]*?$/, '</body>\n</html>');
      } else if (!content.includes('</body>')) {
        content = content.replace(/<\/html>[\s\S]*?$/, '</body>\n</html>');
      } else if (!content.includes('</html>')) {
        content = content.replace(/<\/body>[\s\S]*?$/, '</body>\n</html>');
      }
      fileChanges.push('HTML構造の終了タグを修正');
    }
      // 9. インクルードスクリプトとフッタープレースホルダーの関係修正
    if (content.includes('<div id="footer-placeholder"></div>') && 
        !content.includes('<div id="footer-placeholder"></div>\n<script src="/js/include.js"></script>')) {
      console.log(`- フッタープレースホルダー後にinclude.jsを追加`);
      content = content.replace(
        /<div id="footer-placeholder"><\/div>/,
        '<div id="footer-placeholder"></div>\n<script src="/js/include.js"></script>'
      );
      fileChanges.push('フッタープレースホルダーの後にinclude.jsを追加');
    }
    
    // 10. 重複するインクルードスクリプトを削除
    const includeJsMatches = content.match(/<script src="\/js\/include\.js"><\/script>/g);
    if (includeJsMatches && includeJsMatches.length > 1) {
      console.log(`- 重複するinclude.js参照を削除`);
      
      // 最初のinclude.js参照を見つける
      let firstIndex = content.indexOf('<script src="/js/include.js"></script>');
      
      // 2回目以降の参照を削除
      let processed = content.substring(0, firstIndex + '<script src="/js/include.js"></script>'.length);
      let remaining = content.substring(firstIndex + '<script src="/js/include.js"></script>'.length);
      remaining = remaining.replace(/<script src="\/js\/include\.js"><\/script>/g, '');
      content = processed + remaining;
      
      fileChanges.push('重複するinclude.js参照を削除');
    }
    
    // 変更があれば保存
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${filename} を更新しました`);
      
      // レポートに追加
      if (fileChanges.length > 0) {
        reportContent += `### ${filename}\n`;
        fileChanges.forEach(change => {
          reportContent += `- ${change}\n`;
        });
        reportContent += '\n';
        return true;
      }
    } else {
      console.log(`✓ ${filename} は変更なし`);
      return false;
    }
  } catch (error) {
    console.error(`✗ ${path.basename(filePath)} の処理中にエラー:`, error);
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
  
  // 修正されたファイルをカウント
  let modifiedFiles = 0;
  
  // 各ファイルを処理
  for (const file of files) {
    if (fixFile(file)) {
      modifiedFiles++;
    }
  }
  
  // レポートにサマリーを追加
  reportContent += `## サマリー\n`;
  reportContent += `- 処理したファイル: ${files.length} 件\n`;
  reportContent += `- 修正したファイル: ${modifiedFiles} 件\n`;
  
  // レポートを保存
  fs.writeFileSync(REPORT_FILE, reportContent, 'utf8');
  
  console.log(`\n全てのファイルの処理が完了しました`);
  console.log(`修正されたファイル: ${modifiedFiles}/${files.length}`);
  console.log(`詳細レポート: ${path.basename(REPORT_FILE)}`);
}

// スクリプト実行
main();
