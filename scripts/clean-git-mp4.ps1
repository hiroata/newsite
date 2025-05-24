# Git リポジトリから MP4 ファイルを削除するスクリプト
# このスクリプトは、MP4ファイルをGitリポジトリから削除しますが、ローカルのファイルは保持します

# スクリプトの実行前に注意喚起
Write-Host "このスクリプトはMP4ファイルをGitリポジトリから削除しますが、ローカルファイルは保持されます。" -ForegroundColor Cyan
Write-Host "すでにすべての動画ファイルがGoogle Cloud Storageにアップロードされていることを確認してください。" -ForegroundColor Yellow
Write-Host "HTMLファイル内のビデオリンクが正しくCloudStorageのURLに更新されているか確認してください。" -ForegroundColor Yellow
Write-Host "続行しますか？ (y/n)" -ForegroundColor Cyan

$confirmation = Read-Host

if ($confirmation -ne "y") {
    Write-Host "スクリプトを中止します。" -ForegroundColor Red
    exit
}

# MP4ファイルをリポジトリから削除
Write-Host "`nMP4ファイルをGitリポジトリから削除します..." -ForegroundColor Cyan
git rm --cached $(git ls-files "*.mp4")

# 状態を確認
$status = git status
Write-Host "`nGit Status:" -ForegroundColor Green
Write-Host $status -ForegroundColor Gray

# コミットするかどうか確認
Write-Host "`n変更をコミットしますか？ (y/n)" -ForegroundColor Cyan
$commitConfirmation = Read-Host

if ($commitConfirmation -eq "y") {
    Write-Host "コミットメッセージを入力してください:" -ForegroundColor Cyan
    $commitMessage = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "MP4ファイルをGitリポジトリから削除し、Google Cloud Storageへ移行"
    }
    
    git commit -m $commitMessage
    Write-Host "`n変更をコミットしました。" -ForegroundColor Green
    Write-Host "これでMP4ファイルはGitリポジトリから削除されましたが、ローカルには残っています。" -ForegroundColor Green
    Write-Host "必要に応じて 'git push' を実行してリモートリポジトリに変更を反映させてください。" -ForegroundColor Yellow
} else {
    Write-Host "`n変更はコミットされていません。手動でコミットしてください。" -ForegroundColor Yellow
}

# 今後の手順をガイド
Write-Host "`n次のステップ:" -ForegroundColor Cyan
Write-Host "1. 'git push' を実行して変更をリモートリポジトリに反映させる" -ForegroundColor Gray
Write-Host "2. 他の開発者に変更内容を通知する" -ForegroundColor Gray
Write-Host "3. クローンを作成するときは、動画ファイルを含まないことを確認する" -ForegroundColor Gray
