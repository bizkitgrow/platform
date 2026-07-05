require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function processPendingShares(supabaseClient, recordId, dispatchResult) {
  const targetStatus = dispatchResult.success ? 'SUCCESS' : 'FAILED';

  const { error } = await supabaseClient
    .from('social_shares')
    .update({
      status: targetStatus,
      error_log: dispatchResult.error || null,
    })
    .eq('id', recordId);

  if (error) {
    console.error(`[DATABASE ERROR] Failed to flush social row state: ${error.message}`);
  } else {
    console.log(`[STATE SYNC] Row ${recordId} successfully mutated to ${targetStatus}`);
  }
}

async function dispatchWithTimeout(url, payload, timeoutMs) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });
  return response;
}

async function runDispatcher() {
  const payload = {
    title: process.env.POST_TITLE || 'Bizkitgrow: Sovereign B2B Infrastructure Update',
    slug: process.env.POST_SLUG || 'bizkitgrow-intelligence',
    social_caption:
      process.env.POST_CAPTION ||
      'No-slop B2B intelligence. Global eSIM, local authority, and operational automation — on a single edge. #B2B #Connectivity #AI',
    image_url:
      process.env.POST_IMAGE ||
      'https://image.pollinations.ai/prompt/Brutalist%20telemetry%20B2B%20dashboard%2C%20black%20and%20neon%20green%2C%20flat%20design?width=1080&height=1080&nologo=true',
  };

  // --- GATE 1: n8n Cloud Primary ---
  if (process.env.N8N_CLOUD_WEBHOOK_URL) {
    try {
      console.log('[GATE 1] Dispatching to n8n Cloud...');
      const res = await dispatchWithTimeout(process.env.N8N_CLOUD_WEBHOOK_URL, payload, 6000);
      if (res.ok) {
        console.log('[GATE 1 SUCCESS]');
        if (process.env.PENDING_SHARE_ID)
          await processPendingShares(supabase, process.env.PENDING_SHARE_ID, { success: true });
        process.exit(0);
      }
      console.warn('[GATE 1] Returned non-OK status:', res.status);
    } catch (e) {
      console.warn('[GATE 1 FAIL] Cascading to Gate 2...', e.message);
    }
  }

  // --- GATE 2: Oracle Self-Hosted n8n ---
  if (process.env.N8N_ORACLE_WEBHOOK_URL) {
    try {
      console.log('[GATE 2] Dispatching to Oracle n8n...');
      const res = await dispatchWithTimeout(process.env.N8N_ORACLE_WEBHOOK_URL, payload, 6000);
      if (res.ok) {
        console.log('[GATE 2 SUCCESS]');
        if (process.env.PENDING_SHARE_ID)
          await processPendingShares(supabase, process.env.PENDING_SHARE_ID, { success: true });
        process.exit(0);
      }
      console.warn('[GATE 2] Returned non-OK status:', res.status);
    } catch (e) {
      console.warn('[GATE 2 FAIL] Cascading to Gate 3...', e.message);
    }
  }

  // --- GATE 3: Direct API Fallback (X/Twitter + Pinterest only) ---
  // Note: Instagram & Facebook require OAuth 2.0 renewal — handled in Gate 1/2 only
  console.log(
    '[GATE 3] Activating direct API fallback. Meta syndication deferred (OAuth token security).',
  );

  if (process.env.X_TWITTER_BEARER_TOKEN) {
    console.log('[GATE 3] X/Twitter direct dispatch...');
    // X API v2 direct tweet via bearer token
    try {
      const tweetRes = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.X_TWITTER_BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          text: `${payload.social_caption}\n\nhttps://bizkitgrow.vercel.app/blog/${payload.slug}`,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const tweetData = await tweetRes.json();
      if (process.env.PENDING_SHARE_ID)
        await processPendingShares(supabase, process.env.PENDING_SHARE_ID, { success: true });
      console.log('[GATE 3] X dispatch result:', JSON.stringify(tweetData));
    } catch (e) {
      console.error('[GATE 3 X FAIL]', e.message);
    }
  }

  if (process.env.PINTEREST_ACCESS_TOKEN) {
    console.log('[GATE 3] Pinterest direct dispatch...');
    try {
      const pinRes = await fetch('https://api.pinterest.com/v5/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          title: payload.title,
          description: payload.social_caption,
          link: `https://bizkitgrow.vercel.app/blog/${payload.slug}`,
          media_source: {
            source_type: 'image_url',
            url: payload.image_url,
          },
        }),
        signal: AbortSignal.timeout(8000),
      });
      const pinData = await pinRes.json();
      if (process.env.PENDING_SHARE_ID)
        await processPendingShares(supabase, process.env.PENDING_SHARE_ID, { success: true });
      console.log('[GATE 3] Pinterest dispatch result:', JSON.stringify(pinData));
    } catch (e) {
      console.error('[GATE 3 Pinterest FAIL]', e.message);
    }
  }

  // --- GATE 4: Direct Audience Push Notification (OneSignal) ---
  if (process.env.ONESIGNAL_APP_ID && process.env.ONESIGNAL_REST_API_KEY) {
    console.log('[GATE 4] Dispatching Push Notification via OneSignal...');
    try {
      const osRes = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: process.env.ONESIGNAL_APP_ID,
          included_segments: ['Subscribed Users', 'Active Users'],
          headings: { en: payload.title },
          contents: { en: payload.social_caption },
          url: `https://bizkitgrow.vercel.app/blog/${payload.slug}`,
          chrome_web_image: payload.image_url,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const osData = await osRes.json();
      console.log('[GATE 4] OneSignal dispatch result:', JSON.stringify(osData));
    } catch (e) {
      console.error('[GATE 4 OneSignal FAIL]', e.message);
    }
  }

  console.log('[DISPATCH COMPLETE] Quad-Shield pipeline terminated cleanly.');
  process.exit(0);
}

runDispatcher();
