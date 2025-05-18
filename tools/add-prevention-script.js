/**
 * preventDuplicateIncludesスクリプトを全HTMLファイルに追加し、
 * さらにタグのバランス問題を修正するスクリプト
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// ツールディレクトリのパス
const TOOLS_DIR = path.join(__dirname);
const REPORT_FILE = path.join(__dirname, 'add-prevention-script-report.md');

// レポートデータ
let report = `# preventDuplicateIncludesスクリプト追加レポート\n\n`;
report += `実行日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
report += `| ファイル名 | 追加結果 | 修正された問題 |\n`;
report += `| --- | --- | --- |\n`;

/**
 * HTMLファイルを処理する関数
 * @param {string} filePath HTMLファイルのパス
 */
async function processHtmlFile(filePath) {
    const fileName = path.basename(filePath);
    let fixedProblems = [];

    try {
        let content = await readFileAsync(filePath, 'utf8');
        let originalContent = content;
        
        // prevent-duplicate-includes.jsをheadに追加（まだ追加されていない場合）
        if (!content.includes('/js/prevent-duplicate-includes.js')) {
            // <head>タグの直後に挿入
            content = content.replace(
                /<head>/i,
                `<head>\n    <script src="/js/prevent-duplicate-includes.js"></script>`
            );
            fixedProblems.push('prevent-duplicate-includes.jsの追加');
        } else {
            fixedProblems.push('prevent-duplicate-includes.jsはすでに追加済み');
        }
        
        // タグのバランスを確認して修正
        // 1. 閉じられていない<div>タグを確認
        const openDivs = (content.match(/<div/g) || []).length;
        const closeDivs = (content.match(/<\/div>/g) || []).length;
        
        if (openDivs > closeDivs) {
            const diff = openDivs - closeDivs;
            // </main>の前にdiff数の</div>を追加
            content = content.replace(
                /<\/main>/i,
                `${Array(diff + 1).join('</div>')}\n</main>`
            );
            fixedProblems.push(`不足している閉じdivタグ${diff}個を追加`);
        }
        
        // 2. 他の一般的なHTMLタグのチェック（必要に応じて追加）
        const tagPairs = [
            { open: /<section/g, close: /<\/section>/g, name: 'section' },
            { open: /<article/g, close: /<\/article>/g, name: 'article' },
            { open: /<header/g, close: /<\/header>/g, name: 'header' },
            { open: /<footer/g, close: /<\/footer>/g, name: 'footer' },
            { open: /<p/g, close: /<\/p>/g, name: 'p' },
            { open: /<span/g, close: /<\/span>/g, name: 'span' },
        ];
        
        tagPairs.forEach(pair => {
            const openCount = (content.match(pair.open) || []).length;
            const closeCount = (content.match(pair.close) || []).length;
            
            if (openCount > closeCount) {
                const diff = openCount - closeCount;
                // </main>の前にdiff数の閉じタグを追加
                content = content.replace(
                    /<\/main>/i,
                    `${Array(diff + 1).join(`</${pair.name}>`)}\n</main>`
                );
                fixedProblems.push(`不足している閉じ${pair.name}タグ${diff}個を追加`);
            }
        });

        // 3. 見つかったinclude.jsの直前に、もし既に防止スクリプトがロード済みなら重複ロードを防ぐコードを追加
        content = content.replace(
            /<script src="\/js\/include.js"><\/script>/g,
            `<script>
    if (!window.isScriptLoaded || !window.isScriptLoaded('/js/include.js')) {
        document.write('<script src="/js/include.js"><\\/script>');
    } else {
        console.log('include.jsのロードをスキップしました');
    }
</script>`
        );
        
        if (content !== originalContent) {
            await writeFileAsync(filePath, content, 'utf8');
            return {
                fileName,
                success: true,
                fixedProblems: fixedProblems.join(', ') || 'なし',
            };
        } else {
            return {
                fileName,
                success: true,
                fixedProblems: '変更なし',
            };
        }
    } catch (err) {
        console.error(`${fileName}の処理中にエラーが発生しました:`, err);
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
        
        console.log(`${files.length}個のHTMLファイルを処理します...`);
        
        const results = await Promise.all(files.map(processHtmlFile));
        
        // レポートを生成
        results.forEach(result => {
            report += `| ${result.fileName} | ${result.success ? '成功' : '失敗'} | ${result.fixedProblems} |\n`;
        });
        
        await writeFileAsync(REPORT_FILE, report);
        console.log(`処理が完了しました。レポートは ${REPORT_FILE} に保存されました。`);
    } catch (err) {
        console.error('エラーが発生しました:', err);
    }
}

// スクリプト実行
main();
