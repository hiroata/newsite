# HTML内の動画URL参照を検証するスクリプト

# 検証対象のファイルパス
$htmlFiles = @(
    "C:\Users\atara\Desktop\newsite-voice\achievement\customer1.html",
    "C:\Users\atara\Desktop\newsite-voice\achievement\customer2.html",
    "C:\Users\atara\Desktop\newsite-voice\achievement\customer3.html",
    "C:\Users\atara\Desktop\newsite-voice\achievement\customer4.html",
    "C:\Users\atara\Desktop\newsite-voice\achievement\customer5.html"
)

# 期待されるCloud Storage URLのパターン
$expectedPattern = 'https://storage.googleapis.com/utage-videos/'

# 検証結果のトラッキング
$validFiles = 0
$issues = @()

foreach ($file in $htmlFiles) {
    $fileName = Split-Path $file -Leaf
    Write-Host "検証中: $fileName" -ForegroundColor Cyan
    
    # ファイルが存在するか確認
    if (-not (Test-Path $file)) {
        Write-Host "  ✗ ファイルが見つかりません" -ForegroundColor Red
        $issues += [PSCustomObject]@{
            File = $fileName
            Issue = "ファイルが見つかりません"
            Line = "N/A"
        }
        continue
    }
    
    # ファイルの内容を読み込む
    $content = Get-Content $file -Raw
    
    # video タグがあるか確認
    if ($content -notmatch '<video') {
        Write-Host "  ✗ video タグが見つかりません" -ForegroundColor Red
        $issues += [PSCustomObject]@{
            File = $fileName
            Issue = "video タグが見つかりません"
            Line = "N/A"
        }
        continue
    }
    
    # source タグがあるか確認
    if ($content -notmatch '<source') {
        Write-Host "  ✗ source タグが見つかりません" -ForegroundColor Red
        $issues += [PSCustomObject]@{
            File = $fileName
            Issue = "source タグが見つかりません"
            Line = "N/A"
        }
        continue
    }
    
    # 行ごとに解析
    $lineNum = 0
    $found = $false
    $lineWithSource = ""
    foreach ($line in (Get-Content $file)) {
        $lineNum++
        if ($line -match '<source') {
            $lineWithSource = $line
            
            # Cloud Storage URL が使われているか確認
            if ($line -match $expectedPattern) {
                $found = $true
                Write-Host "  ✓ Cloud Storage URL が見つかりました - 行 $lineNum" -ForegroundColor Green
                Write-Host "    $line" -ForegroundColor Gray
            }
            else {
                Write-Host "  ✗ Cloud Storage URL が見つかりません - 行 $lineNum" -ForegroundColor Red
                Write-Host "    $line" -ForegroundColor Gray
                $issues += [PSCustomObject]@{
                    File = $fileName
                    Issue = "Cloud Storage URL が使われていません"
                    Line = $lineNum
                }
            }
        }
    }
    
    if (-not $found) {
        if ($lineWithSource -eq "") {
            Write-Host "  ✗ source タグが見つかりません" -ForegroundColor Red
            $issues += [PSCustomObject]@{
                File = $fileName
                Issue = "source タグが見つかりません"
                Line = "N/A"
            }
        }
    }
    else {
        $validFiles++
    }
    
    Write-Host ""
}

# 検証結果のサマリー
Write-Host "========== 検証結果 ==========" -ForegroundColor Magenta
Write-Host "$validFiles / $($htmlFiles.Count) ファイルが正しく設定されています" -ForegroundColor $(if ($validFiles -eq $htmlFiles.Count) { "Green" } else { "Yellow" })

if ($issues.Count -gt 0) {
    Write-Host "`n以下の問題が見つかりました:" -ForegroundColor Red
    $issues | Format-Table -AutoSize
    
    Write-Host "`n修正が必要なファイル:" -ForegroundColor Yellow
    $issues | Select-Object -ExpandProperty File -Unique | ForEach-Object {
        Write-Host "- $_" -ForegroundColor Yellow
    }
}
else {
    Write-Host "`n全てのHTMLファイルが正しく設定されています。移行作業を続行できます。" -ForegroundColor Green
}
