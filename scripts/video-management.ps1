# video-management.ps1
# 動画ファイル管理用の統合PowerShellスクリプト
#
# 使用方法:
# .\scripts\video-management.ps1 -Mode <validate|report|backup>
#   validate: HTMLファイル内の動画URLを検証します
#   report: 動画URL検証レポートをHTML形式で生成します
#   backup: 動画ファイルをバックアップします
#
# 例:
# .\scripts\video-management.ps1 -Mode validate
# .\scripts\video-management.ps1 -Mode report
# .\scripts\video-management.ps1 -Mode backup

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("validate", "report", "backup")]
    [string]$Mode
)

# 共通設定
$expectedBucket = "utage-videos-yuki-2025"
$filePattern = "c:\Users\atara\Desktop\newsite-voice\achievement\*.html"
$reportPath = "c:\Users\atara\Desktop\newsite-voice\video-validation-report.html"
$videosDir = "C:\Users\atara\Desktop\newsite-voice\assets\videos"

#region 検証関数
function Validate-VideoUrls {
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
        
        # 検証2: 不正確なCloud Storageのパスを使っていないか
        $incorrectPattern = "https://storage.googleapis.com/(?!$expectedBucket/)[^""']+"
        $incorrectMatches = [regex]::Matches($content, $incorrectPattern)
        
        foreach ($match in $incorrectMatches) {
            $results["不正確なURL"] += @{
                "ファイル" = $fileName
                "URL" = $match.Value
            }
        }
        
        # 検証3: ローカルパスを使っていないか
        $localPattern = "src=""(/assets/videos/[^""]+)"""
        $localMatches = [regex]::Matches($content, $localPattern)
        
        foreach ($match in $localMatches) {
            $localPath = $match.Groups[1].Value
            $results["ローカルパス"] += @{
                "ファイル" = $fileName
                "パス" = $localPath
            }
        }
    }

    # 結果表示
    Write-Host "`r`n検証結果:" -ForegroundColor Green
    Write-Host "----------" -ForegroundColor Green
    
    Write-Host "`r`n正しいURL: $($results['正しいURL'].Count)件" -ForegroundColor Green
    foreach ($item in $results["正しいURL"]) {
        Write-Host "  $($item.ファイル): $($item.URL)" -ForegroundColor Gray
    }
    
    Write-Host "`r`n不正確なURL: $($results['不正確なURL'].Count)件" -ForegroundColor Yellow
    foreach ($item in $results["不正確なURL"]) {
        Write-Host "  $($item.ファイル): $($item.URL)" -ForegroundColor Yellow
    }
    
    Write-Host "`r`nローカルパス: $($results['ローカルパス'].Count)件" -ForegroundColor Red
    foreach ($item in $results["ローカルパス"]) {
        Write-Host "  $($item.ファイル): $($item.パス)" -ForegroundColor Red
    }
    
    Write-Host "`r`n検証完了。" -ForegroundColor Cyan

    return $results
}
#endregion

