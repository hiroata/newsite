/**
 * add-layout-css.js - すべてのブログページにレイアウト更新用CSSとJSを追加するスクリプト
 * 
 * このスクリプトはすべてのブログページのHTMLファイルを検索し、
 * layout-updates.cssとlayout-debug.jsへの参照を追加します
 */

const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const BLOG_DIR = path.join(__dirname, 'blog');
// 追加するCSSとJSリンク
const CSS_LINK = '    <link rel="stylesheet" href="../css/layout-updates.css">';
const JS_LINK = '    <script src="../js/layout-debug.js" defer></script>';

// ブログディレクトリ内のすべてのHTMLファイルを処理
fs.readdir(BLOG_DIR, (err, files) => {
  if (err) {
    console.error('ディレクトリの読み取りエラー:', err);
    return;
  }

  // HTMLファイルをフィルタリング
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  
  console.log(`${htmlFiles.length}件のHTMLファイルが見つかりました。処理を開始します...`);
  
  let processedCount = 0;
  
  // 各HTMLファイルを処理
  htmlFiles.forEach(file => {
    const filePath = path.join(BLOG_DIR, file);
    
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error(`${file}の読み取りエラー:`, err);
        return;
      }
      
      let newContent = content;
      let cssAdded = false;
      let jsAdded = false;
      
      // CSS追加
      if (!content.includes('layout-updates.css')) {
        // blog-fixes-critical.cssの参照の後にlayout-updates.cssを追加
        const cssSearchString = '    <link rel="stylesheet" href="../css/blog-fixes-critical.css">';
        if (content.includes(cssSearchString)) {
          newContent = newContent.replace(
            cssSearchString, 
            `${cssSearchString}\n${CSS_LINK}`
          );
          cssAdded = true;
        }
      } else {
        cssAdded = true;
        console.log(`${file}: CSSはすでに含まれています。`);
      }
      
      // JS追加
      if (!content.includes('layout-debug.js')) {
        // </head>タグの前にJSを追加
        const jsSearchString = '</head>';
        if (content.includes(jsSearchString)) {
          newContent = newContent.replace(
            jsSearchString, 
            `${JS_LINK}\n    ${jsSearchString}`
          );
          jsAdded = true;
        }
      } else {
        jsAdded = true;
        console.log(`${file}: JSはすでに含まれています。`);
      }
      
      // 変更がない場合
      if (newContent === content) {
        console.log(`${file}: 挿入ポイントが見つかりませんでした。`);
        return;
      }
      
      // 変更を保存
      fs.writeFile(filePath, newContent, 'utf8', err => {
        if (err) {
          console.error(`${file}の書き込みエラー:`, err);
          return;
        }
        
        let message = '';
        if (cssAdded && jsAdded) {
          message = 'CSSとJSリンクを追加しました。';
        } else if (cssAdded) {
          message = 'CSSリンクを追加しました。';
        } else if (jsAdded) {
          message = 'JSリンクを追加しました。';
        }
        
        console.log(`${file}: ${message}`);
        processedCount++;
        
        // すべての処理が完了したかチェック
        if (processedCount === htmlFiles.length) {
          console.log(`処理完了: ${processedCount}件のファイルを更新しました。`);
        }
      });
    });
  });
});
