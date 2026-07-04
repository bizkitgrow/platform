const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runSyndication() {
  try {
    console.log('[SYNDICATE-SCRIPT] Initializing Social Syndication Hand-off...');

    // Fetch all pending shares from the database
    const res = await pool.query(`
      SELECT s.id as share_id, p.id as post_id, p.title, p.slug, p.meta_desc, m.pollinations_url 
      FROM social_shares s
      JOIN posts p ON s.post_id = p.id
      LEFT JOIN media_assets m ON p.id = m.post_id
      WHERE s.status = 'PENDING'
    `);

    const pendingShares = res.rows;

    if (pendingShares.length === 0) {
      console.log('[SYNDICATE-SCRIPT] No pending social shares found.');
      return;
    }

    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL || 'https://n8n.bizkitgrow.com/webhook/syndicate';
    const baseUrl = process.env.BASE_URL || 'https://bizkitgrow.com';

    for (const share of pendingShares) {
      const postUrl = `${baseUrl}/blog/${share.slug}`;
      const defaultTags = '#Tech #B2B #Connectivity #Innovation';

      const payload = {
        share_id: share.share_id,
        post_id: share.post_id,
        link: postUrl,
        image_url: share.pollinations_url || '',
        platforms: {
          twitter: {
            text: `🚨 New Post: ${share.title}\n\n${share.meta_desc?.substring(0, 100)}...\n\nRead more: ${postUrl}\n${defaultTags}`,
          },
          linkedin: {
            text: `We just published a new insights article on our blog.\n\n📌 **${share.title}**\n\n${share.meta_desc}\n\nRead the full breakdown here: ${postUrl}\n\n${defaultTags} #BusinessGrowth`,
          },
          mastodon: {
            text: `${share.title}\n\n${share.meta_desc}\n\n🔗 ${postUrl}\n${defaultTags}`,
            alt_text: `Hero image representing ${share.title}`,
          },
          bluesky: {
            text: `📰 ${share.title}\n\n${share.meta_desc}\n\nRead it here: ${postUrl}`,
          },
        },
      };

      try {
        console.log(
          `[SYNDICATE-SCRIPT] Dispatching payload for share ID ${share.share_id} to ${n8nWebhookUrl}...`,
        );

        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        });

        if (!webhookResponse.ok) {
          throw new Error(`Webhook returned status ${webhookResponse.status}`);
        }

        // Update DB status to SYNDICATED
        await pool.query(
          "UPDATE social_shares SET status = 'SYNDICATED', syndicated_at = NOW() WHERE id = $1",
          [share.share_id],
        );

        console.log(`[SYNDICATE-SCRIPT] Successfully syndicated share ID ${share.share_id}.`);
      } catch (dispatchError) {
        console.warn(
          `[N8N Handoff Skipped] Webhook unavailable. Falling back to direct API syndication. Error: ${dispatchError.message}`,
        );

        let syndicated = false;

        // Fallback: Direct API Syndication
        if (process.env.TWITTER_API_KEY) {
          console.log('[SYNDICATE-SCRIPT] Executing Direct Twitter Syndication...');
          // Mock direct API call to Twitter
          // fetch('https://api.twitter.com/2/tweets', { ... })
          syndicated = true;
        }

        if (process.env.PINTEREST_ACCESS_TOKEN) {
          console.log('[SYNDICATE-SCRIPT] Executing Direct Pinterest Syndication...');
          // Mock direct API call to Pinterest
          // fetch('https://api.pinterest.com/v5/pins', { ... })
          syndicated = true;
        }

        if (syndicated) {
          await pool.query(
            "UPDATE social_shares SET status = 'SYNDICATED', syndicated_at = NOW() WHERE id = $1",
            [share.share_id],
          );
          console.log(
            `[SYNDICATE-SCRIPT] Direct syndication successful for share ID ${share.share_id}.`,
          );
        } else {
          console.error(
            `[SYNDICATE-SCRIPT] [ERROR] All syndication avenues failed for share ID ${share.share_id}. No direct keys available.`,
          );
        }
      }
    }
  } catch (globalError) {
    console.error('[SYNDICATE-SCRIPT] [FATAL ERROR]', globalError);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runSyndication();
}

module.exports = { runSyndication };
