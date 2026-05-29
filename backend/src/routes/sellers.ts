import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all sellers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM sellers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});

// Get single seller with properties
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerResult = await query('SELECT * FROM sellers WHERE id = $1', [id]);

    if (sellerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const propertiesResult = await query(
      `SELECT p.* FROM properties p
       JOIN seller_properties sp ON p.id = sp.property_id
       WHERE sp.seller_id = $1`,
      [id]
    );

    res.json({
      ...sellerResult.rows[0],
      properties: propertiesResult.rows
    });
  } catch (error) {
    console.error('Error fetching seller:', error);
    res.status(500).json({ error: 'Failed to fetch seller' });
  }
});

// Create seller
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      name, email, phone, avatar, address, status,
      preferred_agent, notes, selling_reason, timeline
    } = req.body;

    const result = await query(
      `INSERT INTO sellers (
        name, email, phone, avatar, address, status,
        preferred_agent, notes, selling_reason, timeline
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [name, email, phone, avatar, address, status || 'Active', preferred_agent, notes, selling_reason, timeline]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ error: 'Failed to create seller' });
  }
});

// Update seller
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const fieldKeys = Object.keys(fields);
    const fieldValues = Object.values(fields);

    const setClause = fieldKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const result = await query(
      `UPDATE sellers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fieldKeys.length + 1} RETURNING *`,
      [...fieldValues, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ error: 'Failed to update seller' });
  }
});

// Delete seller
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM sellers WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    res.json({ message: 'Seller deleted', id });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Failed to delete seller' });
  }
});

export default router;
