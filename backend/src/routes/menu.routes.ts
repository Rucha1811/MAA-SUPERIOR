import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/client';
import { requireAdminAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ─── Public: Get All Categories with Items ────────────────────────────────────
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const cats = await query('SELECT * FROM menu_categories WHERE is_active=true ORDER BY sort_order');
    const items = await query('SELECT * FROM menu_items WHERE is_available=true ORDER BY sort_order, name');
    const result = cats.rows.map(cat => ({
      ...cat,
      items: items.rows.filter(i => i.category_id === cat.id)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Public: Get Preset Menus ─────────────────────────────────────────────────
router.get('/presets', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM preset_menus WHERE is_active=true ORDER BY menu_number');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Create Category ───────────────────────────────────────────────────
router.post('/categories', ...requireAdminAuth,
  [body('name').notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, description, sort_order } = req.body;
      const result = await query(
        'INSERT INTO menu_categories (name, description, sort_order) VALUES ($1,$2,$3) RETURNING *',
        [name, description || null, sort_order || 0]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ─── Admin: Update Category ───────────────────────────────────────────────────
router.patch('/categories/:id', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, sort_order, is_active } = req.body;
    const result = await query(
      `UPDATE menu_categories SET
        name=COALESCE($1,name), description=COALESCE($2,description),
        sort_order=COALESCE($3,sort_order), is_active=COALESCE($4,is_active)
       WHERE id=$5 RETURNING *`,
      [name, description, sort_order, is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Add Menu Item ─────────────────────────────────────────────────────
router.post('/items', ...requireAdminAuth,
  [body('name').notEmpty(), body('category_id').notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { category_id, name, name_gujarati, description, sort_order } = req.body;
      const result = await query(
        'INSERT INTO menu_items (category_id, name, name_gujarati, description, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [category_id, name, name_gujarati || null, description || null, sort_order || 0]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ─── Admin: Update Item ───────────────────────────────────────────────────────
router.patch('/items/:id', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, name_gujarati, description, is_available, sort_order } = req.body;
    const result = await query(
      `UPDATE menu_items SET
        name=COALESCE($1,name), name_gujarati=COALESCE($2,name_gujarati),
        description=COALESCE($3,description), is_available=COALESCE($4,is_available),
        sort_order=COALESCE($5,sort_order)
       WHERE id=$6 RETURNING *`,
      [name, name_gujarati, description, is_available, sort_order, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Admin: Delete Item ───────────────────────────────────────────────────────
router.delete('/items/:id', ...requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    await query('DELETE FROM menu_items WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
