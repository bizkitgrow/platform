import type { APIRoute } from 'astro';
import pg from 'pg';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new Response('Unauthorized Access', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Bizkitgrow Admin Perimeter"' },
      });
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return new Response('Unauthorized Access', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Bizkitgrow Admin Perimeter"' },
      });
    }

    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

    // Fetch posts created in the last 24h
    const res = await pool.query(
      "SELECT id, title, slug, created_at FROM posts WHERE created_at >= NOW() - INTERVAL '24 hours'",
    );

    const posts = res.rows;

    if (posts.length === 0) {
      await pool.end();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No articles generated in the last 24 hours. Daily digest build skipped.',
          digest: null,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Format Digest Briefing
    const digestText = posts
      .map((p) => `- ${p.title} (https://bizkitgrow.com/blog/${p.slug})`)
      .join('\n');
    const digestPayload = {
      title: `Daily Digest Briefing - ${new Date().toLocaleDateString('en-US')}`,
      body: `Here are the latest B2B operational briefings generated today:\n\n${digestText}\n\nAll perimeters secured.`,
      generatedAt: new Date().toISOString(),
      itemCount: posts.length,
    };

    // Log the automated digest generation event
    await pool.query(
      "INSERT INTO automation_logs (items_fetched, status, execution_duration_ms, error_details) VALUES ($1, 'SUCCESS', 0, $2)",
      [posts.length, `Daily digest created successfully for ${posts.length} articles.`],
    );

    await pool.end();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily digest built and logged successfully.',
        digest: digestPayload,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
};
