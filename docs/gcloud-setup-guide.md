# Google Cloud SDK インストールと設定ガイド

## インストール手順

### Windows

1. [Google Cloud SDKインストーラ](https://cloud.google.com/sdk/docs/install#windows)をダウンロード
2. ダウンロードしたインストーラを実行し、指示に従ってインストール
3. インストール完了後、PowerShellかコマンドプロンプトを開き、認証を行う

```powershell
gcloud init
```

4. 表示される指示に従い、Googleアカウントでログインし、プロジェクトを選択

### 基本的なコマンド

#### バケット内のファイル一覧を表示

```powershell
gsutil ls gs://utage-videos/
```

#### ファイルをアップロード

```powershell
gsutil cp C:\path\to\your\video.mp4 gs://utage-videos/
```

#### ファイルをダウンロード

```powershell
gsutil cp gs://utage-videos/video.mp4 C:\path\to\save\
```

#### ファイルを削除

```powershell
gsutil rm gs://utage-videos/video.mp4
```

#### ファイルを公開設定

```powershell
gsutil acl ch -u AllUsers:R gs://utage-videos/video.mp4
```

## バッチアップロードスクリプト

複数のMP4ファイルをまとめてアップロードするPowerShellスクリプトの例:

```powershell
# バケット名を設定
$bucket = "utage-videos-yuki-2025"

# ローカルのMP4ファイルを含むディレクトリ
$localDir = "C:\Users\atara\Desktop\newsite-voice\assets\videos"

# ディレクトリ内の全てのMP4ファイルを取得してアップロード
Get-ChildItem -Path $localDir -Filter "*.mp4" | ForEach-Object {
    Write-Host "Uploading $($_.Name) to gs://$bucket/"
    gsutil cp $_.FullName gs://$bucket/
    
    # ファイルを公開設定
    gsutil acl ch -u AllUsers:R gs://$bucket/$($_.Name)
    
    Write-Host "Upload complete: https://storage.googleapis.com/$bucket/$($_.Name)"
}
```

このスクリプトを実行するには、PowerShellで以下のコマンドを実行します:

```powershell
.\upload-videos.ps1
```

## 詳細情報

詳しいドキュメントは[Google Cloud Storage ドキュメント](https://cloud.google.com/storage/docs)を参照してください。
