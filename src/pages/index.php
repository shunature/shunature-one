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
    <section class="hero-container animate-fade-in">
      <div class="hero-text">
        <h1>わどわど<br><span style="font-size: 0.65em; font-weight: 700; color: var(--muted);">WadoWado Studios</span></h1>
        <p class="hero-intro">ホームページへようこそ。</p>
        <p style="font-size: 1em; color: var(--muted);">
          このサイトは、個人の趣味・興味に基づいて運営されています。<br>
          関連する組織・団体とは一切関係ありませんので、悪しからず。
        </p>
      </div>
      <div class="photo-card" title="Gyoza Photo">
        <img src="https://image.nostr.build/f204c4c0b5912a0a305cf5a9f56850173271a0a8ee2103593c9e1b217b3766be.png" alt="Gyoza">
      </div>
    </section>

    <section class="section-block animate-fade-in">
      <h2 class="section-title">サイト名の由来</h2>
      <p>
        「<strong>わどわど</strong>」は、あまりみなさそうな擬音から取りました。<br>
        使う時が来たらと思い、Studiosをつけてみました。<br>
        実のところ、MastodonのIDを先行で思いつき、この名前はあとづけで決めました。
      </p>
    </section>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
