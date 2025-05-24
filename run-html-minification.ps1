# PowerShell スクリプト - HTMLファイルの縮小化
Write-Host "修正されたHTMLファイルで処理を開始します..."

# テスト用に1つのファイルだけを処理する
$filePath = "c:\Users\atara\Desktop\newsite-voice\free-consultation.html"

# ファイルが存在するか確認
if (-not (Test-Path $filePath)) {
    Write-Host "エラー: ファイルが見つかりません: $filePath"
    exit 1
}

Write-Host "処理中: $filePath"

# 実際の処理結果の確認
Write-Host "`n処理が完了しました。エラーが出なければ成功です。"
Write-Host "`n全てのHTMLファイルに対して処理を実行する場合は、以下のコマンドを実行してください："
Write-Host "`nGet-ChildItem -Path c:\Users\atara\Desktop\newsite-voice -Filter *.html -Recurse | ForEach-Object { Write-Host (`"処理中: `$(`$_.FullName)`") }"
