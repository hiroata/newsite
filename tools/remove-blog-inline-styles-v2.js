// ブログ記事のインラインスタイルを削除するスクリプト（改良版）
const fs = require('fs');
const path = require('path');

// 処理対象のディレクトリ
const blogDir = '../blog';

// HTMLファイルからインラインスタイルを削除する関数
function removeInlineStyles(filePath) {
  try {
    // ファイルの内容を読み込む
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // style要素のブロックを探して削除（複数のstyleタグに対応）
    const styleRegex = /<style>[\s\S]*?<\/style>/gi;
    
    // スタイル要素があるか確認
    if (content.match(styleRegex)) {
      // バックアップを作成（まだ存在しない場合）
      const backupPath = `${filePath}.bak`;
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, content, 'utf8');
        console.log(`Created backup: ${backupPath}`);
      }

      // スタイル要素を削除
      content = content.replace(styleRegex, 
        '<!-- インラインスタイルはblog-common.cssに統合済み -->');
      modified = true;
      
      // blog-common.cssへのリンクが存在しない場合、追加
      if (!content.includes('blog-common.css')) {
        content = content.replace('</head>', '  <link rel="stylesheet" href="/css/blog-common.css">\n  </head>');
      }
    }
    
    // 変更を保存
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
    return false;
  }
}

// メイン処理
console.log('Removing inline styles from blog posts...');

// ブログディレクトリ内のファイルを処理
try {
  const files = fs.readdirSync(blogDir);
  console.log(`Processing ${files.length} files in blog directory...`);
  
  let modifiedCount = 0;
  
  files.forEach(file => {
    // HTMLファイルのみ処理
    if (path.extname(file).toLowerCase() === '.html') {
      const filePath = path.join(blogDir, file);
      
      if (removeInlineStyles(filePath)) {
        console.log(`Removed inline styles from: ${filePath}`);
        modifiedCount++;
      } else {
        console.log(`No inline styles found in: ${filePath}`);
      }
    }
  });
  
  console.log(`Completed! Modified ${modifiedCount} files.`);
} catch (err) {
  console.error(`Error reading blog directory: ${err.message}`);
}
