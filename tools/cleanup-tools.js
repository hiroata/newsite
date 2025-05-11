/**
 * cleanup-tools.js
 * 不要になったツールスクリプトを削除するためのスクリプト
 */
const fs = require('fs');
const path = require('path');

// 削除対象のファイルリスト
const filesToDelete = [
  // ブログ修正関連（既に完了）
  'fix-blog-css-comments.js',
  'fix-blog-css-references-final.js',
  'fix-blog-css-references-v2.js',
  'fix-blog-css-references.js',
  'fix-blog-manually.js',
  'fix-blog-styles-final.js',
  'fix-html-body-tags.js',
  'fix-missing-style-tags.js',
  'analyze-blog-html-patterns.js',
  'apply-blog-fixes-css.js',
  'ultimate-fix-blog-styles.js',
  
  // 古いバージョンのツール変換スクリプト
  'convert-tool-to-template.js',
  'remove-blog-inline-styles.js',
  
  // モバイルCSS関連（すでに適用済み）
  'add-mobile-css.js',
  'remove-mobile-css-references.js'
];

// toolsディレクトリのパス
const TOOLS_DIR = path.join(__dirname);

// ファイルを削除する関数
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`削除成功: ${filePath}`);
      return true;
    } else {
      console.log(`ファイルが存在しません: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`ファイル削除中にエラーが発生しました ${filePath}:`, error);
    return false;
  }
}

// メイン処理
function main() {
  console.log('不要なスクリプトファイルの削除を開始します...');
  
  let deletedCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;
  
  // 各ファイルを処理
  for (const file of filesToDelete) {
    const filePath = path.join(TOOLS_DIR, file);
    
    try {
      if (fs.existsSync(filePath)) {
        if (deleteFile(filePath)) {
          deletedCount++;
        } else {
          errorCount++;
        }
      } else {
        console.log(`スキップ: ${file} (存在しません)`);
        notFoundCount++;
      }
    } catch (error) {
      console.error(`エラー: ${file} の処理中にエラーが発生しました`, error);
      errorCount++;
    }
  }
  
  // 結果を表示
  console.log('\n===== 削除結果 =====');
  console.log(`削除対象ファイル数: ${filesToDelete.length}`);
  console.log(`削除成功: ${deletedCount}`);
  console.log(`存在しない: ${notFoundCount}`);
  console.log(`エラー: ${errorCount}`);
}

// スクリプト実行
main();
