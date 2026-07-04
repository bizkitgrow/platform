const { Client } = require('pg');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not set in .env');
  process.exit(1);
}

async function bootstrap() {
  console.log('Connecting to Supabase PostgreSQL database directly...');
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connection successful. Executing schema.sql...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Database schema successfully bootstrapped!');
  } catch (err) {
    console.error('Database bootstrap failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

bootstrap();