#region レポート生成関数
function Generate-VideoReport {
    # タイムスタンプを取得
    $timestamp = Get-Date -Format "yyyy/MM/dd HH:mm:ss"

    # 結果オブジェクト
    $results = @{
        "正しいURL" = @()
        "不正確なURL" = @()
        "ローカルパス" = @()
        "総ファイル数" = 0
        "検証時間" = $timestamp
    }

    Write-Host "HTML内の動画参照をチェックしています..." -ForegroundColor Cyan

    # HTMLファイルを取得して検証
    $files = Get-ChildItem -Path $filePattern
    $results["総ファイル数"] = $files.Count

    foreach ($file in $files) {
        $filePath = $file.FullName
        $fileName = $file.Name
        $content = Get-Content -Path $filePath -Raw
        
        # 検証1: 正しいCloud Storageのパスを使っているか
        $correctPattern = "https://storage.googleapis.com/$expectedBucket/[^""']+"
        $correctMatches = [regex]::Matches($content, $correctPattern)
        
        foreach ($match in $correctMatches) {
            $videoName = ($match.Value -split "/")[-1]
            $results["正しいURL"] += @{
                "ファイル" = $fileName
                "URL" = $match.Value
                "ビデオ名" = $videoName
            }
        }
        
        # 検証2: 不正確なCloud Storageのパスを使っていないか
        $incorrectPattern = "https://storage.googleapis.com/(?!$expectedBucket/)[^""']+"
        $incorrectMatches = [regex]::Matches($content, $incorrectPattern)
        
        foreach ($match in $incorrectMatches) {
            $videoName = ($match.Value -split "/")[-1]
            $results["不正確なURL"] += @{
                "ファイル" = $fileName
                "URL" = $match.Value
                "ビデオ名" = $videoName
            }
        }
        
        # 検証3: ローカルパスを使っていないか
        $localPattern = "src=""(/assets/videos/[^""]+)"""
        $localMatches = [regex]::Matches($content, $localPattern)
        
        foreach ($match in $localMatches) {
            $localPath = $match.Groups[1].Value
            $videoName = ($localPath -split "/")[-1]
            $results["ローカルパス"] += @{
                "ファイル" = $fileName
                "パス" = $localPath
                "ビデオ名" = $videoName
            }
        }
    }

    # HTMLレポートの生成
    $htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>動画URL検証レポート</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #0066cc;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #0066cc;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .summary {
            display: flex;
            justify-content: space-between;
            background-color: #e9f5ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .summary-item {
            text-align: center;
        }
        .success {
            color: green;
        }
        .warning {
            color: orange;
        }
        .error {
            color: red;
        }
        .timestamp {
            text-align: right;
            color: #666;
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>動画URL検証レポート</h1>
        
        <div class="summary">
            <div class="summary-item">
                <h3>検証ファイル</h3>
                <p>$($results["総ファイル数"])</p>
            </div>
            <div class="summary-item">
                <h3>正しいURL</h3>
                <p class="success">$($results["正しいURL"].Count)</p>
            </div>
            <div class="summary-item">
                <h3>不正確なURL</h3>
                <p class="warning">$($results["不正確なURL"].Count)</p>
            </div>
            <div class="summary-item">
                <h3>ローカルパス</h3>
                <p class="error">$($results["ローカルパス"].Count)</p>
            </div>
        </div>

        <h2>正しいURL ($($results["正しいURL"].Count)件)</h2>
"@

    if ($results["正しいURL"].Count -gt 0) {
        $htmlContent += @"
        <table>
            <tr>
                <th>ファイル</th>
                <th>ビデオ名</th>
                <th>URL</th>
            </tr>
"@
        foreach ($item in $results["正しいURL"]) {
            $htmlContent += @"
            <tr>
                <td>$($item.ファイル)</td>
                <td>$($item.ビデオ名)</td>
                <td>$($item.URL)</td>
            </tr>
"@
        }
        $htmlContent += @"
        </table>
"@
    } else {
        $htmlContent += @"
        <p>正しいURLは見つかりませんでした。</p>
"@
    }

    $htmlContent += @"
        <h2>不正確なURL ($($results["不正確なURL"].Count)件)</h2>
"@

    if ($results["不正確なURL"].Count -gt 0) {
        $htmlContent += @"
        <table>
            <tr>
                <th>ファイル</th>
                <th>ビデオ名</th>
                <th>不正確なURL</th>
                <th>修正案</th>
            </tr>
"@
        foreach ($item in $results["不正確なURL"]) {
            $correctUrl = "https://storage.googleapis.com/$expectedBucket/$($item.ビデオ名)"
            $htmlContent += @"
            <tr>
                <td>$($item.ファイル)</td>
                <td>$($item.ビデオ名)</td>
                <td class="warning">$($item.URL)</td>
                <td class="success">$correctUrl</td>
            </tr>
"@
        }
        $htmlContent += @"
        </table>
"@
    } else {
        $htmlContent += @"
        <p>不正確なURLは見つかりませんでした。</p>
"@
    }

    $htmlContent += @"
        <h2>ローカルパス ($($results["ローカルパス"].Count)件)</h2>
"@

    if ($results["ローカルパス"].Count -gt 0) {
        $htmlContent += @"
        <table>
            <tr>
                <th>ファイル</th>
                <th>ビデオ名</th>
                <th>ローカルパス</th>
                <th>修正案</th>
            </tr>
"@
        foreach ($item in $results["ローカルパス"]) {
            $correctUrl = "https://storage.googleapis.com/$expectedBucket/$($item.ビデオ名)"
            $htmlContent += @"
            <tr>
                <td>$($item.ファイル)</td>
                <td>$($item.ビデオ名)</td>
                <td class="error">$($item.パス)</td>
                <td class="success">$correctUrl</td>
            </tr>
"@
        }
        $htmlContent += @"
        </table>
"@
    } else {
        $htmlContent += @"
        <p>ローカルパスは見つかりませんでした。</p>
"@
    }

    $htmlContent += @"
        <p class="timestamp">レポート生成日時: $timestamp</p>
    </div>
</body>
</html>
"@

    # レポートファイルに保存
    $htmlContent | Out-File -FilePath $reportPath -Encoding UTF8

    Write-Host "レポートが生成されました: $reportPath" -ForegroundColor Green
    
    # レポートをブラウザで開く
    Invoke-Item $reportPath
}
#endregion

