import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { mediaAssets, posts, socialShares } from '../../../../db/schema';

// This endpoint is responsible for dispatching pending social shares to n8n webhook
export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[SYNDICATE] Initializing Social Syndication Hand-off...');

    // Fetch all pending shares from the database
    const pendingShares = await db
      .select({
        shareId: socialShares.id,
        postId: posts.id,
        title: posts.title,
        slug: posts.slug,
        metaDesc: posts.metaDesc,
        imageUrl: mediaAssets.pollinationsUrl,
      })
      .from(socialShares)
      .innerJoin(posts, eq(socialShares.postId, posts.id))
      .leftJoin(mediaAssets, eq(posts.id, mediaAssets.postId))
      .where(eq(socialShares.status, 'PENDING'));

    if (pendingShares.length === 0) {
      console.log('[SYNDICATE] No pending social shares found.');
      return new Response(
        JSON.stringify({ success: true, message: 'No pending shares to syndicate.' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://webhook.site/mock-n8n-receiver';
    const baseUrl = process.env.BASE_URL || 'https://bizkitgrow.com';

    let successCount = 0;
    let failCount = 0;

    for (const share of pendingShares) {
      const postUrl = `${baseUrl}/blog/${share.slug}`;
      const defaultTags = '#Tech #B2B #Connectivity #Innovation';

      // Format multi-channel payloads (POSSE Pattern)
      const payload = {
        share_id: share.shareId,
        post_id: share.postId,
        link: postUrl,
        image_url: share.imageUrl || '',
        platforms: {
          twitter: {
            text: `🚨 New Post: ${share.title}\n\n${share.metaDesc?.substring(0, 100)}...\n\nRead more: ${postUrl}\n${defaultTags}`,
          },
          linkedin: {
            text: `We just published a new insights article on our blog.\n\n📌 **${share.title}**\n\n${share.metaDesc}\n\nRead the full breakdown here: ${postUrl}\n\n${defaultTags} #BusinessGrowth`,
          },
          mastodon: {
            text: `${share.title}\n\n${share.metaDesc}\n\n🔗 ${postUrl}\n${defaultTags}`,
            alt_text: `Hero image representing ${share.title}`,
          },
          bluesky: {
            text: `📰 ${share.title}\n\n${share.metaDesc}\n\nRead it here: ${postUrl}`,
          },
        },
      };

      try {
        console.log(
          `[SYNDICATE] Dispatching payload for share ID ${share.shareId} to ${n8nWebhookUrl}...`,
        );

        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(5000),
        });

        if (!webhookResponse.ok) {
          throw new Error(`Webhook returned status ${webhookResponse.status}`);
        }

        // Update DB status to SYNDICATED
        await db
          .update(socialShares)
          .set({ status: 'SYNDICATED', syndicatedAt: new Date() })
          .where(eq(socialShares.id, share.shareId));

        successCount++;
        console.log(`[SYNDICATE] Successfully syndicated share ID ${share.shareId}.`);
      } catch (dispatchError: any) {
        console.error(
          `[SYNDICATE] [ERROR] Dispatch failed for share ID ${share.shareId}:`,
          dispatchError.message,
        );
        failCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Syndication complete. Success: ${successCount}, Failed: ${failCount}`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (globalError) {
    console.error('[SYNDICATE] [FATAL ERROR]', globalError);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
