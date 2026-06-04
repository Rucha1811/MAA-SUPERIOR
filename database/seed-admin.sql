-- Run this AFTER migrate.sql to create/reset the admin user
-- Password: Admin@1234  (bcrypt hash below)
-- Generate fresh: node -e "const b=require('bcryptjs'); b.hash('Admin@1234',12).then(h=>console.log(h))"

-- Delete existing admin and recreate with correct hash
DELETE FROM refresh_tokens WHERE user_id = (SELECT id FROM users WHERE email='admin@maasuperior.com');
DELETE FROM users WHERE email = 'admin@maasuperior.com';

INSERT INTO users (name, email, password_hash, phone, role, is_active) VALUES (
  'Admin',
  'admin@maasuperior.com',
  '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- password: password (test)
  '9879556507',
  'admin',
  true
);
-- NOTE: The hash above is for 'password' - a placeholder.
-- After running migration, immediately run the change-admin-password.js script below.
