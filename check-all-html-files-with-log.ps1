# PowerShell スクリプト - すべてのHTMLファイルの縮小化確認（ログファイル出力版）
Write-Host "すべてのHTMLファイルの処理を開始します..."

# ログファイルの設定
$logFile = "c:\Users\atara\Desktop\newsite-voice\html-check-results.log"
"# HTMLファイルチェック結果 - $(Get-Date)" | Out-File -FilePath $logFile

# HTMLファイルを探す
$htmlFiles = Get-ChildItem -Path "c:\Users\atara\Desktop\newsite-voice" -Filter "*.html" -Recurse

$totalFiles = $htmlFiles.Count
"合計 $totalFiles ファイルを処理します。" | Out-File -FilePath $logFile -Append
Write-Host "合計 $totalFiles ファイルを処理します。"

$warningCount = 0

foreach ($file in $htmlFiles) {
    $processedFiles++
    $percentComplete = [Math]::Round(($processedFiles / $totalFiles) * 100)
    
    $message = "[$percentComplete%] 処理中: $($file.FullName)"
    $message | Out-File -FilePath $logFile -Append
    Write-Host $message
    
    # ファイルの内容を読み込んで確認
    $content = Get-Content -Path $file.FullName -Raw
    
    # 潜在的な問題を確認（非エスケープのSVG URL）
    if ($content -match "background-image: url\('data:image/svg\+xml,<svg") {
        $warningMessage = "  警告: エスケープされていないSVG URLが見つかりました: $($file.FullName)"
        $warningMessage | Out-File -FilePath $logFile -Append
        Write-Host $warningMessage -ForegroundColor Yellow
        $warningCount++
    }
}

$summaryMessage = "`n処理が完了しました。警告の数: $warningCount"
$summaryMessage | Out-File -FilePath $logFile -Append
Write-Host $summaryMessage

Write-Host "詳細ログは次のファイルを確認してください: $logFile"
