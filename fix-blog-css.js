// 全てのブログページのCSSリンクを統一化するスクリプト

const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(__dirname, 'blog');

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
    <link rel="icon" href="../images/favicon.ico">
`;

// CSSリンクを標準化する関数
function standardizeCssLinks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // CSSリンク部分を検出して置換
    const cssRegex = /<link rel="preconnect"[\s\S]*?<link rel="icon"[^>]*>/;
    if (cssRegex.test(content)) {
      const modified = content.replace(cssRegex, standardCssLinks.trim());
      fs.writeFileSync(filePath, modified, 'utf8');
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err}`);
    return false;
  }
}

// メイン処理
function main() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(BLOG_DIR, file));
    
  console.log(`HTMLファイルが${files.length}件見つかりました。`);
  
  let successCount = 0;
  for (const file of files) {
    if (standardizeCssLinks(file)) {
      successCount++;
      console.log(`CSS参照を標準化: ${file}`);
    }
  }
  
  console.log(`\n===== 処理結果 =====`);
  console.log(`合計ファイル数: ${files.length}`);
  console.log(`CSS参照を標準化したファイル数: ${successCount}`);
}

main();
