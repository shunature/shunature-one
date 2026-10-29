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
      <span class="netradio-orbit" aria-hidden="true">◉</span>
      <div>
        <p class="netradio-label">NICONICO</p>
        <h2>ただいま準備中</h2>
        <p>動画の公開を開始したら、このページからお知らせします。</p>
      </div>
    </section>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
