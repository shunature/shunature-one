#!/usr/bin/env node
/**
 * Import Posts Script
 * ──────────────────
 * Reads legacy posts from shunature-one/blog/posts.json
 * and imports them into Sanity CMS as 'post' documents.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<your_token> node scripts/import-posts.js
 *
 * Options (via env vars):
 *   SANITY_PROJECT_ID  - Sanity Project ID  (default: dreambgnw)
 *   SANITY_DATASET     - Sanity dataset name (default: production)
 *   SANITY_WRITE_TOKEN - Sanity API write token (REQUIRED)
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load Environment Variables ──
// Automatically load .env file if it exists (Node 20.6+)
const envPath = join(__dirname, '../.env');
if (existsSync(envPath)) {
  try {
    process.loadEnvFile(envPath);
  } catch (e) {
    // Ignore errors if loadEnvFile is not supported or fails
  }
}

// ── Configuration ──
const POSTS_JSON_PATH = join(__dirname, '../posts.json');
const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'mnubywum';
const DATASET    = process.env.SANITY_DATASET    || 'production';
const TOKEN      = process.env.SANITY_WRITE_TOKEN;

if (!TOKEN) {
  console.error('\n❌ Error: SANITY_WRITE_TOKEN environment variable is required.');
  console.error('   Please add it to your .env file or run as:');
  console.error('   SANITY_WRITE_TOKEN=<token> node scripts/import-posts.js\n');
  console.error('   You can create a token in Sanity Manage (https://www.sanity.io/manage)');
  console.error('   under "API" -> "Tokens". Ensure it has "Editor" permissions.\n');
  process.exit(1);
}

// ── Sanity Client ──
const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2023-05-03',
  token: TOKEN,
  useCdn: false,
});

// ── Helpers ──
/**
 * Converts a legacy post slug like "scene/39" into a Sanity-safe slug
 * "scene-39" (replacing slashes with hyphens).
 */
function toSanitySafeSlug(slug) {
  return slug.replace(/\//g, '-');
}

/**
 * Heuristically formats the flat legacy body text into readable Markdown.
 */
function formatBody(text, tags = []) {
  if (!text) return '';

  let formatted = text;

  // 1. Ensure newlines around horizontal rules / section headers
  formatted = formatted.replace(/\s*---\s*/g, '\n\n---\n\n');

  // 2. Add newlines after sentence endings (。！？) if followed by a space
  formatted = formatted.replace(/([。！？])\s+/g, '$1\n');

  // 3. Handle list items (starting with - )
  formatted = formatted.replace(/\s+-\s+/g, '\n- ');

  // 4. Special handling for "Thirty-five Grid" (三十五格子)
  // If the tag exists, it usually contains blocks of 5-7 characters with spaces
  if (tags.includes('三十五格子日記')) {
    // Look for patterns that look like the 5-7-5 grid part
    // (Often found between "本日の内容は以下の通りです" and "解説")
    formatted = formatted.replace(/(本日の内容は以下の通りです)\s*/, '$1\n\n');
    formatted = formatted.replace(/\s*(解説)/, '\n\n$1');
  }

  // 5. Clean up multiple newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted.trim();
}

/**
 * Converts a legacy post object to a Sanity document.
 */
function postToSanityDocument(post) {
  const safeSlug = toSanitySafeSlug(post.slug);

  return {
    _type: 'post',
    _id: `post-${safeSlug}`,       // deterministic ID to allow re-runs without duplicates
    title: post.title,
    slug: {
      _type: 'slug',
      current: safeSlug,
    },
    date: post.date,
    tags: post.tags || [],
    thumbnail: post.thumbnail || null,
    thumbnail_credit: post.thumbnail_credit || null,
    thumbnail_credit_url: post.thumbnail_credit_url || null,
    weather: post.weather || null,
    summary: post.summary || null,
    body: formatBody(post.body || '', post.tags || []),
  };
}

// ── Main ──
async function main() {
  console.log('\n📚 Loading legacy posts from:', POSTS_JSON_PATH);

  let posts;
  try {
    const raw = readFileSync(POSTS_JSON_PATH, 'utf-8');
    posts = JSON.parse(raw);
  } catch (e) {
    console.error('\n❌ Failed to read or parse posts.json:', e.message);
    process.exit(1);
  }

  console.log(`✅ Found ${posts.length} posts to import.\n`);

  let successCount = 0;
  let errorCount   = 0;

  // Process in batches of 10 to be respectful of API rate limits
  const BATCH_SIZE = 10;
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE);

    const transaction = client.transaction();

    for (const post of batch) {
      const doc = postToSanityDocument(post);
      // createOrReplace lets us re-run the script safely
      transaction.createOrReplace(doc);
    }

    try {
      await transaction.commit();
      successCount += batch.length;
      const endIdx = Math.min(i + BATCH_SIZE, posts.length);
      process.stdout.write(`  ✔ Imported posts ${i + 1}–${endIdx} / ${posts.length}\r`);
    } catch (e) {
      errorCount += batch.length;
      console.error(`\n  ❌ Batch ${i}–${i + BATCH_SIZE} failed:`, e.message);
      if (e.message.includes('Insufficient permissions')) {
        console.error('     👉 Your token likely has "Viewer" role. Please use a token with "Editor" or "Administrator" permissions.');
        process.exit(1); // Exit early on permission errors as they won't fix themselves
      }
    }
  }

  console.log('\n');
  console.log('─────────────────────────────────');
  console.log(`✅ Import complete!`);
  console.log(`   Succeeded: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   Failed:    ${errorCount}`);
  }
  console.log('─────────────────────────────────');
  console.log('\n💡 Note: Slug URLs have been converted from "scene/39" → "scene-39"');
  console.log('   Update your Astro blog routes accordingly if needed.\n');
}

main().catch(e => {
  console.error('\n❌ Unexpected error:', e);
  process.exit(1);
});
