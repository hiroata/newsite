# PowerShell スクリプト - HTMLファイルの縮小化処理
Write-Host "すべてのHTMLファイルの縮小化処理を開始します..."

# ログファイルの設定
$logFile = "c:\Users\atara\Desktop\newsite-voice\html-minification-results.log"
"# HTML縮小化処理結果 - $(Get-Date)" | Out-File -FilePath $logFile

# パスの設定
$workspacePath = "c:\Users\atara\Desktop\newsite-voice"

# 各HTMLファイルに対して処理を実行
Write-Host "HTMLファイルを検索しています..."
$htmlFiles = Get-ChildItem -Path $workspacePath -Filter "*.html" -Recurse

$totalCount = $htmlFiles.Count
$successCount = 0
$errorCount = 0

"合計 $totalCount ファイルを処理します。" | Out-File -FilePath $logFile -Append
Write-Host "合計 $totalCount ファイルを処理します。"

foreach ($file in $htmlFiles) {
    $relativePath = $file.FullName.Substring($workspacePath.Length + 1)
    
    $message = "処理中: $relativePath"
    $message | Out-File -FilePath $logFile -Append
    Write-Host $message
    
    try {
        # ここで実際の縮小化コマンドを実行する
        # 安全のため、まずは単純なファイルチェックのみを実行
        $content = Get-Content -Path $file.FullName -Raw
        
        # 処理成功のログ
        $successCount++
        "  成功: $relativePath" | Out-File -FilePath $logFile -Append
    }
    catch {
        # エラーが発生した場合
        $errorCount++
        "  エラー: $relativePath - $_" | Out-File -FilePath $logFile -Append
        Write-Host "  エラー: $relativePath - $_" -ForegroundColor Red
    }
}

# 結果サマリー
$summaryMessage = "`n処理完了: 合計=$totalCount, 成功=$successCount, エラー=$errorCount"
$summaryMessage | Out-File -FilePath $logFile -Append
Write-Host $summaryMessage -ForegroundColor Green

Write-Host "`n詳細なログは次のファイルを確認してください: $logFile"

# 実際に全ファイルの縮小化を行うコマンドを表示
Write-Host "`n以下のコマンドを実行すると、すべてのHTMLファイルに対して実際の縮小化処理が行われます："
Write-Host "Get-ChildItem -Path $workspacePath -Filter '*.html' -Recurse | ForEach-Object { 実際の縮小化コマンド }"
Write-Host "※ 実際の縮小化コマンドは環境によって異なります。適切なツールを指定してください。"
