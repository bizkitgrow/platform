import crypto from 'node:crypto';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = process.env.RESELLPORTAL_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret === 'sk_live_placeholder') {
    console.log('[RESELLPORTAL] Awaiting Production Keys. Webhook skipped safely.');
    return new Response(JSON.stringify({ status: 'Awaiting Keys' }), { status: 200 });
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    if (!signature) {
      return new Response('Missing Signature', { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Secure compare
    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return new Response('Invalid Signature', { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[RESELLPORTAL] Received verified webhook event: ${event}`);

    // Handle events
    switch (event) {
      case 'service.activated':
        // TODO: Handle service activation (e.g. notify user, trigger setup)
        console.log('Service activated:', payload.data);
        break;
      case 'deposit.completed':
        // TODO: Handle deposit completed
        console.log('Deposit completed:', payload.data);
        break;
      default:
        console.log('Unhandled event type:', event);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error('[RESELLPORTAL-WEBHOOK] Error parsing payload', err.message);
    return new Response('Bad Request', { status: 400 });
  }
};
