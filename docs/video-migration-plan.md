# Google Cloud Storageへの動画ファイル移行手順

## ステップ1: Google Cloud Platformの設定

1. [Google Cloud Platform](https://console.cloud.google.com/)にアクセスし、アカウント作成または既存アカウントでログイン
2. 新しいプロジェクトを作成（名前例：`utage-videos`）
3. Cloud Storageを有効化
4. `utage-videos` という名前のバケットを作成（リージョン：東京 - asia-northeast1）
5. バケットの公開アクセス設定を行う

## ステップ2: 動画ファイルのアップロード

### オプション1: Webコンソールからアップロード
1. GCPコンソールで作成したバケットを開く
2. 「アップロード」ボタンをクリックし、動画ファイルを選択
3. アップロードが完了するまで待機
4. 各ファイルの「共有可能なリンク」を取得

### オプション2: スクリプトを使用したアップロード
1. Google Cloud SDKをインストール（[インストール手順](https://cloud.google.com/sdk/docs/install)）
2. ターミナルで認証を行う: `gcloud auth login`
3. `scripts/upload-videos.ps1` スクリプトを実行
   ```powershell
   cd C:\Users\atara\Desktop\newsite-voice
   .\scripts\upload-videos.ps1
   ```

## ステップ3: HTMLファイル内の参照を更新

以下のHTMLファイル内の動画URL参照を更新します（すでに完了済み）:
- `/achievement/customer1.html`
- `/achievement/customer2.html`
- `/achievement/customer3.html`
- `/achievement/customer4.html`
- `/achievement/customer5.html`

## ステップ4: Gitから大きなファイルを削除

1. `.gitignore` ファイルに動画ファイルの除外設定を追加（すでに完了済み）
2. すでにGitで追跡されている動画ファイルをリポジトリから削除:
   ```powershell
   cd C:\Users\atara\Desktop\newsite-voice
   .\scripts\remove-mp4-from-git.ps1
   ```
3. 変更をコミット:
   ```powershell
   git commit -m "MP4ファイルをGit追跡から削除し、Cloud Storageへ移行"
   ```

## ステップ5: ローカルファイルの整理（オプション）

1. アップロードと参照の更新が完了したことを確認
2. ローカルの動画ファイルをバックアップフォルダに移動:
   ```powershell
   cd C:\Users\atara\Desktop\newsite-voice
   .\scripts\backup-video-files.ps1
   ```

## ステップ6: 動作確認とリモートリポジトリへのプッシュ

1. ローカルサーバーを起動して動画ファイルが正しく表示されるか確認:
   ```powershell
   .\start-local-server.ps1
   ```
2. 問題がなければリモートリポジトリにプッシュ:
   ```powershell
   git push
   ```

## トラブルシューティング

- **Cloud Storageの動画が表示されない場合**:
  - バケットの公開アクセス設定を確認
  - 各ファイルのオブジェクトレベル権限を確認
  - ブラウザの開発者ツールでネットワークエラーを確認

- **Gitプッシュでエラーが発生する場合**:
  - 大きなファイルがまだGit履歴に残っている可能性があります
  - BFG Repo-Cleanerでの履歴クリーンアップを検討してください
