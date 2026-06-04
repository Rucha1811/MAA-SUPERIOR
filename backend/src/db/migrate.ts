import fs from 'fs';
import path from 'path';
import { query } from './client';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
  try {
    console.log('🚀 Running database migrations...');
    const sqlPath = path.join(__dirname, '../../../database/migrate.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ Migration file not found at:', sqlPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    // Split on statement-ending semicolons carefully
    await query(sql);
    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrate();
