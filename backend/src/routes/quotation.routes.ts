import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/client';
import { authenticate, requireAdminAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const generateQuoteNumber = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `MSC-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${Math.floor(1000 + Math.random()*9000)}`;
};

// ─── Submit Quote (Public) ────────────────────────────────────────────────────
router.post('/',
  [
    body('customer_name').trim().notEmpty().withMessage('Name is required'),
    body('customer_phone').trim().notEmpty().withMessage('Phone is required'),
    body('customer_email').optional({ checkFalsy: true }).isEmail(),
    body('guest_count').optional({ checkFalsy: true }).isInt({ min: 1 }),
    body('event_date').optional({ checkFalsy: true }).isISO8601(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const {
        customer_name, customer_phone, customer_email,
        event_type, event_date, event_location,
        guest_count, selected_menu_number, custom_items, special_requests
      } = req.body;

      const quoteNumber = generateQuoteNumber();
      const customerId = req.user?.userId || null;

      // Look up preset menu id if number provided
      let selectedMenuId = null;
      if (selected_menu_number) {
        const menuRes = await query('SELECT id FROM preset_menus WHERE menu_number = $1', [parseInt(selected_menu_number)]);
        if (menuRes.rows[0]) selectedMenuId = menuRes.rows[0].id;
      }

      const result = await query(
        `INSERT INTO quotations
         (quote_number, customer_id, customer_name, customer_phone, customer_email,
          event_type, event_date, event_location, guest_count, selected_menu_id,
          custom_items, special_requests, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending')
         RETURNING *`,
        [
          quoteNumber, customerId,
          customer_name.trim(), customer_phone.trim(),
          customer_email || null,
          event_type || null,
          event_date || null,
          event_location || null,
          guest_count || null,
          selectedMenuId,
          custom_items ? JSON.stringify(custom_items) : null,
          special_requests || null,
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Quote submission error:', err);
      res.status(500).json({ error: 'Server error. Please try again.' });
    }
  }
);

// ─── Admin: List Quotations ───────────────────────────────────────────────────
router.get('/admin', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params: any[] = [];
    let where = '';
    if (status && status !== 'all') {
      params.push(status);
      where = `WHERE q.status = $${params.length}`;
    }
    params.push(Number(limit), offset);

    const dataRes = await query(
      `SELECT q.*, pm.title as menu_title, pm.menu_number
       FROM quotations q
       LEFT JOIN preset_menus pm ON q.selected_menu_id = pm.id
       ${where}
       ORDER BY q.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countParams = status && status !== 'all' ? [status] : [];
    const countRes = await query(
      `SELECT COUNT(*) FROM quotations ${status && status !== 'all' ? 'WHERE status=$1' : ''}`,
      countParams
    );

    res.json({ data: dataRes.rows, total: parseInt(countRes.rows[0].count), page: Number(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Get Single ────────────────────────────────────────────────────────
router.get('/admin/:id', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT q.*, pm.title as menu_title, pm.items as menu_items, pm.menu_number
       FROM quotations q LEFT JOIN preset_menus pm ON q.selected_menu_id = pm.id
       WHERE q.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Update ────────────────────────────────────────────────────────────
router.patch('/admin/:id', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, admin_notes, estimated_amount, final_amount } = req.body;
    const result = await query(
      `UPDATE quotations SET
        status = COALESCE($1, status),
        admin_notes = COALESCE($2, admin_notes),
        estimated_amount = COALESCE($3, estimated_amount),
        final_amount = COALESCE($4, final_amount),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [status || null, admin_notes || null, estimated_amount || null, final_amount || null, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Customer: My Quotes ──────────────────────────────────────────────────────
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT q.*, pm.title as menu_title, pm.menu_number FROM quotations q
       LEFT JOIN preset_menus pm ON q.selected_menu_id = pm.id
       WHERE q.customer_id = $1 ORDER BY q.created_at DESC`,
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
