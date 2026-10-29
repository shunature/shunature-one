<?php
$page_title = 'Home';
$page_description = 'わどわど (WadoWado Studios)';
$current_page = 'home';
$base_path = './';
require __DIR__ . '/../includes/head.php';
?>

<div class="layout-wrapper">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>

  <main class="main-content">
    <section class="hero-slideshow animate-fade-in" aria-label="WadoWado Studios slideshow">
      <div class="hero-slide is-active"></div>
      <div class="hero-slide"></div>
      <div class="hero-slide"></div>
      <div class="hero-shade"></div>
      <div class="hero-text">
        <p class="hero-eyebrow">PHOTOGRAPHY</p>
        <h1>わどわど</h1>
        <p class="hero-intro">小さな景色を、写真に。</p>
        <p class="hero-disclaimer">WADOWADO STUDIOS — SELECTED MOMENTS</p>
      </div>
      <div class="slide-pagination" aria-label="スライドの切り替え">
        <button type="button" class="is-active" aria-label="1枚目を表示" aria-pressed="true"></button>
        <button type="button" aria-label="2枚目を表示" aria-pressed="false"></button>
        <button type="button" aria-label="3枚目を表示" aria-pressed="false"></button>
      </div>
      <span class="hero-index" aria-hidden="true">01 <i></i> 03</span>
    </section>

  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
