const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  console.log('[MIGRATION] Starting Database Schema Migration for Phase 6 Dataset...');
  try {
    await pool.query('BEGIN');

    console.log('[MIGRATION] Cascading old categories and related posts/assets/shares...');
    await pool.query('TRUNCATE TABLE categories CASCADE');
    await pool.query('TRUNCATE TABLE rss_sources CASCADE');

    console.log('[MIGRATION] Inserting new definitive categories...');
    await pool.query(`
      INSERT INTO categories (name, slug) VALUES 
      ('eSIM Data Plans', 'esim_data_plans'),
      ('Reputation Management', 'reputation_management'),
      ('AI Business Tools Suite', 'ai_business_tools_suite')
    `);

    console.log('[MIGRATION] Seeding high-quality industry RSS feeds...');
    await pool.query(`
      INSERT INTO rss_sources (url, target_pillar) VALUES 
      ('https://www.rcrwireless.com/feed', 'esim_data_plans'),
      ('https://searchengineland.com/feed', 'reputation_management'),
      ('https://venturebeat.com/category/ai/feed', 'ai_business_tools_suite')
    `);

    await pool.query('COMMIT');
    console.log('[MIGRATION] Migration completed successfully.');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('[MIGRATION] Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
