// faviconと画像リンクを修正するスクリプト

const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(__dirname, 'blog');

// ファイルパスを修正する関数
function fixFileReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // favicon参照を修正
    let modified = content.replace(
      /<link rel="icon" href="\.\.\/images\/favicon\.ico">/g, 
      '<link rel="icon" href="../assets/images/favicon.ico">'
    );
    
    // 画像リンクを修正
    modified = modified.replace(
      /src="\/assets\/images\//g,
      'src="../assets/images/'
    );
    
    // href="/のパスを修正
    modified = modified.replace(
      /href="\/(?!http)/g,
      'href="../'
    );
    
    // 変更があれば保存
    if (content !== modified) {
      fs.writeFileSync(filePath, modified, 'utf8');
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
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(BLOG_DIR, file));
    
  console.log(`HTMLファイルが${files.length}件見つかりました。`);
  
  let successCount = 0;
  for (const file of files) {
    if (fixFileReferences(file)) {
      successCount++;
      console.log(`リンク参照を修正: ${file}`);
    }
  }
  
  console.log(`\n===== 処理結果 =====`);
  console.log(`合計ファイル数: ${files.length}`);
  console.log(`リンク参照を修正したファイル数: ${successCount}`);
}

main();
