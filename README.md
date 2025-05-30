# オートウェビナー大学 公式サイト

このプロジェクトは、オートウェビナー大学の公式サイトのソースコードです。

## 🚀 デプロイ設定

このプロジェクトは GitHub Actions を使用してロリポップサーバーに自動デプロイされます。

### 必要な GitHub Secrets

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のSecretsを設定してください：

- `FTP_SERVER`: ロリポップのFTPサーバー名（例: ftpXXX.lolipop.jp）
- `FTP_USERNAME`: ロリポップのFTPアカウント名（例: lolipop.jp-XXXXXX）
- `FTP_PASSWORD`: ロリポップのFTPパスワード
- `REMOTE_DIR`: アップロード先ディレクトリ（例: public_html/）
- `FTP_PORT`: SFTPポート番号（オプション、デフォルト: 22）

**注意**: GitHub ActionsのFTP-Deploy-Actionでは、アップロード先ディレクトリのパラメータは `server-dir` として使用されますが、Secretsでは `REMOTE_DIR` として設定してください。

### デプロイフロー

1. `master` ブランチにプッシュ
2. GitHub Actions が自動実行
3. ロリポップサーバーにSFTP経由でファイルアップロード
4. サイト更新完了

## 📁 プロジェクト構造

```
newsite/
├── index.html              # トップページ
├── achievement/            # 実績・事例ページ
│   ├── index.html         # 実績一覧
│   ├── customer1.html     # 顧客事例1
│   ├── customer2.html     # 顧客事例2
│   ├── customer3.html     # 顧客事例3
│   ├── customer4.html     # 顧客事例4
│   ├── customer5.html     # 顧客事例5
│   └── achievement.js     # 実績ページのJS
├── assets/                # 静的アセット
│   └── images/           # 画像ファイル
├── css/                   # スタイルシート
│   └── style.css
├── js/                    # JavaScript
│   └── main.js
├── owner.html             # 運営者情報
├── privacy.html           # プライバシーポリシー
├── terms.html            # 利用規約
├── tokutei.html          # 特定商取引法
├── robots.txt            # SEO設定
├── service-worker.js     # PWA設定
└── .htaccess            # Apache設定
```

## 🛠 開発環境セットアップ

### 必要な環境
- Git
- VSCode（推奨）
- 現代的なブラウザ

### ローカル開発
1. リポジトリをクローン
2. `index.html` をブラウザで開く
3. ファイルを編集
4. 変更をコミット・プッシュ

## 📊 自動デプロイの確認方法

1. **GitHub Actions確認**: リポジトリの「Actions」タブでワークフロー実行状況を確認
2. **サーバー確認**: FTPクライアントでファイルがアップロードされているか確認
3. **サイト確認**: 実際のURLにアクセスして表示を確認

## 🔧 トラブルシューティング

### デプロイエラーの場合
1. GitHub Secretsの設定値を確認
2. ロリポップのFTP情報が正しいか確認
3. ディスク容量やアクセス権限を確認

### サイト表示エラーの場合
1. ファイルパスの確認（相対パス推奨）
2. .htaccessの設定確認
3. ブラウザの開発者ツールでエラー確認

## 📝 更新手順

```bash
# ファイルを編集
git add .
git commit -m "feat: サイト内容を更新"
git push origin master
```

プッシュ後、自動的にデプロイが開始されます。
