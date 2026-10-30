import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
});
