-- =========================================================
-- Maa Superior Caterers - Database Migration
-- PostgreSQL 14+
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Refresh Tokens ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(512) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Menu Categories ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Menu Items ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  name_gujarati VARCHAR(255),
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Preset Menus ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS preset_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_number INTEGER UNIQUE NOT NULL,
  title VARCHAR(255),
  items TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Quotations ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_email VARCHAR(255),
  event_type VARCHAR(100),
  event_date DATE,
  event_location TEXT,
  guest_count INTEGER,
  selected_menu_id UUID REFERENCES preset_menus(id) ON DELETE SET NULL,
  custom_items JSONB,
  special_requests TEXT,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','reviewed','quoted','confirmed','completed','cancelled')),
  admin_notes TEXT,
  estimated_amount DECIMAL(12,2),
  final_amount DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Gallery ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  category VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Settings ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contact Messages ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_created ON quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ─── Auto-update timestamp trigger ────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_menu_items_updated ON menu_items;
CREATE TRIGGER trg_menu_items_updated BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_quotations_updated ON quotations;
CREATE TRIGGER trg_quotations_updated BEFORE UPDATE ON quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================================
-- SEED DATA
-- =========================================================

-- ─── Business Settings ────────────────────────────────────
INSERT INTO settings (key, value) VALUES
  ('business_name',   'Maa Superior Caterers'),
  ('tagline',         'Best Quality & Service Is Our Aim'),
  ('phone',           '9879556507'),
  ('whatsapp',        '9879556507'),
  ('owner_name',      'Vipul Gandhi'),
  ('address',         'Nr Shantivan School, Opp Mataji Mandir, Old Mahavir Ice-Cream Godown, Vadodara, Gujarat'),
  ('google_maps_url', 'https://maps.google.com/?q=22.302866,73.225555'),
  ('advance_percent', '50'),
  ('currency',        'INR')
ON CONFLICT (key) DO NOTHING;

