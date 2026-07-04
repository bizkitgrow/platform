import type { APIRoute } from 'astro';

// This endpoint is responsible for dispatching pending social shares to n8n webhook
export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[SYNDICATE] Initializing Social Syndication Hand-off...');

    // In a real scenario, fetch pending elements from `social_shares` via Drizzle:
    // const pendingShares = await db.query.socialShares.findMany({ where: eq(socialShares.status, 'PENDING') });

    // Mock Payload for n8n Webhook
    const mockPayload = {
      post_title: 'The Future of Connectivity and Mobility',
      social_caption:
        'Ready to scale your business with advanced mobility solutions? Check out our latest breakdown on connectivity! 🚀 #Tech #Business #Automation',
      image_url:
        'https://image.pollinations.ai/prompt/Abstract%20visualization%20of%20glowing%20fiber%20optic%20cables?width=1080&height=1080&nologo=true',
      link: 'https://bizkitgrow.com/blog/the-future-of-connectivity',
    };

    // The designated external 'n8n' webhook receiver node URL (Mock)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://webhook.site/mock-n8n-receiver';

    console.log(`[SYNDICATE] Dispatching structured JSON payload to ${n8nWebhookUrl}...`);

    // Enforce rigid try/catch insulation wrapper
    let webhookResponse: Response;
    try {
      webhookResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload),
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook returned status ${webhookResponse.status}`);
      }
    } catch (dispatchError: any) {
      // Capture the event, log it to the local error stack, and preserve the main core Astro build state without crashing.
      console.error('[SYNDICATE] [ERROR] n8n dispatch failed or timed out:', dispatchError.message);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Syndication dispatch failed but system state preserved.',
          error: dispatchError.message,
        }),
        {
          status: 200, // Return 200 to prevent crashing callers or cron jobs unexpectedly
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    console.log('[SYNDICATE] Payload dispatched successfully.');

    // Normally, update DB:
    // await db.update(socialShares).set({ status: 'SYNDICATED', syndicatedAt: new Date() }).where(eq(socialShares.id, ...));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Syndication dispatched to n8n successfully.',
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
