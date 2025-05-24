# HTML内の動画参照を検証して実行可能なHTMLレポートを生成するスクリプト

# 設定パラメータ
$expectedBucket = "utage-videos-yuki-2025"
$filePattern = "c:\Users\atara\Desktop\newsite-voice\achievement\*.html"
$reportPath = "c:\Users\atara\Desktop\newsite-voice\video-validation-report.html"

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
        $videoFileName = $match.Value -replace "https://storage.googleapis.com/$expectedBucket/", ""
        $results["正しいURL"] += @{
            "ファイル" = $fileName
            "URL" = $match.Value
            "動画ファイル名" = $videoFileName
        }
    }
    
    # 検証2: 間違ったCloud Storageのパスを使っているか
    $incorrectPattern = "https://storage.googleapis.com/(?!$expectedBucket)[^/]+/[^""']+"
    $incorrectMatches = [regex]::Matches($content, $incorrectPattern)
    
    foreach ($match in $incorrectMatches) {
        $parts = $match.Value -split "/"
        $videoFileName = $parts[-1]
        $bucketName = $parts[3]
        $results["不正確なURL"] += @{
            "ファイル" = $fileName
            "URL" = $match.Value
            "バケット名" = $bucketName
            "動画ファイル名" = $videoFileName
        }
    }
    
    # 検証3: まだローカルパスを使っているか
    $localPattern = "src=[""'](/assets/videos/[^""']+)[""']"
    $localMatches = [regex]::Matches($content, $localPattern)
    
    foreach ($match in $localMatches) {
        $videoPath = $match.Groups[1].Value
        $videoFileName = $videoPath -replace "/assets/videos/", ""
        $results["ローカルパス"] += @{
            "ファイル" = $fileName
            "パス" = $videoPath
            "動画ファイル名" = $videoFileName
        }
    }
}

# 結果を表示
Write-Host "`n検証結果:" -ForegroundColor Green
Write-Host "  総検証ファイル数: $($results["総ファイル数"])" -ForegroundColor Cyan
Write-Host "  正しいURL参照: $($results["正しいURL"].Count)" -ForegroundColor Green
Write-Host "  不正確なURL参照: $($results["不正確なURL"].Count)" -ForegroundColor $(if ($results["不正確なURL"].Count -eq 0) { "Green" } else { "Red" })
Write-Host "  ローカルパス参照: $($results["ローカルパス"].Count)" -ForegroundColor $(if ($results["ローカルパス"].Count -eq 0) { "Green" } else { "Red" })

