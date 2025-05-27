# AI ブログテンプレート使用ガイド

## 概要

このガイドは、AI が効率的にブログ記事を作成するための標準化されたテンプレート使用方法を説明します。

## テンプレートファイル

- **ファイル名**: `template-ai-friendly.html`
- **場所**: `/blog/template-ai-friendly.html`

## 置換変数一覧

### 必須変数（すべて置換必要）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `[ARTICLE_TITLE]` | 記事タイトル | "UTAGEの基本設定方法" |
| `[ARTICLE_DESCRIPTION]` | 記事の説明文（160文字以内） | "UTAGEの初期設定から基本的な使い方まで..." |
| `[ARTICLE_IMAGE]` | OGP画像ファイル名 | "blog-utage-setup.webp" |
| `[PUBLISH_DATE]` | 公開日 | "2025年5月27日" |
| `[MODIFIED_DATE]` | 更新日 | "2025年5月27日" |
| `[ARTICLE_SLUG]` | ファイル名（拡張子なし） | "utage-basic-setup" |
| `[CATEGORY]` | カテゴリ名 | "UTAGE活用" |
| `[ARTICLE_CONTENT]` | 記事本文（HTMLマークアップ） | 詳細は下記参照 |
| `[RELATED_POSTS]` | 関連記事HTML | 詳細は下記参照 |
| `[TABLE_OF_CONTENTS]` | 目次HTML | 詳細は下記参照 |

## 記事本文の構造

### 基本構造

```html
<!-- フィーチャード画像 -->
<img src="../assets/images/[画像ファイル名]" alt="[画像の説明]" class="article-featured-image" loading="lazy">

<!-- 導入文 -->
<p>記事の導入文...</p>

<!-- セクション見出し -->
<h2 id="section1">見出しテキスト</h2>
<h3 id="section1-1">サブ見出し</h3>

<!-- 画像挿入 -->
<img src="../assets/images/[画像ファイル名]" alt="[画像の説明]" class="article-image" loading="lazy">

<!-- キャラクター会話 -->
<div class="conversation-container yuki">
    <div class="character-icon"></div>
    <div class="conversation-content">
        <p class="character-name">YUKI</p>
        <p>YUKIのセリフ内容</p>
    </div>
</div>

<div class="conversation-container nyanta">
    <div class="character-icon"></div>
    <div class="conversation-content">
        <p class="character-name">ニャン太</p>
        <p>ニャン太のセリフ内容</p>
    </div>
</div>
```

### スタイリング要素

| クラス名 | 用途 | 例 |
|----------|------|-----|
| `highlight-green` | 緑のハイライト | `<span class="highlight-green">重要なポイント</span>` |
| `highlight-blue` | 青のハイライト | `<span class="highlight-blue">技術用語</span>` |
| `highlight-pink` | ピンクのハイライト | `<span class="highlight-pink">メリット</span>` |
| `highlight-yellow` | 黄色のハイライト | `<span class="highlight-yellow">注意点</span>` |
| `text-red` | 赤色のテキスト | `<span class="text-red"><strong>重要</strong></span>` |
| `text-blue` | 青色のテキスト | `<span class="text-blue"><strong>ポイント</strong></span>` |

## 関連記事の構造

```html
<div class="related-post-item">
    <a href="[記事のURL]">
        <img src="../assets/images/[サムネイル画像]" alt="[記事タイトル]" class="related-post-thumbnail">
        <h4 class="related-post-title">[記事タイトル]</h4>
        <p class="related-post-excerpt">[記事の要約]</p>
    </a>
</div>
```

## 目次の構造

```html
<ul class="toc-list">
    <li><a href="#section1">セクション1のタイトル</a></li>
    <li><a href="#section2">セクション2のタイトル</a>
        <ul>
            <li><a href="#section2-1">サブセクション</a></li>
        </ul>
    </li>
</ul>
```

## ファイル命名規則

### ブログ記事ファイル名

- 形式: `[カテゴリ]-[キーワード].html`
- 例: `utage-basic-setup.html`, `marketing-automation-tips.html`

### 画像ファイル名

- ブログサムネイル: `blog-[記事識別子].webp`
- 記事内画像: `[記事識別子]-[連番].webp`
- 例: `blog-utage-setup.webp`, `utage-setup-1.webp`

## AI 作成時のチェックポイント

### 必須チェック項目

1. **SEO要素**
   - [ ] タイトルは60文字以内
   - [ ] メタ説明は160文字以内
   - [ ] 画像にalt属性を設定
   - [ ] 見出しタグの階層が正しい

2. **アクセシビリティ**
   - [ ] 画像にloading="lazy"を設定
   - [ ] 見出しにid属性を設定
   - [ ] リンクに適切なテキストを設定

3. **デザイン統一性**
   - [ ] ハイライトクラスを適切に使用
   - [ ] キャラクター会話を効果的に配置
   - [ ] 画像とテキストのバランス

4. **技術的要件**
   - [ ] 相対パスが正しい
   - [ ] HTMLの構文エラーがない
   - [ ] 不要な空行や文字がない

## 推奨される記事構成

1. **導入（200-300文字）**
   - 問題提起
   - 記事で解決できることの明示

2. **本文（2000-4000文字）**
   - 2-4個のメインセクション
   - 各セクションに画像を1-2枚
   - キャラクター会話を2-3回

3. **まとめ（100-200文字）**
   - 要点の再確認
   - 次のアクションの提案

## 注意事項

- Google Cloud Storage の動画URLは絶対に変更しない
- 既存のデザイン統一性を保つ
- レスポンシブデザインを考慮した画像サイズを使用
- 外部リンクには適切なrel属性を設定

## 更新履歴

- 2025-05-27: 初版作成
- レイアウト拡張に対応（記事本文: 9.2fr、サイドバー: 3.0fr）