-- ─── Preset Menus (Menu 1-19) ─────────────────────────────
INSERT INTO preset_menus (menu_number, title, items) VALUES
(1, 'Classic Vegetarian', ARRAY['Tomato Soup','Sitafal Basoodi','Kaju Pina Sandwich','Garam Puri','Butter Nan','Paneer Korma','Sev Boondi Capsicum','Lilva Wonton','Makai Corn','Lili Chatni','Delhi Chat','Paneer Chilla','Hakka Noodles','Dal Fry','Mix Achar','Mukhwas','Ice Cream','Mineral Water']),
(2, 'Festive Special', ARRAY['Minestrone Soup','Anjeer Kedabari Basoodi','Coconut Delight','Puri Garam','Amali Roti','Chainese Bhel','Lachha Kachori','Alu Tikka','Bar Becyu Chat','Manchurian Gravy','Papad Fry','Gujarati Dal','Plain Rice','Tawa Thalji','Mini Undhiyu','Red Sauce','Mukhwas','Ice Cream','Mineral Water']),
(3, 'Grand Celebration', ARRAY['Minestrone Soup','Anjeer Kedabari Basoodi','Coconut Delight','Puri Garam','Amali Roti','Chainese Bhel','Lachha Kachori','Alu Tikka','Bar Becyu Chat','Manchurian Gravy','Papad Fry','Gujarati Dal','Plain Rice','Tawa Thalji','Mini Undhiyu','Mukhwas','Ice Cream','Mix Achar','Mineral Water']),
(4, 'Royal Thali', ARRAY['Hot & Sour Soup','Shahi Rabdi','Halwo','Locha Puri','Mithi Roti','Paneer Pasanda','Rajasthani Bataki','Tava Vegetable','Lilva Korns','Mini Honsa','Red Sauce','Dal Hyderabadi','Jeera Rice','Chilli Paneer','Manchurian','Papad Fry','Mukhwas','Lemon Chilli Achar','Mineral Water']),
(5, 'Premium Select', ARRAY['Corn Tomato Soup','Rabdi Jvadi','Anjeer Halwa','Locha Puri','Amali Roti','Jodhpuri Bataki','Mini Undhiyu','Paneer Capsicum','In Mutter','Bel','Hyderabadi Chilla','Sbaka Kadhi','Pulav Dry Fruit','Palak Paneer','Capsicum Alu Tikki','Papads','Red Sauce','Mukhwas','Mix Achar','Mineral Water']),
(6, 'Spice Garden', ARRAY['Chilli Beans Soup','Cream Flavour','Kaju Anjeer Tapapuri','Tanduri Roti','Locha Puri','Sarso Da Shak','Chilli Boondi Shak','Paneer Tikka','Batakani Chips','Red Sauce','Chat Basket','Gujarati Dal','Plain Bhat','Papad Mix Fry','Mukhwas','Draksanu Athanu','Mineral Water']),
(7, 'Fusion Feast', ARRAY['Vegetable Noodles with Tomato Soup','Anguri Rabdi','Badam Halwa','Methina Thepla','Locha Puri','Naan','Jayapuri Vegetable','Panjabi Flavar','Potato Chips','Chainese Samosa','Khasta Kachori','Delhi Chat','Mini Uttapam','American Chopsi','Fry Chilli Paneer','Red Sauce','Green Chatni','Raiwala Vadavani Marcha','Kadhi Sbokavali','Pulav Kaju Flas','Papads Bested','Mineral Water']),
(8, 'Maharaja Special', ARRAY['Palak Flavar Soup','Kala Jam','Locha Puri','Angur Basoodi','Butter Nan','Shahi Paneer','Rajasthani Bataka','Sev Boondi Capsicum','Lilva Konas','Chat Basket','Red Sauce','Dasabari Kabab','Manchurian with Fry Rice','Dal Kadhi','Veg Oli Ariyani','Papads Fry','Samtanu','Mineral Water']),
(9, 'Exotic Blend', ARRAY['Noodles with Butter Stick Soup','Basoodi','Coconut Halwa','Locha Puri','Methi Na Thepla','Malai Kofta','Sev Boondi Capsicum','Potato Chips','Ratala Pettis','Corn Basket','Red Sauce','Green Chatni','Gujarati Kadhi','Green Pis Pulav','Papad Fry','Mix Khadu Athanu','Mineral Water']),
(10, 'Heritage Menu', ARRAY['Corn Soup','Kaju Paina Sendvich','Locha Puri','Amali Roti','Methi Na Chaman with Paneer','Falavar Vatana','Barel Parvar','Dhosana Rolls','Dhdhino Halwo','Green Chatni','Alu Tikki','Chainese Bhel','Rai Vala Marcha','Green Salad','Plain Bhat','Papad Mix Fry','Mukhwas','Draksanu Athanu','Mineral Water']),
(11, 'South-North Fusion', ARRAY['Tomato Rasm','Dry Fruit Cream with Anguri','Kaju Pista Kamal','Locha Puri','Masala Naan','Tava Thalji','Fansdi Makai','Vatana In Palak Grevi','Idskola Fry','Paneer Chilla','Methi Bajina Dhokla','Red Sauce','Paneer Cholla','Dhis-Ko Rolls','Green Dal','Plain Basmati Rice','Rajasthani Khchida','Mix Papads','Gajar Libunu Athanu','Mineral Water']),
(12, 'Palak Corn Special', ARRAY['Palakno Corn Soup','Indhrani','Kaju Koprana Rolls','Locha Puri','Methi Naan','Butter Paneer Korma','Mini Undhiyu','Bindi Masala','Bermis Roll','Ratala Handvo','Red Sauce','Samosa Chat','Manchurian n Fry Rice','Dal Kadhi','Veg Oily Ariyani','Papad Fry','Samtanu','Mineral Water']),
(13, 'Rajasthani Thali', ARRAY['Dal (Panchranga)','Baati','Churma','Gatta Nu Shak','Ringan Batakanu Shak','Khasta Kachori','Lili Chatni','Rajasthani Kadhi','Rajasthani Khichida','Mula Nu Salad','Ghewer']),
(14, 'Makai Special', ARRAY['Makaini Roti','Sarso Da Shak','Tanduri','Paneer Korma','Rajbhog Motha','Dal Fry','Jeera Rice','Jwar Mix Fry Chayms']),
(15, 'Simple Gujarati', ARRAY['Chole','Bhature','Dal Fry','Jeera Rice','Kala Jamun','Green Salad','Papads']),
(16, 'Mini Thali', ARRAY['Parotha','Shak','Kadhi','Pulao','Jalebi','Papdi']),
(17, 'Puri Moti Bhoj', ARRAY['Puri Moti','Shak','Dal-Bhat','Papads','Mahi']),
(18, 'Traditional Gujarati', ARRAY['Fada Lapsi','Puri','Gota','Batakanu Shak','Deshi Chana','Dal','Bhat','Papads','Salad']),
(19, 'Festive Bhoj', ARRAY['Chokha Ghina Ladu','Puri','Fulvadi','Batakanu Rasavalu Shak','Ek Green Shak','Deshi Chana/Val','Gujarati Dal','Plain Bhat','Papads','Green Salad','Ravanu'])
ON CONFLICT (menu_number) DO NOTHING;

-- ─── Menu Categories ──────────────────────────────────────
INSERT INTO menu_categories (name, description, sort_order) VALUES
('Cold Appetizer','Choose any One',1),('Hot Appetizer','Choose any One',2),
('Bitting / Starters','Choose any Two',3),('Chatni & Sauce','Choose any Two',4),
('Namkeen','Choose any One',5),('Salad','Choose any Two',6),
('Chat','Choose any Two',7),('Cleva - Nasta','Snacks',8),
('Dal & Kadhi','Lentils & Gravy',9),('Vegetables A - Paneer','Choose any One',10),
('Vegetables B','Choose any Two',11),('From China With Love','Chinese',12),
('Pulao & Rice','Choose any One',13),('Papad','Accompaniments',14),
('From Karai','Deep Fried Breads',15),('From Tawa','Tawa Breads',16),
('From Clay Tandoor','Choose any One',17),('Expresso Coffee & Tea','Hot Beverages',18),
('Hot Sweet Dishes','Choose any One',19),('Cold Sweet Dishes','Choose any Two',20),
('Special Sweets','Additional Charge',21),('Desert Dish','Choose any One',22),
('Rangila Rajasthani Khana','Rajasthani Special',23),('Garvi Gujarat','Gujarati Special',24),
('South Indian','South Indian Cuisine',25),('Ice Cream','Assorted',26),
('Mukhwas & Pan','Digestives',27)
ON CONFLICT DO NOTHING;

-- NOTE: Run database/create-admin.js to create the admin user with proper bcrypt hash.
-- Quick test admin (password = 'Admin@1234'):
-- The hash below was generated with bcrypt rounds=12
INSERT INTO users (name, email, password_hash, phone, role, is_active) 
VALUES (
  'Admin',
  'admin@maasuperior.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj2DCCO2RVCi',
  '9879556507',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;
