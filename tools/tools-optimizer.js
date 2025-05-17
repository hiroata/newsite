/**
 * ツール最適化・統合スクリプト
 * 
 * このスクリプトは以下の処理を行います：
 * 1. 不要なスクリプトファイルの削除
 * 2. 新しい共通ファイルの適用
 * 3. ツールファイル内のスクリプトの参照先の更新
 * 
 * 使い方: node tools/tools-optimizer.js
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// ディレクトリパス
const rootDir = path.resolve(__dirname, '..');
const toolsDir = path.join(rootDir, 'tools');
const jsDir = path.join(rootDir, 'js');
const cssDir = path.join(rootDir, 'css');

// 削除対象の不要なスクリプトファイル
const filesToRemove = [
  // 古い共通ファイル
  path.join(jsDir, 'image-tools-common.js'),
  // 統合されたツール管理スクリプト
  path.join(toolsDir, 'cleanup-tools.js'),
  path.join(toolsDir, 'convert-all-tools.js'),
  path.join(toolsDir, 'convert-tool-to-template-v2.js'),
  path.join(toolsDir, 'run-convert-all-tools.js'),
  // その他のメンテナンス用スクリプト
  path.join(toolsDir, 'fix-whitespace.js'),
  path.join(toolsDir, 'fix-trailing-whitespace.js'),
  path.join(toolsDir, 'stop-servers.js'),
  path.join(toolsDir, 'update-hatena-bookmark.js'),
  path.join(toolsDir, 'update-line-button.js'),
  path.join(toolsDir, 'update-share-buttons.js')
];

// 対象となるツールファイル
const toolHtmlFiles = [
  path.join(toolsDir, 'image-resize.html'),
  path.join(toolsDir, 'png-to-jpeg.html'),
  path.join(toolsDir, 'png-jpeg-to-webp.html'),
  path.join(toolsDir, 'meme-generator.html')
];

/**
 * ファイルを削除する関数
 * @param {string} filePath - 削除するファイルのパス
 */
function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ 削除完了: ${path.relative(rootDir, filePath)}`);
    }
  } catch (err) {
    console.error(`❌ 削除失敗: ${path.relative(rootDir, filePath)}`);
    console.error(err);
  }
}

/**
 * HTML内のCSSとJavaScriptの参照を更新
 * @param {string} htmlPath - HTMLファイルのパス
 */
function updateHtmlReferences(htmlPath) {
  try {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const $ = cheerio.load(html);
    
    // 既存のスタイルタグとスクリプトタグをチェック
    let hasImageToolsStyles = false;
    let hasImageToolsUtils = false;
    
    // 古いスクリプト参照を削除
    $('script').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && (
        src.includes('image-tools-common.js') || 
        src.includes('image-processing.js')
      )) {
        $(elem).remove();
      }
      if (src && src.includes('image-tools-utils.js')) {
        hasImageToolsUtils = true;
      }
    });
    
    // 古いスタイル参照を削除
    $('link[rel="stylesheet"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && href.includes('image-tools-styles.css')) {
        hasImageToolsStyles = true;
      }
    });
    
    // head要素を取得
    const head = $('head');
    
    // 新しい共通CSSが未追加の場合、追加
    if (!hasImageToolsStyles) {
      head.append(
        '<link rel="stylesheet" href="/css/image-tools-styles.css">'
      );
    }
    
    // 新しい共通JSが未追加の場合、追加
    if (!hasImageToolsUtils) {
      head.append(
        '<script src="/js/image-tools-utils.js"></script>'
      );
    }
    
    // JSZipが必要なツールには追加
    if (htmlPath.includes('image-resize') || 
        htmlPath.includes('png-to-jpeg') || 
        htmlPath.includes('png-jpeg-to-webp')) {
      // JSZipがなければ追加
      if (!html.includes('jszip.min.js')) {
        // bodyの最後に追加
        $('body').append(
          '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>'
        );
      }
    }
    
    // HTML内のインライン関数を検索して、共通関数を使用するコードに修正
    const inlineScripts = $('script:not([src])');
    for (let i = 0; i < inlineScripts.length; i++) {
      const script = $(inlineScripts[i]);
      let content = script.html();
      
      // 共通関数を使用するようにコードを修正
      content = content.replace(
        /function\s+setupFileDropAndSelection\([^)]*\)\s*\{[\s\S]*?\}/g,
        '// setupFileDropAndSelectionは共通関数を使用'
      );
      
      content = content.replace(
        /function\s+updateUI\([^)]*\)\s*\{[\s\S]*?\}/g,
        '// updateUIは共通関数を使用'
      );
      
      content = content.replace(
        /function\s+createFileItem\([^)]*\)\s*\{[\s\S]*?\}/g,
        '// createFileItemは共通関数を使用'
      );
      
      content = content.replace(
        /function\s+formatFileSize\([^)]*\)\s*\{[\s\S]*?\}/g,
        '// formatFileSizeは共通関数を使用'
      );
      
      // PNG→JPEGツール用
      if (htmlPath.includes('png-to-jpeg')) {
        content = content.replace(
          /function\s+convertToJPEG\([^)]*\)\s*\{[\s\S]*?\}/g,
          '// convertToJPEGは共通関数を使用'
        );
      }
      
      // WebP変換ツール用
      if (htmlPath.includes('png-jpeg-to-webp')) {
        content = content.replace(
          /function\s+convertToWebP\([^)]*\)\s*\{[\s\S]*?\}/g,
          '// convertToWebPは共通関数を使用'
        );
        
        content = content.replace(
          /function\s+checkWebPSupport\([^)]*\)\s*\{[\s\S]*?\}/g,
          '// checkWebPSupportは共通関数を使用'
        );
      }
      
      // 画像リサイズツール用
      if (htmlPath.includes('image-resize')) {
        content = content.replace(
          /function\s+resizeImage\([^)]*\)\s*\{[\s\S]*?\}/g,
          '// resizeImageは共通関数を使用'
        );
      }
      
      script.html(content);
    }
    
    // 修正したHTMLを保存
    fs.writeFileSync(htmlPath, $.html());
    console.log(`✅ 参照更新完了: ${path.relative(rootDir, htmlPath)}`);
    
  } catch (err) {
    console.error(`❌ HTML更新失敗: ${path.relative(rootDir, htmlPath)}`);
    console.error(err);
  }
}

/**
 * メイン処理
 */
function main() {
  console.log('🔧 ツール最適化・統合処理を開始します...');
  
  // 不要なファイルを削除
  console.log('\n📁 不要なファイルを削除中...');
  filesToRemove.forEach(removeFile);
  
  // HTMLファイル内の参照を更新
  console.log('\n📄 HTMLファイルの参照を更新中...');
  toolHtmlFiles.forEach(updateHtmlReferences);
  
  console.log('\n✨ ツールの最適化・統合が完了しました！');
  console.log('以下のファイルを確認してください:');
  console.log('- /js/image-tools-utils.js (新しい共通JavaScript)');
  console.log('- /css/image-tools-styles.css (新しい共通CSS)');
}

// スクリプト実行
main();
