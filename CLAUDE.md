# UTAGE ウェブサイト - Claude Code 設定

## プロジェクト概要
UTAGEウェブサイトのソースコード管理。ブログ機能を含む企業サイト。

## プロジェクト構造
```
├── achievement/        # 導入事例ページ
├── assets/            # 画像、CSS、JavaScript、その他リソース
├── blog/              # ブログ記事（主な作業対象）
├── components/        # 再利用可能なUI要素
├── css/               # スタイルシート（要整理）
├── docs/              # プロジェクトドキュメント
└── scripts/           # スクリプト類
```

## 重要な制約
- **動画ファイル**: Google Cloud Storage (`utage-videos-yuki-2025`) で管理
- **動画URL形式**: `https://storage.googleapis.com/utage-videos-yuki-2025/ファイル名.mp4`
- **動画URLは絶対に変更しない**

## 開発環境
- Node.js 18以上
- NPM
- ローカル起動: `./start-local-server.ps1`

## コーディング規約
- レスポンシブデザイン必須
- セマンティックHTML推奨
- CSSはモジュール化を心がける
- 既存デザインとの統一性を保つ

## ブログ関連の重要事項
- ブログ記事は `blog/` フォルダに配置
- HTMLはシンプルで再利用可能な構造にする
- AIが今後記事を書きやすいテンプレート設計
- 記事本文とサイドバーの横幅調整が必要

## よく使用するコマンド
- `npm install` - 依存関係インストール
- `./start-local-server.ps1` - ローカルサーバー起動

## 注意事項
- Google Cloud Storage の動画URLを変更禁止
- レスポンシブデザインを崩さない
- 既存のデザイン統一性を保つ
- 変更前後でテスト必須
