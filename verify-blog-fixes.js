// ブログCSSの修正確認スクリプト

const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(__dirname, 'blog');
const CSS_DIR = path.join(__dirname, 'css');

// 必要なCSSファイル一覧
const requiredCSSFiles = [
  'blog-optimized.css',
  'blog-fixes-new.css',
  'blog-fixes-patch.css',
  'blog-fixes-critical.css'
];

// CSSファイルの存在確認
function checkCSSFiles() {
  console.log('=== CSSファイル確認 ===');
  let allFilesExist = true;
  
  for (const cssFile of requiredCSSFiles) {
    const cssPath = path.join(CSS_DIR, cssFile);
    if (fs.existsSync(cssPath)) {
      console.log(`✅ ${cssFile} が存在します`);
    } else {
      console.log(`❌ ${cssFile} が見つかりません`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

// HTML内のCSS参照チェック
function checkCSSReferences() {
  console.log('\n=== CSS参照確認 ===');
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(BLOG_DIR, file));
  
  let allReferencesCorrect = true;
  
  for (const file of files) {
    const fileName = path.basename(file);
    const content = fs.readFileSync(file, 'utf8');
    const allCSSPresent = requiredCSSFiles.every(cssFile => 
      content.includes(`<link rel="stylesheet" href="../css/${cssFile}">`)
    );
    
    if (allCSSPresent) {
      console.log(`✅ ${fileName} のCSS参照は正常です`);
    } else {
      console.log(`❌ ${fileName} に一部のCSS参照が見つかりません`);
      allReferencesCorrect = false;
    }
  }
  
  return allReferencesCorrect;
}

// faviconへの参照チェック
function checkFaviconReferences() {
  console.log('\n=== favicon参照確認 ===');
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(BLOG_DIR, file));
  
  let allReferencesCorrect = true;
  
  for (const file of files) {
    const fileName = path.basename(file);
    const content = fs.readFileSync(file, 'utf8');
    const correctFaviconRef = content.includes('<link rel="icon" href="../assets/images/favicon.ico">');
    
    if (correctFaviconRef) {
      console.log(`✅ ${fileName} のfavicon参照は正常です`);
    } else {
      console.log(`❌ ${fileName} のfavicon参照に問題があります`);
      allReferencesCorrect = false;
    }
  }
  
  return allReferencesCorrect;
}

// メイン処理
function main() {
  const cssFilesOk = checkCSSFiles();
  const cssRefsOk = checkCSSReferences();
  const faviconRefsOk = checkFaviconReferences();
  
  console.log('\n=== 総合結果 ===');
  if (cssFilesOk && cssRefsOk && faviconRefsOk) {
    console.log('✅ すべてのチェックが正常に完了しました！ブログCSSの問題は解決されています。');
  } else {
    console.log('❌ 一部のチェックに問題があります。詳細は上記のログを確認してください。');
  }
}

main();
