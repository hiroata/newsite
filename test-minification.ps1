# PowerShell スクリプト - HTMLファイルの縮小化テスト
Write-Host "HTMLファイルの縮小化テストを開始します..."

# テスト対象のファイル
$filePath = "c:\Users\atara\Desktop\newsite-voice\free-consultation.html"

# ファイルが存在するか確認
if (-not (Test-Path $filePath)) {
    Write-Host "エラー: ファイルが見つかりません: $filePath"
    exit 1
}

# ファイルの内容を読み込む
$content = Get-Content -Path $filePath -Raw

# 簡易的な縮小化処理をシミュレート
Write-Host "縮小化処理をシミュレートしています..."
# この部分は実際の縮小化処理には影響しませんが、SVGのURLが正しくエスケープされているか確認するためのものです

# 特にURLのエスケープに関する部分をチェック
if ($content -match "background-image: url\('data:image/svg\+xml,%3Csvg") {
    Write-Host "成功: SVGのURLが正しくエスケープされています。"
} else {
    Write-Host "警告: SVGのURLが見つからないか、正しくエスケープされていない可能性があります。"
}

Write-Host "テストが完了しました。"
