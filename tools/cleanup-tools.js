/**
 * プロジェクトクリーンアップスクリプト
 * 
 * このスクリプトは以下の不要なファイルを削除します：
 * 1. 開発完了後に不要になった修正スクリプト
 * 2. 一時的な検証ファイル
 * 3. テスト関連ファイル
 * 4. 古いバージョンのスクリプト
 * 5. レポートファイル（ツールディレクトリ内のみ）
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ツールディレクトリのパス
const TOOLS_DIR = path.resolve(__dirname);
const ROOT_DIR = path.resolve(__dirname, '..');

// 削除するJSファイルのリスト（もう不要なスクリプト）
const SCRIPTS_TO_DELETE = [
  // 修正系スクリプト - 一度実行したら不要になるもの
  'fix-all-tools.js',
  'fix-duplicate-includes.js',
  'fix-headers-footers.js',
  'fix-html-structure.js',
  'fix-html-tags.js',
  'fix-includes.js',
  'fix-relative-paths.js',
  'final-fix.js',
  'final-fix-all.js',
  
  // 検証系スクリプト - 開発完了後は不要
  'validate-html.js',
  'html-validation.js',
  'final-html-validation.js',
  
  // テスト関連ファイル
  'test-server.js',
  
  // 古いバージョン
  'remove-blog-inline-styles-v2.js',
  
  // 最適化ツール - 一度実行したら不要
  'tools-optimizer.js',
  'optimize.js'
];

// 不要なHTMLファイル（修正済み、バックアップ、古いバージョン）
const HTML_TO_DELETE = [
  'png-to-jpeg-fixed.html',
  'png-jpeg-to-webp-fix.html'
];

// ツールディレクトリ内の開発レポートファイル
// ルートディレクトリのレポートファイルは保持する
const REPORTS_TO_DELETE = [
  'include-js-fix-report.md',
  'html-validation-report.md',
  'html-fix-report.md',
  'headers-footers-fix-report.md',
  'final-html-validation-report.md',
  'final-fixes-report.md',
  'final-fix-report.md',
  'add-prevention-script-report.md',
  'add-conditional-include-report.md'
];

console.log('プロジェクトクリーンアップを開始します...');

// JSファイルの削除
let deletedScriptsCount = 0;
SCRIPTS_TO_DELETE.forEach(scriptName => {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (fs.existsSync(scriptPath)) {
    try {
      fs.unlinkSync(scriptPath);
      console.log(`削除: ${scriptName}`);
      deletedScriptsCount++;
    } catch (err) {
      console.error(`エラー: ${scriptName} の削除に失敗しました`, err);
    }
  } else {
    console.log(`スキップ: ${scriptName} は既に削除されています`);
  }
});

// HTMLファイルの削除
let deletedHtmlCount = 0;
HTML_TO_DELETE.forEach(htmlName => {
  const htmlPath = path.join(TOOLS_DIR, htmlName);
  if (fs.existsSync(htmlPath)) {
    try {
      fs.unlinkSync(htmlPath);
      console.log(`削除: ${htmlName}`);
      deletedHtmlCount++;
    } catch (err) {
      console.error(`エラー: ${htmlName} の削除に失敗しました`, err);
    }
  } else {
    console.log(`スキップ: ${htmlName} は既に削除されています`);
  }
});

// レポートファイルの削除
let deletedReportsCount = 0;
REPORTS_TO_DELETE.forEach(reportName => {
  const reportPath = path.join(TOOLS_DIR, reportName);
  if (fs.existsSync(reportPath)) {
    try {
      fs.unlinkSync(reportPath);
      console.log(`削除: ${reportName}`);
      deletedReportsCount++;
    } catch (err) {
      console.error(`エラー: ${reportName} の削除に失敗しました`, err);
    }
  } else {
    console.log(`スキップ: ${reportName} は既に削除されています`);
  }
});

console.log('\nクリーンアップ完了:');
console.log(`- 不要なスクリプト: ${deletedScriptsCount}個削除`);
console.log(`- 不要なHTMLファイル: ${deletedHtmlCount}個削除`);
console.log(`- 不要なレポートファイル: ${deletedReportsCount}個削除`);
