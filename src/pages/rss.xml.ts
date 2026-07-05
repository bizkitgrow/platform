import type { APIRoute } from 'astro';
import { desc } from 'drizzle-orm';
import { db } from '../db/client';
import { posts as postsTable } from '../db/schema';

export const prerender = false;

export const GET: APIRoute = async () => {
  let posts: any[] = [];
  try {
    posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt)).limit(50);
  } catch (e) {
    console.error('RSS DB error:', e);
  }

  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>https://bizkitgrow.vercel.app/blog/${p.slug}</link>
      <guid>https://bizkitgrow.vercel.app/blog/${p.slug}</guid>
      <pubDate>${new Date(p.createdAt || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${p.metaDesc || ''}]]></description>
    </item>
  `,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bizkitgrow B2B Operations Briefings</title>
    <link>https://bizkitgrow.vercel.app/blog</link>
    <description>Autonomous intelligence briefings on connectivity protocols, search engine authority, and remote business operations.</description>
    <language>en-us</language>
    <atom:link href="https://bizkitgrow.vercel.app/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>
  `.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
