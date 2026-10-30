import type { CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export type Note = CollectionEntry<'notes'>;

export function postDate(post: Note): Date {
  const raw = post.data.date;
  if (raw instanceof Date) return raw;
  return new Date(raw.replaceAll('/', '-'));
}

export function postTags(post: Note): string[] {
  const tags = post.data.tags;
  return Array.isArray(tags)
    ? tags
    : tags.split(',').map((tag) => tag.trim()).filter(Boolean);
}

export function postPath(post: Note): string {
  const [year, month, day, ...slugParts] = post.id.replace(/\.md$/, '').split('/');
  const slug = slugParts.join('/');
  return `/notes/${year}/${month}/${day}/${slug}/index.html`;
}

export function postImage(post: Note): string {
  const [year, month, day, ...slugParts] = post.id.replace(/\.md$/, '').split('/');
  const slug = slugParts.join('/');
  const thumbnail = `/thumbnails/${year}/${month}/${day}/${slug}.png`;
  return existsSync(resolve(process.cwd(), 'public', thumbnail.slice(1)))
    ? thumbnail
    : '/images/kujira_to_nega.png';
}

export function sortedPosts(posts: Note[]): Note[] {
  return [...posts].sort((a, b) => postDate(b).getTime() - postDate(a).getTime());
}
