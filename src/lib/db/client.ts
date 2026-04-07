import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Singleton database connection
export const db = drizzle(sql, { schema });

export type Database = typeof db;
