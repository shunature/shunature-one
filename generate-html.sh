#!/bin/bash
# generate-html.sh
# posts.jsonとmdファイルから記事詳細HTMLを生成する

REPO="$(cd "$(dirname "$0")" && pwd)"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1"
}

cd "$REPO" || exit 1
log "記事HTML生成開始..."

node - << 'JS'
const fs     = require('fs');
const path   = require('path');
const { marked } = require('marked');

const postsDir  = './blog/posts';
const outputDir = './blog/p';
const base      = 'https://shunature.one';

// marked設定
marked.setOptions({ breaks: true, gfm: true });

// posts.json読み込み
let posts = [];
try {
    posts = JSON.parse(fs.readFileSync('./blog/posts.json', 'utf-8'));
} catch(e) {
    console.error('posts.jsonが見つかりません。先にgenerate-posts.shを実行してください。');
    process.exit(1);
}

const esc = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function formatDate(dateStr) {
    const d = new Date(dateStr.includes('+') || dateStr.includes('Z') ? dateStr : dateStr + '+09:00');
    return d.toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo'
    });
}

let generated = 0;
let skipped   = 0;

for (const p of posts) {
    const slug   = p.slug;                              // 例: scene/27
    const mdPath = path.join(postsDir, slug + '.md');   // 例: blog/scene/27.md

    if (!fs.existsSync(mdPath)) {
        console.log(`Skip (md not found): ${slug}`);
        skipped++;
        continue;
    }

    const raw  = fs.readFileSync(mdPath, 'utf-8');
    const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
    const htmlBody = marked(body);

    const url         = `${base}/blog/${slug}/`;
    const image       = p.thumbnail
        ? `${base}/blog/thumbnails/${p.thumbnail}`
        : `${base}/assets/icon.png`;
    const description = p.summary
        || body.replace(/[#*`\[\]!>]/g, '').trim().slice(0, 200);
    const titleFull   = `${p.title} — Picturebook from shunature`;

    // サムネ
    const thumbHtml = p.thumbnail ? `
    <div class="article-thumb">
        <img src="/blog/thumbnails/${esc(p.thumbnail)}" alt="${esc(p.title)}">
        ${p.thumbnail_credit ? `<p class="thumb-credit">${
            p.thumbnail_credit_url
                ? `<a href="${esc(p.thumbnail_credit_url)}" target="_blank" rel="noopener">${esc(p.thumbnail_credit)}</a>`
                : esc(p.thumbnail_credit)
        }</p>` : ''}
    </div>` : '';

    // タグ
    const tagsHtml = (p.tags || []).length ? `
    <div class="article-tags">
        ${(p.tags).map(t => `<a href="/blog/?tag=${encodeURIComponent(t)}" class="article-tag">${esc(t)}</a>`).join('')}
    </div>` : '';

    // 前後の記事
    const idx  = posts.indexOf(p);
    const prev = posts[idx - 1] || null;  // 新しい記事
    const next = posts[idx + 1] || null;  // 古い記事

    const prevNextHtml = `
    <nav class="article-nav">
        <div class="article-nav-item">
            ${next ? `<a href="/blog/${next.slug}/" class="article-nav-link prev">
                <span class="article-nav-label">← Older</span>
                <span class="article-nav-title">${esc(next.title)}</span>
            </a>` : ''}
        </div>
        <div class="article-nav-item" style="text-align:right;">
            ${prev ? `<a href="/blog/${prev.slug}/" class="article-nav-link next">
                <span class="article-nav-label">Newer →</span>
                <span class="article-nav-title">${esc(prev.title)}</span>
            </a>` : ''}
        </div>
    </nav>`;

    const html = `<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titleFull)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(titleFull)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:site_name" content="Picturebook from shunature">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titleFull)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<meta name="fediverse:creator" content="@shunature@hogus.work">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
<style>
.article-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
}
.article-nav-link {
    display: flex;
    flex-direction: column;
    gap: .3rem;
    color: var(--text-muted);
    transition: color .2s;
}
.article-nav-link:hover { color: var(--accent); }
.article-nav-label {
    font-size: .62rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--text-subtle);
    opacity: .6;
}
.article-nav-title {
    font-size: .82rem;
    line-height: 1.5;
}
</style>
</head>
<body>
<header-module></header-module>
<main>
<div class="article-wrap">
<div class="container">

    <a href="/blog/" class="article-back">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Blog
    </a>

    ${thumbHtml}

    <div class="article-meta">
        <span class="article-date">${formatDate(p.date)}</span>
        ${p.weather  ? `<span class="article-weather">${esc(p.weather)}</span>`  : ''}
        ${p.updated  ? `<span class="article-updated">更新: ${esc(p.updated)}</span>` : ''}
    </div>

    <h1 class="article-title">${esc(p.title)}</h1>

    ${tagsHtml}

    <div class="article-body">
        ${htmlBody}
    </div>

    ${prevNextHtml}

</div>
</div>
</main>
<script src="/common.js"></script>
</body>
</html>`;

    const outDir = path.join(outputDir, slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    generated++;
}

// ── タグTOPページ生成 ──
const tagMap = {};
for (const p of posts) {
    for (const tag of (p.tags || [])) {
        if (!tagMap[tag]) tagMap[tag] = [];
        tagMap[tag].push(p);
    }
}

function tagColor(tag) {
    let hash = 0;
    for (const c of tag) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    const hue = Math.abs(hash) % 360;
    return {
        accent:          `hsl(${hue}, 55%, 50%)`,
        accentHover:     `hsl(${hue}, 55%, 40%)`,
        accentDark:      `hsl(${hue}, 65%, 68%)`,
        accentDarkHover: `hsl(${hue}, 65%, 78%)`,
    };
}

for (const [tag, tagPosts] of Object.entries(tagMap)) {
    const col     = tagColor(tag);
    const outPath = path.join(outputDir, './tags', tag);  // blog/scene/index.html
    fs.mkdirSync(outPath, { recursive: true });

    // _index.mdからdescription取得
    let desc = '';
    const indexMd = path.join(postsDir, tag, '_index.md');
    if (fs.existsSync(indexMd)) {
        const raw = fs.readFileSync(indexMd, 'utf-8');
        const m   = raw.match(/^description:\s*(.+)$/m);
        if (m) desc = m[1].trim().replace(/^["']|["']$/g, '');
    }

    const cardsHtml = tagPosts.map(p => {
        const thumb = p.thumbnail
            ? `<div class="card-thumb"><img src="/blog/thumbnails/${esc(p.thumbnail)}" alt="${esc(p.title)}" loading="lazy"></div>`
            : `<div class="card-thumb"><div class="card-thumb-placeholder">
                <svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M 0,916.875 V 753.74999 H 242.06902 484.1379 V 916.875 1080 H 242.06902 0 Z m 521.3794,0 V 753.74999 h 86.8965 86.89651 V 916.875 1080 H 608.2759 521.3794 Z M 732.41389,1012.5 V 945 h 49.65514 49.65515 v 67.5 67.5 h -49.65515 -49.65514 z m 136.55164,0 V 945 H 974.48278 1080 v 67.5 67.5 H 974.48278 868.96553 Z M 732.41389,832.5 V 753.74999 H 906.20689 1080 V 832.5 911.24999 H 906.20689 732.41389 Z M 0,359.99999 V 0 H 540.00001 1080 v 359.99999 360 H 540.00001 0 Z"/></svg>
               </div></div>`;
        const dateObj = new Date(p.date.includes('+') || p.date.includes('Z') ? p.date : p.date + '+09:00');
        const dateStr = dateObj.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '.');
        return `
        <a href="/blog/${p.slug}/" class="card">
            ${thumb}
            <div class="card-body">
                <div class="card-title">${esc(p.title)}</div>
                ${p.summary ? `<div class="card-desc">${esc(p.summary)}</div>` : ''}
                <div class="card-foot">
                    <span class="card-date">${dateStr}</span>
                    ${p.weather ? `<span class="card-weather">${esc(p.weather)}</span>` : ''}
                </div>
            </div>
        </a>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(tag)} — Picturebook from shunature</title>
<meta name="description" content="${esc(desc || tag + ' の記事一覧')}">
<meta property="og:title" content="${esc(tag)} — Picturebook from shunature">
<meta property="og:url" content="${base}/blog/${encodeURIComponent(tag)}/">
<meta property="og:site_name" content="Picturebook from shunature">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
<style>
    :root {
        --accent:       ${col.accent};
        --accent-hover: ${col.accentHover};
    }
    [data-theme="dark"] {
        --accent:       ${col.accentDark};
        --accent-hover: ${col.accentDarkHover};
    }
    .tag-hero {
        padding: 3.5rem 0 2.5rem;
        border-bottom: 1px solid var(--border);
        margin-bottom: 2.5rem;
    }
    .tag-eyebrow {
        font-size: .65rem;
        letter-spacing: .2em;
        text-transform: uppercase;
        color: var(--accent);
        opacity: .8;
        margin-bottom: .6rem;
    }
    .tag-title {
        font-family: 'Shippori Mincho', serif;
        font-size: clamp(1.8rem, 5vw, 3rem);
        font-weight: 500;
        margin-bottom: .6rem;
    }
    .tag-desc {
        font-size: .85rem;
        color: var(--text-muted);
        margin-bottom: .8rem;
    }
    .tag-count {
        font-size: .7rem;
        color: var(--text-subtle);
        letter-spacing: .08em;
    }
    .tag-back {
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        font-size: .75rem;
        color: var(--text-subtle);
        margin-bottom: 2rem;
        transition: color .2s;
        letter-spacing: .04em;
    }
    .tag-back:hover { color: var(--accent); }
</style>
</head>
<body>
<header-module></header-module>
<main>
<div style="padding: 0 0 5rem;">
<div class="container-wide">
    <div class="tag-hero">
        <a href="/blog/" class="tag-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Blog
        </a>
        <p class="tag-eyebrow">Tag</p>
        <h1 class="tag-title">${esc(tag)}</h1>
        ${desc ? `<p class="tag-desc">${esc(desc)}</p>` : ''}
        <p class="tag-count">${tagPosts.length} posts</p>
    </div>
    <div class="card-grid">
        ${cardsHtml}
    </div>
</div>
</div>
</main>
<script src="/common.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(outPath, 'index.html'), html);
    console.log(`✓ Tag page: ${tag} (${tagPosts.length} posts)`);
}
console.log(`✓ タグページ生成完了 (${Object.keys(tagMap).length} tags)`);

console.log(`✓ HTML生成完了 (${generated} 件 / スキップ ${skipped} 件)`);
JS