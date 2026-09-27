<?php
require_once __DIR__ . '/../includes/functions.php';

// Check if post file is set externally (e.g. from static generator script)
if (!isset($post_file) && isset($_GET['file'])) {
    $post_file = __DIR__ . '/posts/' . basename($_GET['file']);
} elseif (!isset($post_file) && isset($_GET['slug'])) {
    $post_file = __DIR__ . '/posts/' . basename($_GET['slug']) . '.md';
}

if (!isset($post_file) || !file_exists($post_file)) {
    // Default fallback to first post if file not specified
    $files = glob(__DIR__ . '/posts/*.md');
    $post_file = !empty($files) ? $files[0] : null;
}

$post_data = $post_file ? parse_post_file($post_file) : null;
$meta = $post_data ? $post_data['metadata'] : ['title' => 'Post Not Found', 'date' => '', 'tags' => [], 'thumbnail' => ''];

$base_path = isset($base_path) ? $base_path : '../../';
$page_title = $meta['title'] . ' | 鯨とネガ';
$page_description = !empty($meta['excerpt']) ? $meta['excerpt'] : $meta['title'] . ' — 鯨とネガ (Whale and Negafilms)';
$current_page = 'blog_post';
$og_type = 'article';
$og_image = !empty($meta['thumbnail']) ? $base_path . $meta['thumbnail'] : $base_path . 'images/kujira_to_nega.png';

$toc_result = $post_data ? generate_toc_and_content($post_data['body']) : ['toc_html' => '', 'body_html' => ''];
$toc_html = $toc_result['toc_html'];
$body_html = $toc_result['body_html'];

require __DIR__ . '/../includes/head.php';
?>

<div class="layout-wrapper">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>

  <main class="main-content animate-fade-in">
    <?php if (!$post_data): ?>
      <h1 class="page-title">記事が見つかりませんでした</h1>
      <p><a href="<?php echo $base_path; ?>blog/index.html">&larr; ブログ一覧へ戻る</a></p>
    <?php else: ?>
      <article>
        <header style="margin-bottom: 24px; border-bottom: 2px solid var(--line); padding-bottom: 20px;">
          <div class="article-meta">
            <time datetime="<?php echo htmlspecialchars($meta['date']); ?>"><?php echo htmlspecialchars($meta['date']); ?></time>
            <?php if (!empty($meta['tags'])): ?>
              &bull; <?php echo htmlspecialchars(implode(', ', $meta['tags'])); ?>
            <?php endif; ?>
          </div>
          <h1 class="page-title" style="margin-top: 8px;"><?php echo htmlspecialchars($meta['title']); ?></h1>
        </header>

        <!-- Post Hero Thumbnail -->
        <?php if (!empty($meta['thumbnail'])): ?>
          <div class="article-hero-thumb">
            <img src="<?php echo $base_path . $meta['thumbnail']; ?>" alt="<?php echo htmlspecialchars($meta['title']); ?>">
          </div>
        <?php endif; ?>

        <!-- Table of Contents (TOC) -->
        <?php if (!empty($toc_html)): ?>
          <?php echo $toc_html; ?>
        <?php endif; ?>

        <div class="article-body">
          <?php echo $body_html; ?>
        </div>

        <footer style="margin-top: 48px; padding-top: 24px; border-top: 2px solid var(--line);">
          <a href="<?php echo $base_path; ?>blog/index.html" style="font-weight: 700;">&larr; ブログ一覧へ戻る</a>
        </footer>
      </article>
    <?php endif; ?>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
