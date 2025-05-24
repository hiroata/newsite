# HTML内の動画参照を検証するスクリプト

# バケット名
$expectedBucket = "utage-videos-yuki-2025"

# 検索するファイルパターン
$filePattern = "c:\Users\atara\Desktop\newsite-voice\achievement\*.html"

# 結果レポート
$results = @{
    "正しいURL" = @()
    "不正確なURL" = @()
    "ローカルパス" = @()
}

Write-Host "HTML内の動画参照をチェックしています..." -ForegroundColor Cyan

# HTMLファイルを取得して検証
Get-ChildItem -Path $filePattern | ForEach-Object {
    $filePath = $_.FullName
    $fileName = $_.Name
    $content = Get-Content -Path $filePath -Raw
    
    # 検証1: 正しいCloud Storageのパスを使っているか
    $correctPattern = "https://storage.googleapis.com/$expectedBucket/[^""']+"
    $correctMatches = [regex]::Matches($content, $correctPattern)
    
    foreach ($match in $correctMatches) {
        $results["正しいURL"] += @{
            "ファイル" = $fileName
            "URL" = $match.Value
        }
    }
    
    # 検証2: 間違ったCloud Storageのパスを使っているか
    $incorrectPattern = "https://storage.googleapis.com/(?!$expectedBucket)[^/]+/[^""']+"
    $incorrectMatches = [regex]::Matches($content, $incorrectPattern)
    
    foreach ($match in $incorrectMatches) {
        $results["不正確なURL"] += @{
            "ファイル" = $fileName
            "URL" = $match.Value
        }
    }
    
    # 検証3: まだローカルパスを使っているか
    $localPattern = "src=[""'](/assets/videos/[^""']+)[""']"
    $localMatches = [regex]::Matches($content, $localPattern)
    
    foreach ($match in $localMatches) {
        $results["ローカルパス"] += @{
            "ファイル" = $fileName
            "パス" = $match.Groups[1].Value
        }
    }
}

# 結果を表示
Write-Host "`n検証結果:" -ForegroundColor Green

# 正しいURLを表示
Write-Host "`n正しいCloud Storage URL:" -ForegroundColor Green
if ($results["正しいURL"].Count -eq 0) {
    Write-Host "  なし" -ForegroundColor Red
} else {
    foreach ($item in $results["正しいURL"]) {
        Write-Host "  ✓ $($item.ファイル): $($item.URL)" -ForegroundColor Green
    }
}

# 不正確なURLを表示
Write-Host "`n不正確なCloud Storage URL:" -ForegroundColor Yellow
if ($results["不正確なURL"].Count -eq 0) {
    Write-Host "  なし" -ForegroundColor Green
} else {
    foreach ($item in $results["不正確なURL"]) {
        Write-Host "  ✗ $($item.ファイル): $($item.URL)" -ForegroundColor Red
    }
}

# ローカルパスを表示
Write-Host "`nローカルパスの参照:" -ForegroundColor Yellow
if ($results["ローカルパス"].Count -eq 0) {
    Write-Host "  なし" -ForegroundColor Green
} else {
    foreach ($item in $results["ローカルパス"]) {
        Write-Host "  ✗ $($item.ファイル): $($item.パス)" -ForegroundColor Red
    }
}

# 概要を表示
$totalCorrect = $results["正しいURL"].Count
$totalIncorrect = $results["不正確なURL"].Count + $results["ローカルパス"].Count

Write-Host "`n検証概要:" -ForegroundColor Cyan
Write-Host "  正しいURL参照: $totalCorrect" -ForegroundColor Green
Write-Host "  修正が必要: $totalIncorrect" -ForegroundColor $(if ($totalIncorrect -eq 0) { "Green" } else { "Red" })

if ($totalIncorrect -eq 0) {
    Write-Host "`n良い結果です！すべての動画URLは正しくCloud Storageを参照しています。" -ForegroundColor Green
} else {
    Write-Host "`n注意：まだ修正が必要なURLがあります。HTMLファイルを確認してください。" -ForegroundColor Red
}
