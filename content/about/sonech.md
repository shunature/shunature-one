---
title: Sonech
description: このサイトを一緒に作っている存在。
---

<!-- 概要 -->
<div class="info-section">
  <p class="section-label">Overview</p>
  <div class="prose">
    <p>このサイト（INDM / shunature.one）は、Anthropicが開発したAIアシスタント「Claude Sonnet 4.6」との協働により制作されました。</p>
    <p>コード設計・実装・デバッグのほか、構成の提案やデザインの方向性の検討においても活用しており、サイトの技術的基盤の大部分はClaudeとの対話を通じて構築されています。</p>
  </div>
</div>

<hr class="divider">

<!-- モデル情報 -->
<div class="info-section">
  <p class="section-label">Model Info</p>
  <div class="info-grid">
    <div class="info-row">
      <span class="info-key">Model</span>
      <span class="info-val">Claude Sonnet 4.6</span>
    </div>
    <div class="info-row">
      <span class="info-key">Family</span>
      <span class="info-val">Claude 4.6</span>
    </div>
    <div class="info-row">
      <span class="info-key">Developer</span>
      <span class="info-val"><a href="https://www.anthropic.com" target="_blank">Anthropic</a></span>
    </div>
    <div class="info-row">
      <span class="info-key">Interface</span>
      <span class="info-val">Claude.ai</span>
    </div>
    <div class="info-row">
      <span class="info-key">Nickname</span>
      <span class="info-val">そねち / sonech</span>
    </div>
  </div>
</div>

<hr class="divider">

<!-- 制作での役割 -->
<div class="info-section">
  <p class="section-label">Role in This Site</p>
  <div class="card-list">
    <div class="card">
      <p class="card-title">HTML / CSS / JavaScript</p>
      <p class="card-desc">index.html、style.css、blog・galleryページのコーディング。レスポンシブデザイン、ライト／ダークモード対応、アニメーション実装。</p>
    </div>
    <div class="card">
      <p class="card-title">Hugo テンプレート</p>
      <p class="card-desc">静的サイト化に際し、list.html・single.htmlなどのHugoレイアウト設計。タグ管理・記事一覧・OGP・RSS・sitemapの構築。</p>
    </div>
    <div class="card">
      <p class="card-title">デプロイ・自動化</p>
      <p class="card-desc">Incusコンテナ上で動作するデプロイスクリプト設計。sharp.jsによるWebP自動変換、フロントマター自動補完、予約投稿のtouch処理、git push自動化。</p>
    </div>
    <div class="card">
      <p class="card-title">サイト構成・ファイル管理</p>
      <p class="card-desc">コンテンツ種別ごとのフォルダ構成設計、定期連載・単発記事の管理方針の整理。</p>
    </div>
  </div>
</div>

<hr class="divider">

<!-- サイトの変遷 -->
<div class="info-section">
  <p class="section-label">Site History</p>
  <div class="prose">
    <p>INDMはいくつかの転換点を経て現在の形になっています。</p>
    <p>当初はカスタムCMS（AirPubre）とIncusコンテナ、GitHubリポジトリ、シンフリーサーバーを組み合わせた構成でした。3ヶ月ごとの継続申請が必要なホスティングの制約をきっかけに、2026年春、GitHub + Vercelベースの構成へ移行。Gallery・Wallpaper・Mastodon自動投稿など、維持コストの高い機能を整理し、ブログを中心としたシンプルな構成に絞りました。</p>
    <p>また同時期にHugoを導入し、独自のMarkdownパイプラインから静的サイトジェネレーターへ移行。予約投稿・WebP自動変換・タイムゾーン補完といった自動化はIncusコンテナ上のスクリプトで継続しています。</p>
  </div>
</div>

<hr class="divider">

<!-- Anthropicについて -->
<div class="info-section">
  <p class="section-label">About Anthropic</p>
  <div class="prose">
    <p>AnthropicはAIの安全性研究を中心に据えたAI企業です。有害なコンテンツの生成を防ぐための安全対策（セーフガード）を重視しており、信頼性の高いAIシステムの開発を目標としています。</p>
    <p>詳細は<a href="https://www.anthropic.com" target="_blank">anthropic.com</a>をご参照ください。</p>
  </div>
</div>

<hr class="divider">

<p class="note">このページはサイト運営者（Shun Tonegawa）が手動で管理しています。掲載情報はサイト制作時点のものであり、モデルの仕様等は予告なく変更される場合があります。</p>