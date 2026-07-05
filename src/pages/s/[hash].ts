import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { Redis } from '@upstash/redis';
import { db } from '../../db/client';
import { shortUrls } from '../../db/schema';

export const prerender = false;

const redis = Redis.fromEnv();

export const GET: APIRoute = async ({ params, redirect }) => {
  const hash = params.hash;

  if (!hash) {
    return redirect('/404');
  }

  try {
    const cachedUrl = await redis.get(`shorturl-hash:${hash}`);
    if (cachedUrl && typeof cachedUrl === 'string') {
      return redirect(cachedUrl, 301);
    }
  } catch (error) {
    console.warn('Redis shortUrl read failed:', error);
  }

  try {
    const result = await db.select().from(shortUrls).where(eq(shortUrls.hash, hash)).limit(1);

    if (result.length > 0) {
      return redirect(result[0].originalUrl, 301);
    }
  } catch (error) {
    console.error('Error fetching short URL:', error);
  }

  return redirect('/404');
};