#region バックアップ関数
function Backup-VideoFiles {
    # バックアップディレクトリを作成
    $backupDir = "C:\Users\atara\Desktop\newsite-voice\assets\videos_backup_$(Get-Date -Format 'yyyyMMdd')"

    # バックアップディレクトリが存在するか確認
    if (-not (Test-Path -Path $backupDir)) {
        New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
        Write-Host "バックアップディレクトリを作成しました: $backupDir" -ForegroundColor Green
    }

    # MP4ファイルを検索
    $mp4Files = Get-ChildItem -Path $videosDir -Filter "*.mp4"
    $fileCount = $mp4Files.Count

    if ($fileCount -eq 0) {
        Write-Host "ディレクトリ '$videosDir' にMP4ファイルはありません。" -ForegroundColor Yellow
        return
    }

    Write-Host "$fileCount 個のMP4ファイルが見つかりました。" -ForegroundColor Cyan
    Write-Host "これらのファイルを '$backupDir' に移動し、元のディレクトリから削除します。" -ForegroundColor Cyan
    Write-Host "Google Cloud Storage へのアップロードが完了していることを確認してください。" -ForegroundColor Yellow
    Write-Host "続行しますか？ (y/n)" -ForegroundColor Yellow
    $confirm = Read-Host

    if ($confirm -eq "y") {
        # ファイルをバックアップディレクトリに移動
        foreach ($file in $mp4Files) {
            $destinationPath = Join-Path -Path $backupDir -ChildPath $file.Name
            Move-Item -Path $file.FullName -Destination $destinationPath -Force
            Write-Host "移動しました: $($file.Name)" -ForegroundColor Gray
        }
        
        # 成功メッセージ
        Write-Host "`r`nすべてのファイル($fileCount 個)を '$backupDir' に移動しました。" -ForegroundColor Green
        Write-Host "元のディレクトリからは削除されました。" -ForegroundColor Cyan
        
        # バックアップレポートを作成
        $backupReport = @"
# 動画バックアップレポート

- バックアップ日時: $(Get-Date -Format "yyyy/MM/dd HH:mm:ss")
- バックアップ先: $backupDir
- バックアップファイル数: $fileCount

## バックアップされたファイル:
$(foreach ($file in $mp4Files) {
    "- $($file.Name) - $($file.Length / 1MB) MB"
})

## 注意
このバックアップは、Google Cloud Storageへの移行が完了後に作成されました。
元のファイルは削除されており、HTMLファイル内の参照はCloud Storage URLに変更されています。
"@
        
        $backupReportPath = Join-Path -Path $backupDir -ChildPath "backup-report.md"
        $backupReport | Out-File -FilePath $backupReportPath -Encoding UTF8
        Write-Host "バックアップレポートを作成しました: $backupReportPath" -ForegroundColor Green
    }
    else {
        Write-Host "バックアップ処理はキャンセルされました。" -ForegroundColor Yellow
    }
}
#endregion

# メイン実行フロー
switch ($Mode) {
    "validate" {
        Write-Host "== 動画URL検証モード ==" -ForegroundColor Cyan
        Validate-VideoUrls
    }
    "report" {
        Write-Host "== レポート生成モード ==" -ForegroundColor Cyan
        Generate-VideoReport
    }
    "backup" {
        Write-Host "== バックアップモード ==" -ForegroundColor Cyan
        Backup-VideoFiles
    }
}
