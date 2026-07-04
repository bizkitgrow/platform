import type { APIRoute } from 'astro';
import { getAllContent } from '../content-layer'; // Edge-optimized local content assembler

export const prerender = true;
// @ts-ignore
export const dynamic = 'force-static';

export const GET: APIRoute = async () => {
  try {
    const content = await getAllContent();
    const fullCorpus = content
      .map((doc) => `# Content Segment: ${doc.title}\n${doc.markdown}`)
      .join('\n\n');

    return new Response(fullCorpus, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600', // Preserves strict 1-hour CDN caching windows
      },
    });
  } catch (err) {
    return new Response('# Fallback Frame\nEngine extraction currently initializing.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};
