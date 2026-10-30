# WadoWado Studios — Shun Kashiwaba(Shun Tonegawa)

Astro で構築した静的な個人サイトです。Notes の記事は Markdown で管理し、`dist/` に静的 HTML を生成します。

## 開発

```sh
npm install
npm run dev
```

## ビルドとプレビュー

```sh
npm run build
npm run preview
```

生成先は `dist/` です。デプロイ先の公開ディレクトリも `dist` に設定します。

`main` ブランチへの push で GitHub Actions が Astro をビルドし、GitHub Pages にデプロイします。GitHub Pages のプロジェクトサイト用ベースパスは Actions 実行時に自動設定されます。

## コンテンツの追加

- 記事: `src/content/notes/YYYY/MM/DD/slug.md`
- サムネイル: `public/thumbnails/YYYY/MM/DD/slug.png`
- 共通画像: `public/images/`

記事の frontmatter:

```yaml
---
title: 記事のタイトル
date: 2026-10-30 12:00
excerpt: 記事の要約
tags: 雑記, 音楽
---
```

見出しから記事ページの目次を自動生成します。Notes 一覧のタグフィルターも使えます。

## URL と公開設定

Astro の `build.format: 'preserve'` で、`profile.html`、`about.html`、Notes 記事の `.../index.html` 形式で出力します。記事は `/notes/YYYY/MM/DD/slug/` でも開けます。以前の `/blog/` URL からは対応する Notes ページへ自動転送します。公開時は `SITE_URL` 環境変数にサイトの絶対 URL を設定すると canonical URL と OGP に反映されます。

`public/.well-known/` の各ファイルはビルド時に `dist/.well-known/` へコピーされます。
