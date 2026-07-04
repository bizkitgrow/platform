const { db } = require('../src/db/client');
const { socialShares, posts, mediaAssets } = require('../src/db/schema');
const { eq } = require('drizzle-orm');

async function testSyndication() {
  console.log('[SYNDICATE-TEST] Running standalone syndication logic...');
  try {
    const pendingShares = await db
      .select({
        shareId: socialShares.id,
        postId: posts.id,
        title: posts.title,
        slug: posts.slug,
        metaDesc: posts.metaDesc,
      })
      .from(socialShares)
      .innerJoin(posts, eq(socialShares.postId, posts.id))
      .where(eq(socialShares.status, 'PENDING'));

    console.log(`Found ${pendingShares.length} pending shares.`);
    if (pendingShares.length > 0) {
      console.log(pendingShares[0]);
      // Update first one to SYNDICATED to test db
      await db
        .update(socialShares)
        .set({ status: 'SYNDICATED', syndicatedAt: new Date() })
        .where(eq(socialShares.id, pendingShares[0].shareId));
      console.log('Successfully updated status to SYNDICATED for share', pendingShares[0].shareId);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
testSyndication();
