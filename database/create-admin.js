/**
 * Run this script to create the admin user with a proper bcrypt hash.
 * Usage: node create-admin.js
 * 
 * Requirements: npm install bcryptjs pg dotenv
 * Set DATABASE_URL in .env first.
 */
require('dotenv').config({ path: '../backend/.env' });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createAdmin() {
  const password = 'Admin@1234';
  const hash = await bcrypt.hash(password, 12);
  console.log('Generated hash:', hash);

  await pool.query("DELETE FROM refresh_tokens WHERE user_id = (SELECT id FROM users WHERE email='admin@maasuperior.com')");
  await pool.query("DELETE FROM users WHERE email = 'admin@maasuperior.com'");
  
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash, phone, role, is_active) VALUES ($1,$2,$3,$4,$5,true) RETURNING id, email, role",
    ['Vipul Gandhi (Admin)', 'admin@maasuperior.com', hash, '9879556507', 'admin']
  );
  
  console.log('✅ Admin created:', result.rows[0]);
  console.log('📧 Email: admin@maasuperior.com');
  console.log('🔑 Password: Admin@1234');
  await pool.end();
}

createAdmin().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
