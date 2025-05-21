// update-author-profiles.js - 全てのブログ記事の著者プロフィール情報を更新するスクリプト
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// ブログディレクトリのパス
const blogDir = path.join(__dirname, 'blog');

// 新しいプロフィール情報（専門と経験）
const newProfileInfo = `オートマーケティング、セールスファネル構築、集客戦略策定を専門とするコンサルタント。自動化マーケティングによる売上改善事例300件以上。`;

// HTMLファイルを探して処理する関数
async function processFiles() {
  try {
    console.log(`ブログディレクトリを処理中: ${blogDir}`);
    
    // ブログディレクトリのファイル一覧を取得
    const files = await readdir(blogDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    console.log(`処理対象のHTMLファイル: ${htmlFiles.length}件`);

    // 各HTMLファイルを処理
    for (const file of htmlFiles) {
      const filePath = path.join(blogDir, file);
      try {
        // ファイルの内容を読み込み
        let content = await readFile(filePath, 'utf8');
        
        // 著者プロフィールを更新（正規表現を使用して検索と置換）
        let updated = false;
        
        // パターン1: 通常のプロフィールバイオ形式
        const profileRegex1 = /<p class="author-bio">\s*.*?\s*<\/p>/s;
        if (profileRegex1.test(content)) {
          content = content.replace(profileRegex1, `<p class="author-bio">\n                         ${newProfileInfo}\n                     </p>`);
          updated = true;
        }
        
        // パターン2: 別形式のプロフィール（念のため）
        const profileRegex2 = /<div class="author-bio">\s*.*?\s*<\/div>/s;
        if (profileRegex2.test(content)) {
          content = content.replace(profileRegex2, `<div class="author-bio">\n                         ${newProfileInfo}\n                     </div>`);
          updated = true;
        }

        // author-snsのタグが閉じられていない場合を修正
        const unclosedSnsRegex = /<div class="author-sns">\s*<a[^<]*<\/a>\s*<p class="author-bio">/s;
        if (unclosedSnsRegex.test(content)) {
          // SNSタグが閉じられていない場合は修正
          content = content.replace(unclosedSnsRegex, '<div class="author-sns">\n                             <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg></a>\n                             <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9 26.3 26.2 58 34.4 93.9 36.2 37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg></a>\n                         </div>\n                         <p class="author-bio">');
          updated = true;
        }

        if (updated) {
          // 更新されたコンテンツをファイルに書き込み
          await writeFile(filePath, content, 'utf8');
          console.log(`✅ ファイルを更新しました: ${file}`);
        } else {
          console.log(`⚠️ 更新不要: ${file} (プロフィール部分が見つからなかったか、既に更新済み)`);
        }
      } catch (err) {
        console.error(`❌ ファイル処理エラー: ${file}`, err);
      }
    }

    console.log('プロフィール更新処理が完了しました。');
  } catch (err) {
    console.error('エラーが発生しました:', err);
  }
}

// 実行
processFiles();
