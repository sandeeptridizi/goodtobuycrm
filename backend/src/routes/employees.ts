import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all employees
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get single employee
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM employees WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      name, email, phone, role, department, status,
      join_date, avatar, address, emergency_contact,
      skills, qualifications, languages
    } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await query(
      `INSERT INTO employees (
        name, email, phone, role, department, status,
        join_date, avatar, address, emergency_contact,
        skills, qualifications, languages
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        name.trim(), email ?? null, phone ?? null, role ?? null, department ?? null,
        status || 'Active',
        join_date ?? null, avatar ?? null, address ?? null, emergency_contact ?? null,
        Array.isArray(skills) ? skills : [],
        qualifications ?? null,
        Array.isArray(languages) ? languages : [],
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Fields the client is allowed to update. Anything else is silently dropped
// to avoid leaking unknown keys into the SQL SET clause.
const UPDATABLE_EMPLOYEE_FIELDS = [
  'name',
  'email',
  'phone',
  'role',
  'department',
  'status',
  'join_date',
  'avatar',
  'address',
  'emergency_contact',
  'skills',
  'qualifications',
  'languages',
] as const;

// Update employee
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Whitelist + drop unknown keys. Never trust client-provided column names.
    const keys = Object.keys(req.body).filter((k) =>
      (UPDATABLE_EMPLOYEE_FIELDS as readonly string[]).includes(k)
    );

    if (keys.length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const values = keys.map((k) => req.body[k]);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    const result = await query(
      `UPDATE employees SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${keys.length + 1}
       RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM employees WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted', id });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
