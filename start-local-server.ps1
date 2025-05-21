# 簡易ローカルサーバー起動スクリプト
# このスクリプトは、ウェブサイトのローカルでのプレビュー用に
# PowerShellでHTTPサーバーを立ち上げます

Write-Host "ローカルサーバーを起動中..." -ForegroundColor Cyan
Write-Host "サーバーを停止するには、Ctrl+C を押してください。" -ForegroundColor Yellow

# Pythonがインストールされている場合
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "Pythonを使用してサーバーを起動します。" -ForegroundColor Green
    Write-Host "http://localhost:8000 でアクセスできます。" -ForegroundColor Green
    python -m http.server 8000
}
# Nodeがインストールされている場合
elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "http-serverを使用してサーバーを起動します。" -ForegroundColor Green
    Write-Host "http://localhost:8080 でアクセスできます。" -ForegroundColor Green
    npx http-server -p 8080
}
else {
    Write-Host "サーバーを起動するには、Python または Node.js がインストールされている必要があります。" -ForegroundColor Red
    Write-Host "どちらかをインストールしてから再試行してください。" -ForegroundColor Red
}
