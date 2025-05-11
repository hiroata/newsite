/**
 * remove-header-from-blogs.js
 * すべてのブログ記事からヘッダー要素を削除するスクリプト
 */
const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const BLOG_DIR = path.join(__dirname, '..', 'blog');

// HTMLファイルからヘッダーを削除する関数
function removeHeaderFromHtml(filePath) {
  console.log(`処理中: ${filePath}`);
  
  try {
    // ファイルの内容を読み込む
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // 変更前のサイズを記録
    const beforeSize = htmlContent.length;
    
    // 1. <svg-icons>タグを削除（もしくはSVGデータを直接含める必要がある場合は修正）
    htmlContent = htmlContent.replace(/<svg-icons><\/svg-icons>/, '<div id="svg-defs-placeholder"></div>');
    
    // 2. <site-header>タグを削除
    htmlContent = htmlContent.replace(/<site-header><\/site-header>/, '');
    
    // 3. <div id="header-placeholder"></div>の形式も削除
    htmlContent = htmlContent.replace(/<div id="header-placeholder"><\/div>/, '');
    
    // 4. paddingの調整（CSSクラスを使用する場合は、この部分を修正してCSSを追加）
    // htmlContent = htmlContent.replace(/<main class="site-main">/, '<main class="site-main no-header">');
    
    // 変更後のサイズを記録
    const afterSize = htmlContent.length;
    
    // 変更がある場合のみファイルを更新
    if (beforeSize !== afterSize) {
      fs.writeFileSync(filePath, htmlContent, 'utf8');
      console.log(`ヘッダーを削除しました: ${filePath}`);
      return true;
    } else {
      console.log(`変更なし: ${filePath} (ヘッダーが見つからないか、すでに削除済み)`);
      return false;
    }
  } catch (error) {
    console.error(`エラー: ${filePath} の処理中に問題が発生しました`, error);
    return false;
  }
}

// メイン処理
function main() {
  // ブログディレクトリ内のすべてのHTMLファイルを取得
  try {
    const files = fs.readdirSync(BLOG_DIR)
      .filter(file => file.endsWith('.html'))
      .map(file => path.join(BLOG_DIR, file));
    
    console.log(`HTMLファイルが${files.length}件見つかりました。`);
    
    // 各ファイルを処理
    let successCount = 0;
    for (const file of files) {
      const success = removeHeaderFromHtml(file);
      if (success) {
        successCount++;
      }
    }
    
    console.log(`\n===== 処理結果 =====`);
    console.log(`合計ファイル数: ${files.length}`);
    console.log(`ヘッダーを削除したファイル数: ${successCount}`);
  } catch (error) {
    console.error('ブログディレクトリの処理中にエラーが発生しました:', error);
  }
}

// スクリプト実行
main();
