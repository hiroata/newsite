/**
 * update-sidebar-cta-links.js
 * 
 * すべてのブログ記事のサイドバーCTAリンクを更新するスクリプト
 */

const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const BLOG_DIR = path.join(__dirname, 'blog');

// 新しいCTAリンク
const NEW_CTA_URL = 'https://utage-system.com/p/EcESO02xLLoK';

// サイドバーのCTAを検出するための正規表現パターン
// <a href="../free-consultation" class="cta-button">無料相談をする</a> のようなパターンを検出
const SIDEBAR_CTA_PATTERN = /<a href="[^"]+" class="cta-button">無料相談をする<\/a>/g;

// HTMLファイルを処理する関数
function processHtmlFile(filePath) {
  // ファイルを読み込む
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error(`${path.basename(filePath)}の読み取りエラー:`, err);
      return;
    }

    // サイドバーCTAリンクを検索して置換
    const fileName = path.basename(filePath);
    
    // サイドバーCTAを置換する
    const newContent = content.replace(SIDEBAR_CTA_PATTERN, `<a href="${NEW_CTA_URL}" class="cta-button">無料相談をする</a>`);
    
    if (newContent === content) {
      console.log(`${fileName}: サイドバーCTAが見つからないか、すでに正しく設定されています`);
      return;
    }
    
    // ファイルに書き込む
    fs.writeFile(filePath, newContent, 'utf8', err => {
      if (err) {
        console.error(`${fileName}の書き込みエラー:`, err);
        return;
      }
      
      console.log(`${fileName}: サイドバーCTAのURLを更新しました`);
    });
  });
}

// ブログディレクトリ内のすべてのHTMLファイルを処理
fs.readdir(BLOG_DIR, (err, files) => {
  if (err) {
    console.error('ディレクトリの読み取りエラー:', err);
    return;
  }

  // HTMLファイルをフィルタリング
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  console.log(`${htmlFiles.length}件のHTMLファイルが見つかりました。サイドバーCTA処理を開始します...`);
  
  // 各HTMLファイルを処理
  htmlFiles.forEach(file => {
    const filePath = path.join(BLOG_DIR, file);
    processHtmlFile(filePath);
  });
});
