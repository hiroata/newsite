# style.css からブログ重複コードを削除するスクリプト
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

Write-Info "=== style.css 重複コード削除スクリプト ==="

$styleFile = "c:\Users\atara\Desktop\newsite\css\style.css"

# バックアップを作成
if (-not $DryRun) {
    $backupFile = "c:\Users\atara\Desktop\newsite\css\style.css.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $styleFile $backupFile
    Write-Info "バックアップを作成: $(Split-Path $backupFile -Leaf)"
}

# ファイル内容を読み込み
$content = Get-Content $styleFile -Raw -Encoding UTF8
$originalLength = $content.Length

Write-Info "元ファイルサイズ: $($originalLength) 文字"

# 削除対象のスタイル（blog-optimized.css に統合済み）
$deletePatterns = @(
    # 目次関連のスタイル（blog-optimized.css に統合済み）
    '/\* 目次のアクティブ項目のスタイルを強化 \*/[\s\S]*?\.toc-list a:hover \{[\s\S]*?\}',
    
    # 一部のツール系共通スタイル（重複）
    '\.share-social-buttons \{[\s\S]*?\}[\s\S]*?\.share-line \{ background: #06C755; \}',
    
    # 重複するユーティリティクラス
    '\.preset-list \{[\s\S]*?\}[\s\S]*?\.preset-link:hover \{[\s\S]*?\}'
)

$deletedCount = 0

foreach ($pattern in $deletePatterns) {
    if ($content -match $pattern) {
        $match = [regex]::Match($content, $pattern)
        $deletedContent = $match.Value
        $content = $content -replace $pattern, ''
        
        $previewText = $deletedContent.Substring(0, [Math]::Min(50, $deletedContent.Length))
        $lineCount = ($deletedContent -split "`n").Count
        Write-Warning "削除: ${previewText}... ($lineCount 行)"
        $deletedCount++
    }
}

# 重複する空行を整理
$content = $content -replace '(\r?\n\s*){3,}', "`n`n"

# CSS変数の重複チェック（blog-optimized.css に統合済みのもの）
$duplicateVars = @(
    '--toc-active-color: var\(--dark-blue\);'
)

foreach ($varPattern in $duplicateVars) {
    if ($content -match $varPattern) {
        $content = $content -replace $varPattern, ''
        Write-Warning "削除: 重複CSS変数 $varPattern"
        $deletedCount++
    }
}

$newLength = $content.Length
$savedBytes = $originalLength - $newLength
$savedPercentage = [math]::Round(($savedBytes / $originalLength) * 100, 2)

Write-Info "`n=== 削除結果 ==="
Write-Success "削除されたパターン数: $deletedCount"
Write-Success "削除されたバイト数: $savedBytes バイト ($savedPercentage%)"
Write-Info "新ファイルサイズ: $newLength 文字"

if ($deletedCount -gt 0) {
    if (-not $DryRun) {
        $content | Out-File $styleFile -Encoding UTF8 -NoNewline
        Write-Success "✅ ファイルを更新しました"
    } else {
        Write-Info "🧪 [DRY RUN] 削除予定のコードが確認されました"
    }
} else {
    Write-Info "⏭️  削除対象のコードは見つかりませんでした"
}

if ($DryRun) {
    Write-Warning "`nこれはDRY RUNでした。実際に実行するには -DryRun パラメータを除いて再実行してください。"
}
