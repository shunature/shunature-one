#!/bin/bash
# generate-posts.sh
# mdファイルからposts.jsonを生成する

REPO="$(cd "$(dirname "$0")" && pwd)"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1"
}

cd "$REPO" || exit 1
log "posts.json生成開始..."

node - << 'JS'
const fs = require('fs');
const path = require('path');
const https = require('https');

const postsDir = './blog/posts';
const thumbDir = './blog/thumbnails';
const outputFile = './blog/posts.json';
const LAT = 35.7506;
const LNG = 139.7138;

const weatherCode = {
    0: '快晴', 1: '晴れ', 2: '一部曇り', 3: '曇り',
    45: '霧', 48: '霧氷',
    51: '霧雨', 53: '霧雨', 55: '強い霧雨',
    61: '小雨', 63: '雨', 65: '強い雨',
    71: '小雪', 73: '雪', 75: '強い雪',
    80: 'にわか雨', 81: 'にわか雨', 82: '強いにわか雨',
    85: 'にわか雪', 86: '強いにわか雪',
    95: '雷雨', 96: '雷雨（雹）', 99: '激しい雷雨（雹）',
};

function fetchWeather(dateStr) {
    return new Promise((resolve) => {
        const d = new Date(dateStr.includes('+') || dateStr.includes('Z') ? dateStr : dateStr + '+09:00');
        const dateOnly = d.toISOString().split('T')[0];
        const hour = d.getHours();
        const url = 'https://archive-api.open-meteo.com/v1/archive?latitude=' + LAT + '&longitude=' + LNG
            + '&start_date=' + dateOnly + '&end_date=' + dateOnly
            + '&hourly=weathercode&timezone=Asia%2FTokyo';
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const code = json.hourly?.weathercode?.[hour];
                    resolve(code !== undefined ? (weatherCode[code] || '不明') : null);
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

function getMdFiles(dir, base = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        if (entry.name === '_index.md') continue;  // Hugoのセクションファイルはスキップ
        const rel = base ? base + '/' + entry.name : entry.name;
        if (entry.isDirectory()) {
            files = files.concat(getMdFiles(path.join(dir, entry.name), rel));
        } else if (entry.name.endsWith('.md')) {
            files.push(rel);
        }
    }
    return files;
}

const availableThumbs = fs.existsSync(thumbDir)
    ? fs.readdirSync(thumbDir).filter(f => f.endsWith('.webp'))
    : [];

// 既存posts.jsonから天気キャッシュを引き継ぐ
let existingWeather = {};
if (fs.existsSync(outputFile)) {
    try {
        const existing = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
        for (const p of existing) {
            if (p.weather) existingWeather[p.slug] = p.weather;
        }
        console.log(`天気キャッシュ: ${Object.keys(existingWeather).length} 件`);
    } catch(e) {}
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
// _index.mdからcascadeタグを読む
function getCascadeTag(tagDir) {
    const indexPath = path.join(tagDir, '_index.md');
    if (!fs.existsSync(indexPath)) return null;
    const content = fs.readFileSync(indexPath, 'utf-8');
    const m = content.match(/tags:\s*\n\s+-\s+(.+)/);
    return m ? m[1].trim() : null;
}

// cascadeタグキャッシュ（フォルダごとに1回だけ読む）
const cascadeTagCache = {};
function getDisplayTag(tag) {
    if (!tag) return null;
    if (cascadeTagCache[tag] !== undefined) return cascadeTagCache[tag];
    const result = getCascadeTag(path.join(postsDir, tag)) || tag;
    cascadeTagCache[tag] = result;
    return result;
}
const files = getMdFiles(postsDir);
console.log(`${files.length} 件のmdファイルを検出`);

function tagColor(tag) {
    // タグ名を数値にハッシュ化
    let hash = 0;
    for (const c of tag) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    const hue = Math.abs(hash) % 360;
    return {
        accent:  `hsl(${hue}, 55%, 55%)`,
        accentHover: `hsl(${hue}, 55%, 45%)`,
        accentDark:  `hsl(${hue}, 65%, 70%)`,
        accentDarkHover: `hsl(${hue}, 65%, 80%)`,
    };
}

(async () => {
    const posts = [];

    for (const file of files) {
        const slug    = file.replace(/\.md$/, '');                        // 例: scene/27
        const tag     = slug.includes('/') ? slug.split('/')[0] : null;   // 例: scene
        const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);

        let title = slug, date = new Date().toISOString(), tags = [];
        let thumbnail = null, thumbnail_credit = null, thumbnail_credit_url = null;
        let summary = null, updated = null;

        if (fmMatch) {
            const fm  = fmMatch[1];
            const get = key => {
                const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
                return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
            };

            title   = get('title')   || slug;
            date    = get('date')    || new Date().toISOString();
            updated = get('updated') || null;
            summary = get('summary') || null;
            thumbnail_credit     = get('thumbnail_credit')     || null;
            thumbnail_credit_url = get('thumbnail_credit_url') || null;

            // tags: インライン [...] or ブロック形式
            const tagsInline = fm.match(/^tags:\s*\[(.+)\]$/m);
            const tagsBlock  = fm.match(/^tags:\n((?:\s+-\s*.+\n?)+)/m);
            if (tagsInline) {
                tags = tagsInline[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
            } else if (tagsBlock) {
                tags = tagsBlock[1].match(/- (.+)/g).map(t => t.replace('- ', '').trim());
            }

            // thumbnail → .webp確認
            const thumbRaw = get('thumbnail');
            if (thumbRaw) {
                const webpName = thumbRaw.replace(/\.[^.]+$/, '') + '.webp';
                if (availableThumbs.includes(webpName)) thumbnail = webpName;
            }
        } else {
            // frontmatterなし: h1をtitle、mtimeをdateに
            const h1 = content.match(/^#\s+(.+)$/m);
            if (h1) title = h1[1].trim();
            date = fs.statSync(path.join(postsDir, file)).mtime.toISOString();
        }

        const displayTag = getDisplayTag(tag);
        if (displayTag && !tags.includes(displayTag)) tags = [displayTag, ...tags];

        // 予約投稿スキップ
        const postDate = new Date(date.includes('+') || date.includes('Z') ? date : date + '+09:00');
        if (postDate > new Date()) {
            console.log(`Skipping scheduled: ${slug}`);
            continue;
        }

        // 天気（キャッシュ優先、なければAPI取得）
        let weather = existingWeather[slug] || null;
        if (!weather) {
            weather = await fetchWeather(date);
            if (weather) console.log(`Weather for ${slug}: ${weather}`);
        }

        // body（プレビュー・検索用、1000文字）
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
    console.log(`✓ posts.json 生成完了 (${posts.length} 件)`);
})();
JS