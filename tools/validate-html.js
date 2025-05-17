/**
 * ページ内のHTMLエラーチェック用スクリプト
 */
const fs = require('fs');
const path = require('path');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;

// チェックするHTML構造の問題
const checkIssues = [
  { name: '閉じていないタグ', regex: /<([a-z0-9]+)[^>]*>[^<]*$/ },
  // { name: '不正なHTML構造', regex: /<\/html>(?!$)/ },
  { name: '重複するbodyタグ', regex: /<body[^>]*>[\s\S]*<body[^>]*>/ },
  { name: '重複するhtmlタグ', regex: /<html[^>]*>[\s\S]*<html[^>]*>/ },
  // { name: '閉じていないbodyタグ', regex: /<body[^>]*>[\s\S]*<\/html>(?![\s\S]*<\/body>)/ },
  { name: 'ヘッダープレースホルダーの位置エラー', regex: /<main[\s\S]*<div[^>]*id="header-placeholder"/ },
  { name: 'フッタープレースホルダーの位置エラー', regex: /<body[\s\S]*<div[^>]*id="footer-placeholder"[\s\S]*<main/ },
  { name: 'リクエストセクションの重複', regex: /<section[^>]*class="tool-request"[\s\S]*<section[^>]*class="tool-request"/ }
];

/**
 * HTMLファイルをチェック
 * @param {string} filePath - 処理対象のファイルパス
 */
function checkHtmlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    let hasErrors = false;
    
    // ヘッダープレースホルダーのチェック
    if (!content.includes('<div id="header-placeholder"></div>')) {
      console.error(`✗ ${filename}: ヘッダープレースホルダーがありません`);
      hasErrors = true;
    }
    
    // フッタープレースホルダーのチェック（index.htmlは除く）
    if (filename !== 'index.html' && !content.includes('<div id="footer-placeholder"></div>')) {
      console.error(`✗ ${filename}: フッタープレースホルダーがありません`);
      hasErrors = true;
    }
    
    // インクルードスクリプトのチェック
    if (!content.includes('script src="/js/include.js"')) {
      console.error(`✗ ${filename}: インクルードスクリプトがありません`);
      hasErrors = true;
    }
    
    // その他のHTML構造の問題をチェック
    checkIssues.forEach(issue => {
      if (issue.regex.test(content)) {
        console.error(`✗ ${filename}: ${issue.name}があります`);
        hasErrors = true;
      }
    });
    
    // エラーがなければOKを表示
    if (!hasErrors) {
      console.log(`✓ ${filename}: OK`);
    }
    
    return hasErrors;
  } catch (error) {
    console.error(`✗ ${path.basename(filePath)} の処理中にエラーが発生しました:`, error);
    return true;
  }
}

/**
 * メイン処理
 */
function main() {
  // テンプレートと設定ファイルを除外
  const excludeFiles = ['fix-headers-footers.js', 'fix-duplicate-includes.js', 'tool-template.html', 'image-tool-template.html'];
  
  // HTMLファイルをリストアップ
  const files = fs.readdirSync(TOOLS_DIR)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file))
    .map(file => path.join(TOOLS_DIR, file));
  
  console.log(`チェック対象ファイル: ${files.length}件\n`);
  
  // 各ファイルをチェック
  let errorCount = 0;
  files.forEach(file => {
    const hasError = checkHtmlFile(file);
    if (hasError) errorCount++;
  });
  
  if (errorCount > 0) {
    console.log(`\n✗ ${errorCount}件のファイルにエラーがあります`);
  } else {
    console.log('\n✓ すべてのファイルにエラーはありません');
  }
}

// スクリプト実行
main();
