# CSS参照修正スクリプト
# 2025-05-26

Write-Host "=== CSS参照を修正中 ===" -ForegroundColor Green

# ブログディレクトリ内の全HTMLファイルを取得
$blogFiles = Get-ChildItem -Path "c:\Users\atara\Desktop\newsite\blog\*.html"

foreach ($file in $blogFiles) {
    Write-Host "修正中: $($file.Name)" -ForegroundColor Yellow
    
    # ファイル内容を読み込み
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
      # 重複や不正な文字を修正
    $content = $content -replace '`n', "`n"
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-unified\.css">.*?<link rel="stylesheet" href="../css/blog-unified\.css">', '<link rel="stylesheet" href="../css/blog-unified.css">'
    $content = $content -replace '\s+<link rel="stylesheet" href="../css/layout-updates\.css">', "`n    <link rel=`"stylesheet`" href=`"../css/layout-updates.css`">"
    
    # 空行を整理
    $content = $content -replace '\n\s*\n\s*\n', "`n`n"
    
    # 更新されたファイルを保存
    $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    
    Write-Host "完了: $($file.Name)" -ForegroundColor Green
}

Write-Host "`n=== CSS参照修正が完了しました ===" -ForegroundColor Green
