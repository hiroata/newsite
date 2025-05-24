# Google Cloud Storageに動画ファイルをアップロードするスクリプト

# バケット名を設定
$bucket = "utage-videos-yuki-2025"

# ローカルのMP4ファイルを含むディレクトリ
$localDir = "C:\Users\atara\Desktop\newsite-voice\assets\videos"

# Google Cloud SDKがインストールされているか確認
try {
    $gcloudVersion = gcloud --version
    Write-Host "Google Cloud SDK が見つかりました: $gcloudVersion" -ForegroundColor Green
}
catch {
    Write-Host "Google Cloud SDK がインストールされていないか、PATHに設定されていません。" -ForegroundColor Red
    Write-Host "インストール方法については、以下のURLを参照してください:" -ForegroundColor Yellow
    Write-Host "https://cloud.google.com/sdk/docs/install#windows" -ForegroundColor Yellow
    exit
}

# ログイン確認
Write-Host "Google Cloud認証を確認しています..." -ForegroundColor Cyan
$auth = gcloud auth list
if ($auth -match "No credentialed accounts.") {
    Write-Host "Google Cloudにログインしていません。ログインしてください。" -ForegroundColor Yellow
    gcloud auth login
}
else {
    Write-Host "Google Cloudにログイン済みです。" -ForegroundColor Green
}

# プロジェクト設定の確認
$project = gcloud config get-value project
Write-Host "現在のプロジェクト: $project" -ForegroundColor Cyan

# バケットが存在するか確認
$bucketExists = gsutil ls "gs://$bucket" 2>$null
if (-not $bucketExists) {
    Write-Host "バケット 'gs://$bucket' が存在しません。作成しますか？ (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "y") {
        Write-Host "バケットを作成しています... (東京リージョンを使用)" -ForegroundColor Cyan
        gsutil mb -l asia-northeast1 "gs://$bucket"
        
        # バケットの公開アクセスを設定
        Write-Host "バケットを公開設定にしています..." -ForegroundColor Cyan
        gsutil iam ch allUsers:objectViewer "gs://$bucket"
        
        Write-Host "バケット 'gs://$bucket' が作成されました。" -ForegroundColor Green
    }
    else {
        Write-Host "バケットが存在しないため、処理を中止します。" -ForegroundColor Red
        exit
    }
}

# ディレクトリ内の全てのMP4ファイルを取得してアップロード
$mp4Files = Get-ChildItem -Path $localDir -Filter "*.mp4"
if ($mp4Files.Count -eq 0) {
    Write-Host "指定されたディレクトリにMP4ファイルが見つかりません。" -ForegroundColor Yellow
    exit
}

Write-Host "$($mp4Files.Count)個のMP4ファイルが見つかりました。アップロードを開始します..." -ForegroundColor Cyan

foreach ($file in $mp4Files) {
    Write-Host "アップロード中: $($file.Name) → gs://$bucket/" -ForegroundColor Cyan
    gsutil cp $file.FullName "gs://$bucket/"
    
    # ファイルが正常にアップロードされたか確認
    $uploaded = gsutil ls "gs://$bucket/$($file.Name)" 2>$null
    if ($uploaded) {
        # ファイルを公開設定
        gsutil acl ch -u AllUsers:R "gs://$bucket/$($file.Name)"
        
        Write-Host "アップロード完了: https://storage.googleapis.com/$bucket/$($file.Name)" -ForegroundColor Green
    }
    else {
        Write-Host "アップロードに失敗しました: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`n全てのアップロードが完了しました!" -ForegroundColor Green
Write-Host "以下のURLで動画ファイルにアクセスできます:" -ForegroundColor Cyan
Write-Host "https://storage.googleapis.com/$bucket/[ファイル名]`n" -ForegroundColor Cyan

# HTMLファイルの更新ガイド
Write-Host "次のステップ:" -ForegroundColor Yellow
Write-Host "1. HTMLファイル内の動画参照を更新してください" -ForegroundColor Yellow
Write-Host "例: <source src=\"https://storage.googleapis.com/$bucket/[ファイル名]\" type=\"video/mp4\">" -ForegroundColor Yellow
Write-Host "2. 更新したHTMLファイルをGitリポジトリにコミットしてください" -ForegroundColor Yellow
