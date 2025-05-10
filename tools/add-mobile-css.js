/**
 * モバイルCSSリンクをサイト全体に追加するスクリプト
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');
const { promisify } = require('util');

// プロミス版の関数を作成
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// HTMLファイルを走査して適用する関数
async function addMobileCssToAllPages() {
  console.log('🔍 サイト内のHTMLファイルを検索中...');
    // HTMLファイルを再帰的に検索
  const htmlFiles = glob.sync('**/*.html', {
    ignore: ['node_modules/**'],
    cwd: path.resolve(__dirname, '..'),
    absolute: true
  });

  console.log(`🔍 ${htmlFiles.length}件のHTMLファイルを検出しました`);
  console.log('💻 モバイル最適化CSSを追加しています...');

  let updatedCount = 0;
  let alreadyHasCount = 0;
  
  // 各HTMLファイルを処理
  for (const htmlFile of htmlFiles) {
    try {
      // ファイルの内容を読み込む
      const htmlContent = await readFile(htmlFile, 'utf-8');
      const $ = cheerio.load(htmlContent);
      
      // モバイルCSSがすでに追加されているかどうかを確認
      const hasMobileCss = $('link[href*="mobile-enhancements.css"]').length > 0;
      
      if (!hasMobileCss) {
        // モバイルCSSを追加するためにheadタグを見つける
        const head = $('head');
        if (head.length > 0) {
          // モバイルCSS用のlink要素を作成して追加
          const mobileCssLink = $('<link>').attr({
            'rel': 'stylesheet',
            'href': '/css/mobile-enhancements.css'
          });
          
          // headの最後に挿入
          head.append('\n   <!-- モバイルUX向上のための追加CSS -->\n   ');
          head.append(mobileCssLink);
          head.append('\n');
          
          // 更新されたHTMLコンテンツを書き込む
          await writeFile(htmlFile, $.html(), 'utf-8');
          updatedCount++;
          console.log(`✅ ${path.relative(__dirname, htmlFile)} - モバイルCSSを追加しました`);
        }
      } else {
        alreadyHasCount++;
        console.log(`⏩ ${path.relative(__dirname, htmlFile)} - すでにモバイルCSSが適用されています`);
      }
    } catch (error) {
      console.error(`❌ ${path.relative(__dirname, htmlFile)} - エラーが発生しました:`, error.message);
    }
  }
  
  console.log('✅ 処理完了');
  console.log(`📊 ${updatedCount}ページにモバイルCSSを追加しました`);
  console.log(`📊 ${alreadyHasCount}ページはすでにモバイルCSSが適用されていました`);
}

// スクリプト実行
addMobileCssToAllPages();