# HTMLレポート作成
$htmlContent = @"
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>動画URL検証レポート - $timestamp</title>
    <style>
        body {
            font-family: 'Segoe UI', 'メイリオ', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1, h2, h3 {
            color: #0d3283;
        }
        .report-header {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .summary {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .summary-item {
            text-align: center;
            background-color: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin: 10px;
            min-width: 200px;
        }
        .correct {
            color: #28a745;
        }
        .warning {
            color: #ffc107;
        }
        .error {
            color: #dc3545;
        }
        .section {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            background-color: #fff;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f0f7ff;
            color: #0d3283;
            position: sticky;
            top: 0;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.9em;
            color: #777;
        }
        .badge {
            display: inline-block;
            padding: 3px 7px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            color: white;
        }
        .badge-success {
            background-color: #28a745;
        }
        .badge-warning {
            background-color: #ffc107;
            color: #212529;
        }
        .badge-danger {
            background-color: #dc3545;
        }
        .url {
            word-break: break-all;
            font-family: monospace;
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="report-header">
        <h1>動画URL検証レポート</h1>
        <p>このレポートは、HTMLファイル内の動画URL参照を検証し、Google Cloud Storageへの移行状況を確認するためのものです。</p>
        <p>検証日時: $($results["検証時間"])</p>
    </div>

    <div class="summary">
        <div class="summary-item">
            <h3>検証ファイル数</h3>
            <div style="font-size: 2em;">$($results["総ファイル数"])</div>
            <p>HTMLファイル</p>
        </div>
        <div class="summary-item">
            <h3>正しいURL</h3>
            <div style="font-size: 2em;" class="correct">$($results["正しいURL"].Count)</div>
            <p>正しいGCS参照</p>
        </div>
        <div class="summary-item">
            <h3>不正確なURL</h3>
            <div style="font-size: 2em;" class="$($results["不正確なURL"].Count -eq 0 ? "correct" : "error")">$($results["不正確なURL"].Count)</div>
            <p>バケット名が異なるURL</p>
        </div>
        <div class="summary-item">
            <h3>ローカルパス</h3>
            <div style="font-size: 2em;" class="$($results["ローカルパス"].Count -eq 0 ? "correct" : "error")">$($results["ローカルパス"].Count)</div>
            <p>ローカルファイル参照</p>
        </div>
    </div>

    <!-- 正しいURL -->
    <div class="section">
        <h2>正しいCloud Storage URL</h2>
"@

if ($results["正しいURL"].Count -eq 0) {
    $htmlContent += "<p>正しいCloud Storage URLが見つかりませんでした。</p>"
} else {
    $htmlContent += @"
        <table>
            <thead>
                <tr>
                    <th>HTMLファイル</th>
                    <th>動画ファイル名</th>
                    <th>URL</th>
                </tr>
            </thead>
            <tbody>
"@
    
    foreach ($item in $results["正しいURL"]) {
        $htmlContent += @"
                <tr>
                    <td>$($item.ファイル)</td>
                    <td>$($item.動画ファイル名)</td>
                    <td class="url">$($item.URL)</td>
                </tr>
"@
    }
    
    $htmlContent += @"
            </tbody>
        </table>
"@
}

$htmlContent += @"
    </div>

    <!-- 不正確なURL -->
    <div class="section">
        <h2>不正確なCloud Storage URL</h2>
"@

if ($results["不正確なURL"].Count -eq 0) {
    $htmlContent += "<p class='correct'>素晴らしい！不正確なCloud Storage URLはありません。</p>"
} else {
    $htmlContent += @"
        <p class="error">以下のURLは正しいバケット名 ($expectedBucket) を使用していません。</p>
        <table>
            <thead>
                <tr>
                    <th>HTMLファイル</th>
                    <th>現在のバケット名</th>
                    <th>動画ファイル名</th>
                    <th>URL</th>
                </tr>
            </thead>
            <tbody>
"@
    
    foreach ($item in $results["不正確なURL"]) {
        $htmlContent += @"
                <tr>
                    <td>$($item.ファイル)</td>
                    <td><span class="badge badge-warning">$($item.バケット名)</span></td>
                    <td>$($item.動画ファイル名)</td>
                    <td class="url">$($item.URL)</td>
                </tr>
"@
    }
    
    $htmlContent += @"
            </tbody>
        </table>
"@
}

$htmlContent += @"
    </div>

    <!-- ローカルパス -->
    <div class="section">
        <h2>ローカルパス参照</h2>
"@

if ($results["ローカルパス"].Count -eq 0) {
    $htmlContent += "<p class='correct'>素晴らしい！ローカルパス参照はありません。</p>"
} else {
    $htmlContent += @"
        <p class="error">以下のパスはまだローカルファイルを参照しています。Cloud Storageへの移行が必要です。</p>
        <table>
            <thead>
                <tr>
                    <th>HTMLファイル</th>
                    <th>動画ファイル名</th>
                    <th>ローカルパス</th>
                </tr>
            </thead>
            <tbody>
"@
    
    foreach ($item in $results["ローカルパス"]) {
        $htmlContent += @"
                <tr>
                    <td>$($item.ファイル)</td>
                    <td>$($item.動画ファイル名)</td>
                    <td class="url">$($item.パス)</td>
                </tr>
"@
    }
    
    $htmlContent += @"
            </tbody>
        </table>
"@
}

$htmlContent += @"
    </div>

    <!-- 修正手順 -->
    <div class="section">
        <h2>次のステップと修正手順</h2>
        
        <h3>正しいCloud Storage URLへの修正例:</h3>
        <pre>
&lt;video controls poster="/assets/images/interview-video-thumbnail.webp" preload="none" width="100%"&gt;
    &lt;source src="https://storage.googleapis.com/$expectedBucket/example-video.mp4" type="video/mp4"&gt;
    お使いのブラウザは動画タグをサポートしていません。
&lt;/video&gt;
        </pre>
        
        <h3>不正確なURLの修正手順:</h3>
        <ol>
            <li>対象のHTMLファイルを開く</li>
            <li>不正確なバケット名を正しいバケット名 (<code>$expectedBucket</code>) に置換</li>
            <li>変更をコミットして動作確認</li>
        </ol>
        
        <h3>ローカルパスの修正手順:</h3>
        <ol>
            <li>ローカル動画ファイルをGoogle Cloud Storageにアップロード</li>
            <li>HTMLファイル内のローカルパス参照をCloud Storage URLに変更</li>
            <li>変更をコミットして動作確認</li>
        </ol>
    </div>

    <div class="footer">
        <p>このレポートは自動生成されました。© 2025 UTAGEウェブサイトプロジェクト</p>
    </div>
</body>
</html>
"@

# HTMLレポートを保存
$htmlContent | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "`nHTML検証レポートが保存されました: $reportPath" -ForegroundColor Green

# レポートを開く
Invoke-Item $reportPath
