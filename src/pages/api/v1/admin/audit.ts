import type { APIRoute } from 'astro';
import pg from 'pg';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const checks = {
      databaseConnection: false,
      rlsEnabled: false,
      apiTokenSecurity: false,
    };

    // 1. Connection check
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    try {
      await pool.query('SELECT 1');
      checks.databaseConnection = true;
    } catch (err) {
      console.error('[AUDIT] Connection failed:', err);
    }

    // 2. Table RLS status check (checking public tables RLS)
    if (checks.databaseConnection) {
      try {
        const res = await pool.query(`
          SELECT tablename, rowsecurity 
          FROM pg_tables 
          WHERE schemaname = 'public' AND tablename IN ('posts', 'waiting_list', 'rss_sources')
        `);
        // If all tables have rowsecurity set to true, check is success
        const insecure = res.rows.some((r) => !r.rowsecurity);
        checks.rlsEnabled = !insecure;
      } catch (err) {
        console.error('[AUDIT] RLS check failed:', err);
      }
    }

    // 3. API Environment variables check
    if (process.env.GEMINI_API_KEY?.startsWith('AQ')) {
      checks.apiTokenSecurity = true;
    }

    await pool.end();

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        checks,
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
