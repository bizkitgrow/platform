import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

export default defineConfig({
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
  ],
  vite: {
    ssr: {
      noExternal: ['lenis'],
    },
  },
});
