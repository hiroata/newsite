# ブログHTMLファイルのCSS参照を一括更新するスクリプト
param(
    [switch]$DryRun = $false
)

function Write-ColorText {
    param($Text, $Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

function Write-Success { param($Text) Write-ColorText $Text "Green" }
function Write-Warning { param($Text) Write-ColorText $Text "Yellow" }
function Write-Info { param($Text) Write-ColorText $Text "Cyan" }

Write-Info "=== ブログHTML CSS参照更新スクリプト ==="

# 対象ディレクトリ
$blogDir = "c:\Users\atara\Desktop\newsite\blog"
$updatedCount = 0

# 除外ファイル
$excludeFiles = @("optimized-blog.html")

# ブログHTMLファイルを取得
$blogFiles = Get-ChildItem -Path $blogDir -Filter "*.html" | Where-Object { 
    $excludeFiles -notcontains $_.Name 
}

Write-Info "対象ファイル数: $($blogFiles.Count)"

foreach ($file in $blogFiles) {
    $filePath = $file.FullName
    $fileName = $file.Name
    
    Write-Info "`n処理中: $fileName"
    
    # ファイル内容を読み込み
    $content = Get-Content $filePath -Raw -Encoding UTF8
    $originalContent = $content
    $hasChanges = $false
    
    # 1. 削除されたCSSファイルへの参照を除去
    $cssToRemove = @(
        'href="../css/blog-unified.css"',
        'href="../css/layout-updates.css"'
    )
    
    foreach ($cssRef in $cssToRemove) {
        $pattern = '<link[^>]*' + [regex]::Escape($cssRef) + '[^>]*>'
        if ($content -match $pattern) {
            $content = $content -replace $pattern, ''
            Write-Warning "  - 削除: $cssRef"
            $hasChanges = $true
        }
    }
    
    # 2. 重複するstyle.css参照があれば1つに統一
    $stylePattern = '<link[^>]*href="../css/style\.css"[^>]*>'
    $styleMatches = [regex]::Matches($content, $stylePattern)
    if ($styleMatches.Count -gt 1) {
        # 最初の参照以外を削除
        for ($i = $styleMatches.Count - 1; $i -gt 0; $i--) {
            $content = $content.Remove($styleMatches[$i].Index, $styleMatches[$i].Length)
        }
        Write-Warning "  - 重複するstyle.css参照を統一"
        $hasChanges = $true
    }
    
    # 3. blog-optimized.css の参照を追加（まだない場合）
    if ($content -notmatch 'blog-optimized\.css') {
        # style.css の直後に追加
        $styleInsertPattern = '(<link[^>]*href="../css/style\.css"[^>]*>)'
        if ($content -match $styleInsertPattern) {
            $replacement = "$1`n    <link rel=`"stylesheet`" href=`"../css/blog-optimized.css`">"
            $content = $content -replace $styleInsertPattern, $replacement
            Write-Success "  + 追加: blog-optimized.css"
            $hasChanges = $true
        }
    }
    
    # 4. layout-debug.js の参照を除去
    $debugJsPattern = '<script[^>]*src="../js/layout-debug\.js"[^>]*></script>'
    if ($content -match $debugJsPattern) {
        $content = $content -replace $debugJsPattern, ''
        Write-Warning "  - 削除: layout-debug.js"
        $hasChanges = $true
    }
    
    # 5. blog-optimized.js の参照を追加（まだない場合）
    if ($content -notmatch 'blog-optimized\.js') {
        # </body> の直前に追加
        $bodyEndPattern = '(\s*</body>)'
        if ($content -match $bodyEndPattern) {
            $replacement = "    <script src=`"../js/blog-optimized.js`" defer></script>`n$1"
            $content = $content -replace $bodyEndPattern, $replacement
            Write-Success "  + 追加: blog-optimized.js"
            $hasChanges = $true
        }
    }
    
    # 6. 重複する空行やスペースの整理
    $content = $content -replace '(\r?\n\s*){3,}', "`n`n"
    
    # ファイルを更新
    if ($hasChanges) {
        if (-not $DryRun) {
            $content | Out-File $filePath -Encoding UTF8 -NoNewline
            Write-Success "  ✅ 更新完了"
        } else {
            Write-Info "  🧪 [DRY RUN] 更新予定"
        }
        $updatedCount++
    } else {
        Write-Info "  ⏭️  変更なし"
    }
}

Write-Info "`n=== 処理完了 ==="
Write-Success "更新されたファイル数: $updatedCount / $($blogFiles.Count)"

if ($DryRun) {
    Write-Warning "`nこれはDRY RUNでした。実際に実行するには -DryRun パラメータを除いて再実行してください。"
}
