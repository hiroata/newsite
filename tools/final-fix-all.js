/**
 * 最終的なHTMLファイルの修正スクリプト
 * 
 * このスクリプトは、最終検証で検出された問題を修正します：
 * 1. ヘッダー・フッタープレースホルダーの追加
 * 2. 条件付きinclude.jsロードコードの修正（重複削除）
 * 3. タグバランスの修正（li, div, section, th等）
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// ツールディレクトリのパス
const TOOLS_DIR = path.join(__dirname);
const REPORT_FILE = path.join(__dirname, 'final-fixes-report.md');

// レポートデータ
let report = `# 最終HTML修正レポート\n\n`;
report += `実行日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
report += `| ファイル名 | 修正結果 | 修正された問題 |\n`;
report += `| --- | --- | --- |\n`;

/**
 * HTMLファイルを修正する関数
 * @param {string} filePath HTMLファイルのパス
 */
async function fixHtmlFile(filePath) {
    const fileName = path.basename(filePath);
    let fixedProblems = [];

    try {
        let content = await readFileAsync(filePath, 'utf8');
        let originalContent = content;
        
        // 1. ヘッダー・フッタープレースホルダーの追加
        // ヘッダープレースホルダーが存在しない場合、<body>の直後に追加
        if (!content.includes('<!-- header -->')) {
            content = content.replace(
                /<body[^>]*>/i,
                match => `${match}\n<!-- header -->`
            );
            fixedProblems.push('ヘッダープレースホルダーを追加');
        }
        
        // フッタープレースホルダーが存在しない場合、</body>の前に追加
        if (!content.includes('<!-- footer -->')) {
            content = content.replace(
                /<\/body>/i,
                `\n<!-- footer -->\n</body>`
            );
            fixedProblems.push('フッタープレースホルダーを追加');
        }
        
        // 2. 条件付きロードスクリプトの修正（重複削除）
        // 条件付きinclude.jsロードスクリプトがある場合、2つ目以降を削除
        const conditionalIncludeRegex = /<script>\s*if \(!window\.isScriptLoaded[^]*?document\.write\('<script src="\/js\/include\.js"><\\\/script>'\)[^]*?<\/script>/g;
        let matches = content.match(conditionalIncludeRegex);
        
        if (matches && matches.length > 1) {
            // 最初の一致をキープし、それ以降を削除
            let firstMatch = matches[0];
            for (let i = 1; i < matches.length; i++) {
                content = content.replace(matches[i], '');
            }
            fixedProblems.push(`重複する条件付きinclude.jsロードコードを${matches.length - 1}個削除`);
        }
        
        // 3. タグバランスの修正
        const tagPairs = [
            { open: /<li/g, close: /<\/li>/g, name: 'li' },
            { open: /<div/g, close: /<\/div>/g, name: 'div' },
            { open: /<section/g, close: /<\/section>/g, name: 'section' },
            { open: /<th/g, close: /<\/th>/g, name: 'th' },
            { open: /<td/g, close: /<\/td>/g, name: 'td' },
            { open: /<tr/g, close: /<\/tr>/g, name: 'tr' }
        ];
        
        tagPairs.forEach(pair => {
            const openCount = (content.match(pair.open) || []).length;
            const closeCount = (content.match(pair.close) || []).length;
            
            // 開きタグが閉じタグより多い場合、不足分を追加
            if (openCount > closeCount) {
                const diff = openCount - closeCount;
                // </main>の前にdiff数の閉じタグを追加
                if (content.includes('</main>')) {
                    content = content.replace(
                        /<\/main>/i,
                        `${Array(diff + 1).join(`</${pair.name}>`)}\n</main>`
                    );
                } else if (content.includes('<!-- footer -->')) {
                    // mainがない場合はフッタープレースホルダーの前に追加
                    content = content.replace(
                        /<!-- footer -->/i,
                        `${Array(diff + 1).join(`</${pair.name}>`)}\n<!-- footer -->`
                    );
                } else {
                    // それもない場合は</body>の前に追加
                    content = content.replace(
                        /<\/body>/i,
                        `${Array(diff + 1).join(`</${pair.name}>`)}\n</body>`
                    );
                }
                fixedProblems.push(`不足している閉じ${pair.name}タグを${diff}個追加`);
            }
            // 閉じタグが開きタグより多い場合、過剰分を削除
            else if (closeCount > openCount) {
                let tempContent = content;
                const diff = closeCount - openCount;
                let count = 0;
                
                // 最後の不要な閉じタグから削除していく
                content = tempContent.replace(new RegExp(`</${pair.name}>`, 'g'), match => {
                    if (count < diff) {
                        count++;
                        return ''; // 過剰な閉じタグを削除
                    }
                    return match;
                });
                
                fixedProblems.push(`余分な閉じ${pair.name}タグを${diff}個削除`);
            }
        });
        
        // test-image-tools.htmlにmainタグがない場合、追加
        if (fileName === 'test-image-tools.html' && !content.includes('<main')) {
            // bodyタグの中にmainタグを追加
            content = content.replace(
                /<body[^>]*>([\s\S]*?)<\/body>/i,
                (match, bodyContent) => {
                    // ヘッダープレースホルダーの後に挿入
                    if (bodyContent.includes('<!-- header -->')) {
                        return match.replace(
                            /<!-- header -->/,
                            '<!-- header -->\n<main>'
                        ).replace(
                            /<!-- footer -->/,
                            '</main>\n<!-- footer -->'
                        );
                    } else {
                        // ヘッダーがない場合は本文をmainで囲む
                        return `<body>\n<!-- header -->\n<main>${bodyContent}</main>\n<!-- footer -->\n</body>`;
                    }
                }
            );
            fixedProblems.push('mainタグを追加');
        }
        
        if (content !== originalContent) {
            await writeFileAsync(filePath, content, 'utf8');
            return {
                fileName,
                success: true,
                fixedProblems: fixedProblems.join(', '),
            };
        } else {
            return {
                fileName,
                success: true,
                fixedProblems: '変更なし',
            };
        }
    } catch (err) {
        console.error(`${fileName}の修正中にエラーが発生しました:`, err);
        return {
            fileName,
            success: false,
            fixedProblems: `エラー: ${err.message}`,
        };
    }
}

/**
 * メイン実行関数
 */
async function main() {
    try {
        // HTMLファイル一覧を取得
        const files = fs.readdirSync(TOOLS_DIR)
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(TOOLS_DIR, file));
        
        console.log(`${files.length}個のHTMLファイルを修正します...`);
        
        const results = await Promise.all(files.map(fixHtmlFile));
        
        // レポートを生成
        results.forEach(result => {
            report += `| ${result.fileName} | ${result.success ? '成功' : '失敗'} | ${result.fixedProblems} |\n`;
        });
        
        await writeFileAsync(REPORT_FILE, report);
        console.log(`修正が完了しました。レポートは ${REPORT_FILE} に保存されました。`);
    } catch (err) {
        console.error('エラーが発生しました:', err);
    }
}

// スクリプト実行
main();
