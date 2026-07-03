import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');

  if (secret !== process.env.VERCEL_REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Under Vercel Astro Adapter, path updates are performed via standard CDN revalidation or purging
  return new Response(
    JSON.stringify({
      revalidated: true,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
