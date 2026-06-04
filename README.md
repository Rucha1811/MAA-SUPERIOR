# 🍽️ Maa Superior Caterers — Complete Web Application
### Royal Gold & Maroon Theme | No Login Required for Customers

---

## 🚀 Setup in 3 Steps

### 1. Database
```bash
# Create database
psql -U postgres -c "CREATE DATABASE maa_superior;"

# Run migrations (creates all tables + seeds menus)
psql -U postgres -d maa_superior -f database/migrate.sql

# Create admin user with correct bcrypt hash
node database/create-admin.js
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
npm run dev        # → http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

---

## 🔑 Admin Login
| Email | Password |
|-------|----------|
| admin@maasuperior.com | Admin@1234 |

**URL:** `http://localhost:5173/admin-login`

> ⚠️ Change password before going live: edit `database/create-admin.js` line 9

---

## 🌐 Pages

| URL | Description |
|-----|-------------|
| `/` | Home — Hero + Maa Modheshwari badge + Services + Menu preview |
| `/menu` | Full menu — À La Carte (500+ items) + Set Menus 1–19 (all items visible) |
| `/gallery` | Gallery + Password-protected photo upload (password: Nehal@0512) |
| `/contact` | Contact form — messages sent directly via WhatsApp to +91 98795 56507 |
| `/quote` | 3-step quote form — notifies admin via WhatsApp on submit |
| `/admin-login` | Admin login |
| `/admin` | Dashboard |
| `/admin/quotations` | Quotation management |
| `/admin/customers` | Customer management |
| `/admin/menu` | Menu management |
| `/admin/settings` | Business settings |

---

## ✅ Features

### Public Website
- **No customer login/signup** — removed as requested
- **Home page** includes "मा मोढ़ेश्वरी कैटरर्स — Maa Modheshwari Caterers" badge
- **Contact form** opens WhatsApp to +91 98795 56507 with message
- **Quote form** auto-opens WhatsApp to notify admin on submission
- **Menu** — all 19 set menus show complete dish lists when clicked
- **Gallery** — password-protected upload (Nehal@0512), images stored locally

### Admin Panel
- Dashboard with pending quote alerts
- Quotation management with WhatsApp message templates
- Customer list and history
- Menu editor (add/remove categories and items)
- Business settings editor

### Theme
- **Royal Gold** (#C9961A, #E5B732, #F5C842) + **Deep Maroon** (#4A0000, #6B0000)
- Fonts: Cinzel (headings) + Cormorant Garamond (body) + Nunito (UI)

---

## 📁 Structure
```
maa-superior/
├── frontend/src/
│   ├── components/     Header.tsx, Footer.tsx
│   ├── pages/          Home, Menu, Gallery, Contact, QuoteRequest, AdminLogin
│   │   └── admin/      Dashboard, Quotations, QuoteDetail, Customers,
│   │                   CustomerDetail, MenuManagement, Settings
│   ├── hooks/          useAuth.tsx
│   └── lib/            api.ts (axios)
├── backend/src/
│   ├── routes/         auth, quotations, menu, customers, dashboard, settings
│   ├── middleware/      auth.middleware.ts
│   ├── lib/            auth.ts (bcrypt + JWT)
│   └── db/             client.ts, migrate.ts
└── database/
    ├── migrate.sql      Full schema + 19 preset menus seeded
    └── create-admin.js  Admin user creation with bcrypt
```

---

## 📞 Business
**Vipul Gandhi** · +91 98795 56507  
Nr Shantivan School, Opp Mataji Mandir, Old Mahavir Ice-Cream Godown, Anand, Gujarat  
Maps: https://maps.google.com/?q=22.302866,73.225555
