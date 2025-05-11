// ツールページを共通コンポーネント化するスクリプト（最適化版）
const fs = require('fs');
const path = require('path');

// 変換対象のツールファイル（コマンドライン引数から取得）
const targetFile = process.argv[2];

if (!targetFile) {
  console.error('使用方法: node convert-tool-to-template.js [ツールファイル名]');
  console.error('例: node convert-tool-to-template.js countdown.html');
  process.exit(1);
}

// 完全なファイルパス
const targetFilePath = `./${targetFile}`;
const templatePath = './tool-template.html';

// ファイルの存在確認
if (!fs.existsSync(targetFilePath)) {
  console.error(`エラー: ${targetFilePath} が見つかりません。`);
  process.exit(1);
}

// テンプレートの読み込み
if (!fs.existsSync(templatePath)) {
  console.error(`エラー: テンプレートファイル ${templatePath} が見つかりません。`);
  process.exit(1);
}

// ファイル内容の読み込み
const templateContent = fs.readFileSync(templatePath, 'utf8');
const toolContent = fs.readFileSync(targetFilePath, 'utf8');

// バックアップファイルの作成
const backupPath = `${targetFilePath}.bak`;
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, toolContent, 'utf8');
  console.log(`バックアップ作成: ${backupPath}`);
}

// ツールからメタデータを抽出
function extractFromTool(content, pattern) {
  const match = content.match(pattern);
  return match ? match[1].trim() : '';
}

// タイトルの抽出
const titlePattern = /<title>(.*?)(?:\s*\|.*?)?<\/title>/i;
const title = extractFromTool(toolContent, titlePattern);

// 説明の抽出（meta descriptionから）
const descPattern = /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i;
const description = extractFromTool(toolContent, descPattern);

// スタイルの抽出
const stylePattern = /<style>([\s\S]*?)<\/style>/i;
const styleMatch = toolContent.match(stylePattern);
const styles = styleMatch ? styleMatch[1].trim() : '';

// ボディコンテンツの抽出
function extractBodyContent(content) {
  const bodyPattern = /<body>([\s\S]*?)<\/body>/i;
  const bodyMatch = content.match(bodyPattern);
  
  if (!bodyMatch) return '';
  
  let bodyContent = bodyMatch[1].trim();
  
  // ヘッダーとフッターを削除
  bodyContent = bodyContent.replace(/<header[\s\S]*?<\/header>/i, '');
  bodyContent = bodyContent.replace(/<footer[\s\S]*?<\/footer>/i, '');
  
  return bodyContent.trim();
}

const bodyContent = extractBodyContent(toolContent);

// ツール固有のスクリプトを抽出
function extractScripts(content) {
  const scriptPattern = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
  const scripts = [];
  let match;
  
  while ((match = scriptPattern.exec(content)) !== null) {
    // 共通スクリプト以外を抽出
    if (!match[0].includes('script.js') && !match[0].includes('include.js')) {
      scripts.push(match[1].trim());
    }
  }
  
  return scripts.join('\n\n');
}

const toolScripts = extractScripts(toolContent);

// テンプレートにマージ
let newContent = templateContent;
newContent = newContent.replace(/\{\{title\}\}/g, title);
newContent = newContent.replace(/\{\{description\}\}/g, description);
newContent = newContent.replace(/\{\{specific_styles\}\}/g, styles);
newContent = newContent.replace(/\{\{body_content\}\}/g, bodyContent);
newContent = newContent.replace(/\{\{specific_scripts\}\}/g, toolScripts);

// 最終的な文書構造を整形
newContent = newContent.replace(/<\/style>\s*<\/head>/, '</style>\n  <script>\n    // ツール固有のスクリプト\n    {{specific_scripts}}\n  </script>\n</head>');

// 書き出し
fs.writeFileSync(targetFilePath, newContent, 'utf8');
console.log(`${targetFilePath} を共通コンポーネント化しました。`);
