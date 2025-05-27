# CSS統合とレイアウト更新スクリプト
# 2025-05-26

Write-Host "=== CSS統合とレイアウト更新を開始 ===" -ForegroundColor Green

# ブログディレクトリ内の全HTMLファイルを取得
$blogFiles = Get-ChildItem -Path "c:\Users\atara\Desktop\newsite\blog\*.html"

foreach ($file in $blogFiles) {
    Write-Host "処理中: $($file.Name)" -ForegroundColor Yellow
    
    # ファイル内容を読み込み
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 古いCSS参照を削除
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-optimized\.css">', ''
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-fixes-new\.css">', ''
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-fixes-patch\.css">', ''
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-fixes-critical\.css">', ''
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-common\.css">', ''
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-fixes\.css">', ''
    $content = $content -replace '<link rel="stylesheet" href="../css/blog-card\.css">', ''
    
    # 新しい統合CSSを追加（style.cssの後に）
    $content = $content -replace '(<link rel="stylesheet" href="../css/style\.css">)', '$1`n    <link rel="stylesheet" href="../css/blog-unified.css">'
      # 左サイドバーを削除（3カラム→2カラム）
    $content = $content -replace '(?s)<div class="article-left-sidebar">.*?</div>', ''
    
    # グリッドレイアウトクラスを更新
    $content = $content -replace 'grid-template-columns:\s*2fr 6fr 2fr', 'grid-template-columns: 7fr 3fr'
    $content = $content -replace 'class="article-container"', 'class="article-container two-column"'
    
    # 更新されたファイルを保存
    $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    
    Write-Host "完了: $($file.Name)" -ForegroundColor Green
}

Write-Host "`n=== CSS統合とレイアウト更新が完了しました ===" -ForegroundColor Green
Write-Host "統合CSSファイル: blog-unified.css" -ForegroundColor Cyan
Write-Host "レイアウト: 2カラム (7:3)" -ForegroundColor Cyan
