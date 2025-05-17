# まえゆきツール - 開発者ガイド

## 概要

まえゆきツールは、ブラウザ上で動作するさまざまなウェブツールを提供するプロジェクトです。このドキュメントでは、特に画像処理関連ツールの開発・保守のためのガイドラインを提供します。

## ディレクトリ構成

```
/newsite
  ├── tools/       # 各種ツールHTML
  ├── js/          # 共有JavaScriptファイル
  │   ├── image-tools-utils.js    # 画像処理共通関数
  │   └── tools-cache.js          # ツールキャッシング
  ├── css/         # スタイルシート
  │   ├── image-tools-styles.css  # 画像ツール共通スタイル
  │   └── tools-common.css        # 全ツール共通スタイル
  └── service-worker.js           # キャッシング用サービスワーカー
```

## 共通ユーティリティ関数

### 画像処理関数

`image-tools-utils.js`には以下の共通関数が定義されています：

- **setupFileDropAndSelection(dropArea, fileInput, processFunction)** - ドラッグ＆ドロップと選択UI設定
- **resizeImage(file, maxWidth, maxHeight, quality, maintainAspectRatio)** - 画像リサイズ
- **convertToJPEG(file, quality, bgColor)** - PNG→JPEG変換
- **convertToWebP(file, quality)** - WebP形式への変換
- **getImageAspectRatio(file)** - 画像アスペクト比取得
- **generateImagePreview(file, maxSize)** - プレビュー画像生成
- **checkWebPSupport()** - ブラウザがWebPをサポートしているか確認
- **updateUI(message, isError, messageElement)** - メッセージ表示・更新
- **createFileItem(file, id, previewGenerator, removeCallback)** - ファイルリスト項目作成
- **updateFilesMetaUI(selectedFiles, filesMetaElement)** - ファイル情報表示更新
- **updateProgressBar(progress, progressBar, progressText, current, total)** - 進捗表示更新
- **downloadProcessedImages(images, prefix, progressText)** - 処理済み画像ダウンロード
- **downloadAsZip(files, zipName, progressText)** - ZIP形式でファイル一括ダウンロード

## 新しいツールの作成手順

1. `image-tool-template.html`をベースに新しいファイルを作成
2. 必要な設定と処理を追加
3. ファイル名や処理関数をツールの用途に合わせて変更
4. テストと最適化

## キャッシング戦略

ツールの高速な読み込みと安定性を確保するため、以下のキャッシング戦略を採用しています：

1. **サービスワーカー** - 共通リソースをキャッシュし、オフライン対応
2. **ブラウザキャッシュ** - 適切なCache-Controlヘッダーによるリソースキャッシング

## ベストプラクティス

### パフォーマンス

- 大きな処理は非同期（Promise/async-await）で実装
- 画像処理はWebWorkerの使用を検討
- 処理の進捗を適切に表示

### コーディングスタイル

- 変数・関数には明示的な命名を使用
- JSDoc形式でコメントを追加
- グローバル変数の使用は最小限に

### テスト

- 新しいツールの追加後は以下をテスト：
  1. 様々なサイズ・形式の画像での動作
  2. モバイルとデスクトップの両方での表示
  3. エラー処理の確認

## 最適化

新しいユーティリティ関数を追加する場合：

1. `image-tools-utils.js`に追加
2. JSDoc形式でコメントを追加
3. エラーハンドリングを実装
4. 既存ツールの対応部分を更新

## 共通問題のトラブルシューティング

- **ファイルの選択/ドロップが機能しない** - setupFileDropAndSelectionの呼び出しを確認
- **画像処理時にエラー** - Promise内のエラーハンドリングを確認
- **メモリ使用量が大きい** - 大きな画像処理時にObjectURLの適切な解放を確認
