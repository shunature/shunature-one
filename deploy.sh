#!/bin/bash
# deploy.sh (Incus上で実行)
# webp変換 → posts.json生成 → OGP HTML生成 → sitemap → git push

REPO="$HOME/shunature-one"
LOG="$HOME/publisher.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG"
}

cd "$REPO" || exit 1

# ────────────────────────────────
# 0. git pull（リモート優先）
# ────────────────────────────────
log "▶ git pull..."
git fetch origin
git reset --hard origin/main
log "✓ pull完了"

# ────────────────────────────────
# 1. webp変換（thumbnails/に生画像があれば変換して元ファイル削除）
# ────────────────────────────────
log "▶ webp変換..."
node - << 'JS'
const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const thumbDir = './blog/thumbnails';
if (!fs.existsSync(thumbDir)) process.exit(0);

const files = fs.readdirSync(thumbDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
if (files.length === 0) { console.log('変換対象なし'); process.exit(0); }

(async () => {
    await Promise.all(files.map(file => {
        const input  = path.join(thumbDir, file);
        const name   = path.basename(file, path.extname(file));
        const output = path.join(thumbDir, name + '.webp');
        return sharp(input)
            .resize(1920, 1080, { fit: 'cover', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(output)
            .then(() => {
                fs.unlinkSync(input);
                console.log('✓ 変換:', file, '→', name + '.webp');
            });
    }));
})().catch(e => { console.error(e); process.exit(1); });
JS
log "✓ webp変換完了"

# ────────────────────────────────
# 2. posts.json生成（予約投稿スキップ・天気キャッシュ引き継ぎ）
# ────────────────────────────────
log "▶ posts.json生成..."
node - << 'JS'
const fs    = require('fs');
const path  = require('path');
const https = require('https');

const postsDir   = './blog/posts';
const thumbDir   = './blog/thumbnails';
const outputFile = './blog/posts.json';
const LAT = 35.7506;
const LNG = 139.7138;

const weatherCode = {
    0:'快晴', 1:'晴れ', 2:'一部曇り', 3:'曇り',
    45:'霧', 48:'霧氷',
    51:'霧雨', 53:'霧雨', 55:'強い霧雨',
    61:'小雨', 63:'雨', 65:'強い雨',
    71:'小雪', 73:'雪', 75:'強い雪',
    80:'にわか雨', 81:'にわか雨', 82:'強いにわか雨',
    85:'にわか雪', 86:'強いにわか雪',
    95:'雷雨', 96:'雷雨（雹）', 99:'激しい雷雨（雹）',
};

function fetchWeather(dateStr) {
    return new Promise(resolve => {
        const d        = new Date(dateStr.includes('+') || dateStr.includes('Z') ? dateStr : dateStr + '+09:00');
        const dateOnly = d.toISOString().split('T')[0];
        const hour     = d.getHours();
        const url = 'https://archive-api.open-meteo.com/v1/archive?latitude=' + LAT
            + '&longitude=' + LNG
            + '&start_date=' + dateOnly + '&end_date=' + dateOnly
            + '&hourly=weathercode&timezone=Asia%2FTokyo';
        https.get(url, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const code = json.hourly && json.hourly.weathercode ? json.hourly.weathercode[hour] : undefined;
                    resolve(code !== undefined ? (weatherCode[code] || '不明') : null);
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

function getMdFiles(dir, base) {
    base = base || '';
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
        if (entry.name.startsWith('.'))  continue;
        if (entry.name === '_index.md') continue;
        const rel = base ? base + '/' + entry.name : entry.name;
        if (entry.isDirectory()) {
            files = files.concat(getMdFiles(path.join(dir, entry.name), rel));
        } else if (entry.name.endsWith('.md')) {
            files.push(rel);
        }
    }
    return files;
}

// cascadeタグ（_index.mdから）
const cascadeCache = {};
function getCascadeTag(folder) {
    if (cascadeCache[folder] !== undefined) return cascadeCache[folder];
    const indexPath = path.join(postsDir, folder, '_index.md');
    if (!fs.existsSync(indexPath)) return (cascadeCache[folder] = folder);
    const m = fs.readFileSync(indexPath, 'utf-8').match(/tags:\s*\n\s+-\s+(.+)/);
    return (cascadeCache[folder] = m ? m[1].trim() : folder);
}

const availableThumbs = fs.existsSync(thumbDir)
    ? fs.readdirSync(thumbDir).filter(f => f.endsWith('.webp'))
    : [];

// 天気キャッシュ引き継ぎ
let existingWeather = {};
if (fs.existsSync(outputFile)) {
    try {
        const existing = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
        for (const p of existing) { if (p.weather) existingWeather[p.slug] = p.weather; }
        console.log('天気キャッシュ:', Object.keys(existingWeather).length, '件');
    } catch(e) {}
}

const files = getMdFiles(postsDir);
console.log(files.length, '件のmdを検出');

(async () => {
    const posts = [];

    for (const file of files) {
        const slug    = file.replace(/\.md$/, '');
        const folder  = slug.includes('/') ? slug.split('/')[0] : null;
        const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);

        let title = slug, date = new Date().toISOString(), tags = [];
        let thumbnail = null, thumbnail_credit = null, thumbnail_credit_url = null;
        let summary = null, updated = null;

        if (fmMatch) {
            const fm  = fmMatch[1];
            const get = key => {
                const m = fm.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'));
                return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
            };
            title                = get('title')                || slug;
            date                 = get('date')                 || new Date().toISOString();
            updated              = get('updated')              || null;
            summary              = get('summary')              || null;
            thumbnail_credit     = get('thumbnail_credit')     || null;
            thumbnail_credit_url = get('thumbnail_credit_url') || null;

            const tagsInline = fm.match(/^tags:\s*\[(.+)\]$/m);
            const tagsBlock  = fm.match(/^tags:\n((?:\s+-\s*.+\n?)+)/m);
            if (tagsInline) {
                tags = tagsInline[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
            } else if (tagsBlock) {
                tags = tagsBlock[1].match(/- (.+)/g).map(t => t.replace('- ', '').trim());
            }

            const thumbRaw = get('thumbnail');
            if (thumbRaw) {
                const webpName = thumbRaw.replace(/\.[^.]+$/, '') + '.webp';
                if (availableThumbs.includes(webpName)) thumbnail = webpName;
            }
        } else {
            const h1 = content.match(/^#\s+(.+)$/m);
            if (h1) title = h1[1].trim();
            date = fs.statSync(path.join(postsDir, file)).mtime.toISOString();
        }

        const displayTag = folder ? getCascadeTag(folder) : null;
        if (displayTag && !tags.includes(displayTag)) tags = [displayTag, ...tags];

        // 予約投稿スキップ
        const postDate = new Date(date.includes('+') || date.includes('Z') ? date : date + '+09:00');
        if (postDate > new Date()) { console.log('予約投稿スキップ:', slug); continue; }

        // 天気（キャッシュ優先）
        let weather = existingWeather[slug] || null;
        if (!weather) {
            weather = await fetchWeather(date);
            if (weather) console.log('Weather:', slug, '→', weather);
        }

        const bodyText = content
            .replace(/^---\n[\s\S]*?\n---\n?/, '')
            .replace(/[#*`\[\]!>]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 1000);

        const entry = { slug, title, date, tags };
        if (thumbnail)            entry.thumbnail            = thumbnail;
        if (thumbnail_credit)     entry.thumbnail_credit     = thumbnail_credit;
        if (thumbnail_credit_url) entry.thumbnail_credit_url = thumbnail_credit_url;
        if (weather)              entry.weather              = weather;
        if (updated)              entry.updated              = updated;
        if (summary)              entry.summary              = summary;
        if (bodyText)             entry.body                 = bodyText;
        posts.push(entry);
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 4));
    console.log('✓ posts.json生成完了:', posts.length, '件');
})();
JS
log "✓ posts.json生成完了"

# ────────────────────────────────
# 3. 記事HTML生成（リダイレクト付き）
# ────────────────────────────────
log "▶ 記事HTML生成..."
node - << 'JS'
const fs     = require('fs');
const path   = require('path');
const { marked } = require('marked');

marked.setOptions({ breaks: true, gfm: true });

// ==テキスト== をマーカーに変換
const renderer = new marked.Renderer();
const originalParagraph = renderer.paragraph.bind(renderer);
renderer.paragraph = (text) => {
    text = text.replace(/==(.+?)==/g, '<mark>$1</mark>');
    return originalParagraph(text);
};
marked.setOptions({ renderer });

const base   = 'https://shunature.one';
const posts  = JSON.parse(fs.readFileSync('./blog/posts.json', 'utf-8'));
const esc    = s => String(s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let count = 0;
for (const p of posts) {
    const mdPath = path.join('./blog/posts', p.slug + '.md');
    if (!fs.existsSync(mdPath)) continue;

    const raw      = fs.readFileSync(mdPath, 'utf-8');
    const body     = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
    const htmlBody = marked(body);

    const url         = base + '/blog/p/' + p.slug + '/';
    const image       = p.thumbnail ? base + '/blog/thumbnails/' + p.thumbnail : base + '/assets/icon.png';
    const description = p.summary || (p.body ? p.body.slice(0, 200) : '');
    const titleFull   = p.title + ' — Indigo Night Dull Moon';

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
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:site_name" content="Indigo Night Dull Moon">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titleFull)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<meta name="fediverse:creator" content="@shunature@hogus.work">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
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
    ${p.thumbnail ? `<div class="article-thumb"><img src="/blog/thumbnails/${esc(p.thumbnail)}" alt="${esc(p.title)}"></div>` : ''}
    <div class="article-meta">
        <span class="article-date">${new Date(p.date.includes('+') || p.date.includes('Z') ? p.date : p.date + '+09:00').toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo' })}</span>
        ${p.weather ? `<span class="article-weather">${esc(p.weather)}</span>` : ''}
    </div>
    <h1 class="article-title">${esc(p.title)}</h1>
    <div class="article-body">${htmlBody}</div>
</div>
</div>
</main>
<script src="/common.js"></script>
</body>
</html>`;

    const outDir = path.join('./blog/p', p.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    count++;
}
console.log('✓ HTML生成完了:', count, '件');
JS
log "✓ 記事HTML生成完了"

# ────────────────────────────────
# 4. sitemap.xml生成
# ────────────────────────────────
log "▶ sitemap.xml生成..."
node - << 'JS'
const fs    = require('fs');
const base  = 'https://shunature.one';
const posts = JSON.parse(fs.readFileSync('./blog/posts.json', 'utf-8'));

const staticPages = [
    { url: '/',       priority: '1.0' },
    { url: '/blog/',  priority: '0.9' },
    { url: '/music/', priority: '0.7' },
    { url: '/about/', priority: '0.7' },
];
const postPages = posts.map(p => ({
    url:      '/blog/p/' + p.slug + '/',
    lastmod:  p.date.split('T')[0],
    priority: '0.6',
}));

const all = [...staticPages, ...postPages];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + all.map(p =>
        '  <url>\n'
        + '    <loc>' + base + p.url + '</loc>\n'
        + (p.lastmod ? '    <lastmod>' + p.lastmod + '</lastmod>\n' : '')
        + '    <priority>' + p.priority + '</priority>\n'
        + '  </url>'
    ).join('\n')
    + '\n</urlset>';

fs.writeFileSync('./sitemap.xml', xml);
console.log('✓ sitemap.xml生成完了:', all.length, 'URLs');
JS
log "✓ sitemap.xml生成完了"

# ────────────────────────────────
# 5. commit & push（変更があれば）
# ────────────────────────────────
log "▶ git push確認..."

git add -A
if ! git diff --cached --quiet; then
    CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
    git commit -m "deploy: auto update (${CHANGED} files) [$(date '+%Y-%m-%d %H:%M')]"
    git push origin main
    log "✓ push完了 (${CHANGED} files)"
else
    log "- 変更なし、pushスキップ"
fi

log "🎉 デプロイ完了！"