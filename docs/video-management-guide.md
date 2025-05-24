# 動画ファイル管理ガイド

## 概要

このドキュメントでは、UTAGEウェブサイトで使用している動画ファイルの管理方法について説明します。
大きな動画ファイルはGoogle Cloud Storageに保存し、Gitリポジトリから除外しています。

## Google Cloud Storage情報

- バケット名: `utage-videos-yuki-2025`
- リージョン: `asia-northeast1` (東京)
- 公開アクセス: 許可
- URL形式: `https://storage.googleapis.com/utage-videos-yuki-2025/ファイル名.mp4`

## 動画ファイル一覧

現在、以下の動画ファイルを使用しています：

1. `takayasusama-interview.mp4` - 髙安様インタビュー動画 (customer1.html)
2. `customer2-interview.mp4` - ゴルフ講師インタビュー動画 (customer2.html)
3. `customer3-interview.mp4` - マーケティングコンサルタントインタビュー動画 (customer3.html)
4. `customer4-interview.mp4` - コーチングトレーナーインタビュー動画 (customer4.html)
5. `customer5-interview.mp4` - 長門浩二様インタビュー動画 (customer5.html)

## 動画ファイルの追加方法

新しい動画ファイルを追加する場合は、以下の手順に従ってください：

1. 新しい動画ファイルをローカルで準備
2. [Google Cloud Storage Console](https://console.cloud.google.com/storage/browser)にアクセス
3. `utage-videos` バケットを選択
4. 「アップロード」ボタンをクリックして動画ファイルをアップロード
5. アップロード完了後、ファイルをクリックして「公開URL」をコピー
6. HTMLファイル内の `<source>` タグの `src` 属性を、コピーした公開URLに更新

## HTMLでの参照例

```html
<video controls poster="/assets/images/interview-video-thumbnail.webp" preload="none" width="100%">
    <source src="https://storage.googleapis.com/utage-videos-yuki-2025/example-interview.mp4" type="video/mp4">
    お使いのブラウザは動画タグをサポートしていません。
</video>
```

## 注意点

- 動画ファイルは直接Gitリポジトリにコミットしないでください
- `.gitignore` ファイルに `*.mp4` が追加されていることを確認してください
- 大きなファイルをGitにプッシュする際のHTTP 500エラーを避けるため、必ずこの方法で管理してください
