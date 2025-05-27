# 静的サイト最終ビルドテスト（簡潔版）

Write-Host "🔍 静的サイトビルドテスト開始" -ForegroundColor Green

# HTMLファイルチェック
$htmlFiles = Get-ChildItem -Path "*.html" -Recurse
$errorCount = 0
$totalCount = $htmlFiles.Count

foreach ($file in $htmlFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction Stop
        
        # 基本チェック
        $hasDoctype = $content -match '<!DOCTYPE html>'
        $hasTitle = $content -match '<title[^>]*>'
        $hasCharset = $content -match '<meta[^>]*charset[^>]*>'
        
        if ($hasDoctype -and $hasTitle -and $hasCharset) {
            Write-Host "✅ $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "❌ $($file.Name) - 基本構造エラー" -ForegroundColor Red
            $errorCount++
        }
    }
    catch {
        Write-Host "❌ $($file.Name) - 読み込みエラー" -ForegroundColor Red
        $errorCount++
    }
}

# 結果表示
$validCount = $totalCount - $errorCount
Write-Host "`n📊 結果: $validCount/$totalCount 有効" -ForegroundColor Cyan

if ($errorCount -eq 0) {
    Write-Host "🎉 全ファイル正常！ロリポップアップロード準備完了" -ForegroundColor Green
} else {
    Write-Host "⚠️  $errorCount 個のファイルにエラーあり" -ForegroundColor Yellow
}

# ファイルサイズ
$totalSize = (Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum).Sum
Write-Host "📈 総サイズ: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Yellow
