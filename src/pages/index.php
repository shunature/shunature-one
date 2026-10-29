<?php
$page_title = 'Home';
$page_description = 'わどわど (WadoWado Studios)';
$current_page = 'home';
$base_path = './';
$hero_slides = [
  'forest.png',
  'sample.png',
  'kujira_to_nega.png',
];
require __DIR__ . '/../includes/head.php';
?>

<div class="layout-wrapper layout-home">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>

  <main class="main-content">
    <section class="hero-slideshow animate-fade-in" aria-label="WadoWado Studios slideshow">
      <?php foreach ($hero_slides as $index => $slide): ?>
        <div class="hero-slide<?php echo $index === 0 ? ' is-active' : ''; ?>" aria-hidden="true">
          <img src="<?php echo htmlspecialchars($base_path . 'images/' . $slide, ENT_QUOTES, 'UTF-8'); ?>" alt="">
        </div>
      <?php endforeach; ?>
      <div class="hero-shade"></div>
      <div class="hero-text">
        <p class="hero-eyebrow">PHOTOGRAPHY</p>
        <h1>わどわど</h1>
        <p class="hero-intro">小さな景色を、写真に。</p>
        <p class="hero-disclaimer">WADOWADO STUDIOS — SELECTED MOMENTS</p>
      </div>
      <div class="slide-pagination" aria-label="スライドの切り替え">
        <?php foreach ($hero_slides as $index => $slide): ?>
          <button type="button" class="<?php echo $index === 0 ? 'is-active' : ''; ?>" aria-label="<?php echo $index + 1; ?>枚目を表示" aria-pressed="<?php echo $index === 0 ? 'true' : 'false'; ?>"></button>
        <?php endforeach; ?>
      </div>
      <span class="hero-index" aria-hidden="true">01 <i></i> <?php echo str_pad((string) count($hero_slides), 2, '0', STR_PAD_LEFT); ?></span>
    </section>

  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
