/**
 * 最適化確認テストスクリプト
 * 
 * このスクリプトは、最適化した共通ファイルがプロジェクト内で正しく参照されているかを確認します。
 */

const fs = require('fs');
const path = require('path');

// ディレクトリパス
const rootDir = __dirname;
const toolsDir = path.join(rootDir, 'tools');
const jsDir = path.join(rootDir, 'js');
const cssDir = path.join(rootDir, 'css');

// 必須ファイル
const requiredFiles = [
  path.join(jsDir, 'image-tools-utils.js'),
  path.join(cssDir, 'image-tools-styles.css')
];

// 確認対象のツールファイル
const toolHtmlFiles = [
  path.join(toolsDir, 'image-resize.html'),
  path.join(toolsDir, 'png-to-jpeg.html'),
  path.join(toolsDir, 'png-jpeg-to-webp.html'),
  path.join(toolsDir, 'meme-generator.html')
];

// ファイルのサイズを確認する関数
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
}

// HTMLファイル内で共通リソースの参照をチェック
function checkHtmlReferences(htmlPath) {
  const content = fs.readFileSync(htmlPath, 'utf-8');
  
  // 各共通ファイルの参照を確認
  const hasImageToolsUtils = content.includes('image-tools-utils.js');
  const hasImageToolsStyles = content.includes('image-tools-styles.css');
  
  return { hasImageToolsUtils, hasImageToolsStyles };
}

// メイン処理
function main() {
  console.log('🔍 最適化確認テスト実行中...');
  
  // 必須ファイルの存在確認
  console.log('\n📁 共通ファイル確認:');
  let allFilesExist = true;
  
  requiredFiles.forEach(filePath => {
    const size = getFileSize(filePath);
    const fileExists = size > 0;
    allFilesExist = allFilesExist && fileExists;
    
    console.log(
      `  ${fileExists ? '✅' : '❌'} ${path.relative(rootDir, filePath)}: ${fileExists ? `${(size / 1024).toFixed(1)} KB` : '見つかりません'}`
    );
  });
  
  // HTMLファイル内の参照確認
  console.log('\n📄 HTMLファイル内の参照確認:');
  let allReferencesCorrect = true;
  
  toolHtmlFiles.forEach(htmlPath => {
    try {
      const { hasImageToolsUtils, hasImageToolsStyles } = checkHtmlReferences(htmlPath);
      const allRefsOK = hasImageToolsUtils && hasImageToolsStyles;
      allReferencesCorrect = allReferencesCorrect && allRefsOK;
      
      console.log(`  ${allRefsOK ? '✅' : '❌'} ${path.relative(rootDir, htmlPath)}:`);
      console.log(`    - image-tools-utils.js: ${hasImageToolsUtils ? '参照あり' : '参照なし ⚠️'}`);
      console.log(`    - image-tools-styles.css: ${hasImageToolsStyles ? '参照あり' : '参照なし ⚠️'}`);
    } catch (err) {
      console.error(`  ❌ ${path.relative(rootDir, htmlPath)}: ファイルの読み込みに失敗`);
      allReferencesCorrect = false;
    }
  });
  
  // 総合結果
  console.log('\n📊 テスト結果:');
  if (allFilesExist && allReferencesCorrect) {
    console.log('✅ すべてのチェックに合格しました！最適化は正常に適用されています。');
  } else {
    console.log('❌ 一部のチェックに失敗しました。詳細は上記のログを確認してください。');
  }
}

// スクリプト実行
main();
