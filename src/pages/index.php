<?php
$page_title = '鯨とネガ — Whale and Negafilms';
$page_description = '鯨とネガ (Whale and Negafilms)';
$current_page = 'home';
$base_path = './';
require __DIR__ . '/../includes/head.php';
?>

<div class="layout-wrapper">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>

  <main class="main-content">
    <section class="hero-container animate-fade-in">
      <div class="hero-text">
        <h1>鯨とネガ<br><span style="font-size: 0.65em; font-weight: 700; color: var(--muted);">Whale and Negafilms</span></h1>
        <p class="hero-intro">
          ホームページへようこそ。
        </p>
      </div>

      <!-- Single Photo Card with Animation -->
      <div class="photo-card" title="Gyoza Photo">
        <img src="https://image.nostr.build/f204c4c0b5912a0a305cf5a9f56850173271a0a8ee2103593c9e1b217b3766be.png" alt="Gyoza">
      </div>
    </section>

    <!-- Origin & Concept of Site Name -->
    <section class="section-block animate-fade-in">
      <h2 class="section-title">サイト名の由来</h2>
      <p>
        「<strong>鯨とネガ</strong>」は、某コンテナで有名な鯨と、フイルムカメラのフィルムで用いられる「ネガティヴフィルム（ネガ）」を組み合わせた造語です。<br>
        実のところ、MastodonのIDを先行で思いつき、この名前はあとづけで決めました。
      </p>
    </section>

    <section class="section-block animate-fade-in">
      <h2 class="section-title">Links & Presence</h2>
      <nav class="social-links" aria-label="外部リンク">
        <a rel="me" href="https://famichiki.jp/@dockker7mb" target="_blank">Mastodon</a>
        <a href="https://matrix.to/#/@shunature:matrix.org" target="_blank">Matrix</a>
        <a href="https://signal.me/#eu/UaFw5dUSJqKwsd-DzyAxd8fXuJaIXFKuSsxNX_nOuCin02HaRHtOnYznwzBm-nU5" target="_blank">Signal</a>
        <a href="https://www.last.fm/user/shunature" target="_blank">Last.fm</a>
      </nav>
    </section>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
