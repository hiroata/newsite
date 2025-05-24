# PowerShell スクリプト - HTMLファイルの縮小化（bash コマンドを使用）
Write-Host "HTMLファイルの縮小化処理を開始します..."

# ワークスペースのパス
$workspacePath = "c:\Users\atara\Desktop\newsite-voice"

# 作業ディレクトリを設定
Set-Location -Path $workspacePath

# Bashコマンドのシミュレーション
Write-Host "以下のBash風コマンドをPowerShellで実行します："
Write-Host "for file in \$(find . -name '*.html' -type f); do ..."

# すべてのHTMLファイルを取得
$htmlFiles = Get-ChildItem -Path $workspacePath -Filter "*.html" -Recurse

# 各ファイルに対して処理を実行
foreach ($file in $htmlFiles) {
    $relativePath = $file.FullName.Substring($workspacePath.Length + 1)
    Write-Host "処理: $relativePath"
    
    # ここで実際の縮小化処理を行う
    # この例では単にファイルのサイズを表示
    $fileSize = (Get-Item -Path $file.FullName).Length / 1KB
    Write-Host "  ファイルサイズ: $($fileSize.ToString("0.00")) KB"
}

Write-Host "`n処理が完了しました。"
Write-Host "`n実際の縮小化処理を行う場合は、適切なHTML縮小化ツールをインストールして使用してください。"
Write-Host "例えば npm の html-minifier-terser などが利用可能です。"
Write-Host "`nインストールコマンド例："
Write-Host "npm install -g html-minifier-terser"
Write-Host "`n使用例："
Write-Host "Get-ChildItem -Path '$workspacePath' -Filter '*.html' -Recurse | ForEach-Object { html-minifier-terser -o `$_.FullName `$_.FullName }"
