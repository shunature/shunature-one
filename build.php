<?php
/**
 * PHP Static Site Generator Script for shunature-one
 * Usage: php build.php
 */

echo "===> Starting Static Site Generator...\n";

$rootDir = __DIR__;
$srcDir  = $rootDir . '/src';
$pubDir  = $rootDir . '/public';
$distDir = $rootDir . '/dist';

// Helper function to recursively remove directory
function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object !== "." && $object !== "..") {
                if (is_dir($dir . "/" . $object) && !is_link($dir . "/" . $object)) {
                    rrmdir($dir . "/" . $object);
                } else {
                    unlink($dir . "/" . $object);
                }
            }
        }
        rmdir($dir);
    }
}

// Helper function to copy directory recursively
function copy_dir($src, $dst) {
    if (!is_dir($src)) return;
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    while (false !== ($file = readdir($dir))) {
        if (($file !== '.') && ($file !== '..')) {
            if (is_dir($src . '/' . $file)) {
                copy_dir($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

// Clean and recreate dist directory
if (is_dir($distDir)) {
    rrmdir($distDir);
}
mkdir($distDir, 0755, true);

// Copy public assets to dist
echo "-> Copying public assets (css, js, images, thumbnails, favicons)...\n";
copy_dir($pubDir, $distDir);

// Render PHP Page to File Helper
function render_php_page($sourcePhp, $targetHtml, $vars = []) {
    extract($vars);
    ob_start();
    require $sourcePhp;
    $content = ob_get_clean();
    
    $dir = dirname($targetHtml);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($targetHtml, $content);
    echo "   [CREATED] " . str_replace(__DIR__ . '/', '', $targetHtml) . "\n";
}

echo "-> Building core pages...\n";
render_php_page($srcDir . '/pages/index.php', $distDir . '/index.html', ['base_path' => './']);
render_php_page($srcDir . '/pages/profile.php', $distDir . '/profile.html', ['base_path' => './']);
render_php_page($srcDir . '/pages/about.php', $distDir . '/about.html', ['base_path' => './']);

echo "-> Building blog index page...\n";
render_php_page($srcDir . '/blog/index.php', $distDir . '/blog/index.html', ['base_path' => '../']);

echo "-> Building blog article detail pages...\n";
require_once $srcDir . '/includes/functions.php';

$postsDir = $srcDir . '/blog/posts';
if (is_dir($postsDir)) {
    $directory = new RecursiveDirectoryIterator($postsDir);
    $iterator = new RecursiveIteratorIterator($directory);

    foreach ($iterator as $info) {
        if ($info->isFile() && strtolower($info->getExtension()) === 'md') {
            $file = $info->getPathname();
            $postData = parse_post_file($file);
            if (!$postData) continue;

            $meta = $postData['metadata'];
            // Target output: dist/blog/YYYY/MM/DD/slug/index.html
            $targetHtml = $distDir . '/' . $meta['url_path'];

            // Calculate relative base_path depth (blog/YYYY/MM/DD/slug = 5 levels)
            $depth = count(explode('/', trim($meta['url_path'], '/'))) - 1;
            $base_path = str_repeat('../', $depth);

            render_php_page($srcDir . '/blog/post.php', $targetHtml, [
                'post_file' => $file,
                'base_path' => $base_path,
                'current_page' => 'blog'
            ]);
        }
    }
}

echo "===> Static Site Generation Completed Successfully!\n";
echo "Output Directory: " . $distDir . "\n";
