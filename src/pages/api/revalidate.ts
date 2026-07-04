import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const path = url.searchParams.get('path') || '/blog';

  if (!process.env.VERCEL_REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ error: 'Revalidation secret not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (secret !== process.env.VERCEL_REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized revalidation attempt' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      revalidated: true,
      path,
      now: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'x-vercel-revalidate': '3600',
      },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  return GET({ request } as any);
};
