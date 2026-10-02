<?php
require_once __DIR__ . '/markdown.php';

/**
 * Parses frontmatter and body from Markdown content.
 * Supports /blog/posts/:year:/:month:/:day:/slug.md structure
 * and /thumbnails/:year:/:month:/:day:/slug.png thumbnails.
 */
function parse_post_file($filePath) {
    if (!file_exists($filePath)) {
        return null;
    }
    
    $content = file_get_contents($filePath);
    $filename = pathinfo($filePath, PATHINFO_FILENAME);

    $normalizedPath = str_replace('\\', '/', $filePath);
    if (preg_match('#/posts/(\d{4})/(\d{2})/(\d{2})/(.+)\.md$#', $normalizedPath, $m)) {
        $year = $m[1];
        $month = $m[2];
        $day = $m[3];
        $slug = $m[4];
        $date = "{$year}-{$month}-{$day}";
    } else {
        if (preg_match('/^(\d{4}-\d{2}-\d{2})-(.+)$/', $filename, $m)) {
            $date = $m[1];
            $slug = $m[2];
            list($year, $month, $day) = explode('-', $date);
        } else {
            $date = date('Y-m-d', filemtime($filePath));
            $slug = $filename;
            list($year, $month, $day) = explode('-', $date);
        }
    }

    $thumbnailRelPath = "thumbnails/{$year}/{$month}/{$day}/{$slug}.png";
    $thumbnailFullPath = __DIR__ . '/../../public/' . $thumbnailRelPath;
    $hasThumbnail = file_exists($thumbnailFullPath);

    // フロントマターに明示的な date: があるかを追跡するフラグ
    $dateFromFrontmatter = false;

    $metadata = [
        'title'     => $slug,
        'date'      => $date,
        'year'      => $year,
        'month'     => $month,
        'day'       => $day,
        'slug'      => $slug,
        'excerpt'   => '',
        'cover'     => '',
        'tags'      => [],
        'draft'     => false,
        'thumbnail' => $hasThumbnail ? $thumbnailRelPath : 'images/kujira_to_nega.png',
        'url_path'  => "blog/{$year}/{$month}/{$day}/{$slug}/index.html",
        'path'      => $filePath
    ];

    $markdownBody = $content;

    if (preg_match('/^---\s*\n(.*?)\n---\s*\n(.*)$/s', $content, $matches)) {
        $frontmatterStr = $matches[1];
        $markdownBody = $matches[2];

        $lines = explode("\n", $frontmatterStr);
        foreach ($lines as $line) {
            if (strpos($line, ':') !== false) {
                list($key, $val) = explode(':', $line, 2);
                $key = trim($key);
                $val = trim($val);
                $val = trim($val, "\"'");

                if ($key === 'tags') {
                    $metadata['tags'] = array_map('trim', explode(',', $val));
                } elseif ($key === 'draft') {
                    // "true" / "1" / "yes" を true として扱う
                    $metadata['draft'] = in_array(strtolower($val), ['true', '1', 'yes'], true);
                } elseif ($key === 'date') {
                    $metadata['date'] = $val;
                    $dateFromFrontmatter = true;
                } else {
                    $metadata[$key] = $val;
                }
            }
        }
    }

    // draft: true または date: が書かれていない場合は下書き扱い
    if (!$dateFromFrontmatter) {
        $metadata['draft'] = true;
    }

    $htmlBody = parse_markdown($markdownBody);

    return [
        'metadata' => $metadata,
        'body'     => $htmlBody,
        'raw_body' => $markdownBody
    ];
}

/**
 * Scans the blog posts directory recursively and returns an array of post metadata sorted by date (newest first).
 */
function get_all_posts($postsDir = null) {
    if (!$postsDir) {
        $postsDir = __DIR__ . '/../blog/posts';
    }

    if (!is_dir($postsDir)) {
        return [];
    }

    $directory = new RecursiveDirectoryIterator($postsDir);
    $iterator = new RecursiveIteratorIterator($directory);
    $posts = [];

    foreach ($iterator as $info) {
        if ($info->isFile() && strtolower($info->getExtension()) === 'md') {
            $postData = parse_post_file($info->getPathname());
            if ($postData) {
                $posts[] = $postData['metadata'];
            }
        }
    }

    usort($posts, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });

    return $posts;
}
