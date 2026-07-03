import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'placeholder',
  );
  try {
    const text = await request.text();
    const params = new URLSearchParams(text);

    const merchantCode = params.get('merchantCode');
    const amount = params.get('amount');
    const merchantOrderId = params.get('merchantOrderId');
    const resultCode = params.get('resultCode');
    const signature = params.get('signature');

    if (!merchantCode || !amount || !merchantOrderId || !resultCode || !signature) {
      return new Response('Missing request parameters', { status: 400 });
    }

    const apiKey = process.env.DUITKU_API_KEY || '';

    // Construct local SHA256 checksum signature for payload authenticity verification
    const localSignature = crypto
      .createHash('sha256')
      .update(merchantCode + amount + merchantOrderId + apiKey)
      .digest('hex');

    if (signature !== localSignature) {
      return new Response('Unauthorized Signature Checksum', { status: 401 });
    }

    if (resultCode === '00') {
      console.log(`[Duitku Webhook] Payment Successful for order: ${merchantOrderId}`);

      // Update local invoice state
      await supabase.from('waiting_list').update({ coupon_sent: true }).eq('id', merchantOrderId);

      // Fonnte WA notification disabled for Phase 1. Log payment verification natively.
      console.log(
        `[Duitku Webhook] System initialized for invoice ${merchantOrderId}. Notifications routed to client account console.`,
      );
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return new Response('Internal Server Error', { status: 500 });
  }
};
