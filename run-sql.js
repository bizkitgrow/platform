import dotenv from 'dotenv';
import pg from 'pg';
import { db } from './src/db/client.js';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const tables = [
    'automation_logs',
    'social_shares',
    'inbound_webhooks',
    'posts',
    'categories',
    'rss_sources',
    'waiting_list',
    'media_assets',
    'leads',
  ];
  for (const table of tables) {
    try {
      await pool.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
      console.log(`Enabled RLS on ${table}`);
      // Add default allow policy for read
      await pool.query(
        `CREATE POLICY "Enable read access for all users" ON public.${table} FOR SELECT USING (true);`,
      );
    } catch (e) {
      console.log(`RLS error on ${table}: ${e.message}`);
    }
  }

  try {
    await pool.query('DROP INDEX IF EXISTS idx_short_urls_hash;');
    console.log('Dropped duplicate index idx_short_urls_hash');
  } catch (e) {}

  const unused = ['idx_leads_email', 'idx_leads_created_at', 'idx_leads_status'];
  for (const idx of unused) {
    try {
      await pool.query(`DROP INDEX IF EXISTS ${idx};`);
      console.log(`Dropped unused index ${idx}`);
    } catch (e) {}
  }

  const fkIndexes = [
    { name: 'idx_media_assets_post_id', table: 'media_assets', cols: 'post_id' },
    { name: 'idx_posts_category_id', table: 'posts', cols: 'category_id' },
    { name: 'idx_social_shares_post_id', table: 'social_shares', cols: 'post_id' },
  ];
  for (const idx of fkIndexes) {
    try {
      await pool.query(
        `CREATE INDEX IF NOT EXISTS ${idx.name} ON public.${idx.table} (${idx.cols});`,
      );
      console.log(`Created FK index ${idx.name}`);
    } catch (e) {
      console.log(`Error creating FK index ${idx.name}: ${e.message}`);
    }
  }

  process.exit(0);
}
run();
