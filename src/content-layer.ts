import { desc } from 'drizzle-orm';
import { db } from './db/client';
import { posts } from './db/schema';

export interface ContentDoc {
  title: string;
  markdown: string;
}

export async function getAllContent(): Promise<ContentDoc[]> {
  try {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return allPosts.map((p) => ({
      title: p.title,
      markdown: p.content || '',
    }));
  } catch (err: any) {
    console.error('Failed to fetch content layer:', err.message);
    return [];
  }
}

export async function getStaticPaths() {
  try {
    const allPosts = await db.select().from(posts);
    return allPosts.map((p) => ({
      params: { slug: p.slug },
    }));
  } catch (err: any) {
    console.error('Failed to fetch static paths:', err.message);
    return [];
  }
}
