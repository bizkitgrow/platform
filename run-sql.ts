import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.telemetry_cache (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE public.telemetry_cache ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Enable read access for all users" ON public.telemetry_cache FOR SELECT USING (true);
    `);
    console.log('Created telemetry_cache table');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
