<?php
$page_title = 'About | 鯨とネガ';
$page_description = '鯨とネガ (Whale and Negafilms) の設計思想、制作の動機、ゼロ依存PHP＋Markdownの技術スタック';
$current_page = 'about';
$base_path = './';
require __DIR__ . '/../includes/head.php';
?>

<div class="layout-wrapper">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>

  <main class="main-content animate-fade-in">
    <h1 class="page-title">このサイトについて</h1>
    <p class="page-subtitle">Whale and Negafilms — Technical Architecture & Philosophy</p>

    <div style="max-width: 740px;">
      <section style="margin-bottom: 36px;">
        <h2 class="section-title">動機とコンセプト</h2>
        <p>
          まず、断りを入れておきましょう。<br>
          サイト全体にAIやフレームワークを導入することは、決して悪いことではありませんし、このサイト自体デザインをClaude、コードをAntigravityにお任せしました。<br>
          <br>
          ですが、いろいろと進化して、それに依存をしてきましたね。<br>
          WordPressに、AIに。<br>
          しかし、「<strong>AIやフレームワークに<strong>頼り切る</strong>よりも、自分で中身がわかる仕組みを組む方が、結果的に理解しやすく長期的な運用も楽なのでは？</strong>」と考えたことが、このサイトを構築したきっかけです。
        </p>
        <p>
          また、ごちゃついた表現を削ぎ落とし、閲覧者にとっても制作者にとっても視認性と取り回しの良さを最優先した設計を行なっています。
        </p>
      </section>

      <section style="margin-bottom: 36px;">
        <h2 class="section-title">技術スタック（Tech Stack）</h2>
        <p>
          このサイトは、外部のライブラリやヘビーなビルドツール（Node.js/npmパッケージ等）を一切使用せず、<strong>純粋なPHPとVanilla JS / CSS</strong> のみで構成されています。
        </p>

        <ul style="line-height: 2; padding-left: 20px;">
          <li><strong>テンプレートエンジン (PHP 8.x)</strong>: `src/pages/` 配下でページを記述し、`src/includes/` でパーツ化。</li>
          <li><strong>ゼロ依存 Markdown パーサー</strong>: `src/includes/markdown.php` にて自作の軽量パーサーを実装。`.md` ファイルから見出し、太字、コードブロック、画像をパース。</li>
          <li><strong>静的サイトジェネレーター (`build.php`)</strong>: PHPの出力バッファリングを利用して `dist/` ディレクトリに高速なHTMLを出力。</li>
          <li><strong>レスポンシブ CSS</strong>: 画面幅に応じたPCサイドバー／スマホヘッダー・ドロワー切替、CSS変数を活用したダークモード対応。</li>
        </ul>
      </section>

      <section style="margin-bottom: 36px;">
        <h2 class="section-title">仕組みと運用フロー（Workflow）</h2>
        
        <div style="padding: 20px; border: 2px solid var(--line); background: var(--surface); margin-top: 16px;">
          <h3 style="margin: 0 0 12px; font-size: 17px;">1. ローカル編集</h3>
          <p style="margin: 0 0 12px; font-size: 14px; color: var(--muted);">
            記事を書くときは `src/blog/posts/*.md` にファイルを追加するだけ。画像は `public/images/` に配置します。
          </p>

          <h3 style="margin: 0 0 12px; font-size: 17px;">2. ビルド (`php build.php`)</h3>
          <p style="margin: 0 0 12px; font-size: 14px; color: var(--muted);">
            `php build.php` を1回実行すると、PHPとMarkdownがコンパイルされ、`dist/` ディレクトリに完全な静的HTML/CSS/JSが出力されます。
          </p>

          <h3 style="margin: 0 0 12px; font-size: 17px;">3. プラットフォーム非依存のデプロイ</h3>
          <p style="margin: 0; font-size: 14px; color: var(--muted);">
            生成物 `dist/` を Vercel、Firebase Hosting、Cloudflare Pages 等の静的ホスティングにコミット＆Pushするだけで世界中に配信されます。
          </p>
        </div>
      </section>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--line);">
        <a href="<?php echo $base_path; ?>index.html" style="font-weight: 700;">&larr; ホームへ戻る</a>
      </div>
    </div>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
