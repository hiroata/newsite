# Git追跡からMP4ファイルを削除するスクリプト
# ローカルファイルは保持したまま、Gitリポジトリからのみ削除します

# MP4ファイルのパスを取得
$mp4Files = git ls-files "*.mp4"

if ($mp4Files) {
    Write-Host "以下のMP4ファイルがGitで追跡されています：" -ForegroundColor Cyan
    $mp4Files | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
    
    Write-Host "`nこれらのファイルをGitリポジトリから削除しますが、ローカルファイルは保持します。" -ForegroundColor Cyan
    Write-Host "続行しますか？ (y/n)" -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq "y") {
        # ファイルをGitの追跡から削除（ローカルファイルは保持）
        $mp4Files | ForEach-Object {
            Write-Host "削除中: $_" -ForegroundColor Cyan
            git rm --cached $_
        }
        
        # コミット
        git status
        Write-Host "`n変更をコミットするには以下のコマンドを実行してください：" -ForegroundColor Green
        Write-Host "git commit -m 'MP4ファイルをGitリポジトリから削除（ローカルファイルは保持）'" -ForegroundColor Yellow
    }
    else {
        Write-Host "操作をキャンセルしました。" -ForegroundColor Red
    }
}
else {
    Write-Host "Gitで追跡されているMP4ファイルはありません。" -ForegroundColor Green
}

# 残りのGitキャッシュをクリーンアップする方法
Write-Host "`n=== 追加情報 ===" -ForegroundColor Magenta
Write-Host "Git履歴からMP4ファイルを完全に削除するには、BFG Repo-Cleanerの使用を検討してください：" -ForegroundColor Cyan
Write-Host "https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Cyan
Write-Host "使用例：" -ForegroundColor Yellow
Write-Host "java -jar bfg.jar --delete-files \"*.mp4\" path/to/your/repo.git" -ForegroundColor Yellow
