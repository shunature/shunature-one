<?php
$base_path = isset($base_path) ? $base_path : './';
$current_page = isset($current_page) ? $current_page : 'home';
?>
<!-- Mobile Header (Visible on Mobile) -->
<header class="mobile-header">
  <a class="brand" href="<?php echo $base_path; ?>index.html">
    <span class="brand-mark" aria-hidden="true"></span>
    <span class="brand-name">わどわど<span>WadoWado Studios</span></span>
  </a>
  <div class="header-actions">
    <button class="theme-toggle" type="button" aria-label="テーマ切り替え"></button>
    <button class="menu-toggle" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">MENU</button>
  </div>
</header>

<!-- Mobile Slide-out Drawer Menu -->
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav aria-label="モバイルメニュー">
    <a href="<?php echo $base_path; ?>index.html" class="<?php echo $current_page === 'home' ? 'active' : ''; ?>">ホーム</a>
    <a href="<?php echo $base_path; ?>profile.html" class="<?php echo $current_page === 'profile' ? 'active' : ''; ?>">プロフィール</a>
    <a href="<?php echo $base_path; ?>about.html" class="<?php echo $current_page === 'about' ? 'active' : ''; ?>">このサイトについて</a>
    <details class="mobile-contents" <?php echo in_array($current_page, ['blog', 'netradio'], true) ? 'open' : ''; ?>>
      <summary>Contents</summary>
      <a href="<?php echo $base_path; ?>blog/index.html" class="<?php echo $current_page === 'blog' ? 'active' : ''; ?>">Blog</a>
      <a href="<?php echo $base_path; ?>netradio/index.html" class="<?php echo $current_page === 'netradio' ? 'active' : ''; ?>">Netradio</a>
    </details>
    <a href="#contact-modal" class="modal-trigger">Contact</a>
  </nav>
</div>

<!-- Desktop Sidebar (Visible on Desktop) -->
<aside class="site-sidebar">
  <div class="sidebar-inner">
    <div class="sidebar-brand">
      <a class="brand" href="<?php echo $base_path; ?>index.html">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-title">わどわど</span>
      </a>
      <p class="brand-subtitle">WadoWado Studios</p>
    </div>

    <nav class="sidebar-nav" aria-label="メインナビゲーション">
      <ul>
        <li><a href="<?php echo $base_path; ?>index.html" class="<?php echo $current_page === 'home' ? 'active' : ''; ?>">ホーム</a></li>
        <li><a href="<?php echo $base_path; ?>profile.html" class="<?php echo $current_page === 'profile' ? 'active' : ''; ?>">プロフィール</a></li>
        <li><a href="<?php echo $base_path; ?>about.html" class="<?php echo $current_page === 'about' ? 'active' : ''; ?>">このサイトについて</a></li>
        <li class="nav-dropdown">
          <details <?php echo in_array($current_page, ['blog', 'netradio'], true) ? 'open' : ''; ?>>
            <summary>Contents</summary>
            <div class="dropdown-links">
              <a href="<?php echo $base_path; ?>blog/index.html" class="<?php echo $current_page === 'blog' ? 'active' : ''; ?>">Blog</a>
              <a href="<?php echo $base_path; ?>netradio/index.html" class="<?php echo $current_page === 'netradio' ? 'active' : ''; ?>">Netradio</a>
            </div>
          </details>
        </li>
        <li><a href="#contact-modal" class="modal-trigger">Contact</a></li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button class="theme-toggle" type="button" aria-label="テーマ切り替え">
        <span class="theme-label">テーマ切り替え</span>
      </button>
      <p class="copyright">&copy; 2026 WadoWado Studios</p>
    </div>
  </div>
</aside>
