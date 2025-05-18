/**
 * 条件付きinclude.jsロードコードを追加するスクリプト
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// ツールディレクトリのパス
const TOOLS_DIR = path.join(__dirname);
const REPORT_FILE = path.join(__dirname, 'add-conditional-include-report.md');

// 対象ファイル
const TARGET_FILES = [
    'image-tool-template.html',
    'test-image-tools.html',
    'tool-template.html'
];

// レポートデータ
let report = `# 条件付きinclude.jsロードコード追加レポート\n\n`;
report += `実行日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
report += `| ファイル名 | 修正結果 |\n`;
report += `| --- | --- |\n`;

/**
 * HTMLファイルを修正する関数
 * @param {string} filePath HTMLファイルのパス
 */
async function fixHtmlFile(filePath) {
    const fileName = path.basename(filePath);

    try {
        let content = await readFileAsync(filePath, 'utf8');
        let originalContent = content;
        
        // フッタープレースホルダーの直後に条件付きinclude.jsロードコードを追加
        if (!content.includes('if (!window.isScriptLoaded') && content.includes('<!-- footer -->')) {
            content = content.replace(
                /<!-- footer -->/i,
                `<!-- footer -->\n<script>
    if (!window.isScriptLoaded || !window.isScriptLoaded('/js/include.js')) {
        document.write('<script src="/js/include.js"><\\/script>');
    } else {
        console.log('include.jsのロードをスキップしました');
    }
</script>`
            );
            
            await writeFileAsync(filePath, content, 'utf8');
            return {
                fileName,
                success: true,
            };
        } else {
            return {
                fileName,
                success: false,
            };
        }
    } catch (err) {
        console.error(`${fileName}の修正中にエラーが発生しました:`, err);
        return {
            fileName,
            success: false,
        };
    }
}

/**
 * メイン実行関数
 */
async function main() {
    try {
        console.log(`${TARGET_FILES.length}個のHTMLファイルを修正します...`);
        
        const results = await Promise.all(
            TARGET_FILES.map(file => fixHtmlFile(path.join(TOOLS_DIR, file)))
        );
        
        // レポートを生成
        results.forEach(result => {
            report += `| ${result.fileName} | ${result.success ? '成功' : '失敗（すでに追加済みまたはエラー）'} |\n`;
        });
        
        await writeFileAsync(REPORT_FILE, report);
        console.log(`修正が完了しました。レポートは ${REPORT_FILE} に保存されました。`);
    } catch (err) {
        console.error('エラーが発生しました:', err);
    }
}

// スクリプト実行
main();
