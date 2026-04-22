#!/bin/bash
# deploy.sh
set -euo pipefail

log() { echo "[$(date '+%H:%M:%S')] $1"; }

cd "$(dirname "$0")"

# git pull
log "pull中..."
git pull origin main

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
    console.log('変換:', file, '→', path.basename(out));
  }
})();
JS

# ── frontmatter タイムゾーン補完 ──
log "タイムゾーン補完中..."
find content/blog/posts -name "*.md" | while read f; do
  # +09:00も Zもついてないdateを検出して補完
  if grep -qE "^date: [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$" "$f"; then
    sed -i "s/^\(date: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}T[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}\)$/\1+09:00/" "$f"
    echo "補完: $f"
  fi
done

# ── git ──
log "git push中..."
git add .

if git diff --cached --quiet; then
  log "変更なし、pushをスキップ"
else
  git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
  log "完了！Vercelがビルド中..."
fi
