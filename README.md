# UTAGEウェブサイトプロジェクト

このリポジトリはUTAGEウェブサイトのソースコードを管理しています。

## プロジェクト構成

- `achievement/` - 導入事例ページ
- `assets/` - 画像、CSS、JavaScript、その他リソース
- `blog/` - ブログ記事
- `components/` - 再利用可能なUI要素
- `css/` - スタイルシート
- `docs/` - プロジェクトドキュメント
- `scripts/` - スクリプト類

## 動画ファイル管理について

このプロジェクトでは、大きな動画ファイル（MP4など）はGoogle Cloud Storageで管理しています。
Gitリポジトリには動画ファイルは含まれていません。

### Google Cloud Storage設定
- バケット名: `utage-videos-yuki-2025`
- URL形式: `https://storage.googleapis.com/utage-videos-yuki-2025/ファイル名.mp4`

詳細は `docs/video-management-guide.md` を参照してください。

### 動画ファイルの設定

- 動画ファイルは Google Cloud Storage バケット `utage-videos-yuki-2025` に保存
- HTMLファイル内では以下の形式でURLを参照:
  ```html
  <source src="https://storage.googleapis.com/utage-videos-yuki-2025/ファイル名.mp4" type="video/mp4">
  ```

### 新しい動画を追加する方法

1. Google Cloud Storageの `utage-videos-yuki-2025` バケットに動画をアップロード
2. HTMLファイル内で適切なURLを使用して動画を参照

詳細なマニュアルは `docs/video-management-guide.md` を参照してください。

## 開発環境のセットアップ

### 必要条件

- Node.js 18以上
- NPM

### インストール

```bash
# 依存関係のインストール
npm install
```

### 開発サーバーの起動

```bash
# ローカル開発サーバーの起動
./start-local-server.ps1
```

## その他ドキュメント

- `docs/video-management-guide.md` - 動画ファイル管理ガイド
- `docs/gcloud-setup-guide.md` - Google Cloud Storage設定ガイド
