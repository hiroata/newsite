// ツールページを一括で共通コンポーネント化するスクリプト
const fs = require('fs');
const path = require('path');

// 処理対象のディレクトリ
const toolsDir = './tools';

// ツールファイルを一覧取得（変換対象のみ）
const toolFiles = fs.readdirSync(toolsDir).filter(file => {
  return file.endsWith('.html') && 
         file !== 'index.html' && 
         file !== 'tool-template.html' &&
         !file.endsWith('.bak');
});

console.log('変換対象のツールファイル:');
toolFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file}`);
});

console.log('\n共通コンポーネント化の準備が完了しました。');
console.log('convert-tool-to-template.js スクリプトを使って、各ファイルを変換してください:');
console.log('\n例:');
console.log('node tools/convert-tool-to-template.js countdown.html');
console.log('node tools/convert-tool-to-template.js image-resize.html');
console.log('...');

console.log('\nすべてのファイルを変換したら、include.jsを使って共通ヘッダー/フッターを実装します。');
console.log('終了するには Ctrl+C を押してください。');
