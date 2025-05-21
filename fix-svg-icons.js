// SVGアイコンの確認と修正スクリプト

const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(__dirname, 'blog');

// XとはてなブックマークとLINEアイコンのSVG定義
const XIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>';
const hatenaIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4.5 7.2h3.7v3.7H4.5V7.2zm8.9 0v3.7h3.7V7.2h-3.7zm-8.9 8.9h3.7v-3.7H4.5v3.7zm8.9-3.7v3.7h3.7v-3.7h-3.7z"/><path d="M9.1 4.5v3.7h3.7V4.5H9.1zM4.5 4.5H2v10.9c0 1.4 1.1 2.5 2.5 2.5h10.9v-2.5H4.5V4.5z"/></svg>';
const lineIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8 0 3.2 1.4 3.2 3.2z"/></svg>';

function fixSVGIcons(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // はてなブックマークボタンの修正
    const hatenaButtonRegex = /<a href="https:\/\/b\.hatena\.ne\.jp\/entry[^<>]*class="share-button share-hatena"[^<>]*>(.*?)<\/a>/gs;
    if (!hatenaButtonRegex.test(content) || !content.includes('hatena') || !content.includes(hatenaIconSVG)) {
      // はてなボタンが存在しないか、SVGアイコンがない場合は修正
      content = content.replace(
        /<a href="https:\/\/b\.hatena\.ne\.jp\/entry[^<>]*class="share-button share-hatena"[^<>]*>.*?<\/a>/gs,
        `<a href="https://b.hatena.ne.jp/entry/s/blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-hatena" aria-label="はてなブックマーク">
            ${hatenaIconSVG}
        </a>`
      );
      modified = true;
    }

    // Xボタンの修正
    const xButtonRegex = /<a href="https:\/\/twitter\.com\/intent\/tweet[^<>]*class="share-button share-twitter"[^<>]*>(.*?)<\/a>/gs;
    if (!xButtonRegex.test(content) || !content.includes('twitter') || !content.includes(XIconSVG)) {
      // Xボタンが存在しないか、SVGアイコンがない場合は修正
      content = content.replace(
        /<a href="https:\/\/twitter\.com\/intent\/tweet[^<>]*class="share-button share-twitter"[^<>]*>.*?<\/a>/gs,
        `<a href="https://twitter.com/intent/tweet?url=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-twitter" aria-label="Xでシェア">
            ${XIconSVG}
        </a>`
      );
      modified = true;
    }

    // LINEボタンの修正
    const lineButtonRegex = /<a href="https:\/\/social-plugins\.line\.me\/lineit\/share[^<>]*class="share-button share-line"[^<>]*>(.*?)<\/a>/gs;
    if (!lineButtonRegex.test(content) || !content.includes('line') || !content.includes(lineIconSVG)) {
      // LINEボタンが存在しないか、SVGアイコンがない場合は修正
      content = content.replace(
        /<a href="https:\/\/social-plugins\.line\.me\/lineit\/share[^<>]*class="share-button share-line"[^<>]*>.*?<\/a>/gs,
        `<a href="https://social-plugins.line.me/lineit/share?url=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-line" aria-label="LINEでシェア">
            ${lineIconSVG}
        </a>`
      );
      modified = true;
    }

    // 変更があれば保存
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err}`);
    return false;
  }
}

// メイン処理
function main() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.html') && file !== 'index.html')
    .map(file => path.join(BLOG_DIR, file));
    
  console.log(`HTMLファイルが${files.length}件見つかりました。`);
  
  let successCount = 0;
  for (const file of files) {
    if (fixSVGIcons(file)) {
      successCount++;
      console.log(`SVGアイコンを修正: ${path.basename(file)}`);
    }
  }
  
  console.log(`\n===== 処理結果 =====`);
  console.log(`合計ファイル数: ${files.length}`);
  console.log(`SVGアイコンを修正したファイル数: ${successCount}`);
}

main();
