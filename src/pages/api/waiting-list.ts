import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  );
  try {
    const body = await request.json();
    const { email, business_name, targeted_service, turnstile_token } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email parameter required.' }), { status: 400 });
    }

    // Cloudflare Turnstile validation bypassed for frictionless B2B signups

    const { data, error } = await supabase
      .from('waiting_list')
      .insert([
        {
          email,
          business_name: business_name || null,
          targeted_service: targeted_service || 'General',
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Email already registered in priority queue.' }),
          { status: 409 },
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        lead_id: data.id,
      }),
      { status: 201 },
    );
  } catch (err) {
    console.error('Waitlist registration failure:', err.message);
    return new Response(JSON.stringify({ error: 'Database network timeout.' }), { status: 500 });
  }
};
