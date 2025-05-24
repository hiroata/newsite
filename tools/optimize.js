/**
 * optimize.js - サイト最適化統合ツール
 * 様々な最適化タスクを一度に実行するためのツール
 * 
 * 使用方法:
 * node tools/optimize.js [task1] [task2] ...
 * または
 * node tools/optimize.js all (すべての最適化を実行)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 最適化タスクを管理するクラス
class OptimizationTask {
  constructor(name, description, action) {
    this.name = name;
    this.description = description;
    this.action = action;
  }
  
  async execute() {
    console.log(`\n🚀 ${this.name}を実行中...`);
    console.log(`ℹ️ ${this.description}`);
    
    try {
      await this.action();
      console.log(`✅ ${this.name}が完了しました`);
      return true;
    } catch (error) {
      console.error(`❌ ${this.name}の実行中にエラーが発生しました:`, error);
      return false;
    }
  }
}

// 安全にモジュールを読み込むユーティリティ
function safeRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (error) {
    console.warn(`警告: モジュール ${modulePath} を読み込めませんでした - ${error.message}`);
    return null;
  }
}

// 外部コマンドを実行するユーティリティ
function runCommand(command) {
  return () => {
    try {
      execSync(command, { stdio: "inherit" });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

// 最適化モジュールを読み込み
const addLazyLoading = safeRequire("./add-lazy-loading");
const fs = require('fs');
const path = require('path');
const cleanupTools = safeRequire("./cleanup-tools");
const fixRelativePaths = safeRequire("./fix-relative-paths");
const fixWhitespace = safeRequire("./fix-whitespace");
const fixTrailingWhitespace = safeRequire("./fix-trailing-whitespace");
const convertAllTools = safeRequire("./convert-all-tools");
const removeBlogInlineStyles = safeRequire("./remove-blog-inline-styles-v2");

// 利用可能なタスクを定義
const availableTasks = [
  new OptimizationTask(
    "test-achievement",
    "achievement フォルダのファイルをテストします",
    runAchievementTest
  ),
  new OptimizationTask(
    "test-optimization",
    "最適化されたツールファイルをテストします",
    runOptimizationTest
  ),
  new OptimizationTask(
    "lazy-loading",
    "画像に遅延読み込み属性を追加します", 
    () => {
      if (addLazyLoading && typeof addLazyLoading.run === "function") {
        return addLazyLoading.run();
      }
      return runCommand("node tools/add-lazy-loading.js")();
    }
  ),
  new OptimizationTask(
    "cleanup",
    "不要なファイルを削除します", 
    () => {
      if (cleanupTools && typeof cleanupTools.run === "function") {
        return cleanupTools.run();
      }
      return runCommand("node tools/cleanup-tools.js")();
    }
  ),
  new OptimizationTask(
    "fix-paths",
    "相対パスを修正します",
    () => {
      if (fixRelativePaths && typeof fixRelativePaths.run === "function") {
        return fixRelativePaths.run();
      }
      return runCommand("node tools/fix-relative-paths.js")();
    }
  ),
  new OptimizationTask(
    "fix-whitespace",
    "不要な空白を削除します",
    () => {
      if (fixWhitespace && typeof fixWhitespace.run === "function") {
        return fixWhitespace.run();
      }
      return runCommand("node tools/fix-whitespace.js")();
    }
  ),
  new OptimizationTask(
    "fix-trailing-whitespace",
    "行末の空白を削除します",
    () => {
      if (fixTrailingWhitespace && typeof fixTrailingWhitespace.run === "function") {
        return fixTrailingWhitespace.run();
      }
      return runCommand("node tools/fix-trailing-whitespace.js")();
    }
  ),
  new OptimizationTask(
    "minify-css",
    "CSSファイルを圧縮します",
    runCommand("node tools/minify-css.js")
  ),  new OptimizationTask(
    "convert-tools",
    "ツールページをテンプレート形式に変換します",
    () => {
      if (convertAllTools && typeof convertAllTools.run === "function") {
        return convertAllTools.run();
      }
      return runCommand("node tools/convert-all-tools.js")();
    }
  ),
  new OptimizationTask(
    "update-cta-links",
    "すべてのブログ記事の本文末尾CTAリンクを更新します",
    async () => {
      // ブログディレクトリのパス
      const BLOG_DIR = path.join(__dirname, '..', 'blog');
      // 新しいCTAリンク
      const NEW_CTA_URL = 'https://utage-system.com/p/EcESO02xLLoK';
      // 本文末尾のCTAを検出するための正規表現パターン
      const CTA_PATTERN = /<p><a href="[^"]+" class="cta-button">[^<]+<\/a><\/p>/g;

      return new Promise((resolve, reject) => {
        try {
          fs.readdir(BLOG_DIR, (err, files) => {
            if (err) {
              console.error('ディレクトリの読み取りエラー:', err);
              return reject(err);
            }
            
            // HTMLファイルをフィルタリング
            const htmlFiles = files.filter(file => file.endsWith('.html'));
            let processed = 0;
            let changed = 0;
            
            console.log(`${htmlFiles.length}件のHTMLファイルを処理します...`);
            
            // 各ファイルを処理
            htmlFiles.forEach(file => {
              const filePath = path.join(BLOG_DIR, file);
              
              fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                  console.error(`${file}の読み取りエラー:`, err);
                  return;
                }
                
                // CTAリンクを検索して置換
                const matches = content.match(CTA_PATTERN);
                
                if (matches && matches.length > 0) {
                  let updatedContent = content;
                  
                  matches.forEach(match => {
                    // 古いURLを新しいURLに置換
                    const updatedMatch = match.replace(/href="[^"]+"/, `href="${NEW_CTA_URL}"`);
                    updatedContent = updatedContent.replace(match, updatedMatch);
                  });
                  
                  // 変更があった場合のみファイルに書き戻す
                  if (updatedContent !== content) {
                    fs.writeFile(filePath, updatedContent, 'utf8', err => {
                      if (err) {
                        console.error(`${file}の書き込みエラー:`, err);
                      } else {
                        console.log(`✅ ${file}のCTAリンクを更新しました`);
                        changed++;
                      }
                      
                      processed++;
                      if (processed === htmlFiles.length) {
                        console.log(`処理完了: ${changed}件のファイルを更新しました`);
                        resolve();
                      }
                    });
                  } else {
                    console.log(`ℹ️ ${file}は更新不要です`);
                    processed++;
                    if (processed === htmlFiles.length) {
                      console.log(`処理完了: ${changed}件のファイルを更新しました`);
                      resolve();
                    }
                  }
                } else {
                  console.log(`ℹ️ ${file}にはCTAリンクがありません`);
                  processed++;
                  if (processed === htmlFiles.length) {
                    console.log(`処理完了: ${changed}件のファイルを更新しました`);
                    resolve();
                  }
                }
              });
            });
          });
        } catch (error) {
          reject(error);
        }
      });
    }
  ),
  new OptimizationTask(
    "add-layout-css",
    "すべてのブログページにレイアウト更新用CSSとJSを追加します",
    async () => {
      // ブログディレクトリのパス
      const BLOG_DIR = path.join(__dirname, '..', 'blog');
      // 追加するCSSとJSリンク
      const CSS_LINK = '    <link rel="stylesheet" href="../css/layout-updates.css">';
      const JS_LINK = '    <script src="../js/layout-debug.js" defer></script>';

      return new Promise((resolve, reject) => {
        fs.readdir(BLOG_DIR, (err, files) => {
          if (err) {
            console.error('ディレクトリの読み取りエラー:', err);
            return reject(err);
          }
          
          // HTMLファイルをフィルタリング
          const htmlFiles = files.filter(file => file.endsWith('.html'));
          let processed = 0;
          let cssAdded = 0;
          let jsAdded = 0;
          
          console.log(`${htmlFiles.length}件のHTMLファイルを処理します...`);
          
          // 各HTMLファイルを処理
          htmlFiles.forEach(file => {
            const filePath = path.join(BLOG_DIR, file);
            
            fs.readFile(filePath, 'utf8', (err, content) => {
              if (err) {
                console.error(`${file}の読み取りエラー:`, err);
                processed++;
                return;
              }
              
              let updatedContent = content;
              let cssWasAdded = false;
              let jsWasAdded = false;
              
              // CSSリンクが既に存在するか確認
              if (!content.includes('layout-updates.css')) {
                // </head>タグの前にCSSリンクを挿入
                updatedContent = updatedContent.replace('</head>', `${CSS_LINK}\n</head>`);
                cssWasAdded = true;
                cssAdded++;
              }
              
              // JSリンクが既に存在するか確認
              if (!content.includes('layout-debug.js')) {
                // </body>タグの前にJSリンクを挿入
                updatedContent = updatedContent.replace('</body>', `${JS_LINK}\n</body>`);
                jsWasAdded = true;
                jsAdded++;
              }
              
              // 変更があった場合のみファイルを更新
              if (updatedContent !== content) {
                fs.writeFile(filePath, updatedContent, 'utf8', err => {
                  if (err) {
                    console.error(`${file}の書き込みエラー:`, err);
                  } else {
                    console.log(`✅ ${file}: ` + 
                      (cssWasAdded ? 'CSSを追加、' : '') + 
                      (jsWasAdded ? 'JSを追加' : ''));
                  }
                  
                  processed++;
                  if (processed === htmlFiles.length) {
                    console.log(`処理完了: ${cssAdded}件のCSSリンクと${jsAdded}件のJSリンクを追加しました`);
                    resolve();
                  }
                });
              } else {
                console.log(`ℹ️ ${file}は既に更新済みです`);
                processed++;
                if (processed === htmlFiles.length) {
                  console.log(`処理完了: ${cssAdded}件のCSSリンクと${jsAdded}件のJSリンクを追加しました`);
                  resolve();
                }
              }
            });
          });
        });
      });
    }
  ),
  new OptimizationTask(
    "clean-blog-styles",
    "ブログ記事からインラインスタイルを削除します",
    () => {
      if (removeBlogInlineStyles && typeof removeBlogInlineStyles.run === "function") {
        return removeBlogInlineStyles.run();
      }
      return runCommand("node tools/remove-blog-inline-styles-v2.js")();
    }
  ),
  new OptimizationTask(
    "generate-sitemap",
    "サイトマップを自動生成します",
    runCommand("node js/auto-sitemap.js")
  ),
  new OptimizationTask(
    "optimize-images",
    "画像を最適化します",
    async () => {
      // 画像サイズを最適化する処理
      console.log("   📷 すべての画像ファイルを最適化しています...");
      
      // 画像ディレクトリを処理
      const imageDirectories = [
        'assets/images',
        'blog/images'
      ];
      
      // 各ディレクトリで画像最適化を実行
      for (const dir of imageDirectories) {
        try {
          if (fs.existsSync(dir)) {
            console.log(`   🔍 ${dir} ディレクトリ内の画像を処理中...`);
            execSync(`npx imagemin ${dir}/**/*.{jpg,png,gif} --out-dir=${dir}`, { stdio: 'inherit' });
          }
        } catch (error) {
          console.warn(`   ⚠️ ${dir} の処理中にエラーが発生しました: ${error.message}`);
        }
      }
      
      console.log("   ✅ 画像の最適化が完了しました");
      return Promise.resolve();
    }
  )
];

// テスト実行関数
async function runAchievementTest() {
  try {
    const puppeteer = require('puppeteer');
    console.log('✨ Achievementテストを実行します...');
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // ログ収集
    const logs = [];
    page.on('console', message => {
      logs.push({
        type: message.type(),
        text: message.text()
      });
    });
    
    // エラー収集
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    // レポート準備
    const report = {
      pages: [],
      totalErrors: 0,
      totalWarnings: 0
    };
    
    // テスト対象ページ
    const pages = [
      'http://localhost:8080/achievement/index.html',
      'http://localhost:8080/achievement/customer1.html',
      'http://localhost:8080/achievement/customer2.html',
      'http://localhost:8080/achievement/customer3.html',
      'http://localhost:8080/achievement/customer4.html',
      'http://localhost:8080/achievement/customer5.html'
    ];
    
    for (const pageUrl of pages) {
      console.log(`ページをテスト中: ${pageUrl}`);
      
      // エラーとログをリセット
      errors.length = 0;
      logs.length = 0;
      
      // ページ読み込み
      await page.goto(pageUrl, { waitUntil: 'networkidle0' });
      
      // コンテンツテスト
      const hasFilter = await page.evaluate(() => {
        return document.querySelectorAll('.filter-buttons').length > 0;
      });
      
      // レポート情報を追加
      const warnings = logs.filter(log => log.type === 'warning').length;
      
      report.pages.push({
        url: pageUrl,
        errors: errors.length,
        warnings,
        hasFilter
      });
      
      report.totalErrors += errors.length;
      report.totalWarnings += warnings;
      
      // エラー表示
      if (errors.length > 0) {
        console.log(`⚠️ ${pageUrl}で${errors.length}件のエラーが検出されました:`);
        errors.forEach(error => console.log(`  - ${error}`));
      } else {
        console.log(`✅ ${pageUrl}でエラーは検出されませんでした`);
      }
    }
    
    await browser.close();
    
    // レポートをファイルに出力
    fs.writeFileSync(
      path.join(__dirname, '..', 'achievement-validation-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('✅ テスト完了!');
    console.log(`📊 結果: ${report.totalErrors}件のエラー、${report.totalWarnings}件の警告`);
    console.log(`📝 詳細なレポートは achievement-validation-report.json に保存されました`);
    
    return report.totalErrors === 0;
  } catch (error) {
    console.error('❌ テスト実行中にエラーが発生しました:', error);
    return false;
  }
}

// 最適化テスト関数
function runOptimizationTest() {
  console.log('✨ 最適化テストを実行します...');
  
  // ディレクトリパス
  const rootDir = path.join(__dirname, '..');
  const toolsDir = path.join(rootDir, 'tools');
  const jsDir = path.join(rootDir, 'js');
  const cssDir = path.join(rootDir, 'css');
  
  // 必須ファイル
  const requiredFiles = [
    path.join(jsDir, 'image-tools-utils.js'),
    path.join(cssDir, 'image-tools-styles.css')
  ];
  
  // 確認対象のツールファイル
  const toolHtmlFiles = [
    path.join(toolsDir, 'image-resize.html'),
    path.join(toolsDir, 'png-to-jpeg.html'),
    path.join(toolsDir, 'png-jpeg-to-webp.html'),
    path.join(toolsDir, 'meme-generator.html')
  ];
  
  // ファイルが存在するか確認
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    console.error('❌ 以下の必要なファイルが見つかりません:');
    missingFiles.forEach(file => console.error(`  - ${file}`));
    return false;
  }
  
  console.log('✅ すべての必要なファイルが存在します');
  
  // 共通ファイルのサイズを確認
  const jsSize = fs.statSync(requiredFiles[0]).size;
  const cssSize = fs.statSync(requiredFiles[1]).size;
  
  console.log(`📊 image-tools-utils.js: ${(jsSize / 1024).toFixed(2)} KB`);
  console.log(`📊 image-tools-styles.css: ${(cssSize / 1024).toFixed(2)} KB`);
  
  if (jsSize < 1000) {
    console.warn('⚠️ image-tools-utils.jsのサイズが小さすぎます');
  }
  
  if (cssSize < 500) {
    console.warn('⚠️ image-tools-styles.cssのサイズが小さすぎます');
  }
  
  // 各ツールファイルを確認
  let allValid = true;
  const validationReport = [];
  
  toolHtmlFiles.forEach(htmlFile => {
    if (!fs.existsSync(htmlFile)) {
      console.warn(`⚠️ ${path.basename(htmlFile)}が見つかりません`);
      validationReport.push({
        file: path.basename(htmlFile),
        status: 'missing',
        issues: ['ファイルが見つかりません']
      });
      return;
    }
    
    const content = fs.readFileSync(htmlFile, 'utf8');
    const fileName = path.basename(htmlFile);
    const issues = [];
    
    // JSの参照を確認
    if (!content.includes('image-tools-utils.js')) {
      issues.push('image-tools-utils.jsの参照が見つかりません');
      console.error(`❌ ${fileName}にimage-tools-utils.jsの参照が見つかりません`);
      allValid = false;
    }
    
    // CSSの参照を確認
    if (!content.includes('image-tools-styles.css')) {
      issues.push('image-tools-styles.cssの参照が見つかりません');
      console.error(`❌ ${fileName}にimage-tools-styles.cssの参照が見つかりません`);
      allValid = false;
    }
    
    validationReport.push({
      file: fileName,
      status: issues.length === 0 ? 'valid' : 'invalid',
      issues
    });
    
    if (issues.length === 0) {
      console.log(`✅ ${fileName}は正しく最適化されています`);
    }
  });
  
  // レポートをファイルに出力
  fs.writeFileSync(
    path.join(rootDir, 'optimization-validation-report.json'),
    JSON.stringify(validationReport, null, 2)
  );
  
  console.log('✅ テスト完了!');
  
  if (allValid) {
    console.log('🎉 すべてのファイルが正しく最適化されています');
  } else {
    console.warn('⚠️ 一部のファイルで最適化の問題が検出されました');
    console.log('詳細はoptimization-validation-report.jsonを確認してください');
  }
  
  return allValid;
}

// タスク名からタスクを取得
function getTaskByName(name) {
  return availableTasks.find(task => task.name === name);
}

// ヘルプを表示
function showHelp() {
  console.log(`
