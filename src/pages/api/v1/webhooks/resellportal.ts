import { createHmac } from 'node:crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { inboundWebhooks, posts } from '../../../../db/schema';

const WEBHOOK_SECRET = process.env.RESELLPORTAL_WEBHOOK_SECRET;

// Lazy-load to prevent build-time crashes on Vercel
let webhookRatelimit: Ratelimit | null = null;

function getRatelimit() {
  if (webhookRatelimit) return webhookRatelimit;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  webhookRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(30, '1m'),
    prefix: 'webhook_resellportal',
  });
  return webhookRatelimit;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const signature = request.headers.get('x-resellportal-signature') || '';
    const rawBody = await request.text(); // Raw body needed for HMAC

    // Rate-limit check — prevent webhook replay & abuse
    const ip = clientAddress || 'global';
    const rl = getRatelimit();
    if (rl) {
      const { success: rateOk } = await rl.limit(`webhook_${ip}`);
      if (!rateOk) {
        console.warn('[WEBHOOK] Rate limit exceeded for IP:', ip);
        return new Response('Too Many Requests', { status: 429 });
      }
    }

    if (!WEBHOOK_SECRET) {
      console.error('[WEBHOOK] Missing RESELLPORTAL_WEBHOOK_SECRET');
      return new Response('Configuration Error', { status: 500 });
    }

    const hmac = createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(rawBody);
    const computedSignature = hmac.digest('hex');

    if (computedSignature !== signature) {
      console.error('[WEBHOOK] Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.id || `webhook_${Date.now()}`;
    const isDryRun = event.test === true || event.dryRun === true;

    // Idempotency check
    const existing = await db.query.inboundWebhooks.findFirst({
      where: eq(inboundWebhooks.eventId, eventId),
    });

    if (existing) {
      console.log(`[WEBHOOK] Duplicate event ${eventId} safely ignored.`);
      return new Response(JSON.stringify({ message: 'Duplicate event' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert to DB
    await db.insert(inboundWebhooks).values({
      eventId,
      eventSignature: computedSignature,
      provider: 'ResellPortal',
      payloadType: event.type,
      processedAt: new Date(),
    });

    // If dry run, exit early successfully
    if (isDryRun) {
      console.log(`[WEBHOOK] Dry run event ${eventId} processed successfully.`);
      return new Response(JSON.stringify({ success: true, eventId, dryRun: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process event (service.activated / deposit.completed / service.cancelled)
    if (event.type === 'service.activated' && event.orderId) {
      console.log(`[WEBHOOK] Provisioning activated for order ${event.orderId}`);
      await db
        .update(posts)
        .set({ resellportalStatus: 'active' })
        .where(eq(posts.resellportalOrderId, event.orderId));
    } else if (event.type === 'service.cancelled' && event.orderId) {
      console.log(`[WEBHOOK] Service cancelled for order ${event.orderId}`);
      await db
        .update(posts)
        .set({ resellportalStatus: 'cancelled' })
        .where(eq(posts.resellportalOrderId, event.orderId));
    }

    return new Response(JSON.stringify({ success: true, eventId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[WEBHOOK] [ERROR]', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
