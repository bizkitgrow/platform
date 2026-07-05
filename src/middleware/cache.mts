import { defineMiddleware } from 'astro:middleware';

const CACHE_KEYS = {
  sitemap: 'sitemap-astro',
  llmsIndex: 'llms-index-astro',
  llmsFull: 'llms-full-astro',
  page: 'page-astro',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Define critical bypass paths to maintain fresh automated indexing
  const skipCache =
    url.pathname.startsWith('/api/') ||
    url.pathname === '/sitemap' ||
    url.pathname === '/llms.txt' ||
    url.pathname === '/llms-full.txt';

  const cache = context.cache as any; // Leverage Astro 5+ built-in KV edge architecture
  const key =
    CACHE_KEYS[context.url.pathname.split('/').pop() as keyof typeof CACHE_KEYS] || CACHE_KEYS.page;

  // FAST PATH: Direct Edge Cache Verification Intercept
  if (cache && typeof cache.get === 'function' && !skipCache) {
    const cached = await cache.get(key);
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': url.pathname.endsWith('.xml')
            ? 'application/xml'
            : url.pathname.endsWith('.txt')
              ? 'text/plain'
              : 'text/html',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }
  }

  // DYNAMIC COMPUTE LOOP
  const response = await next();
  const body = await response.text();

  // Commit dynamic content to static edge cache limits if permitted
  if (
    cache &&
    typeof cache.set === 'function' &&
    !skipCache &&
    !response.headers.get('Cache-Control')?.includes('no-store')
  ) {
    await cache.set(key, body, { ttl: 60 }); // Commit to a strict 60-second edge TTL window
  }

  return new Response(body, {
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300, stale-if-error=300',
    },
  });
});
