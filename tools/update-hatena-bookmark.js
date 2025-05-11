/**
 * update-hatena-bookmark.js
 * はてなブックマークのボタンをより分かりやすく改善するスクリプト
 */
const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const BLOG_DIR = path.join(__dirname, '..', 'blog');

// はてなブックマークボタンを改善する関数
function updateHatenaButtons() {
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
            
            // はてなブックマークのSVGを削除して、CSSの::afterで「B!」を表示できるようにする
            const hatenaRegex = /<a href="https:\/\/b\.hatena\.ne\.jp\/entry\/s\/.*?" target="_blank" rel="noopener noreferrer" class="share-button share-hatena" aria-label="はてなブックマーク">[\s\S]*?<\/svg>[\s\S]*?<\/a>/g;
            
            const replacement = (match) => {
                // URLを保持したまま、内部のSVGを削除
                const urlMatch = match.match(/href="([^"]+)"/);
                if (urlMatch && urlMatch[1]) {
                    return `<a href="${urlMatch[1]}" target="_blank" rel="noopener noreferrer" class="share-button share-hatena" aria-label="はてなブックマーク"></a>`;
                }
                return match; // URLが見つからない場合は元の文字列を返す
            };
            
            const updatedContent = content.replace(hatenaRegex, replacement);
            
            // 変更があれば保存
            if (content !== updatedContent) {
                fs.writeFileSync(file, updatedContent, 'utf8');
                console.log(`✅ ${path.basename(file)} のはてなブックマークボタンを更新しました`);
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
updateHatenaButtons();
