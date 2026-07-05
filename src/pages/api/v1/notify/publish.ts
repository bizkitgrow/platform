import type { APIRoute } from 'astro';
import { siteConfig } from '~/config/site';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const ONESIGNAL_APP_ID = '498d3a2b-c642-41a3-b70c-c4b1185c958c';
  const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

  if (!ONESIGNAL_REST_API_KEY) {
    return new Response(JSON.stringify({ error: 'OneSignal REST API key not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { title, slug, pillar } = body;
  if (!title || !slug) {
    return new Response(JSON.stringify({ error: 'title and slug are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const notificationUrl = new URL(`/blog/${slug}`, siteConfig.url).toString();

  try {
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['Total Subscriptions'],
        headings: { en: `New Intelligence Brief: ${pillar?.toUpperCase() || 'OPERATIONS'}` },
        contents: { en: title.slice(0, 90) },
        url: notificationUrl,
        web_url: notificationUrl,
        chrome_web_icon: new URL('/favicon.png', siteConfig.url).toString(),
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify({ sent: true, onesignal: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
