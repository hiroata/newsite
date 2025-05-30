# GitHub Secrets 設定手順

## 🚨 現在の状況
GitHub Actionsで「Input required and not supplied: server」エラーが発生しています。
これは **GitHub Secrets が設定されていない** ことが原因です。

## 📋 必要なSecrets一覧

以下のSecretsをGitHubリポジトリに設定する必要があります：

| Secret名 | 必須 | 説明 | 例 |
|---------|------|------|-----|
| `FTP_SERVER` | ✅ | ロリポップのFTPサーバー名 | `ftpXXX.lolipop.jp` |
| `FTP_USERNAME` | ✅ | FTPアカウント名 | `lolipop.jp-XXXXXX` |
| `FTP_PASSWORD` | ✅ | FTPパスワード | `your_password` |
| `REMOTE_DIR` | ✅ | アップロード先ディレクトリ | `public_html/` |
| `FTP_PORT` | ❌ | SFTPポート（デフォルト: 22） | `22` |

## 🔧 設定手順

### 1. ロリポップの情報を確認

1. [ロリポップ！ユーザー専用ページ](https://user.lolipop.jp/)にログイン
2. 「サーバーの管理・設定」→「FTP・WebDAV設定」で以下を確認：
   - **FTPサーバー名**: `ftpXXX.lolipop.jp` 
   - **FTPアカウント名**: `lolipop.jp-XXXXXX`
   - **FTPパスワード**: 設定済みのパスワード

### 2. GitHubでSecretsを設定

1. **GitHubリポジトリページ**を開く
2. **Settings**タブをクリック
3. 左サイドバーの**Secrets and variables** → **Actions**をクリック
4. **New repository secret**ボタンをクリック
5. 以下の順序で設定：

#### FTP_SERVER の設定
- Name: `FTP_SERVER`
- Secret: `ftpXXX.lolipop.jp`（ロリポップで確認した値）
- **Add secret**をクリック

#### FTP_USERNAME の設定
- Name: `FTP_USERNAME`  
- Secret: `lolipop.jp-XXXXXX`（ロリポップで確認した値）
- **Add secret**をクリック

#### FTP_PASSWORD の設定
- Name: `FTP_PASSWORD`
- Secret: `your_password`（ロリポップのFTPパスワード）
- **Add secret**をクリック

#### REMOTE_DIR の設定
- Name: `REMOTE_DIR`
- Secret: `public_html/`（通常はこの値、サブディレクトリの場合は `public_html/subdirectory/`）
- **Add secret**をクリック

### 3. 動作確認

1. 何かファイルを少し変更
2. git add . && git commit -m "test: デプロイテスト"
3. git push origin master
4. GitHubの**Actions**タブで実行状況を確認

## 🔍 トラブルシューティング

### Secretsが正しく設定されているか確認
GitHub Actions実行時のログで以下のような出力があることを確認：
```
Checking secrets...
FTP_SERVER exists: true
FTP_USERNAME exists: true
FTP_PASSWORD exists: true
REMOTE_DIR exists: true
```

### よくあるエラーと対処法

| エラー | 原因 | 対処法 |
|--------|------|--------|
| `Input required and not supplied: server` | FTP_SERVER未設定 | FTP_SERVERを設定 |
| `Authentication failed` | ユーザー名/パスワード間違い | FTP_USERNAME, FTP_PASSWORDを確認 |
| `Permission denied` | ディレクトリ権限エラー | REMOTE_DIRのパスを確認 |
| `Connection timed out` | サーバー接続エラー | FTP_SERVERとポート番号を確認 |

## 📞 サポート

設定でご不明な点がございましたら、ロリポップのサポートページまたはGitHubのActionsログをご確認ください。
