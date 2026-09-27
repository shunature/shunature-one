<?php
/**
 * Lightweight Zero-Dependency Markdown to HTML Parser with TOC Generator
 */
function parse_markdown($markdown) {
    // Normalize line endings
    $text = str_replace(["\r\n", "\r"], "\n", $markdown);
    
    // Code blocks (fenced)
    $text = preg_replace_callback('/```(\w*)\n(.*?)\n```/s', function($matches) {
        $lang = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $code = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
        return "<pre><code class=\"language-{$lang}\">{$code}</code></pre>";
    }, $text);

    // Split by block elements
    $lines = explode("\n", $text);
    $html = [];
    $in_list = false;
    $list_type = ''; // 'ul' or 'ol'
    $in_blockquote = false;

    foreach ($lines as $line) {
        $trimmed = trim($line);

        // Blank lines
        if ($trimmed === '') {
            if ($in_list) {
                $html[] = "</{$list_type}>";
                $in_list = false;
            }
            if ($in_blockquote) {
                $html[] = "</blockquote>";
                $in_blockquote = false;
            }
            continue;
        }

        // Horizontal rule
        if (preg_match('/^(---|\*\*\*|___)$/', $trimmed)) {
            if ($in_list) { $html[] = "</{$list_type}>"; $in_list = false; }
            if ($in_blockquote) { $html[] = "------------------"; $in_blockquote = false; }
            $html[] = "<hr>";
            continue;
        }

        // Headings
        if (preg_match('/^(#{1,6})\s+(.+)$/', $line, $m)) {
            if ($in_list) { $html[] = "</{$list_type}>"; $in_list = false; }
            if ($in_blockquote) { $html[] = "</blockquote>"; $in_blockquote = false; }
            $level = strlen($m[1]);
            $content = parse_inline_markdown($m[2]);
            $html[] = "<h{$level}>{$content}</h{$level}>";
            continue;
        }

        // Blockquotes
        if (preg_match('/^>\s?(.*)$/', $line, $m)) {
            if ($in_list) { $html[] = "</{$list_type}>"; $in_list = false; }
            if (!$in_blockquote) {
                $html[] = "blockquote>";
                $in_blockquote = true;
            }
            $html[] = "<p>" . parse_inline_markdown($m[1]) . "</p>";
            continue;
        }

        // Unordered lists (- or *)
        if (preg_match('/^[\-\*]\s+(.+)$/', $line, $m)) {
            if ($in_blockquote) { $html[] = "</blockquote>"; $in_blockquote = false; }
            if (!$in_list || $list_type !== 'ul') {
                if ($in_list) $html[] = "</{$list_type}>";
                $html[] = "<ul>";
                $in_list = true;
                $list_type = 'ul';
            }
            $html[] = "<li>" . parse_inline_markdown($m[1]) . "</li>";
            continue;
        }

        // Ordered lists (1. 2. etc)
        if (preg_match('/^\d+\.\s+(.+)$/', $line, $m)) {
            if ($in_blockquote) { $html[] = "</blockquote>"; $in_blockquote = false; }
            if (!$in_list || $list_type !== 'ol') {
                if ($in_list) $html[] = "</{$list_type}>";
                $html[] = "<ol>";
                $in_list = true;
                $list_type = 'ol';
            }
            $html[] = "<li>" . parse_inline_markdown($m[1]) . "</li>";
            continue;
        }

        // If line is preformatted code block HTML from earlier, output direct
        if (strpos($trimmed, '<pre><code') === 0 || strpos($trimmed, '</code></pre>') !== false) {
            $html[] = $line;
            continue;
        }

        // Standard Paragraph
        if ($in_list) { $html[] = "</{$list_type}>"; $in_list = false; }
        if ($in_blockquote) { $html[] = "</blockquote>"; $in_blockquote = false; }

        $content = parse_inline_markdown($line);
        $html[] = "<p>{$content}</p>";
    }

    if ($in_list) $html[] = "</{$list_type}>";
    if ($in_blockquote) $html[] = "</blockquote>";

    return implode("\n", $html);
}

function parse_inline_markdown($text) {
    // Images: ![alt](url)
    $text = preg_replace('/!\[([^\]]*)\]\(([^)]+)\)/', '<img src="$2" alt="$1" loading="lazy">', $text);
    // Links: [text](url)
    $text = preg_replace('/\[([^\]]+)\]\(([^)]+)\)/', '<a href="$2">$1</a>', $text);
    // Bold: **text** or __text__
    $text = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $text);
    $text = preg_replace('/__([^_]+)__/', '<strong>$1</strong>', $text);
    // Italic: *text* or _text_
    $text = preg_replace('/\*([^*]+)\*/', '<em>$1</em>', $text);
    $text = preg_replace('/_([^_]+)_/', '<em>$1</em>', $text);
    // Inline code: `code`
    $text = preg_replace('/`([^`]+)`/', '<code>$1</code>', $text);

    return $text;
}

/**
 * Generates Table of Contents (TOC) and inserts anchor IDs into h1, h2, h3 tags
 */
function generate_toc_and_content($html) {
    $toc = [];
    $index = 0;

    $html = preg_replace_callback('/<h([1-3])>(.*?)<\/h[1-3]>/i', function($matches) use (&$toc, &$index) {
        $index++;
        $level = (int)$matches[1];
        $text = strip_tags($matches[2]);
        $id = 'heading-' . $index;
        
        $toc[] = [
            'level' => $level,
            'text' => $text,
            'id' => $id
        ];

        return "<h{$level} id=\"{$id}\">{$matches[2]}</h{$level}>";
    }, $html);

    if (empty($toc)) {
        return ['toc_html' => '', 'body_html' => $html];
    }

    $tocHtml = '<nav class="table-of-contents" aria-label="目次">';
    $tocHtml .= '<p class="toc-title">目次</p><ul class="toc-list">';
    foreach ($toc as $item) {
        $indentClass = 'toc-level-' . $item['level'];
        $tocHtml .= "<li class=\"{$indentClass}\"><a href=\"#{$item['id']}\">" . htmlspecialchars($item['text']) . "</a></li>";
    }
    $tocHtml .= '</ul></nav>';

    return ['toc_html' => $tocHtml, 'body_html' => $html];
}
