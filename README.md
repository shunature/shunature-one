# indigo-night — INDM Hugo Theme

Indigo Night Dull Moon (shunature.one) 用の Hugo テーマ。

## ディレクトリ構造

```
.
├── hugo.toml                          # サイト設定
├── content/
│   └── blog/
│       ├── _index.md                  # ブログセクション
│       └── posts/                     # ここにMarkdownを置く
│           └── my-post.md
└── themes/
    └── indigo-night/
        ├── theme.toml
        ├── layouts/
        │   ├── _default/baseof.html
        │   ├── index.html
        │   ├── blog/
        │   │   ├── list.html
        │   │   └── single.html
        │   └── partials/
        │       ├── head.html
        │       ├── header.html
        │       ├── footer.html
        │       └── scripts.html
        └── static/
            └── css/main.css
```

## セットアップ

```bash
# Hugoインストール（まだなら）
brew install hugo

# 既存のassets/をstaticにコピー
cp -r /path/to/old-site/assets/ static/

# 記事をcontentに移動
cp -r /path/to/old-site/blog/posts/*.md content/blog/

# ローカル確認
hugo server -D

# ビルド
hugo
```

## frontmatter互換（AirPubre形式）

以下はそのまま使えます：

```yaml
---
title: 記事タイトル
date: 2025-04-19T12:00:00+09:00
tags: [日常, 音楽]
summary: 記事の概要文
thumbnail: image.webp
thumbnail_credit: Photo by example
thumbnail_credit_url: https://example.com
updated: 2025-04-20T10:00:00+09:00   # ← Hugo の lastmod として認識
---
```

## assets の置き場所

| 旧パス | 新パス (Hugo) |
|--------|--------------|
| `assets/fonts/` | `static/assets/fonts/` |
| `assets/img/thumbnail/` | `static/assets/img/thumbnail/` |
| `assets/icon.png` | `static/assets/icon.png` |

## URL互換

`hugo.toml` の permalinks 設定により `/blog/slug/` 形式を維持します。
既存の Mastodon シェアや feed.xml リンクは引き続き動作します。
