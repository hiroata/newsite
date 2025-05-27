# ブログ記事のレイアウト修正スクリプト
# 1. 本文の横幅を広くする（8:2レイアウト）
# 2. 右サイドバーが無い記事に追加

Write-Host "ブログ記事のレイアウト修正を開始..." -ForegroundColor Green

$blogDir = "c:\Users\atara\Desktop\newsite\blog"
$htmlFiles = Get-ChildItem -Path $blogDir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

$fixedFiles = @()
$errorFiles = @()

foreach ($file in $htmlFiles) {
    try {
        Write-Host "処理中: $($file.Name)" -ForegroundColor Yellow
        
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # 1. article-containerにtwo-columnクラスがない場合は追加しない（既存の8:2レイアウトを使用）
        # 2. 右サイドバーが存在するかチェック
        if ($content -notmatch 'article-right-sidebar') {
            Write-Host "  → 右サイドバーが見つかりません。追加します..." -ForegroundColor Red
            
            # 記事の終了タグの前に右サイドバーを追加
            $sidebarHtml = @'
            
            <!-- 右サイドバー -->
            <div class="article-right-sidebar">
                <!-- プロフィール -->
                <div class="sidebar-section sidebar-author-profile">
                    <img src="../assets/images/profile-sidebar.webp" alt="YUKIのプロフィール写真" class="author-image" loading="lazy">
                    <h3 class="author-name">YUKI</h3>
                    <p class="author-title">マーケティングコンサルタント</p>
                    <div class="author-sns">
                        <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg></a>
                        <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"></path></svg></a>
                    </div>
                    <p class="author-bio">
                        オートマーケティング、セールスファネル構築、集客戦略策定を専門とするコンサルタント。自動化マーケティングによる売上改善事例300件以上。
                    </p>
                    <a href="#" class="author-link">プロフィール詳細</a>
                    <a href="https://utage-system.com/p/EcESO02xLLoK" class="cta-button">無料相談をする</a>
                </div>

                <!-- 目次（基本的なもの） -->
                <div class="sidebar-section sidebar-toc">
                    <h3 class="sidebar-title">目次</h3>
                    <ul class="toc-list">
                        <li><a href="#section1">記事の内容1<span class="toc-dot"></span></a></li>
                        <li><a href="#section2">記事の内容2<span class="toc-dot"></span></a></li>
                        <li><a href="#section3">記事の内容3<span class="toc-dot"></span></a></li>
                    </ul>
                </div>
            </div>
'@
            
            # article-mainの終了divの後に挿入
            $content = $content -replace '(\s*</div>\s*</div>\s*</div>\s*</main>)', "$sidebarHtml`$1"
            
            # もしくは、より具体的なパターンで挿入
            if ($content -match $originalContent) {
                # article-mainの終了divを探して、その後にサイドバーを挿入
                $content = $content -replace '(\s*</div>\s*</div>\s*<div id="footer-placeholder">)', "$sidebarHtml`$1"
            }
        } else {
            Write-Host "  → 右サイドバーは既に存在します" -ForegroundColor Green
        }
        
        # ファイルが変更された場合のみ保存
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            $fixedFiles += $file.Name
            Write-Host "  → 修正完了" -ForegroundColor Green
        } else {
            Write-Host "  → 変更なし" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  → エラー: $($_.Exception.Message)" -ForegroundColor Red
        $errorFiles += $file.Name
    }
}

Write-Host "`n=== 修正結果 ===" -ForegroundColor Cyan
Write-Host "処理したファイル数: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "修正したファイル数: $($fixedFiles.Count)" -ForegroundColor Green
Write-Host "エラーファイル数: $($errorFiles.Count)" -ForegroundColor Red

if ($fixedFiles.Count -gt 0) {
    Write-Host "`n修正したファイル:" -ForegroundColor Green
    $fixedFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
}

if ($errorFiles.Count -gt 0) {
    Write-Host "`nエラーファイル:" -ForegroundColor Red
    $errorFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
}

Write-Host "`n修正完了！" -ForegroundColor Green
