import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-ai-robots-txt';

export default defineConfig({
  site: 'https://bizkitgrow.vercel.app',
  adapter: vercel({
    isr: {
      bypassToken: process.env.VERCEL_ISR_BYPASS_TOKEN, // Protects on-demand webhook execution
    },
  }),
  output: 'static', // Enforces absolute edge distribution with zero serverless latency costs
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    sitemap(),
    robotsTxt(),
  ],
  vite: {
    ssr: {
      noExternal: ['lenis'],
    },
  },
});
