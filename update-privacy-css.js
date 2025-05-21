// update-privacy-css.js - プライバシーポリシーページのクラス名を更新するスクリプト
const fs = require('fs');
const path = require('path');

// ファイルパス
const privacyFilePath = path.join(__dirname, 'privacy.html');

try {
  // ファイルを読み込む
  let content = fs.readFileSync(privacyFilePath, 'utf8');
  
  // privacy-section クラスを legal-section に置換
  const updatedContent = content.replace(/class="privacy-section"/g, 'class="legal-section"');
  
  // 更新された内容をファイルに書き込み
  fs.writeFileSync(privacyFilePath, updatedContent, 'utf8');
  
  console.log('✅ privacy.htmlのクラス名の更新が完了しました');
} catch (error) {
  console.error('❌ エラーが発生しました:', error);
}
