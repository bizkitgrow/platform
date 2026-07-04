import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { waitingList } from '../../db/schema';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, business_name, targeted_service } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email parameter required.' }), { status: 400 });
    }

    // Arcjet Rate Limiting implementation
    const aj = require('@arcjet/node').arcjet({
      key: process.env.ARCJET_KEY || 'ajkey_placeholder',
      rules: [
        require('@arcjet/node').slidingWindow({ mode: 'LIVE', interval: '1m', max: 5 }), // 5 req/min
      ],
    });

    const decision = await aj.protect(request);
    if (decision.isDenied()) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
    }

    // Insert via Drizzle ORM instead of Supabase Client
    const result = await db
      .insert(waitingList)
      .values({
        email,
        businessName: business_name || null,
        targetedService: targeted_service || 'General',
      })
      .returning({ id: waitingList.id });

    return new Response(
      JSON.stringify({
        status: 'success',
        lead_id: result[0].id,
      }),
      { status: 201 },
    );
  } catch (err: any) {
    if (err.code === '23505') {
      return new Response(
        JSON.stringify({ error: 'Email already registered in priority queue.' }),
        { status: 409 },
      );
    }
    console.error('Waitlist registration failure:', err.message);
    return new Response(JSON.stringify({ error: 'Database network timeout.' }), { status: 500 });
  }
};
