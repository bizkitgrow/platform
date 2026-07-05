import type { APIRoute } from 'astro';

interface SitemapItem {
  loc: string;
  lastModified?: Date;
}
import { getStaticPaths } from '../content-layer'; // Dynamic build dependency ingestion

export const prerender = true;
// @ts-ignore
export const dynamic = 'force-static';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const sitemap: SitemapItem[] = [
    { loc: new URL('/', url).href, lastModified: new Date() },
    { loc: new URL('/esim', url).href, lastModified: new Date() },
    { loc: new URL('/reputation', url).href, lastModified: new Date() },
    { loc: new URL('/solutions', url).href, lastModified: new Date() },
  ];

  const paths = await getStaticPaths();
  for (const p of paths) {
    sitemap.push({
      loc: new URL(`/blog/${p.params.slug}`, url).href,
      lastModified: new Date(),
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((item) => `  <url><loc>${item.loc}</loc><lastmod>${item.lastModified?.toISOString()}</lastmod></url>`).join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
};
