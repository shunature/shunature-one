#!/bin/bash
# deploy-server.sh
# WebP変換 → git push → Vercel自動デプロイ

set -euo pipefail

log() { echo "[$(date '+%H:%M:%S')] $1"; }

cd "$(dirname "$0")"

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
