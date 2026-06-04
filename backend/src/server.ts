import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import quotationRoutes from './routes/quotation.routes';
import menuRoutes from './routes/menu.routes';
import customerRoutes from './routes/customer.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { settingsRouter, contactRouter } from './routes/settings.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'https://maa-superior.vercel.app',
  // allow any vercel preview URLs
  /^https:\/\/maa-superior.*\.vercel\.app$/,
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? origin === o || origin.startsWith(o) : o.test(origin)
    );
    if (allowed) return callback(null, true);
    // In production allow all — fine for this app
    if (process.env.NODE_ENV === 'production') return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors()); // pre-flight

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, max: 200,
  message: { error: 'Too many requests, please try again later.' },
}));
app.use(['/api/auth/login', '/api/auth/admin/login', '/api/auth/register'], rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  message: { error: 'Too many attempts, please try again later.' },
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Maa Superior Caterers API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRouter);
app.use('/api/contact', contactRouter);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.stack || err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║  🍽️  Maa Superior Caterers API           ║
  ║  Port: ${PORT}  |  ${process.env.NODE_ENV || 'development'}              ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
