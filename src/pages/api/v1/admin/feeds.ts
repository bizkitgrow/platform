import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
// rssSources removed from golden schema

// Auth middleware helper
const checkAuth = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;
  try {
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
  } catch (err) {
    return false;
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.url || !body.targetPillar) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const newFeed = [{ url: body.url, targetPillar: body.targetPillar }];
    // Deprecated by Golden Schema

    return new Response(JSON.stringify({ success: true, feed: newFeed[0] }), { status: 201 });
  } catch (err: any) {
    console.error('Error adding feed:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing feed ID' }), { status: 400 });
    }

    // await db.delete(rssSources).where(eq(rssSources.id, Number(id)));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error('Error deleting feed:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
