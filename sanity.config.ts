import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { markdownSchema } from 'sanity-plugin-markdown';
import { postSchema } from './sanity-schema';

export default defineConfig({
  name: 'shunature-studio',
  title: 'shunature Studio',
  basePath: '/studio',

  // Sanity Project configuration
  // Use import.meta.env for Astro/Vite compatibility
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'mnubywum',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool(),
    markdownSchema(),
  ],

  schema: {
    types: [postSchema],
  },
});
