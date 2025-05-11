/**
 * update-line-button.js
 * LINEシェアボタンをより分かりやすく改善するスクリプト
 */
const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const BLOG_DIR = path.join(__dirname, '..', 'blog');

// LINEボタンを改善する関数
function updateLineButtons() {
    // ブログディレクトリ内のHTMLファイルを取得
    const blogFiles = fs.readdirSync(BLOG_DIR)
        .filter(file => file.endsWith('.html') && file !== 'index.html') // index.htmlを除外
        .map(file => path.join(BLOG_DIR, file));
    
    console.log(`処理するブログファイル: ${blogFiles.length}件`);
    
    let successCount = 0;
    
    blogFiles.forEach(file => {
        try {
            console.log(`処理中: ${file}`);
            const content = fs.readFileSync(file, 'utf8');
            
            // LINEシェアボタンのSVGを削除して、CSSの::afterで「L」を表示できるようにする
            const lineRegex = /<a href="https:\/\/social-plugins\.line\.me\/lineit\/share\?url=.*?" target="_blank" rel="noopener noreferrer" class="share-button share-line" aria-label="LINEでシェア">[\s\S]*?<\/svg>[\s\S]*?<\/a>/g;
            
            const replacement = (match) => {
                // URLを保持したまま、内部のSVGを削除
                const urlMatch = match.match(/href="([^"]+)"/);
                if (urlMatch && urlMatch[1]) {
                    return `<a href="${urlMatch[1]}" target="_blank" rel="noopener noreferrer" class="share-button share-line" aria-label="LINEでシェア"></a>`;
                }
                return match; // URLが見つからない場合は元の文字列を返す
            };
            
            const updatedContent = content.replace(lineRegex, replacement);
            
            // タグの閉じ忘れ修正
            const fixedContent = updatedContent.replace(/<\/a>\s*<\/a>/g, '</a>');
            
            // 変更があれば保存
            if (content !== fixedContent) {
                fs.writeFileSync(file, fixedContent, 'utf8');
                console.log(`✅ ${path.basename(file)} のLINEボタンを更新しました`);
                successCount++;
            } else {
                console.log(`ℹ️ ${path.basename(file)} に変更は不要です`);
            }
        } catch (err) {
            console.error(`❌ ${path.basename(file)} の処理中にエラーが発生しました:`, err);
        }
    });
    
    console.log(`\n===== 処理結果 =====`);
    console.log(`処理したファイル数: ${blogFiles.length}`);
    console.log(`正常に更新したファイル数: ${successCount}`);
}

// スクリプト実行
updateLineButtons();
