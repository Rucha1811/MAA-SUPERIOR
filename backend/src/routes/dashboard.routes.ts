import { Router, Response } from 'express';
import { query } from '../db/client';
import { requireAdminAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/', ...requireAdminAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const [quotes, customers, pending, revenue, recent] = await Promise.all([
      query('SELECT COUNT(*) FROM quotations'),
      query("SELECT COUNT(*) FROM users WHERE role='customer'"),
      query("SELECT COUNT(*) FROM quotations WHERE status='pending'"),
      query("SELECT COALESCE(SUM(final_amount),0) as total FROM quotations WHERE status='completed'"),
      query(`SELECT q.quote_number, q.customer_name, q.event_type, q.status, q.created_at
             FROM quotations q ORDER BY q.created_at DESC LIMIT 5`),
    ]);

    const statusCounts = await query(`
      SELECT status, COUNT(*) as count FROM quotations GROUP BY status
    `);

    res.json({
      totalQuotes: parseInt(quotes.rows[0].count),
      totalCustomers: parseInt(customers.rows[0].count),
      pendingQuotes: parseInt(pending.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].total),
      recentQuotes: recent.rows,
      quotesByStatus: statusCounts.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
