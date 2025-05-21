/**
 * update-cta-links.js
 * 
 * すべてのブログ記事の本文末尾CTAリンクを更新するスクリプト
 */

const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const BLOG_DIR = path.join(__dirname, 'blog');

// 新しいCTAリンク
const NEW_CTA_URL = 'https://utage-system.com/p/EcESO02xLLoK';

// 本文末尾のCTAを検出するための正規表現パターン
// <p><a href="...." class="cta-button">任意のテキスト</a></p> のようなパターンを検出
const CTA_PATTERN = /<p><a href="[^"]+" class="cta-button">[^<]+<\/a><\/p>/g;

// HTMLファイルを処理する関数
function processHtmlFile(filePath) {
  // ファイルを読み込む
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error(`${path.basename(filePath)}の読み取りエラー:`, err);
      return;
    }

    // CTAリンクを検索して置換
    const fileName = path.basename(filePath);
    const matches = content.match(CTA_PATTERN);

    if (!matches || matches.length === 0) {
      console.log(`${fileName}: CTAボタンが見つかりませんでした`);
      return;
    }

    // メインCTA（最初に見つかったCTAのみ更新）
    const oldCTA = matches[0];
    
    // すでに正しいURLが設定されているかチェック
    if (oldCTA.includes(NEW_CTA_URL)) {
      console.log(`${fileName}: CTAのURLはすでに正しく設定されています`);
      return;
    }
    
    // 元のCTAからテキスト部分を抽出
    const textMatch = oldCTA.match(/<p><a href="[^"]+" class="cta-button">([^<]+)<\/a><\/p>/);
    const ctaText = textMatch ? textMatch[1] : '無料相談はこちら';
    
    // 新しいCTAを生成
    const newCTA = `<p><a href="${NEW_CTA_URL}" class="cta-button">${ctaText}</a></p>`;
    
    // 置換
    const newContent = content.replace(oldCTA, newCTA);
    
    // ファイルに書き込む
    fs.writeFile(filePath, newContent, 'utf8', err => {
      if (err) {
        console.error(`${fileName}の書き込みエラー:`, err);
        return;
      }
      
      console.log(`${fileName}: CTAのURLを更新しました（${ctaText}）`);
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
  console.log(`${htmlFiles.length}件のHTMLファイルが見つかりました。処理を開始します...`);
  
  // 各HTMLファイルを処理
  htmlFiles.forEach(file => {
    const filePath = path.join(BLOG_DIR, file);
    processHtmlFile(filePath);
  });
});
