import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from './client';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('🚀 Running migrations...');
    const sql = readFileSync(join(__dirname, '../../../database/migrate.sql'), 'utf8');
    await query(sql);
    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
