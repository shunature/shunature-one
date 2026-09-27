<?php
$page_title = isset($page_title) ? $page_title : '鯨とネガ — Whale and Negafilms';
$page_description = isset($page_description) ? $page_description : '鯨とネガ (Whale and Negafilms)';
$base_path = isset($base_path) ? $base_path : './';
$current_page = isset($current_page) ? $current_page : '';
$og_type = isset($og_type) ? $og_type : ($current_page === 'blog_post' ? 'article' : 'website');
$og_image = isset($og_image) && !empty($og_image) ? $og_image : $base_path . 'images/kujira_to_nega.png';
?>
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="<?php echo $base_path; ?>favicon.png">
  <meta name="description" content="<?php echo htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="fediverse:creator" content="@dockker7mb@famichiki.jp">

  <!-- Open Graph Protocol (OGP) -->
  <meta property="og:site_name" content="鯨とネガ">
  <meta property="og:title" content="<?php echo htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:description" content="<?php echo htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:type" content="<?php echo $og_type; ?>">
  <meta property="og:image" content="<?php echo $og_image; ?>">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?php echo htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="twitter:description" content="<?php echo htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="twitter:image" content="<?php echo $og_image; ?>">

  <title><?php echo htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8'); ?></title>
  <link rel="stylesheet" href="<?php echo $base_path; ?>css/style.css">
</head>
<body>
<?php if ($current_page === 'home'): ?>
  <!-- Loader Animation Overlay ("鯨" -> "と" -> "ネガ") - Only rendered on index page -->
  <div id="loader-overlay" class="loader-overlay" aria-hidden="true">
    <div class="loader-text">
      <span class="char-1">鯨</span><span class="char-2">と</span><span class="char-3">ネガ</span>
    </div>
  </div>
<?php endif; ?>
