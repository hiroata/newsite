// ツールページを一括で共通コンポーネント化するスクリプト（実行版）
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 現在のディレクトリがツールディレクトリであることを確認
const toolsDir = './';

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

console.log(`\n合計 ${toolFiles.length} ファイルを変換します...\n`);

// 非同期でノードスクリプトを実行する関数
function runNodeScript(scriptFile, arg) {
  return new Promise((resolve, reject) => {
    console.log(`node ${scriptFile} ${arg} を実行中...`);
    
    exec(`node ${scriptFile} ${arg}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`実行エラー: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

// 順番に変換を実行
async function convertAllTools() {
  const convertScript = path.join(toolsDir, 'convert-tool-to-template-v2.js');
  
  // テンプレートの存在確認
  const templatePath = path.join(toolsDir, 'tool-template.html');
  if (!fs.existsSync(templatePath)) {
    console.error(`エラー: テンプレートファイル ${templatePath} が見つかりません。`);
    process.exit(1);
  }

  // スクリプトの存在確認
  if (!fs.existsSync(convertScript)) {
    console.error(`エラー: 変換スクリプト ${convertScript} が見つかりません。`);
    process.exit(1);
  }
  
  console.log('各ツールを共通コンポーネント化しています...\n');
  
  for (const file of toolFiles) {
    try {
      await runNodeScript(convertScript, file);
      console.log(`✅ ${file} の変換が完了しました\n`);
    } catch (error) {
      console.error(`❌ ${file} の変換中にエラーが発生しました: ${error.message}\n`);
    }
  }
  
  console.log('-------------------------------------');
  console.log('🎉 すべてのツールの共通コンポーネント化が完了しました!');
  console.log('-------------------------------------');
}

// 処理を実行
convertAllTools();
