import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all enquiries
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Get single enquiry
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM enquiries WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
});

// Create enquiry
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, property, message, status, source } = req.body;

    const result = await query(
      `INSERT INTO enquiries (name, email, phone, property, message, status, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, email, phone, property, message, status || 'New', source || 'Website']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
});

// Update enquiry
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const fieldKeys = Object.keys(fields);
    const fieldValues = Object.values(fields);

    const setClause = fieldKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const result = await query(
      `UPDATE enquiries SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fieldKeys.length + 1} RETURNING *`,
      [...fieldValues, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Delete enquiry
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM enquiries WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted', id });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
