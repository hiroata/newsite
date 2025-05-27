# 静的サイト全自動セットアップ
Write-Host "🚀 ロリポップサーバー用静的サイト準備開始" -ForegroundColor Green

# 1. 不要ファイル削除
Write-Host "📁 不要ファイル削除中..." -ForegroundColor Yellow

$deleteFiles = @(
    "*.ps1",
    "*.md", 
    "package.json",
    "*-report.*",
    "test-*.js",
    "verify-*.js",
    "update-*.js",
    "validate-*.js"
)

foreach ($pattern in $deleteFiles) {
    Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Remove-Item $_.FullName -Force
            Write-Host "❌ 削除: $($_.Name)" -ForegroundColor Red
        } catch {
            Write-Host "⚠️  削除失敗: $($_.Name)" -ForegroundColor Yellow
        }
    }
}

# 2. 開発フォルダ削除
$deleteFolders = @("tools", "scripts", "docs")
foreach ($folder in $deleteFolders) {
    if (Test-Path $folder) {
        try {
            Remove-Item $folder -Recurse -Force
            Write-Host "❌ フォルダ削除: $folder" -ForegroundColor Red
        } catch {
            Write-Host "⚠️  フォルダ削除失敗: $folder" -ForegroundColor Yellow
        }
    }
}

# 3. Apple風ヒーローセクション確認
Write-Host "🍎 Apple風ヒーローセクション確認中..." -ForegroundColor Cyan
if (Test-Path "css\apple-hero.css") {
    Write-Host "✅ Apple風CSSファイル存在" -ForegroundColor Green
} else {
    Write-Host "❌ Apple風CSSファイルなし" -ForegroundColor Red
}

# 4. 最終ビルドテスト
Write-Host "🔍 最終ビルドテスト実行中..." -ForegroundColor Cyan
& ".\final-build-test.ps1"

Write-Host "`n✅ 静的サイトセットアップ完了！" -ForegroundColor Green
Write-Host "🚀 ロリポップサーバーへアップロード可能" -ForegroundColor Green
