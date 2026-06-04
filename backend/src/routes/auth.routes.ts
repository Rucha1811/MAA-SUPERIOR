import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/client';
import {
  hashPassword, comparePassword,
  signAccessToken, generateRefreshToken,
  storeRefreshToken, validateRefreshToken,
  revokeRefreshToken,
} from '../lib/auth';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const sanitizeUser = (u: any) => ({
  id: u.id, name: u.name, email: u.email,
  phone: u.phone, role: u.role, created_at: u.created_at,
});

// ─── Register ─────────────────────────────────────────────────────────────────
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional({ checkFalsy: true }).trim(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, phone, password } = req.body;
      const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'This email is already registered. Please sign in.' });
      }

      const hash = await hashPassword(password);
      const result = await query(
        'INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [name.trim(), email, phone?.trim() || null, hash, 'customer']
      );
      const user = result.rows[0];

      const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken();
      await storeRefreshToken(user.id, refreshToken);

      res.status(201).json({ user: sanitizeUser(user), accessToken, refreshToken });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  }
);

// ─── Customer Login ───────────────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const result = await query(
        "SELECT * FROM users WHERE email = $1 AND role = 'customer'",
        [email]
      );
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'No account found with this email. Please register first.' });
      }
      if (!user.is_active) {
        return res.status(403).json({ error: 'Your account has been disabled. Please contact us.' });
      }
      const valid = await comparePassword(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }

      const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken();
      await storeRefreshToken(user.id, refreshToken);

      res.json({ user: sanitizeUser(user), accessToken, refreshToken });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  }
);

// ─── Admin Login ──────────────────────────────────────────────────────────────
router.post('/admin/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const result = await query(
        "SELECT * FROM users WHERE email = $1 AND role = 'admin'",
        [email]
      );
      const user = result.rows[0];

      if (!user || !(await comparePassword(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid admin credentials. Check your email and password.' });
      }

      const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken();
      await storeRefreshToken(user.id, refreshToken);

      res.json({ user: sanitizeUser(user), accessToken, refreshToken });
    } catch (err) {
      console.error('Admin login error:', err);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  }
);

// ─── Refresh Token ────────────────────────────────────────────────────────────
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

  try {
    const stored = await validateRefreshToken(refreshToken);
    if (!stored) return res.status(401).json({ error: 'Session expired. Please log in again.' });

    await revokeRefreshToken(refreshToken);
    const newAccess = signAccessToken({ userId: stored.uid, email: stored.email, role: stored.role });
    const newRefresh = generateRefreshToken();
    await storeRefreshToken(stored.uid, newRefresh);

    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) await revokeRefreshToken(refreshToken).catch(() => {});
  res.json({ message: 'Logged out successfully' });
});

// ─── Me ───────────────────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE id = $1',
      [req.user!.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    if (!result.rows[0].is_active) return res.status(403).json({ error: 'Account disabled' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