サイト最適化ツール - 使用方法:
==============================

node tools/optimize.js [タスク名] [タスク名] ...

利用可能なタスク:
--------------`);

  availableTasks.forEach(task => {
    console.log(`  - ${task.name}: ${task.description}`);
  });

  console.log(`
オプション:
---------
  all       : すべての最適化タスクを実行します (デフォルト)
  --help, -h: このヘルプメッセージを表示します

例:
---
  node tools/optimize.js                  # すべてのタスクを実行
  node tools/optimize.js lazy-loading     # 遅延読み込み最適化のみ実行
  node tools/optimize.js cleanup fix-paths # 複数のタスクを順に実行
  `);
}

// コマンドライン引数を解析してタスクを実行
async function parseArgumentsAndRun() {
  const args = process.argv.slice(2);
  
  // ヘルプ表示
  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }
  
  // 実行するタスクを決定
  const tasksToRun = args.length === 0 || args.includes("all")
    ? availableTasks // すべてのタスクを実行
    : args.map(arg => getTaskByName(arg)).filter(Boolean); // 指定されたタスクのみ実行
  
  if (tasksToRun.length === 0) {
    console.error("❌ 有効なタスク名を指定してください。--help でヘルプを表示します。");
    return;
  }
  
  console.log("🛠️ サイト最適化を開始します...");
  
  // 選択されたタスクを順番に実行
  let successCount = 0;
  for (const task of tasksToRun) {
    const success = await task.execute();
    if (success) successCount++;
  }
  
  console.log(`\n🏁 最適化完了! ${successCount}/${tasksToRun.length} のタスクが成功しました。`);
}

// メイン処理を実行
parseArgumentsAndRun().catch(error => {
  console.error("❌ 致命的なエラーが発生しました:", error);
  process.exit(1);
});

// モジュールとしてエクスポート
module.exports = {
  runTask: async (taskName) => {
    const task = getTaskByName(taskName);
    if (task) {
      return await task.execute();
    }
    return false;
  },
  runAll: async () => {
    let successCount = 0;
    for (const task of availableTasks) {
      const success = await task.execute();
      if (success) successCount++;
    }
    return successCount === availableTasks.length;
  }
};

