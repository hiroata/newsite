/**
 * 画像に loading="lazy" 属性を追加するスクリプト
 * - サイト内の全HTML画像要素にlazy属性を追加
 * - すでにloading属性がある画像は対象外
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

// サイトのルートディレクトリ
const ROOT_DIR = path.resolve(__dirname, '..');

// HTMLファイルを検索
const findHtmlFiles = () => {
  return new Promise((resolve, reject) => {
    glob('**/*.html', { cwd: ROOT_DIR, ignore: ['node_modules/**'] }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map(file => path.join(ROOT_DIR, file)));
      }
    });
  });
};

// HTMLファイル内の画像にloading="lazy"属性を追加する
const addLazyLoadingToImages = (htmlFile) => {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const $ = cheerio.load(html);
  let modified = false;
  let imagesUpdated = 0;

  // すべてのimg要素に対して処理
  $('img').each((i, img) => {
    // すでにloading属性を持つ画像はスキップ
    if (!$(img).attr('loading')) {
      $(img).attr('loading', 'lazy');
      modified = true;
      imagesUpdated++;
    }
  });

  if (modified) {
    fs.writeFileSync(htmlFile, $.html(), 'utf8');
    console.log(`✅ ${path.relative(ROOT_DIR, htmlFile)} - ${imagesUpdated}個の画像を最適化しました`);
  }

  return imagesUpdated;
};

// メイン処理
const main = async () => {
  try {
    console.log('🔍 サイト内のHTMLファイルを検索中...');
    const htmlFiles = await findHtmlFiles();
    console.log(`🔍 ${htmlFiles.length}件のHTMLファイルを検出しました`);

    console.log('🖼️ 画像に lazy loading 属性を追加しています...');
    
    let totalImagesUpdated = 0;
    
    for (const file of htmlFiles) {
      totalImagesUpdated += addLazyLoadingToImages(file);
    }

    console.log('✅ 処理完了');
    console.log(`📊 合計 ${totalImagesUpdated} 個の画像を最適化しました`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
};

// スクリプト実行
main();
