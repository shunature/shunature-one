# Whale and Negafilms — Shun Tonegawa (鯨とネガ)

PHP + Markdown でコンテンツを管理し、1コマンドで静的HTMLにコンパイルして **Vercel** や **Firebase Hosting** 等の各種無料ホスティングで配信するパーソナルウェブサイトです。

Node.js / npm や Composer などの外部依存ライブラリを一切使わず、**純粋な PHP 8.x + Vanilla JS / CSS** のみで構築されているため、軽量・高速で長期的な保守性に優れています。

---

## 📁 ディレクトリ構成

```
/
│
├── src/                     # 編集・制作するソースコード（PHP & Markdown）
│   ├── pages/               # 固定ページテンプレート
│   │   ├── index.php        # トップページ（写真、ロゴアニメーション、由来解説）
│   │   ├── profile.php      # プロフィール（拠点、音響・ゲーム・ガジェット等の趣味）
│   │   └── about.php        # サイト理念・技術スタック・運用フロー
│   │
│   ├── blog/                # ブログ機能
│   │   ├── index.php        # ブログ記事一覧（小リスト形式 ＋ タグフィルター）
│   │   ├── post.php         # 記事詳細テンプレート（アイキャッチ ＋ 自動生成目次）
│   │   └── posts/           # Markdown記事ファイル
│   │       └── 2026/09/27/hello-world.md  # 記事ファイル (YYYY/MM/DD/slug.md)
│   │
│   └── includes/            # 共通コンポーネント
│       ├── head.php         # <head>メタタグ、OGP、Fediverseタグ、CSS読み込み
│       ├── sidebar.php      # PC固定サイドバー ＆ スマホヘッダー/ドロワーメニュー
│       ├── footer.php       # フッター ＆ Contactモーダル
│       ├── markdown.php     # ゼロ依存 Markdownパーサー ＆ TOC（目次）生成
│       └── functions.php    # フロントメタデータ解析 ＆ 記事スキャン
│
├── public/                  # 静的アセットファイル
│   ├── css/
│   │   └── style.css        # レスポンシブスタイル、テーマ変数、ホバー色反転
│   ├── js/
│   │   └── main.js          # ダークモード切替、スマホメニュー、タグ絞り込み、ロードアニメーション
│   ├── thumbnails/          # サムネイル画像
│   │   └── 2026/09/27/hello-world.png  # 記事サムネイル (YYYY/MM/DD/slug.png)
│   ├── images/              # 共通画像アセット
│   ├── favicon.svg
│   └── favicon.png
│
├── build.php                # 静的サイト生成スクリプト (`php build.php`)
├── README.md                # 運用・仕様ドキュメント
│
└── dist/                    # コンパイル後の生成物（公開用静的ファイル）
    ├── index.html
    ├── profile.html
    ├── about.html
    ├── blog/
    │   ├── index.html
    │   └── 2026/09/27/hello-world/index.html
    └── thumbnails/
        └── 2026/09/27/hello-world.png
```

---

## 🎨 デザイン・UI仕様

- **カラーパレット**: 白黒（モノトーン）を基調とし、アクセントカラーに**エレクトリックイエロー（`#ffe600`）**を採用。
- **高視認性な色反転**: リンクホバー時、およびサイドバーやタグの選択中（active）状態では、背景がイエローになり文字色がくっきりとした黒（`#111111`）に自動反転します。
- **トップページ限定ロードアニメーション**: `index.html` アクセス時のみ「鯨」→「と」→「ネガ」が 0.25秒間隔でシーケンシャルにフェードイン表示されます（下層ページ回遊時は演出なしで即時表示）。
- **自然なテキスト自動折り返し**: 全端末の画面幅に応じて日本語・英語テキストが綺麗に折り返されるよう `word-break: auto-phrase; overflow-wrap: anywhere;` を設定。
- **レスポンシブ・レイアウト**:
  - **PC（画面幅768px以上）**: 左側固定サイドバー（260px）。
  - **スマホ（画面幅768px未満）**: 上部固定ヘッダー ＋ ハンバーガーボタン（`MENU`/`CLOSE`）によるドロワーメニュー。

---

## 📝 記事およびサムネイルの追加手順（AI不要なワークフロー）

1. **記事ファイルの作成**:
   `src/blog/posts/YYYY/MM/DD/slug.md` の階層で Markdown ファイルを作成します。
   例: `src/blog/posts/2026/09/27/my-first-post.md`

2. **サムネイル画像の配置**:
   `public/thumbnails/YYYY/MM/DD/slug.png` の階層に `.png` 画像を配置します。
   例: `public/thumbnails/2026/09/27/my-first-post.png`
   ※一覧ページでの小サムネイル表示および記事冒頭のアイキャッチ画像として自動認識されます。

3. **フロントメタデータの記述**:
   Markdown ファイルの冒頭にメタデータを記述します：
   ```markdown
   ---
   title: 記事のタイトル
   date: 2026-09-27
   excerpt: 記事の要約テキスト
   tags: 雑記, ゲーム, PHP
   ---

   # 記事のタイトル

   ここに本文を記述します。見出し（`##` や `###`）を作成すると、記事冒頭に目次が自動生成されます。
   ```

---

## 🏷️ ブログ機能

- **小リスト形式の一覧**: サムネイル小枠（左）＋ メタ情報・タイトル・要約（右）による視認性の高いリスト表示。
- **リアルタイム・タグフィルター**: ブログ一覧の上部に全記事のタグ（`#タグ`）を自動抽出。クリックすると即座に対象記事のみをフィルタリング表示します。
- **目次（TOC）自動生成**: 記事本文内の見出し（`<h1>`〜`3`）を自動パースし、各見出しへのアンカーリンクが付いた「目次」ボックスを記事冒頭に挿入します。

---

## 🌐 メタデータ & OGP 設定

- **Fediverse Creator タグ**: 全ページの `<head>` に `<meta name="fediverse:creator" content="@dockker7mb@famichiki.jp">` を自動挿入。
- **OGP & Twitter Card**: ページタイトル、説明文、記事サムネイル画像を `og:image` や `twitter:image` に自動適用します。

---

## 🚀 ローカルでの動作確認・ビルド

### 1. ローカルプレビュー

```bash
# dist（ビルド済み静的サイト）のプレビュー
php -S localhost:8000 -t dist

# または src（PHPテンプレート）のプレビュー
php -S localhost:8000 -t src/pages
```

ブラウザで `http://localhost:8000` にアクセスしてください。

### 2. 静的サイトのビルド

記事の追加やテンプレート修正後、以下のコマンドを実行します。

```bash
php build.php
```

`dist/` ディレクトリに最新の静的HTML/CSS/JS/画像が出力されます。

---

## 🌐 ホスティング・デプロイ

`dist/` ディレクトリを公開対象（Publish / Output Directory）として指定するだけで、プラットフォームに縛られず配信できます。

- **Vercel**: Output Directory に `dist` を指定。
- **Firebase Hosting**: `firebase.json` で `"public": "dist"` と指定。
- **Cloudflare Pages / Netlify / GitHub Pages**: 公開ディレクトリに `dist` を指定。
