import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export function createPgAdapterFromEnv(): { pool: Pool; adapter: PrismaPg } {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  const pool = new Pool({ connectionString });
  return { pool, adapter: new PrismaPg(pool) };
}
