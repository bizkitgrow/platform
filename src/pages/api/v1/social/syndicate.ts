import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const n8nOracle = process.env.N8N_ORACLE_WEBHOOK_URL;
    const n8nCloud = process.env.N8N_CLOUD_WEBHOOK_URL;

    if (!n8nOracle && !n8nCloud) {
      return new Response(JSON.stringify({ error: 'N8N endpoints not configured' }), {
        status: 500,
      });
    }

    let success = false;
    // Try Oracle first
    if (n8nOracle) {
      const res = await fetch(n8nOracle, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'manual_syndicate', ...payload }),
        signal: AbortSignal.timeout(5000),
      }).catch(() => null);
      if (res?.ok) success = true;
    }

    // Fallback to Cloud
    if (!success && n8nCloud) {
      const res = await fetch(n8nCloud, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'manual_syndicate', ...payload }),
        signal: AbortSignal.timeout(5000),
      }).catch(() => null);
      if (res?.ok) success = true;
    }

    if (success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payload dispatched to N8N distribution shield.',
        }),
        { status: 200 },
      );
    }
    return new Response(JSON.stringify({ success: false, error: 'N8N nodes unreachable' }), {
      status: 502,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
};
