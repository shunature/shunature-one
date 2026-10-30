import { defineConfig } from 'astro/config';

const pagesUrl = process.env.SITE_URL;
const site = pagesUrl ? new URL(pagesUrl).origin : 'https://www.shunature.one';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
});
