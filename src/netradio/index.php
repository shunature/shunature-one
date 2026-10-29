<?php
$page_title = 'NetRadio';
$page_description = 'ニコニコ動画での配信を予定しているラジオ形式の動画です。';
$current_page = 'netradio';
$base_path = '../';
require __DIR__ . '/../includes/head.php';
?>

<div class="layout-wrapper">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>
  <main class="main-content animate-fade-in">
    <p class="page-kicker">WADOWADO STUDIOS / CONTENTS</p>
    <h1 class="page-title">話してもいいですか？</h1>
    <p class="page-subtitle">ニコニコ動画での配信を予定している、ラジオ形式の動画です。</p>
    <section class="netradio-panel">
      <span class="netradio-orbit" aria-hidden="true">♤</span>
      <div>
        <p class="netradio-label">LATEST</p>
        <h2>配信中のエピソード一覧</h2>
        <ul class="netradio-episode-list">
          <li>
            <a href="https://www.nicovideo.jp/watch/sm46980387?ref=garage_share_other" target="_blank" rel="noopener noreferrer">第1回「寒すぎるだろ、10月末のくせして。」</a>
          </li>
        </ul>
      </div>
    </section>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
