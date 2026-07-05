import { desc } from 'drizzle-orm';
import { db } from './src/db/client';
import { posts as postsTable } from './src/db/schema';

async function test() {
  try {
    const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt)).limit(5);
    console.log('Posts count:', posts.length);
    console.log(posts.map((p) => p.title));
  } catch (err) {
    console.error('ERROR:', err);
  }
}
test().catch(console.error);
