import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  // Read from process.env or standard import.meta.env
  // Fallbacks allow local development and building even if secrets aren't set
  projectId: import.meta.env.SANITY_PROJECT_ID || 'mnubywum',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // Use current date or stable API version
  useCdn: false, // Set to true to fetch from Edge cache, false for fresh content
});
