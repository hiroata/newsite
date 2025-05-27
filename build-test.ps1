# HTML静的サイトビルドテスト
# エラーチェックとリンク検証

Write-Host "🔍 HTML静的サイトビルドテストを開始..." -ForegroundColor Green

# HTMLファイルの基本構造チェック
function Test-HTMLFile {
    param($filePath)
    
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $errors = @()
        
        # 基本的なHTML構造チェック
        if ($content -notmatch '<!DOCTYPE html>') {
            $errors += "DOCTYPE宣言がありません"
        }
        
        if ($content -notmatch '<html[^>]*>') {
            $errors += "HTMLタグがありません"
        }
        
        if ($content -notmatch '<head[^>]*>') {
            $errors += "HEADタグがありません"
        }
        
        if ($content -notmatch '<body[^>]*>') {
            $errors += "BODYタグがありません"
        }
        
        # メタタグチェック
        if ($content -notmatch '<meta[^>]*charset[^>]*>') {
            $errors += "文字エンコーディングが設定されていません"
        }
        
        if ($content -notmatch '<title[^>]*>') {
            $errors += "TITLEタグがありません"
        }
          # リソースパスチェック
        $cssMatches = [regex]::Matches($content, 'href=["'']([^"'']*\.css)["'']')
        foreach ($match in $cssMatches) {
            $cssPath = $match.Groups[1].Value
            if ($cssPath -notmatch '^https?://') {
                $fullPath = Join-Path (Split-Path $filePath) $cssPath
                if (-not (Test-Path $fullPath)) {
                    $errors += "CSSファイルが見つかりません: $cssPath"
                }
            }
        }
        
        $jsMatches = [regex]::Matches($content, 'src=["'']([^"'']*\.js)["'']')
        foreach ($match in $jsMatches) {
            $jsPath = $match.Groups[1].Value
            if ($jsPath -notmatch '^https?://') {
                $fullPath = Join-Path (Split-Path $filePath) $jsPath
                if (-not (Test-Path $fullPath)) {
                    $errors += "JSファイルが見つかりません: $jsPath"
                }
            }
        }
        
        return @{
            File = $filePath
            Errors = $errors
            Valid = $errors.Count -eq 0
        }
    }
    catch {
        return @{
            File = $filePath
            Errors = @("ファイル読み込みエラー: $_")
            Valid = $false
        }
    }
}

# 全HTMLファイルをテスト
$htmlFiles = Get-ChildItem -Path "*.html" -Recurse
$results = @()

Write-Host "📄 HTMLファイルをチェック中..." -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    $result = Test-HTMLFile $file.FullName
    $results += $result
    
    if ($result.Valid) {
        Write-Host "✅ $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($file.Name)" -ForegroundColor Red
        foreach ($error in $result.Errors) {
            Write-Host "   - $error" -ForegroundColor Orange
        }
    }
}

# サマリー表示
$validFiles = ($results | Where-Object { $_.Valid }).Count
$totalFiles = $results.Count

Write-Host "`n📊 ビルドテスト結果:" -ForegroundColor Cyan
Write-Host "✅ 有効なファイル: $validFiles/$totalFiles" -ForegroundColor Green

if ($validFiles -eq $totalFiles) {
    Write-Host "🎉 全てのHTMLファイルが正常です！" -ForegroundColor Green
    Write-Host "🚀 ロリポップサーバーへのアップロード準備完了" -ForegroundColor Green
} else {
    Write-Host "⚠️ エラーがあるファイルがあります。修正してください。" -ForegroundColor Orange
}

# ファイルサイズレポート
Write-Host "`n📈 ファイルサイズレポート:" -ForegroundColor Cyan
$totalSize = 0
Get-ChildItem -Recurse -File | ForEach-Object {
    $totalSize += $_.Length
}
Write-Host "総ファイルサイズ: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Yellow
