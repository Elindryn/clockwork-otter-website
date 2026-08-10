// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://clockworkotterfoundry.com',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // The 404 page already carries noindex — it has no business being
      // listed as a crawlable/indexable URL in the sitemap too.
      filter: (page) => !page.endsWith('/404') && !page.endsWith('/404/'),
    }),
  ],
});