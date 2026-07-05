import type { APIRoute } from 'astro';
import { db } from '../../../../db/client';
import { posts } from '../../../../db/schema';
import crypto from 'crypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    if (data.action === 'manual_create') {
      const { title, slug, contentHtml, metaDesc, tags, productSku, sourceUrl } = data;

      if (!title || !slug || !contentHtml) {
        return new Response(JSON.stringify({ error: 'Title, slug, and content are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const hash = crypto.createHash('sha256').update(safeSlug).digest('hex');

      const aiSummary = {
        hook: metaDesc,
        tags: tags ? tags.split(',').map((t: string) => t.trim()) : [productSku],
        metaDesc: metaDesc,
        socialWidget: `Read more about ${title}`,
      };

      try {
        await db.insert(posts).values({
          title,
          slug: safeSlug,
          content: contentHtml,
          metaDesc: metaDesc || title,
          targetProductSku: productSku,
          sourceUrl: sourceUrl || 'ManualCMS',
          aiSummary: aiSummary,
          hash: hash,
        });
      } catch (dbErr: any) {
        return new Response(JSON.stringify({ error: dbErr.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({ success: true, slug: safeSlug }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('Manual CMS error:', err.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
