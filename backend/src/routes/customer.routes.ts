import { Router, Response } from 'express';
import { query } from '../db/client';
import { requireAdminAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ─── Admin: List Customers ────────────────────────────────────────────────────
router.get('/', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let sql = `SELECT u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
               COUNT(q.id) as quote_count
               FROM users u LEFT JOIN quotations q ON u.id = q.customer_id
               WHERE u.role = 'customer'`;
    const params: any[] = [];
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.phone ILIKE $${params.length})`;
    }
    sql += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(Number(limit), offset);

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Get Customer Detail ───────────────────────────────────────────────
router.get('/:id', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await query(
      'SELECT id, name, email, phone, is_active, created_at FROM users WHERE id=$1 AND role=$2',
      [req.params.id, 'customer']
    );
    if (!user.rows[0]) return res.status(404).json({ error: 'Not found' });

    const quotes = await query(
      'SELECT * FROM quotations WHERE customer_id=$1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json({ ...user.rows[0], quotations: quotes.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Toggle Customer Status ────────────────────────────────────────────
router.patch('/:id/toggle', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'UPDATE users SET is_active = NOT is_active WHERE id=$1 AND role=$2 RETURNING id, name, is_active',
      [req.params.id, 'customer']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
