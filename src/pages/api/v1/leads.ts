import type { APIRoute } from 'astro';
import { db } from '~/db/client';
import { leads } from '~/db/schema';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const prerender = false;

// Initialize rate limiter for leads to prevent spamming the form
const leadsRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1m'), // Max 5 lead submissions per minute per IP
  prefix: 'leads_limiter',
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Check rate limit
    const ip = clientAddress || 'global';
    const { success: rateOk } = await leadsRatelimit.limit(`leads_${ip}`);
    if (!rateOk) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please wait a moment and try again.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { email, businessName, targetedService } = body;

    // Simple email validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const business = businessName && typeof businessName === 'string' ? businessName.trim() : null;
    const service = targetedService && typeof targetedService === 'string' ? targetedService.trim() : 'general';

    // Insert into Supabase
    await db.insert(leads).values({
      email: email.trim().toLowerCase(),
      businessName: business,
      targetedService: service,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Lead successfully captured.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[LEADS_API] [ERROR]', error.message);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
