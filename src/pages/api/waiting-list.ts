import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { leads } from '../../db/schema';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
      });
    }

    await db.insert(leads).values({
      email: data.email,
      businessName: data.business_name || null,
      targetedService: data.targeted_service || 'General',
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error inserting lead:', error);
    return new Response(JSON.stringify({ error: 'Failed to join waiting list' }), {
      status: 500,
    });
  }
};
