<?php
$page_title = 'Blog | 鯨とネガ';
$page_description = '鯨とネガ (Whale and Negafilms) のブログ記事一覧です';
$current_page = 'blog';
$base_path = '../';

require_once __DIR__ . '/../includes/functions.php';
require __DIR__ . '/../includes/head.php';

$posts = get_all_posts(__DIR__ . '/posts');

// Extract all unique tags
$all_tags = [];
foreach ($posts as $p) {
    if (!empty($p['tags'])) {
        foreach ($p['tags'] as $t) {
            $all_tags[trim($t)] = true;
        }
    }
}
$all_tags = array_keys($all_tags);
sort($all_tags);
?>

<div class="layout-wrapper">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>

  <main class="main-content animate-fade-in">
    <h1 class="page-title">ブログ</h1>
    <p class="page-subtitle">Blog Articles List</p>

    <!-- Tag Filter Bar -->
    <?php if (!empty($all_tags)): ?>
      <div class="tag-filter-bar" aria-label="タグフィルター">
        <span class="filter-label">タグ:</span>
        <button type="button" class="tag-filter-btn active" data-tag="all">すべて</button>
        <?php foreach ($all_tags as $tag): ?>
          <button type="button" class="tag-filter-btn" data-tag="<?php echo htmlspecialchars($tag); ?>">
            #<?php echo htmlspecialchars($tag); ?>
          </button>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <div class="article-list" id="article-list">
      <?php if (empty($posts)): ?>
        <p>記事がまだありません。</p>
      <?php else: ?>
        <?php foreach ($posts as $post): ?>
          <article class="article-item" data-tags="<?php echo htmlspecialchars(implode(',', $post['tags'])); ?>">
            <?php if (!empty($post['thumbnail'])): ?>
              <a href="<?php echo $base_path . $post['url_path']; ?>" class="article-item-thumb">
                <img src="<?php echo $base_path . $post['thumbnail']; ?>" alt="<?php echo htmlspecialchars($post['title']); ?>" loading="lazy">
              </a>
            <?php endif; ?>

            <div class="article-item-body">
              <div class="article-meta">
                <time datetime="<?php echo htmlspecialchars($post['date']); ?>"><?php echo htmlspecialchars($post['date']); ?></time>
                <?php if (!empty($post['tags'])): ?>
                  <span class="meta-divider">•</span> <?php echo htmlspecialchars(implode(', ', $post['tags'])); ?>
                <?php endif; ?>
              </div>

              <h2 class="article-item-title">
                <a href="<?php echo $base_path . $post['url_path']; ?>">
                  <?php echo htmlspecialchars($post['title']); ?>
                </a>
              </h2>

              <?php if (!empty($post['excerpt'])): ?>
                <p class="article-item-excerpt"><?php echo htmlspecialchars($post['excerpt']); ?></p>
              <?php endif; ?>
            </div>
          </article>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
