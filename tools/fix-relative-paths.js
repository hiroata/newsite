/**
 * パスを絶対パスから相対パスに変換するスクリプト
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 編集対象ファイル
const targetFile = path.resolve(__dirname, '..', 'index.html');

// ファイル読み込み
fs.readFile(targetFile, 'utf8', (err, html) => {
  if (err) {
    console.error(`ファイルの読み込みに失敗しました: ${err}`);
    return;
  }

  const $ = cheerio.load(html);
  let replacementCount = 0;

  // 画像、動画、スクリプトなどのリソースパスを修正
  $('[src^="/"]').each((index, element) => {
    const oldSrc = $(element).attr('src');
    const newSrc = oldSrc.replace(/^\//, '');
    $(element).attr('src', newSrc);
    replacementCount++;
    console.log(`変更: ${oldSrc} -> ${newSrc}`);
  });

  // href属性の修正
  $('[href^="/"]').each((index, element) => {
    // 外部リンク(https://)は変更しない
    const href = $(element).attr('href');
    if (!href.startsWith('https://') && !href.startsWith('http://')) {
      const oldHref = href;
      const newHref = oldHref.replace(/^\//, '');
      $(element).attr('href', newHref);
      replacementCount++;
      console.log(`変更: ${oldHref} -> ${newHref}`);
    }
  });

  // 変更を保存
  fs.writeFile(targetFile, $.html(), 'utf8', (err) => {
    if (err) {
      console.error(`ファイルの書き込みに失敗しました: ${err}`);
      return;
    }
    console.log(`合計 ${replacementCount} 箇所のパスを相対パスに変換しました`);
  });
});
