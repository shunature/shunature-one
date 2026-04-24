#!/bin/bash
# deploy.sh
set -euo pipefail

log() { echo "[$(date '+%H:%M:%S')] $1"; }

cd "$(dirname "$0")"

# git pull
log "pull中..."
git pull origin main

# ── frontmatter タイムゾーン補完 ──
log "タイムゾーン補完中..."
find content/blog/posts -name "*.md" | while read f; do
  # +09:00も Zもついてないdateを検出して補完
  if grep -qE "^date: [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$" "$f"; then
    sed -i "s/^\(date: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}T[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}\)$/\1+09:00/" "$f"
    echo "補完: $f"
  fi
done



# ── 公開予定 touch ──
log "公開予定チェック中..."
node - << 'JS'
const fs = require('fs');
const path = require('path');

const postsDir = './content/blog/posts';
const stampFile = './.last-run';

const now = new Date();
const lastRun = fs.existsSync(stampFile)
  ? new Date(fs.readFileSync(stampFile, 'utf-8').trim())
  : new Date(now - 20 * 60 * 1000); // 初回は20分前とみなす

function getMdFiles(dir, base) {
  base = base || '';
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const rel = base ? base + '/' + e.name : e.name;
    if (e.isDirectory()) files = files.concat(getMdFiles(path.join(dir, e.name), rel));
    else if (e.name.endsWith('.md')) files.push(path.join(dir, e.name));
  }
  return files;
}

const files = getMdFiles(postsDir);
let touched = 0;
for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const m = content.match(/^date:\s*(.+)$/m);
  if (!m) continue;
  const dateStr = m[1].trim();
  const postDate = new Date(dateStr.includes('+') || dateStr.includes('Z') ? dateStr : dateStr + '+09:00');
  // 前回実行〜今回の間に公開時刻が来たファイルだけtouch
  if (postDate > lastRun && postDate <= now) {
    fs.appendFileSync(filePath, '\n');
    console.log('touch（公開タイミング）:', path.basename(filePath));
    touched++;
  }
}
if (touched === 0) console.log('公開タイミングのファイルなし');

// タイムスタンプ更新
fs.writeFileSync(stampFile, now.toISOString());
JS

# ── WebP変換 ──
log "WebP変換中..."
node - << 'JS'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const thumbDir = './content/blog/thumbnails';
if (!fs.existsSync(thumbDir)) { console.log('thumbnailsディレクトリなし、スキップ'); process.exit(0); }

const files = fs.readdirSync(thumbDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
if (files.length === 0) { console.log('変換対象なし'); process.exit(0); }

(async () => {
  for (const file of files) {
    const src = path.join(thumbDir, file);
    const out = path.join(thumbDir, path.basename(file, path.extname(file)) + '.webp');
    if (fs.existsSync(out)) { console.log('スキップ（既存）:', out); continue; }
    await sharp(src).webp({ quality: 85 }).toFile(out);
    fs.unlinkSync(src);  // 元PNGを削除
    console.log('変換＆削除:', file, '→', path.basename(out));
  }
})();
JS


# ── git ──
log "git push中..."
git add content/blog/posts content/blog/thumbnails .last-run

if git diff --cached --quiet; then
  log "変更なし、pushをスキップ"
else
  git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
  log "完了！Vercelがビルド中..."
fi
