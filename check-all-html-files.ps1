# PowerShell スクリプト - すべてのHTMLファイルの縮小化確認
Write-Host "すべてのHTMLファイルの処理を開始します..."

# HTMLファイルを探す
$htmlFiles = Get-ChildItem -Path "c:\Users\atara\Desktop\newsite-voice" -Filter "*.html" -Recurse

$totalFiles = $htmlFiles.Count
$processedFiles = 0

Write-Host "合計 $totalFiles ファイルを処理します。"

foreach ($file in $htmlFiles) {
    $processedFiles++
    $percentComplete = [Math]::Round(($processedFiles / $totalFiles) * 100)
    
    Write-Host "[$percentComplete%] 処理中: $($file.FullName)"
    
    # ファイルの内容を読み込んで確認
    $content = Get-Content -Path $file.FullName -Raw
    
    # 潜在的な問題を確認（非エスケープのSVG URL）
    if ($content -match "background-image: url\('data:image/svg\+xml,<svg") {
        Write-Host "  警告: エスケープされていないSVG URLが見つかりました: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`n処理が完了しました。警告が表示されなければ全ファイルが問題ないことを示します。"
