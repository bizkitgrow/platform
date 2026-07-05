import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { shortUrls } from '../../db/schema';

export const prerender = false;

export const GET: APIRoute = async ({ params, redirect }) => {
  const hash = params.hash;

  if (!hash) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const result = await db.select().from(shortUrls).where(eq(shortUrls.hash, hash)).limit(1);

    if (result.length > 0) {
      // Background click increment (optional)
      // await db.update(shortUrls).set({ clicks: result[0].clicks + 1 }).where(eq(shortUrls.hash, hash));

      // Return 301 Redirect to original URL
      return redirect(result[0].originalUrl, 301);
    }
  } catch (error) {
    console.error('Error fetching short URL:', error);
  }

  return new Response('Not Found', { status: 404 });
};
