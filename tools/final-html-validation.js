/**
 * 最終的なHTMLファイルの検証スクリプト
 * 
 * このスクリプトは、すべてのHTMLファイルに対して最終的な検証を行います：
 * 1. 基本的なHTML構造（html, head, body, main）
 * 2. ヘッダー・フッタープレースホルダーの一意性
 * 3. include.jsスクリプト参照の検証
 * 4. タグのバランス
 * 5. prevent-duplicate-includes.jsの存在確認
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// ツールディレクトリのパス
const TOOLS_DIR = path.join(__dirname);
const REPORT_FILE = path.join(__dirname, 'final-html-validation-report.md');

// レポートデータ
let report = `# 最終HTMLファイル検証レポート\n\n`;
report += `実行日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
report += `## 検出された問題\n\n`;

/**
 * HTMLファイルを検証する関数
 * @param {string} filePath HTMLファイルのパス
 */
async function validateHtmlFile(filePath) {
    const fileName = path.basename(filePath);
    let issues = [];

    try {
        const content = await readFileAsync(filePath, 'utf8');
        
        // 1. 基本的なHTML構造の検証
        if (!content.includes('<html')) issues.push('htmlタグがない');
        if (!content.includes('<head')) issues.push('headタグがない');
        if (!content.includes('<body')) issues.push('bodyタグがない');
        
        // mainタグが1回だけ存在するか確認
        const mainTagCount = (content.match(/<main/g) || []).length;
        if (mainTagCount === 0) {
            issues.push('mainタグがない');
        } else if (mainTagCount > 1) {
            issues.push(`mainタグが複数（${mainTagCount}個）存在する`);
        }
        
        // 2. ヘッダー・フッタープレースホルダーの検証
        const headerPlaceholderCount = (content.match(/<!--\s*header\s*-->/g) || []).length;
        const footerPlaceholderCount = (content.match(/<!--\s*footer\s*-->/g) || []).length;
        
        if (headerPlaceholderCount === 0) {
            issues.push('ヘッダープレースホルダーがない');
        } else if (headerPlaceholderCount > 1) {
            issues.push(`ヘッダープレースホルダーが複数（${headerPlaceholderCount}個）存在する`);
        }
        
        if (footerPlaceholderCount === 0) {
            issues.push('フッタープレースホルダーがない');
        } else if (footerPlaceholderCount > 1) {
            issues.push(`フッタープレースホルダーが複数（${footerPlaceholderCount}個）存在する`);
        }
        
        // 3. include.jsスクリプト参照の検証
        // 直接的な参照は警告（スクリプトを使うべき）
        const directIncludeJsCount = (content.match(/<script src="\/js\/include.js"><\/script>/g) || []).length;
        if (directIncludeJsCount > 0) {
            issues.push(`直接的なinclude.js参照が${directIncludeJsCount}個存在する（スクリプト使用を推奨）`);
        }
        
        // 条件付きロードスクリプトの確認
        const conditionalIncludeCount = (content.match(/if \(!window\.isScriptLoaded.*include\.js/g) || []).length;
        if (conditionalIncludeCount === 0) {
            issues.push('include.jsの条件付きロードコードがない');
        } else if (conditionalIncludeCount > 1) {
            issues.push(`include.jsの条件付きロードコードが複数（${conditionalIncludeCount}個）存在する`);
        }
        
        // 4. タグのバランス検証
        const tagPairs = [
            { open: /<div/g, close: /<\/div>/g, name: 'div' },
            { open: /<p/g, close: /<\/p>/g, name: 'p' },
            { open: /<section/g, close: /<\/section>/g, name: 'section' },
            { open: /<article/g, close: /<\/article>/g, name: 'article' },
            { open: /<span/g, close: /<\/span>/g, name: 'span' },
            { open: /<form/g, close: /<\/form>/g, name: 'form' },
            { open: /<table/g, close: /<\/table>/g, name: 'table' },
            { open: /<tr/g, close: /<\/tr>/g, name: 'tr' },
            { open: /<td/g, close: /<\/td>/g, name: 'td' },
            { open: /<th/g, close: /<\/th>/g, name: 'th' },
            { open: /<ul/g, close: /<\/ul>/g, name: 'ul' },
            { open: /<ol/g, close: /<\/ol>/g, name: 'ol' },
            { open: /<li/g, close: /<\/li>/g, name: 'li' },
            { open: /<a/g, close: /<\/a>/g, name: 'a' },
            { open: /<button/g, close: /<\/button>/g, name: 'button' },
        ];
        
        tagPairs.forEach(pair => {
            const openCount = (content.match(pair.open) || []).length;
            const closeCount = (content.match(pair.close) || []).length;
            
            if (openCount !== closeCount) {
                issues.push(`${pair.name}タグのバランスが不正（開き: ${openCount}個、閉じ: ${closeCount}個）`);
            }
        });
        
        // 5. prevent-duplicate-includes.jsの存在確認
        if (!content.includes('/js/prevent-duplicate-includes.js')) {
            issues.push('prevent-duplicate-includes.jsスクリプトが含まれていない');
        }
        
        return {
            fileName,
            issues,
        };
    } catch (err) {
        console.error(`${fileName}の検証中にエラーが発生しました:`, err);
        return {
            fileName,
            issues: [`エラー: ${err.message}`],
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
        
        console.log(`${files.length}個のHTMLファイルを検証します...`);
        
        const results = await Promise.all(files.map(validateHtmlFile));
        
        // レポートに問題を追加
        let problemCount = 0;
        results.forEach(result => {
            if (result.issues.length > 0) {
                report += `### ${result.fileName}\n`;
                result.issues.forEach(issue => {
                    report += `- ${issue}\n`;
                    problemCount++;
                });
                report += '\n';
            }
        });
        
        // 問題がなければその旨を記載
        if (problemCount === 0) {
            report += '**検出された問題はありません。すべてのHTMLファイルが検証に合格しました。**\n';
        } else {
            report += `\n**合計 ${problemCount}個の問題が検出されました。**\n`;
        }
        
        await writeFileAsync(REPORT_FILE, report);
        console.log(`検証が完了しました。レポートは ${REPORT_FILE} に保存されました。`);
    } catch (err) {
        console.error('エラーが発生しました:', err);
    }
}

// スクリプト実行
main();
