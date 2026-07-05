import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const dbUrl =
  (typeof process !== 'undefined' ? process.env.DATABASE_URL : undefined) ||
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.DATABASE_URL
    : undefined);

const pool = new pg.Pool({
  connectionString: dbUrl,
});

export const db = drizzle(pool, { schema });
