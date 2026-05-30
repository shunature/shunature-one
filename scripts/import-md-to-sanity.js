#!/usr/bin/env node
import { createClient } from '@sanity/client';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load Environment Variables ──
const envPath = join(__dirname, '../.env');
if (existsSync(envPath)) {
  try {
    // For Node.js < 20.6 compatibility, we don't use loadEnvFile if it might fail
    // But since the project uses 22.12.0 in engines, it should be fine.
    process.loadEnvFile(envPath);
  } catch (e) {}
}

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'mnubywum';
const DATASET    = process.env.SANITY_DATASET    || 'production';
const TOKEN      = process.env.SANITY_WRITE_TOKEN;

if (!TOKEN) {
  console.error('❌ Error: SANITY_WRITE_TOKEN is required in .env');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2023-05-03',
  token: TOKEN,
  useCdn: false,
});

const POSTS_DIR = join(__dirname, '../blog/posts');

function getMdFiles(dir, files = []) {
  const list = readdirSync(dir);
  for (const file of list) {
    const name = join(dir, file);
    if (statSync(name).isDirectory()) {
      getMdFiles(name, files);
    } else if (extname(file) === '.md' && !file.startsWith('_')) {
      files.push(name);
    }
  }
  return files;
}

function toSanitySafeSlug(filePath) {
  // Get path relative to POSTS_DIR, remove extension
  const rel = relative(POSTS_DIR, filePath).replace(/\.md$/, '');
  // "scene/39" -> "scene-39"
  return rel.replace(/\//g, '-');
}

async function main() {
  console.log('🚀 Starting Markdown import to Sanity...');
  const files = getMdFiles(POSTS_DIR);
  console.log(`📂 Found ${files.length} markdown files.\n`);

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const { data, content: body } = matter(content);
    const slug = toSanitySafeSlug(file);

    const doc = {
      _type: 'post',
      _id: `post-${slug}`,
      title: data.title || slug,
      slug: {
        _type: 'slug',
        current: slug,
      },
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      tags: data.tags || [],
      thumbnail: data.thumbnail || null,
      thumbnail_credit: data.thumbnail_credit || null,
      thumbnail_credit_url: data.thumbnail_credit_url || null,
      weather: data.weather || null,
      summary: data.summary || null,
      body: body.trim(),
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✅ Imported: ${slug}`);
    } catch (e) {
      console.error(`❌ Failed: ${slug}`, e.message);
    }
  }

  console.log('\n✨ All done!');
}

main().catch(console.error);
