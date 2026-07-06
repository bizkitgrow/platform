import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_URL || '',
  import.meta.env.SUPABASE_ANON_KEY || ''
);

export const POST: APIRoute = async ({ request }) => {
  try {
    let email = '';
    let name = '';
    let target_sku = '';
    let created_at = new Date().toISOString();

    const contentType = request.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email || '';
      name = body.name || '';
      target_sku = body.target_sku || '';
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      email = formData.get('email')?.toString() || '';
      name = formData.get('name')?.toString() || '';
      target_sku = formData.get('target_sku')?.toString() || '';
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Media Type' }), { status: 415 });
    }

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const onesignalAppId = import.meta.env.ONESIGNAL_APP_ID || '';
    
    // Dual-mesh Promise.all sync for Supabase and OneSignal
    const [supabaseResult, onesignalResult] = await Promise.allSettled([
      supabase.from('waiting_list').insert([{ email, name, target_sku, created_at }]),
      
      fetch('https://onesignal.com/api/v1/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${import.meta.env.ONESIGNAL_REST_API_KEY || ''}`
        },
        body: JSON.stringify({
          app_id: onesignalAppId,
          identifier: email,
          tags: {
            name: name,
            sku: target_sku
          }
        })
      })
    ]);

    let success = true;
    if (supabaseResult.status === 'rejected' || (supabaseResult.status === 'fulfilled' && supabaseResult.value.error)) {
      console.error('Supabase Error:', supabaseResult.status === 'fulfilled' ? supabaseResult.value.error : supabaseResult.reason);
      success = false;
    }
    
    if (onesignalResult.status === 'rejected' || (onesignalResult.status === 'fulfilled' && !onesignalResult.value.ok)) {
       console.error('OneSignal Error:', onesignalResult.status === 'fulfilled' ? await onesignalResult.value.text() : onesignalResult.reason);
    }

    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to ingest lead' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Lead ingested successfully' }), { status: 200 });
  } catch (error) {
    console.error('Ingestion Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
