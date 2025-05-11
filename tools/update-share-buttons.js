/**
 * update-share-buttons.js
 * シェアボタンをモダンでカッコいいデザインに一括で更新するスクリプト
 */
const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const BLOG_DIR = path.join(__dirname, '..', 'blog');

// 全てのブログページを処理して古いシェアボタンを新しいものに置き換える
function updateShareButtons() {
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
            const fileName = path.basename(file);
            
            // 1. CSSの追加チェック
            if (!content.includes('<link rel="stylesheet" href="../css/share-buttons.css">')) {
                let updatedContent = content.replace(
                    /<link rel="stylesheet" href="\.\.\/css\/blog-fixes\.css">/,
                    '<link rel="stylesheet" href="../css/blog-fixes.css">\n    <link rel="stylesheet" href="../css/share-buttons.css">'
                );
                
                // 2. シェアボタンの更新
                // 正規表現を使用して、share-boxを含むブロック全体を特定し置換
                const shareBoxRegex = /<div class="share-box">[\s\S]*?<\/div>\s*<\/div>/;
                
                // ページのURLとタイトルを取得
                const titleMatch = content.match(/<title>(.*?)<\/title>/);
                const title = titleMatch ? titleMatch[1].split(' - ')[0] : 'オートウェビナー大学ブログ記事';
                const url = `https://blog.autowebinar-daigaku.com/blog/${fileName}`;
                
                // 新しいシェアボタンHTML
                const newShareBox = `<div class="share-box">
                    <h3 class="share-title">この記事をシェアする</h3>
                    <div class="share-buttons">
                        <!-- X（旧Twitter）シェアボタン -->
                        <a href="https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer" class="share-button share-twitter" aria-label="Xでシェア">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                        </a>
                        
                        <!-- Facebookシェアボタン -->
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener noreferrer" class="share-button share-facebook" aria-label="Facebookでシェア">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                        </a>
                        
                        <!-- はてなブックマークシェアボタン -->
                        <a href="https://b.hatena.ne.jp/entry/s/${url.replace('https://', '')}" target="_blank" rel="noopener noreferrer" class="share-button share-hatena" aria-label="はてなブックマーク">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4.04,8.26H8.2c0-1.24-0.08-3.72-0.08-3.76h2.53c0,0-0.08,2.5-0.08,3.76h4.13v2.46h-4.1c0,1.3,0.08,3.82,0.08,3.82 H8.16c0,0,0.08-2.54,0.08-3.82H4.04V8.26z" fill="white"/><path d="M16.4,1.33H3.6c-1.25,0-2.27,1.02-2.27,2.27v12.8c0,1.25,1.02,2.27,2.27,2.27h12.8 c1.25,0,2.27-1.02,2.27-2.27V3.6C18.67,2.35,17.65,1.33,16.4,1.33z M16.26,16.26H3.74V3.74h12.52V16.26z" fill="white"/></svg>
                        </a>
                        
                        <!-- LINEシェアボタン -->
                        <a href="https://social-plugins.line.me/lineit/share?url=${url}" target="_blank" rel="noopener noreferrer" class="share-button share-line" aria-label="LINEでシェア">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z" fill="white"/></svg>
                        </a>
                    </div>
                </div>`;
                
                // share-boxブロック全体を置換
                if (shareBoxRegex.test(updatedContent)) {
                    updatedContent = updatedContent.replace(shareBoxRegex, newShareBox);
                    
                    // 更新した内容をファイルに書き込み
                    fs.writeFileSync(file, updatedContent, 'utf8');
                    console.log(`✅ ${path.basename(file)} を更新しました`);
                    successCount++;
                } else {
                    console.warn(`⚠️ ${path.basename(file)} にシェアボタンが見つかりませんでした`);
                }
            } else {
                console.log(`ℹ️ ${path.basename(file)} は既に更新済みです`);
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
updateShareButtons();
