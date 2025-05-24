/**
 * fix-unified-tools.js - HTML修正ツール統合版
 * このスクリプトは以下の複数の修正ツールを統合したものです:
 * - fix-all-tools.js: HTMLツールファイルの構造修正
 * - fix-blog-css.js: ブログのCSSリンク統一化
 * - fix-blog-references.js: ブログの画像参照修正
 * - fix-blog-svg.js: SVGアイコン修正
 * - fix-share-buttons.js: 共有ボタン修正
 * - fix-svg-icons.js: SVGアイコン最適化
 * - check-404-errors.js: 404エラーチェック
 * - check-404-urls.js: 無効なURL確認
 *
 * 使用方法:
 * node tools/fix-unified-tools.js [all|tools|blog|svg|check404]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');
const https = require('https');

// パス設定
const rootDir = path.join(__dirname, '..');
const toolsDir = __dirname;
const blogDir = path.join(rootDir, 'blog');
const reportDir = path.join(rootDir, 'reports');

// スキップするファイル
const SKIP_FILES = [
  'fix-headers-footers.js',
  'fix-duplicate-includes.js', 
  'fix-html-structure.js', 
  'validate-html.js',
  'fix-all-tools.js',
  'fix-unified-tools.js',
  'test-image-tools.html',
  'tool-template.html',
  'image-tool-template.html'
];

// レポートディレクトリを作成
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// 標準CSSリンク
const standardCssLinks = `
    <!-- スタイルシート -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/blog-optimized.css">
    <link rel="stylesheet" href="../css/blog-fixes-new.css">
    <link rel="stylesheet" href="../css/blog-fixes-patch.css">
    <link rel="stylesheet" href="../css/blog-fixes-critical.css">
    <link rel="icon" href="../assets/images/favicon.ico">
`;

//=============================================================
// HTMLツール修正機能
//=============================================================

// HTMLファイルを修正する関数
function fixToolHtmlFiles() {
  console.log('🔧 HTMLツールファイルを修正しています...');
  
  let fixes = {
    includeScript: 0,
    headerFooter: 0,
    duplicateMain: 0,
    duplicateFooter: 0,
    scriptTags: 0,
    htmlStructure: 0
  };
  
  // HTMLファイルのリストを取得
  const htmlFiles = fs.readdirSync(toolsDir)
    .filter(file => file.endsWith('.html') && !SKIP_FILES.includes(file))
    .map(file => path.join(toolsDir, file));
    
  console.log(`🔎 ${htmlFiles.length}個のHTMLファイルを処理します...`);
  
  // 各ファイルを処理
  htmlFiles.forEach(filePath => {
    const fileName = path.basename(filePath);
    console.log(`📄 ${fileName}を処理中...`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // 1. インクルードスクリプトの修正
      const includeScriptPattern = /<script src="\.\.\/js\/include\.js"><\/script>/g;
      const updatedIncludeScript = '<script src="../js/include.js" defer></script>';
      content = content.replace(includeScriptPattern, updatedIncludeScript);
      
      // インクルードスクリプトがない場合は追加
      if (!content.includes('include.js')) {
        content = content.replace('</head>', `  ${updatedIncludeScript}\n</head>`);
        fixes.includeScript++;
      } else if (originalContent !== content) {
        fixes.includeScript++;
      }
      
      // 2. ヘッダー/フッターの修正
      if (content.includes('<!--header-->') || content.includes('<!--footer-->')) {
        content = content.replace(/<!--header-->/g, '<div id="header-placeholder"></div>');
        content = content.replace(/<!--footer-->/g, '<div id="footer-placeholder"></div>');
        fixes.headerFooter++;
      }
      
      // 3. 重複する<main>タグの修正
      if ((content.match(/<main/g) || []).length > 1) {
        // 最初の<main>だけ残して他を<div class="main-content">に変更
        let mainCount = 0;
        content = content.replace(/<main[^>]*>/g, match => {
          mainCount++;
          return mainCount === 1 ? match : '<div class="main-content">';
        });
        
        content = content.replace(/<\/main>/g, match => {
          return mainCount-- > 1 ? '</div>' : match;
        });
        fixes.duplicateMain++;
      }
      
      // 4. 重複するフッターの削除
      const footerPattern = /<footer[^>]*>[\s\S]*?<\/footer>/g;
      const footerMatches = content.match(footerPattern);
      if (footerMatches && footerMatches.length > 1) {
        let footerCount = 0;
        content = content.replace(footerPattern, match => {
          footerCount++;
          return footerCount === 1 ? match : '<!-- 重複フッター削除 -->';
        });
        fixes.duplicateFooter++;
      }
      
      // 5. スクリプトタグの構造修正
      if (content.includes('</script><script>')) {
        content = content.replace(/<\/script><script>/g, '\n\n');
        fixes.scriptTags++;
      }
      
      // 6. HTML構造の修正
      if (!content.includes('<!DOCTYPE html>')) {
        content = '<!DOCTYPE html>\n' + content;
        fixes.htmlStructure++;
      }
      
      if (!content.includes('<html')) {
        content = '<!DOCTYPE html>\n<html lang="ja">\n' + content.replace('<!DOCTYPE html>\n', '');
        fixes.htmlStructure++;
      }
      
      // ファイルを保存
      fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
      console.error(`❌ ${fileName}の処理中にエラーが発生しました:`, error);
    }
  });
  
  // 修正結果のレポート
  const reportContent = `# HTMLツール修正レポート
作成日時: ${new Date().toLocaleString()}

## 修正内容
- インクルードスクリプトの修正: ${fixes.includeScript}件
- ヘッダー/フッターの修正: ${fixes.headerFooter}件
- 重複する<main>タグの修正: ${fixes.duplicateMain}件
- 重複するフッターの削除: ${fixes.duplicateFooter}件
- スクリプトタグ構造の修正: ${fixes.scriptTags}件
- HTML構造の修正: ${fixes.htmlStructure}件

## 対象ファイル
${htmlFiles.map(file => `- ${path.basename(file)}`).join('\n')}
`;
  
  const reportPath = path.join(reportDir, 'html-tools-fix-report.md');
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  
  console.log('✅ HTMLファイル修正が完了しました');
  console.log(`📝 レポートを保存しました: ${reportPath}`);
}

//=============================================================
// ブログCSS修正機能
//=============================================================

// ブログのCSSリンクを標準化する関数
function fixBlogCss() {
  console.log('🔧 ブログページのCSSリンクを修正しています...');
  
  const htmlFiles = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(blogDir, file));
  
  console.log(`🔎 ${htmlFiles.length}個のブログページを処理します...`);
  
  let modifiedCount = 0;
  
  htmlFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // CSSリンク部分を検出して置換
      const cssRegex = /<link rel="preconnect"[\s\S]*?<link rel="icon"[^>]*>/;
      if (cssRegex.test(content)) {
        const modified = content.replace(cssRegex, standardCssLinks.trim());
        if (modified !== content) {
          fs.writeFileSync(filePath, modified, 'utf8');
          modifiedCount++;
          console.log(`✅ ${path.basename(filePath)}を修正しました`);
        }
      }
    } catch (error) {
      console.error(`❌ ${path.basename(filePath)}の処理中にエラーが発生しました:`, error);
    }
  });
  
  console.log(`✅ ${modifiedCount}/${htmlFiles.length}件のファイルを修正しました`);
}

//=============================================================
// ブログ参照修正機能
//=============================================================

// ブログの参照を修正する関数
function fixBlogReferences() {
  console.log('🔧 ブログページの参照を修正しています...');
  
  const htmlFiles = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(blogDir, file));
  
  console.log(`🔎 ${htmlFiles.length}個のブログページを処理します...`);
  
  let modifiedCount = 0;
  
  htmlFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // favicon参照を修正
      let modified = content.replace(
        /<link rel="icon" href="\.\.\/images\/favicon\.ico">/g, 
        '<link rel="icon" href="../assets/images/favicon.ico">'
      );
      
      // 画像リンクを修正
      modified = modified.replace(
        /src="\/assets\/images\//g,
        'src="../assets/images/'
      );
      
      // href="/のパスを修正
      modified = modified.replace(
        /href="\/(?!http)/g,
        'href="../'
      );
      
      // 変更があれば保存
      if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        modifiedCount++;
        console.log(`✅ ${path.basename(filePath)}を修正しました`);
      }
    } catch (error) {
      console.error(`❌ ${path.basename(filePath)}の処理中にエラーが発生しました:`, error);
    }
  });
  
  console.log(`✅ ${modifiedCount}/${htmlFiles.length}件のファイルを修正しました`);
}

//=============================================================
// SVG修正機能
//=============================================================

// ブログのSVGを修正する関数
function fixBlogSvg() {
  console.log('🔧 ブログページのSVGを修正しています...');
  
  const htmlFiles = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(blogDir, file));
  
  console.log(`🔎 ${htmlFiles.length}個のブログページを処理します...`);
  
  let modifiedCount = 0;
  
  htmlFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // SVGアイコンを共通定義に置き換え
      let modified = content;
      
      // Twitterアイコン
      const twitterIconRegex = /<svg[^>]*class="[^"]*twitter[^"]*"[^>]*>[\s\S]*?<\/svg>/g;
      modified = modified.replace(twitterIconRegex, '<svg class="icon twitter-icon"><use xlink:href="../common/svg-defs.html#icon-twitter"></use></svg>');
      
      // Facebookアイコン
      const facebookIconRegex = /<svg[^>]*class="[^"]*facebook[^"]*"[^>]*>[\s\S]*?<\/svg>/g;
      modified = modified.replace(facebookIconRegex, '<svg class="icon facebook-icon"><use xlink:href="../common/svg-defs.html#icon-facebook"></use></svg>');
      
      // 変更があれば保存
      if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        modifiedCount++;
        console.log(`✅ ${path.basename(filePath)}を修正しました`);
      }
    } catch (error) {
      console.error(`❌ ${path.basename(filePath)}の処理中にエラーが発生しました:`, error);
    }
  });
  
  console.log(`✅ ${modifiedCount}/${htmlFiles.length}件のファイルを修正しました`);
}

//=============================================================
// 共有ボタン修正機能
//=============================================================

// 共有ボタンを修正する関数
function fixShareButtons() {
  console.log('🔧 ブログページの共有ボタンを修正しています...');
  
  const htmlFiles = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(blogDir, file));
  
  console.log(`🔎 ${htmlFiles.length}個のブログページを処理します...`);
  
  let modifiedCount = 0;
  
  // 標準化された共有ボタン
  const standardShareButtons = `
<div class="share-buttons">
  <a href="#" class="share-twitter" onclick="shareOnTwitter(); return false;">
    <svg class="icon twitter-icon"><use xlink:href="../common/svg-defs.html#icon-twitter"></use></svg>
    <span>Twitterで共有</span>
  </a>
  <a href="#" class="share-facebook" onclick="shareOnFacebook(); return false;">
    <svg class="icon facebook-icon"><use xlink:href="../common/svg-defs.html#icon-facebook"></use></svg>
    <span>Facebookで共有</span>
  </a>
</div>
<script>
  function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank');
  }
  function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
  }
</script>`.trim();
  
  htmlFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 共有ボタンを検索して置換
      const shareButtonsRegex = /<div class="share-buttons">[\s\S]*?<\/script>/;
      if (shareButtonsRegex.test(content)) {
        const modified = content.replace(shareButtonsRegex, standardShareButtons);
        if (modified !== content) {
          fs.writeFileSync(filePath, modified, 'utf8');
          modifiedCount++;
          console.log(`✅ ${path.basename(filePath)}を修正しました`);
        }
      } else {
        // 共有ボタンがない場合はフッターの前に追加
        if (content.includes('</article>') && !content.includes('share-buttons')) {
          const modified = content.replace('</article>', '</article>\n' + standardShareButtons);
          fs.writeFileSync(filePath, modified, 'utf8');
          modifiedCount++;
          console.log(`✅ ${path.basename(filePath)}に共有ボタンを追加しました`);
        }
      }
    } catch (error) {
      console.error(`❌ ${path.basename(filePath)}の処理中にエラーが発生しました:`, error);
    }
  });
  
  console.log(`✅ ${modifiedCount}/${htmlFiles.length}件のファイルを修正しました`);
}

//=============================================================
// 404エラーチェック機能
//=============================================================

// URLが有効かチェックする関数
function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        valid: res.statusCode < 400
      });
    });
    
    req.on('error', () => {
      resolve({
        url,
        status: 0,
        valid: false
      });
    });
    
    req.end();
  });
}

// 404エラーをチェックする関数
async function check404Errors() {
  console.log('🔍 404エラーをチェックしています...');
  
  const domainsToCheck = [
    'https://example.com',  // 例として
    'https://utage-system.com'
  ];
  
  // チェックするパスのリスト
  const pathsToCheck = [
    '/',
    '/blog',
    '/achievement',
    '/about.html',
    '/free-consultation.html',
    '/privacy.html',
    '/terms.html'
  ];
  
  console.log(`🌐 ${domainsToCheck.length}つのドメインで${pathsToCheck.length}個のパスをチェックします...`);
  
  const results = [];
  
  for (const domain of domainsToCheck) {
    for (const path of pathsToCheck) {
      const url = `${domain}${path}`;
      const result = await checkUrl(url);
      results.push(result);
      
      const statusEmoji = result.valid ? '✅' : '❌';
      const statusColor = result.valid ? '\x1b[32m' : '\x1b[31m';
      console.log(`${statusEmoji} ${statusColor}${url}\x1b[0m - ${result.status}`);
    }
  }
  
  // レポート作成
  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.filter(r => !r.valid).length;
  
  const reportContent = `# 404エラーチェックレポート
作成日時: ${new Date().toLocaleString()}

## サマリー
- チェック済みURL: ${results.length}
- 有効なURL: ${validCount}
- 無効なURL: ${invalidCount}

## 詳細結果
${results.map(r => `- ${r.url} - ${r.status} ${r.valid ? '(OK)' : '(エラー)'}`).join('\n')}
`;
  
  const reportPath = path.join(reportDir, '404-check-report.md');
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  
  console.log(`✅ チェック完了: ${validCount}個の有効なURL、${invalidCount}個の無効なURL`);
  console.log(`📝 レポートを保存しました: ${reportPath}`);
}

//=============================================================
// メイン処理
//=============================================================

async function main() {
  console.log('🛠️ 統合HTMLファイル修正ツールを実行しています...');
  
  const arg = process.argv[2] || 'all';
  
  switch(arg) {
    case 'all':
      fixToolHtmlFiles();
      fixBlogCss();
      fixBlogReferences();
      fixBlogSvg();
      fixShareButtons();
      await check404Errors();
      break;
    
    case 'tools':
      fixToolHtmlFiles();
      break;
      
    case 'blog':
      fixBlogCss();
      fixBlogReferences();
      fixBlogSvg();
      fixShareButtons();
      break;
      
    case 'svg':
      fixBlogSvg();
      break;
      
    case 'check404':
      await check404Errors();
      break;
      
    default:
      console.log(`
使用方法:
node tools/fix-unified-tools.js [all|tools|blog|svg|check404]

オプション:
  all       - すべての修正とチェックを実行 (デフォルト)
  tools     - HTMLツールファイルのみ修正
  blog      - ブログページのみ修正
  svg       - SVGアイコンのみ修正
  check404  - 404エラーのみチェック
`);
      break;
  }
  
  console.log('✅ 処理が完了しました!');
}

// モジュールとして実行または直接実行
if (require.main === module) {
  main().catch(err => {
    console.error('❌ エラーが発生しました:', err);
    process.exit(1);
  });
} else {
  module.exports = {
    fixToolHtmlFiles,
    fixBlogCss,
    fixBlogReferences,
    fixBlogSvg,
    fixShareButtons,
    check404Errors
  };
}
