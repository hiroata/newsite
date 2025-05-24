# ローカルの動画ファイルを整理するスクリプト
# Google Cloud Storageへの移行が完了した後に実行してください

# 動画ファイルのディレクトリ
$videosDir = "C:\Users\atara\Desktop\newsite-voice\assets\videos"

# バックアップディレクトリを作成
$backupDir = "C:\Users\atara\Desktop\newsite-voice\assets\videos_backup_$(Get-Date -Format 'yyyyMMdd')"

# バックアップディレクトリが存在するか確認
if (-not (Test-Path -Path $backupDir)) {
    New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
    Write-Host "バックアップディレクトリを作成しました: $backupDir" -ForegroundColor Green
}

# MP4ファイルを検索
$mp4Files = Get-ChildItem -Path $videosDir -Filter "*.mp4"
$fileCount = $mp4Files.Count

if ($fileCount -eq 0) {
    Write-Host "ディレクトリ '$videosDir' にMP4ファイルはありません。" -ForegroundColor Yellow
    exit
}

Write-Host "$fileCount 個のMP4ファイルが見つかりました。" -ForegroundColor Cyan
Write-Host "これらのファイルを '$backupDir' に移動し、元のディレクトリから削除します。" -ForegroundColor Cyan
Write-Host "Google Cloud Storage へのアップロードが完了していることを確認してください。" -ForegroundColor Yellow
Write-Host "続行しますか？ (y/n)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -eq "y") {
    # 各ファイルをバックアップディレクトリに移動
    foreach ($file in $mp4Files) {
        $destPath = Join-Path -Path $backupDir -ChildPath $file.Name
        
        Write-Host "移動中: $($file.FullName) -> $destPath" -ForegroundColor Cyan
        Move-Item -Path $file.FullName -Destination $destPath -Force
        
        if (Test-Path -Path $destPath) {
            Write-Host "  ✓ 移動成功" -ForegroundColor Green
        }
        else {
            Write-Host "  ✗ 移動失敗" -ForegroundColor Red
        }
    }
    
    # 残っているMP4ファイルを確認
    $remainingFiles = Get-ChildItem -Path $videosDir -Filter "*.mp4"
    
    if ($remainingFiles.Count -eq 0) {
        Write-Host "`n全てのMP4ファイルが正常に移動されました。" -ForegroundColor Green
    }
    else {
        Write-Host "`n警告: 以下の $($remainingFiles.Count) 個のファイルは移動できませんでした:" -ForegroundColor Red
        $remainingFiles | ForEach-Object { Write-Host " - $($_.Name)" -ForegroundColor Yellow }
    }
    
    Write-Host "`n動画ファイルがGoogle Cloud Storageにアップロードされ、HTMLファイル内の参照が更新されていることを確認してください。" -ForegroundColor Cyan
    Write-Host "バックアップファイルは '$backupDir' に保存されています。" -ForegroundColor Cyan
}
else {
    Write-Host "操作がキャンセルされました。" -ForegroundColor Red
}
