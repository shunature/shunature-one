# 鯨とネガ (SQUARE fractal) — Shun Tonegawa

PHP + Markdown で管理し、静的HTMLにビルドして Vercel や Firebase Hosting 等で公開するパーソナルウェブサイトです。

## 📁 ディレクトリ構成

```
shunature-one/
│
├── src/                     # 編集するもの
│   ├── pages/
│   │   ├── index.php
│   │   ├── profile.php
│   │   └── about.php
│   │
│   ├── blog/
│   │   ├── index.php
│   │   ├── post.php
│   │   └── posts/
│   │       └── 2026/09/27/hello-world.md   # 年/月/日/slug.md
│   │
│   └── includes/
│       ├── head.php
│       ├── sidebar.php
│       ├── footer.php
│       ├── markdown.php
│       └── functions.php
│
├── public/                  # CSS・JS・サムネイル・画像
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── thumbnails/
│   │   └── 2026/09/27/hello-world.png      # 年/月/日/slug.png
│   └── images/
│
├── build.php                # 静的サイト生成スクリプト
├── README.md
│
└── dist/                    # 生成物（公開する静的ファイル）
    ├── index.html
    ├── profile.html
    ├── about.html
    ├── blog/
    │   ├── index.html
    │   └── 2026/09/27/hello-world/
    │       └── index.html
    └── thumbnails/
        └── 2026/09/27/hello-world.png
```

---

## 🚀 ローカルでの確認・プレビュー

PHPの組み込みサーバーを使用して、`src/` 配下をプレビューできます。

```bash
php -S localhost:8000 -t src/pages
```

---

## 📝 記事およびサムネイルの追加手順

1. `src/blog/posts/YYYY/MM/DD/slug.md` を作成します（例: `src/blog/posts/2026/09/27/my-post.md`）。
2. サムネイル画像は `public/thumbnails/YYYY/MM/DD/slug.png` に配置します（例: `public/thumbnails/2026/09/27/my-post.png`）。
3. 記事冒頭にフロントメタデータを記述します：
   ```markdown
   ---
   title: 記事のタイトル
   date: 2026-09-27
   excerpt: 記事の要約
   tags: 雑記, ゲーム
   ---

   # 記事のタイトル

   本文を記述します。
   ```

---

## 🛠️ 静的サイトのビルドと公開

```bash
php build.php
```

`dist/` ディレクトリに生成された最新の静的ファイルを、Vercel, Firebase Hosting, Cloudflare Pages 等の静的ホスティングにコミット＆Pushして公開します。
