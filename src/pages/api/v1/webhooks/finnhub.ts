import crypto from 'node:crypto';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-finnhub-signature');
    const secret = import.meta.env.FINNHUB_WEBHOOK_SECRET || process.env.FINNHUB_WEBHOOK_SECRET;

    if (!secret) {
      console.error('[FINNHUB_WEBHOOK] Secret not configured');
      return new Response('Server Error', { status: 500 });
    }

    if (!signature) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Verify Finnhub Signature (HMAC-SHA256)
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');

    if (digest !== signature) {
      console.warn('[FINNHUB_WEBHOOK] Invalid signature match attempt');
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log('[FINNHUB_WEBHOOK] Verified payload received:', payload);

    // TODO: Process payload based on webhook type (e.g., earnings release, price alerts)
    // For now, just log and return 200 OK so Finnhub knows we received it.

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[FINNHUB_WEBHOOK] Error processing webhook:', err.message);
    return new Response('Bad Request', { status: 400 });
  }
};
