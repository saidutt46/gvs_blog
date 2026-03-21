// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://saidutt46.github.io',
  base: '/gvs_blog',
  output: 'static',
  integrations: [sitemap()],
});
