# ブログ最適化後のファイル削除スクリプト
# 実行前に必ずバックアップを作成し、テスト環境で確認してください

param(
    [switch]$DryRun = $false,    # テスト実行（実際には削除しない）
    [switch]$Force = $false      # 確認を求めない
)

# カラー出力の設定
function Write-ColorText {
    param($Text, $Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

function Write-Success { param($Text) Write-ColorText $Text "Green" }
function Write-Warning { param($Text) Write-ColorText $Text "Yellow" }
function Write-Error { param($Text) Write-ColorText $Text "Red" }
function Write-Info { param($Text) Write-ColorText $Text "Cyan" }

# スクリプト開始
Write-Info "==================================================="
Write-Info "ブログ最適化後のファイル削除スクリプト"
Write-Info "==================================================="

if ($DryRun) {
    Write-Warning "🧪 DRY RUN モード: 実際のファイル操作は行いません"
}

# 作業ディレクトリの確認
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$cssPath = Join-Path $scriptPath "css"
$jsPath = Join-Path $scriptPath "js"
$blogPath = Join-Path $scriptPath "blog"

Write-Info "作業ディレクトリ: $scriptPath"
Write-Info "CSS ディレクトリ: $cssPath"
Write-Info "JS ディレクトリ: $jsPath"
Write-Info "Blog ディレクトリ: $blogPath"

# 必要なディレクトリの存在確認
if (-not (Test-Path $cssPath) -or -not (Test-Path $jsPath) -or -not (Test-Path $blogPath)) {
    Write-Error "❌ 必要なディレクトリが見つかりません。正しいディレクトリで実行してください。"
    exit 1
}

# 削除対象ファイルの定義
$filesToDelete = @{
    "CSS" = @(
        @{ Path = "css/blog-unified.css"; Description = "ブログ統合CSS（完全に統合済み）" }
        @{ Path = "css/layout-updates.css"; Description = "レイアウト更新CSS（完全に統合済み）" }
    )
    "JavaScript" = @(
        @{ Path = "js/layout-debug.js"; Description = "レイアウトデバッグJS（ブログページ専用）" }
    )
}

# バックアップ対象ファイルの定義（部分削除のため保持）
$filesToBackup = @(
    @{ Path = "css/style.css"; Description = "メインスタイル（他のページでも使用中）" }
    @{ Path = "js/script.js"; Description = "メインスクリプト（他のページでも使用中）" }
)

# バックアップディレクトリの作成
$backupDir = Join-Path $scriptPath "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (-not $DryRun) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Success "✅ バックアップディレクトリ作成: $backupDir"
}

# フェーズ1: バックアップの作成
Write-Info "`n📦 フェーズ1: バックアップの作成"
Write-Info "-------------------------------------------"

# 削除対象ファイルのバックアップ
foreach ($category in $filesToDelete.Keys) {
    Write-Info "`n[$category] ファイルのバックアップ:"
    foreach ($file in $filesToDelete[$category]) {
        $fullPath = Join-Path $scriptPath $file.Path
        if (Test-Path $fullPath) {
            $backupPath = Join-Path $backupDir (Split-Path -Leaf $file.Path)
            Write-Info "  📋 $($file.Path) → $backupPath"
            if (-not $DryRun) {
                Copy-Item $fullPath $backupPath
            }
        } else {
            Write-Warning "  ⚠️  ファイルが見つかりません: $($file.Path)"
        }
    }
}

# 保持ファイルのバックアップ
Write-Info "`n[保持ファイル] のバックアップ:"
foreach ($file in $filesToBackup) {
    $fullPath = Join-Path $scriptPath $file.Path
    if (Test-Path $fullPath) {
        $backupPath = Join-Path $backupDir (Split-Path -Leaf $file.Path)
        Write-Info "  📋 $($file.Path) → $backupPath"
        if (-not $DryRun) {
            Copy-Item $fullPath $backupPath
        }
    }
}

# フェーズ2: ファイルの削除
Write-Info "`n🗑️  フェーズ2: ファイルの削除"
Write-Info "-------------------------------------------"

$totalDeleted = 0
foreach ($category in $filesToDelete.Keys) {
    Write-Info "`n[$category] ファイルの削除:"
    foreach ($file in $filesToDelete[$category]) {
        $fullPath = Join-Path $scriptPath $file.Path
        if (Test-Path $fullPath) {
            Write-Info "  🗑️  削除対象: $($file.Path)"
            Write-Info "      説明: $($file.Description)"
            
            if (-not $Force -and -not $DryRun) {
                $confirm = Read-Host "      削除しますか？ (y/N)"
                if ($confirm -ne "y" -and $confirm -ne "Y") {
                    Write-Warning "      ⏭️  スキップしました"
                    continue
                }
            }
            
            if (-not $DryRun) {
                Remove-Item $fullPath -Force
                Write-Success "      ✅ 削除完了"
            } else {
                Write-Info "      🧪 [DRY RUN] 削除予定"
            }
            $totalDeleted++
        } else {
            Write-Warning "  ⚠️  ファイルが見つかりません: $($file.Path)"
        }
    }
}

# フェーズ3: HTML参照の更新
Write-Info "`n🔄 フェーズ3: HTML参照の更新"
Write-Info "-------------------------------------------"

# ブログHTMLファイルの取得
$blogFiles = Get-ChildItem -Path $blogPath -Filter "*.html" | Where-Object { $_.Name -ne "optimized-blog.html" }
Write-Info "対象ブログファイル数: $($blogFiles.Count)"

$updatedFiles = 0
foreach ($htmlFile in $blogFiles) {
    $filePath = $htmlFile.FullName
    $content = Get-Content $filePath -Raw -Encoding UTF8
    $originalContent = $content
    $updated = $false
    
    # 削除したCSSファイルへの参照を除去
    $cssReferences = @(
        'href="../css/blog-unified.css"',
        'href="../css/layout-updates.css"'
    )
    
    foreach ($ref in $cssReferences) {
        if ($content -match $ref) {
            $pattern = '<link[^>]*' + [regex]::Escape($ref) + '[^>]*>'
            $content = $content -replace $pattern, ''
            $updated = $true
            Write-Info "  📝 CSS参照を削除: $ref"
        }
    }
    
    # 削除したJSファイルへの参照を除去
    $jsReferences = @(
        'src="../js/layout-debug.js"'
    )
    
    foreach ($ref in $jsReferences) {
        if ($content -match $ref) {
            $pattern = '<script[^>]*' + [regex]::Escape($ref) + '[^>]*></script>'
            $content = $content -replace $pattern, ''
            $updated = $true
            Write-Info "  📝 JS参照を削除: $ref"
        }
    }
    
    # 最適化ファイルへの参照を追加（まだない場合）
    if ($content -notmatch 'blog-optimized.css') {
        $headPattern = '(?i)(<head[^>]*>)'
        $newCssLink = '<link rel="stylesheet" href="../css/blog-optimized.css">'
        $content = $content -replace $headPattern, "`$1`n    $newCssLink"
        $updated = $true
        Write-Info "  ➕ 最適化CSS参照を追加"
    }
    
    if ($content -notmatch 'blog-optimized.js') {
        $bodyEndPattern = '(?i)(</body>)'
        $newJsScript = '<script src="../js/blog-optimized.js" defer></script>'
        $content = $content -replace $bodyEndPattern, "    $newJsScript`n`$1"
        $updated = $true
        Write-Info "  ➕ 最適化JS参照を追加"
    }
    
    # ファイルの更新
    if ($updated) {
        Write-Info "  🔄 更新中: $($htmlFile.Name)"
        if (-not $DryRun) {
            $content | Out-File $filePath -Encoding UTF8 -NoNewline
            Write-Success "  ✅ 更新完了"
        } else {
            Write-Info "  🧪 [DRY RUN] 更新予定"
        }
        $updatedFiles++
    }
}

# 結果サマリー
Write-Info "`n📊 処理結果サマリー"
Write-Info "==================================================="
Write-Success "✅ 削除されたファイル数: $totalDeleted"
Write-Success "✅ 更新されたHTMLファイル数: $updatedFiles"

if (-not $DryRun) {
    Write-Success "✅ バックアップ作成場所: $backupDir"
    Write-Info "`n📋 次のステップ:"
    Write-Info "1. 全ブログページの表示確認を行ってください"
    Write-Info "2. レスポンシブデザインの動作確認を行ってください"
    Write-Info "3. JavaScript機能の動作確認を行ってください"
    Write-Info "4. 問題がある場合は、バックアップから復旧してください"
} else {
    Write-Warning "`n🧪 これはDRY RUNでした。実際に実行するには -DryRun パラメータを除いて再実行してください。"
}

# 復旧手順の表示
Write-Info "`n🆘 緊急時の復旧手順:"
Write-Info "# バックアップからの復旧"
Write-Info "Copy-Item '$backupDir\*' '$scriptPath\css\' -Force"
Write-Info "Copy-Item '$backupDir\*' '$scriptPath\js\' -Force"

Write-Info "`n==================================================="
Write-Success "✅ スクリプト実行完了"
Write-Info "==================================================="
