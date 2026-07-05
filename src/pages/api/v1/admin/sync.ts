import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, payload } = data;

    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Map actions to FastAPI endpoints
    let targetEndpoint = '';
    if (action === 'optimize') {
      targetEndpoint = 'optimize-routing';
    } else if (action === 'scrape') {
      targetEndpoint = 'scrape-intelligence';
    } else if (action === 'paraphrase') {
      targetEndpoint = 'paraphrase';
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Proxy request to local FastAPI backend (default port 8000 in dev, 8088 in test/sandbox)
    const fastApiUrl = process.env.FASTAPI_BACKEND_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${fastApiUrl}/api/v1/${targetEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: `Backend returned error: ${errText}` }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resData = await res.json();
    return new Response(JSON.stringify({ success: true, data: resData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('FastAPI Sync Proxy Error:', err.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error forwarding request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
