import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import robotsTxt from 'astro-ai-robots-txt';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://bizkitgrow.vercel.app',
  adapter: vercel({
    isr: {
      bypassToken: process.env.VERCEL_ISR_BYPASS_TOKEN, // Protects on-demand webhook execution
    },
  }),
  image: {
    remotePatterns: [
      { protocol: 'https' }
    ],
  },
  output: 'static', // Enables static generation for pages but keeps dynamic endpoints alive
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    sitemap(),
    robotsTxt(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['lenis'],
    },
  },
});
