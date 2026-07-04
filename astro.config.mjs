import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bizkitgrow.vercel.app',
  output: 'hybrid',
  adapter: vercel({
    speedInsights: {
      enabled: true,
    },
    edgeMiddleware: false,
    functionPerRoute: false,
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  vite: {
    ssr: {
      noExternal: ['lenis'],
    },
  },
});
