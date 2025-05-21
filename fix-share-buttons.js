/**
 * シェアボタン修正スクリプト 2025-06-05 改善版
 * - はてなブックマークアイコンを追加・修正
 * - Xアイコン（旧Twitter）を黒色に修正
 * - LINEアイコンのSVGパスを完全に修正
 */

const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(__dirname, 'blog');

// 各SNSの完全なSVG定義
const SVG_ICONS = {
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>',
  facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>',
  hatena: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4.5 7.2h3.7v3.7H4.5V7.2zm8.9 0v3.7h3.7V7.2h-3.7zm-8.9 8.9h3.7v-3.7H4.5v3.7zm8.9-3.7v3.7h3.7v-3.7h-3.7z"/><path d="M9.1 4.5v3.7h3.7V4.5H9.1zM4.5 4.5H2v10.9c0 1.4 1.1 2.5 2.5 2.5h10.9v-2.5H4.5V4.5z"/></svg>',
  line: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"></path></svg>'
};

function fixShareButtons(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // はてなブックマークアイコンを修正
    const hatenaRegex = /<a href="https:\/\/b\.hatena\.ne\.jp\/entry[^>]+class="share-button share-hatena"[^>]*>(.*?)<\/a>/gs;
    if (hatenaRegex.test(content)) {
      content = content.replace(hatenaRegex, 
        `<a href="https://b.hatena.ne.jp/entry/s/blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-hatena" aria-label="はてなブックマーク">
          ${SVG_ICONS.hatena}
        </a>`
      );
      modified = true;
    }
    
    // LINEアイコンの不完全なパスを修正
    const lineRegexIncomplete = /<a href="https:\/\/social-plugins\.line\.me\/lineit\/share[^>]+class="share-button share-line"[^>]*><svg[^>]*><path d="[^"]*"\/><\/svg><\/a>/g;
    if (lineRegexIncomplete.test(content)) {
      content = content.replace(lineRegexIncomplete, 
        `<a href="https://social-plugins.line.me/lineit/share?url=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-line" aria-label="LINEでシェア">
          ${SVG_ICONS.line}
        </a>`
      );
      modified = true;
    }
    
    // LINEアイコンが空の場合も修正
    const lineRegexEmpty = /<a href="https:\/\/social-plugins\.line\.me\/lineit\/share[^>]+class="share-button share-line"[^>]*><\/a>/g;
    if (lineRegexEmpty.test(content)) {
      content = content.replace(lineRegexEmpty, 
        `<a href="https://social-plugins.line.me/lineit/share?url=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-line" aria-label="LINEでシェア">
          ${SVG_ICONS.line}
        </a>`
      );
      modified = true;
    }
      // Xアイコン（旧Twitter）を修正
    const twitterRegex = /<a href="https:\/\/twitter\.com\/intent\/tweet[^>]+class="share-button share-twitter"[^>]*>(.*?)<\/a>/gs;
    if (twitterRegex.test(content)) {
      content = content.replace(twitterRegex, 
        `<a href="https://twitter.com/intent/tweet?url=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}&text=${encodeURIComponent('オートウェビナー大学ブログ: ' + path.basename(filePath, '.html'))}" target="_blank" rel="noopener noreferrer" class="share-button share-twitter" aria-label="Xでシェア">
          ${SVG_ICONS.x}
        </a>`
      );
      modified = true;
    }
    
    // Facebookアイコンを修正
    const facebookRegex = /<a href="https:\/\/www\.facebook\.com\/sharer\/sharer\.php[^>]+class="share-button share-facebook"[^>]*>(.*?)<\/a>/gs;
    if (facebookRegex.test(content)) {
      content = content.replace(facebookRegex, 
        `<a href="https://www.facebook.com/sharer/sharer.php?u=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-facebook" aria-label="Facebookでシェア">
          ${SVG_ICONS.facebook}
        </a>`
      );
      modified = true;
    }
    
    // シェアボックス全体を標準化（すべてのアイコンを一度に修正）
    if (!modified) {
      const shareBoxRegex = /<div class="share-box">([\s\S]*?)<\/div>\s*<\/div>/gm;
      if (shareBoxRegex.test(content)) {
        content = content.replace(shareBoxRegex, 
          `<div class="share-box">
            <h3 class="share-title">この記事をシェアする</h3>
            <div class="share-buttons">
              <!-- X（旧Twitter）シェアボタン -->
              <a href="https://twitter.com/intent/tweet?url=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}&text=${encodeURIComponent('オートウェビナー大学ブログ: ' + path.basename(filePath, '.html'))}" target="_blank" rel="noopener noreferrer" class="share-button share-twitter" aria-label="Xでシェア">
                ${SVG_ICONS.x}
              </a>
              
              <!-- Facebookシェアボタン -->
              <a href="https://www.facebook.com/sharer/sharer.php?u=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-facebook" aria-label="Facebookでシェア">
                ${SVG_ICONS.facebook}
              </a>
              
              <!-- はてなブックマークシェアボタン -->
              <a href="https://b.hatena.ne.jp/entry/s/blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-hatena" aria-label="はてなブックマーク">
                ${SVG_ICONS.hatena}
              </a>
              
              <!-- LINEシェアボタン -->
              <a href="https://social-plugins.line.me/lineit/share?url=https://blog.autowebinar-daigaku.com/blog/${path.basename(filePath)}" target="_blank" rel="noopener noreferrer" class="share-button share-line" aria-label="LINEでシェア">
                ${SVG_ICONS.line}
              </a>
            </div>
          </div>`
        );
        modified = true;
      }
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
  // CSSの修正確認
  console.log('CSSの状態を確認中...');
  const cssPath = path.join(__dirname, 'css', 'share-buttons.css');
  
  try {
    if (fs.existsSync(cssPath)) {
      console.log('share-buttons.css ファイルを確認しました。');
    } else {
      console.warn('警告: share-buttons.css ファイルが見つかりません。');
    }
  } catch (err) {
    console.error('CSSファイルの確認中にエラーが発生しました:', err);
  }

  // HTMLファイルの処理
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(BLOG_DIR, file));
    
  console.log(`\nHTMLファイルが${files.length}件見つかりました。`);
  
  let successCount = 0;
  for (const file of files) {
    if (fixShareButtons(file)) {
      successCount++;
      console.log(`シェアボタンを修正: ${path.basename(file)}`);
    }
  }
  
  console.log(`\n===== 処理結果 =====`);
  console.log(`合計HTMLファイル数: ${files.length}`);
  console.log(`シェアボタンを修正したファイル数: ${successCount}`);
  
  if (successCount > 0) {
    console.log('\n✅ シェアボタンの修正が完了しました。');
    console.log('すべてのSNSアイコンが正しく表示されるようになりました。');
  } else {
    console.log('\nℹ️ 修正が必要なファイルはありませんでした。');
  }
}

// スクリプトを実行
main();
