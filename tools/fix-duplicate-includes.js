/**
 * include.jsスクリプトの重複を修正するスクリプト
 */
const fs = require('fs');
const path = require('path');

// ツールディレクトリのパス
const TOOLS_DIR = __dirname;

/**
 * HTMLファイルを処理しinclude.jsの重複を修正
 * @param {string} filePath - 処理対象のファイルパス
 */
function removeDuplicateInclude(filePath) {
  try {
    // ファイル読み込み
    let content = fs.readFileSync(filePath, 'utf8');
    
    // include.jsスクリプトタグの出現回数をカウント
    const includeScriptCount = (content.match(/script src="\/js\/include\.js"/g) || []).length;
    
    if (includeScriptCount > 1) {
      // 2回目以降のinclude.jsスクリプトタグを削除
      const updatedContent = content.replace(/(<script src="\/js\/include\.js"><\/script>[\s\n]*){2,}/g, '$1');
      
      // ファイルに書き戻し
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✓ ${path.basename(filePath)} からinclude.jsの重複を削除しました`);
    } else {
      console.log(`✓ ${path.basename(filePath)} は重複がありません`);
    }
  } catch (error) {
    console.error(`✗ ${path.basename(filePath)} の処理中にエラーが発生しました:`, error);
  }
}

/**
 * メイン処理
 */
function main() {
  // HTMLファイルをリストアップ
  const files = fs.readdirSync(TOOLS_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(TOOLS_DIR, file));
  
  console.log(`処理対象ファイル: ${files.length}件`);
  
  // 各ファイルを処理
  files.forEach(removeDuplicateInclude);
  
  console.log('処理が完了しました');
}

// スクリプト実行
main();
