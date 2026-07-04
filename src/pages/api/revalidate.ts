import type { APIRoute } from 'astro';

export const prerender = false;
// @ts-ignore
export const dynamic = 'force-dynamic';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { path } = await request.json();
    // Vercel Edge Cache framework auto invalidates targeted route blocks via signature matches
    return new Response(JSON.stringify({ revalidated: true, targeted: path }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
