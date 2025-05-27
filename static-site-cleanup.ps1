# 静的サイト用クリーンアップスクリプト
# ロリポップサーバーアップロード前の最適化

Write-Host "🚀 静的サイトクリーンアップを開始します..." -ForegroundColor Green

# 削除対象の開発ファイル・フォルダ
$deletePatterns = @(
    # 開発ツール関連
    "tools\*",
    "scripts\*",
    
    # PowerShellスクリプト
    "*.ps1",
    
    # 開発用JSファイル（rootレベル）
    "verify-blog-fixes.js",
    "validate-achievement.js",
    "update-terms-css.js",
    "update-sidebar-cta-links.js",
    "update-privacy-css.js",
    "update-author-profiles.js",
    "test-filter.js",
    
    # 開発ドキュメント
    "*.md",
    "CLAUDE.md",
    "README.md",
    "*.json",
    
    # レポート・ログファイル
    "*-report.md",
    "*-report.json",
    "*-analysis.md",
    "*-guide.md",
    "deletable-files-list.md",
    
    # 不要なフォルダ
    "docs\*",
    
    # gitignore等
    ".gitignore",
    ".git\*"
)

# 保持するファイル
$keepFiles = @(
    "service-worker.js",
    "js\*",
    "achievement\achievement.js",
    "css\*",
    "assets\*",
    "*.html",
    "sitemap.xml",
    "robots.txt"
)

Write-Host "📁 不要ファイルを削除中..." -ForegroundColor Yellow

foreach ($pattern in $deletePatterns) {
    $files = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        try {
            Remove-Item $file.FullName -Recurse -Force
            Write-Host "❌ 削除: $($file.Name)" -ForegroundColor Red
        }
        catch {
            Write-Host "⚠️ 削除できませんでした: $($file.Name)" -ForegroundColor Orange
        }
    }
}

Write-Host "✅ クリーンアップ完了!" -ForegroundColor Green
Write-Host "📊 残存ファイル数:" -ForegroundColor Cyan
Get-ChildItem -Recurse | Group-Object Extension | Sort-Object Count -Descending | Select-Object Name, Count | Format-Table
