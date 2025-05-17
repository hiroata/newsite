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
const cleanupTools = safeRequire("./cleanup-tools");
const fixRelativePaths = safeRequire("./fix-relative-paths");
const fixWhitespace = safeRequire("./fix-whitespace");
const fixTrailingWhitespace = safeRequire("./fix-trailing-whitespace");
const convertAllTools = safeRequire("./convert-all-tools");
const removeBlogInlineStyles = safeRequire("./remove-blog-inline-styles-v2");

// 利用可能なタスクを定義
const availableTasks = [
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
  ),
  new OptimizationTask(
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

