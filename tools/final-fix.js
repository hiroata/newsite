/**
 * HTML構造の最終修正スクリプト
 * 
 * 検証レポートで発見された問題を修正します。
 * - フッタープレースホルダーの後にinclude.jsを追加
 * - 重複するinclude.jsの参照を削除
 * - 重複するmainタグとフッタープレースホルダーを削除
 */

const fs = require('fs');
const path = require('path');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;
const REPORT_FILE = path.join(TOOLS_DIR, 'final-fix-report.md');

// スキップするファイル
const SKIP_FILES = [
  'fix-headers-footers.js',
  'fix-duplicate-includes.js', 
  'fix-html-structure.js', 
  'validate-html.js',
  'fix-all-tools.js',
  'html-validation.js',
  'final-fix.js',
  'test-image-tools.html',
  'tool-template.html',
  'image-tool-template.html'
];

// レポートのヘッダー
let reportContent = '# HTML構造 最終修正レポート\n\n';
reportContent += `実行日時: ${new Date().toLocaleString()}\n\n`;
reportContent += '## 修正内容\n\n';

/**
 * HTMLファイルを修正する
 */
function fixFile(filePath) {
  const filename = path.basename(filePath);
  console.log(`--------------------`);
  console.log(`処理: ${filename}`);
  
  // 修正内容のリスト
  let changes = [];
  
  try {
    // ファイルの内容を読み込む
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // 1. 重複するmainタグを修正
    const mainTagMatches = content.match(/<main[^>]*>[\s\S]*?<\/main>/g);
    if (mainTagMatches && mainTagMatches.length > 1) {
      console.log(`- 重複するmainタグを修正`);
      
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
      
      changes.push('重複するmainタグを統合');
    }
    
    // 2. 重複するフッタープレースホルダーを修正
    const footerPlaceholderMatches = content.match(/<div id="footer-placeholder"><\/div>/g);
    if (footerPlaceholderMatches && footerPlaceholderMatches.length > 1) {
      console.log(`- 重複するフッタープレースホルダーを削除`);
      
      // 最初のフッタープレースホルダーを見つける
      let firstIndex = content.indexOf('<div id="footer-placeholder"></div>');
      
      // 2回目以降のプレースホルダーを削除
      let processed = content.substring(0, firstIndex + '<div id="footer-placeholder"></div>'.length);
      let remaining = content.substring(firstIndex + '<div id="footer-placeholder"></div>'.length);
      remaining = remaining.replace(/<div id="footer-placeholder"><\/div>/g, '');
      content = processed + remaining;
      
      changes.push('重複するフッタープレースホルダーを削除');
    }
    
    // 3. 重複するinclude.jsの参照を修正
    const includeJsMatches = content.match(/<script src="\/js\/include\.js"><\/script>/g);
    if (includeJsMatches && includeJsMatches.length > 1) {
      console.log(`- 重複するinclude.jsの参照を削除`);
      
      // 最初のinclude.js参照を見つける
      let firstIndex = content.indexOf('<script src="/js/include.js"></script>');
      
      // 2回目以降の参照を削除
      let processed = content.substring(0, firstIndex + '<script src="/js/include.js"></script>'.length);
      let remaining = content.substring(firstIndex + '<script src="/js/include.js"></script>'.length);
      remaining = remaining.replace(/<script src="\/js\/include\.js"><\/script>/g, '');
      content = processed + remaining;
      
      changes.push('重複するinclude.jsの参照を削除');
    }
    
    // 4. フッタープレースホルダーの後にinclude.jsを追加
    if (content.includes('<div id="footer-placeholder"></div>') && 
        !content.includes('<div id="footer-placeholder"></div>\n  <script src="/js/include.js"></script>') &&
        !content.includes('<div id="footer-placeholder"></div>\n<script src="/js/include.js"></script>')) {
      
      console.log(`- フッタープレースホルダーの後にinclude.jsを追加`);
      
      // フッタープレースホルダーの後にスクリプトタグを追加
      content = content.replace(
        /<div id="footer-placeholder"><\/div>/,
        '<div id="footer-placeholder"></div>\n  <script src="/js/include.js"></script>'
      );
      
      changes.push('フッタープレースホルダーの後にinclude.jsを追加');
    }
    
    // 5. HTMLタグのバランスを修正 (基本的な修正のみ)
    // ただし、完全な修正は複雑なため、単純な閉じタグのバランスのみ確認
    if (content.includes('<main') && !content.includes('</main>')) {
      content = content.replace('</body>', '</main>\n</body>');
      changes.push('mainタグの閉じタグを追加');
    }
    
    if (content.includes('<div') && 
        (content.match(/<div/g) || []).length > (content.match(/<\/div>/g) || []).length) {
      
      // 単純に閉じdivタグを追加（ただし、これは正確な位置ではない可能性がある）
      content = content.replace('</body>', '</div>\n</body>');
      changes.push('不足しているdivタグの閉じタグを追加（注意: 正確な位置ではない可能性あり）');
    }
    
    // 6. 不要なフッターの削除 (特にmeme-generator.htmlなどにある重複フッター)
    const footerTagCount = (content.match(/<footer[^>]*>[\s\S]*?<\/footer>/g) || []).length;
    if (footerTagCount > 1) {
      console.log(`- 重複するfooterタグを削除`);
      
      // 最初のfooterタグを見つける
      let firstIndex = content.indexOf('<footer');
      let closeIndex = content.indexOf('</footer>', firstIndex) + '</footer>'.length;
      
      // 最初のフッターを保持し、残りのフッターを削除
      let beforeFooter = content.substring(0, firstIndex);
      let firstFooter = content.substring(firstIndex, closeIndex);
      let afterFooter = content.substring(closeIndex);
      
      // 残りのフッターを削除
      afterFooter = afterFooter.replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, '');
      
      content = beforeFooter + firstFooter + afterFooter;
      
      changes.push('重複するfooterタグを削除');
    }
    
    // 変更があれば保存
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${filename} を更新しました`);
      
      // レポートに記録
      if (changes.length > 0) {
        reportContent += `### ${filename}\n`;
        changes.forEach(change => {
          reportContent += `- ${change}\n`;
        });
        reportContent += '\n';
      }
      
      return true;
    } else {
      console.log(`✓ ${filename} は変更なし`);
      return false;
    }
    
  } catch (error) {
    console.error(`✗ ${filename} の処理中にエラー:`, error);
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
