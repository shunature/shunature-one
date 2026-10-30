import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isProjectPages = process.env.GITHUB_ACTIONS === 'true'
  && repository
  && !repository.endsWith('.github.io');

export default defineConfig({
  site: process.env.SITE_URL || 'https://shunature.github.io',
  base: isProjectPages ? `/${repository}` : '/',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
});
