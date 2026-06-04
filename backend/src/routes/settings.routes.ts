import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/client';
import { requireAdminAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ─── Public: Get Settings ─────────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT key, value FROM settings');
    const settings: Record<string, string> = {};
    result.rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Update Settings ───────────────────────────────────────────────────
router.put('/', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const settings = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(settings)) {
      await query(
        'INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
        [key, value]
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export { router as settingsRouter };

// ─── Contact ──────────────────────────────────────────────────────────────────
const contactRouter = Router();

contactRouter.post('/',
  [
    body('name').trim().notEmpty(),
    body('phone').notEmpty(),
    body('message').trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, phone, email, message } = req.body;
      await query(
        'INSERT INTO contact_messages (name, phone, email, message) VALUES ($1,$2,$3,$4)',
        [name, phone, email || null, message]
      );
      res.status(201).json({ message: 'Message received! We will contact you soon.' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Admin: list contact messages
contactRouter.get('/admin', ...requireAdminAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

contactRouter.patch('/admin/:id/read', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    await query('UPDATE contact_messages SET is_read=true WHERE id=$1', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export { contactRouter };
