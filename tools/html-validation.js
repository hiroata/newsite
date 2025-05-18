/**
 * HTML構造検証スクリプト
 * 
 * このスクリプトは、HTMLファイルの構造的な問題を検出します。
 * - 重複するタグ（main, header, footer, include.js）
 * - 不適切なスクリプトタグ
 * - ヘッダー/フッタープレースホルダーの欠落または重複
 * - HTMLの閉じタグの問題
 */

const fs = require('fs');
const path = require('path');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;
const REPORT_FILE = path.join(TOOLS_DIR, 'html-validation-report.md');

// スキップするファイル
const SKIP_FILES = [
  'fix-headers-footers.js',
  'fix-duplicate-includes.js', 
  'fix-html-structure.js', 
  'validate-html.js',
  'fix-all-tools.js',
  'test-image-tools.html',
  'tool-template.html',
  'image-tool-template.html',
  'html-validation.js'
];

// レポートのヘッダー
let reportContent = '# HTML構造検証レポート\n\n';
reportContent += `実行日時: ${new Date().toLocaleString()}\n\n`;
reportContent += '## 検証結果\n\n';

/**
 * HTMLファイルを検証する
 * @param {string} filePath HTMLファイルのパス
 * @returns {Object} 検証結果のオブジェクト
 */
function validateFile(filePath) {
  const filename = path.basename(filePath);
  console.log(`検証: ${filename}`);
  
  // 検証結果オブジェクト
  const result = {
    filename: filename,
    issues: [],
    hasIssues: false
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 1. 重複するmainタグのチェック
    const mainTagCount = (content.match(/<main/g) || []).length;
    if (mainTagCount > 1) {
      result.issues.push(`- 重複するmainタグがあります（${mainTagCount}個）`);
      result.hasIssues = true;
    }
    
    // 2. 重複するheaderタグのチェック
    const headerTagCount = (content.match(/<header/g) || []).length;
    if (headerTagCount > 1) {
      result.issues.push(`- 重複するheaderタグがあります（${headerTagCount}個）`);
      result.hasIssues = true;
    }
    
    // 3. 重複するfooterタグのチェック
    const footerTagCount = (content.match(/<footer/g) || []).length;
    if (footerTagCount > 1) {
      result.issues.push(`- 重複するfooterタグがあります（${footerTagCount}個）`);
      result.hasIssues = true;
    }
    
    // 4. ヘッダープレースホルダーのチェック
    const headerPlaceholderCount = (content.match(/id="header-placeholder"/g) || []).length;
    if (headerPlaceholderCount === 0) {
      result.issues.push('- ヘッダープレースホルダーがありません');
      result.hasIssues = true;
    } else if (headerPlaceholderCount > 1) {
      result.issues.push(`- 重複するヘッダープレースホルダーがあります（${headerPlaceholderCount}個）`);
      result.hasIssues = true;
    }
    
    // 5. フッタープレースホルダーのチェック
    const footerPlaceholderCount = (content.match(/id="footer-placeholder"/g) || []).length;
    if (footerPlaceholderCount === 0) {
      result.issues.push('- フッタープレースホルダーがありません');
      result.hasIssues = true;
    } else if (footerPlaceholderCount > 1) {
      result.issues.push(`- 重複するフッタープレースホルダーがあります（${footerPlaceholderCount}個）`);
      result.hasIssues = true;
    }
    
    // 6. include.jsスクリプトのチェック
    const includeJsCount = (content.match(/src="\/js\/include\.js"/g) || []).length;
    if (includeJsCount === 0) {
      result.issues.push('- include.jsの参照がありません');
      result.hasIssues = true;
    } else if (includeJsCount > 1) {
      result.issues.push(`- 重複するinclude.jsの参照があります（${includeJsCount}個）`);
      result.hasIssues = true;
    }
    
    // 7. フッタープレースホルダーとinclude.jsの関係のチェック
    const hasFooterAndJs = content.includes('<div id="footer-placeholder"></div>\n  <script src="/js/include.js"></script>') || 
                           content.includes('<div id="footer-placeholder"></div>\n<script src="/js/include.js"></script>');
    if (!hasFooterAndJs && footerPlaceholderCount > 0) {
      result.issues.push('- フッタープレースホルダーの後にinclude.jsがありません');
      result.hasIssues = true;
    }
    
    // 8. スクリプトタグ内のHTMLコメントのチェック
    const scriptWithComment = content.match(/<script[^>]*>\s*<!--/);
    if (scriptWithComment) {
      result.issues.push('- スクリプトタグ内に不正なHTMLコメントがあります');
      result.hasIssues = true;
    }
    
    // 9. HTML閉じタグのチェック
    if (!content.match(/<\/body>\s*<\/html>\s*$/)) {
      result.issues.push('- HTML構造の終了タグが不適切です');
      result.hasIssues = true;
    }
    
    // 10. 閉じていないタグのチェック（基本的な検出のみ）
    const openTags = content.match(/<(div|span|p|h[1-6]|section|article|main|header|footer|nav)[^>]*>/g) || [];
    const closeTags = content.match(/<\/(div|span|p|h[1-6]|section|article|main|header|footer|nav)>/g) || [];
    
    if (openTags.length !== closeTags.length) {
      result.issues.push(`- タグのバランスが取れていません（開始: ${openTags.length}個、終了: ${closeTags.length}個）`);
      result.hasIssues = true;
    }
    
    // 結果の表示
    if (result.hasIssues) {
      console.log(`  ✗ ${result.issues.length}件の問題を検出しました`);
    } else {
      console.log(`  ✓ 問題は見つかりませんでした`);
    }
    
    return result;
  } catch (error) {
    console.error(`  ✗ ファイル読み込み中にエラー: ${error.message}`);
    result.issues.push(`- ファイル読み込み中にエラー: ${error.message}`);
    result.hasIssues = true;
    return result;
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
  
  console.log(`検証対象ファイル: ${files.length}件\n`);
  
  let filesWithIssues = 0;
  
  // 各ファイルを検証
  for (const file of files) {
    const result = validateFile(file);
    
    // レポートに追加
    if (result.hasIssues) {
      filesWithIssues++;
      reportContent += `### ${result.filename}\n`;
      result.issues.forEach(issue => {
        reportContent += `${issue}\n`;
      });
      reportContent += '\n';
    }
  }
  
  // 問題のないファイルをカウント
  const filesWithoutIssues = files.length - filesWithIssues;
  
  // レポートにサマリーを追加
  reportContent += `## サマリー\n`;
  reportContent += `- 検証したファイル: ${files.length} 件\n`;
  reportContent += `- 問題のあるファイル: ${filesWithIssues} 件\n`;
  reportContent += `- 問題のないファイル: ${filesWithoutIssues} 件\n`;
  
  // レポートを保存
  fs.writeFileSync(REPORT_FILE, reportContent, 'utf8');
  
  console.log(`\n検証が完了しました`);
  console.log(`問題のあるファイル: ${filesWithIssues}/${files.length}`);
  console.log(`詳細レポート: ${path.basename(REPORT_FILE)}`);
}

// スクリプト実行
main();
