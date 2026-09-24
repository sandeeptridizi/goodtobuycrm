import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getAll, getById, getWhere, createDoc, updateDocById, deleteDocById, type DocData } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const PHONE_PATTERN = /^\d{10}$/;

function stripPassword(worker: DocData): Omit<DocData, 'password_hash'> {
  const { password_hash, ...rest } = worker;
  return rest;
}

// Get all workers
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const workers = await getAll('workers');
    res.json(workers.map(stripPassword));
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// Get single worker
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const worker = await getById('workers', id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json(stripPassword(worker));
  } catch (error) {
    console.error('Error fetching worker:', error);
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
});

// Create worker
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (phone && !PHONE_PATTERN.test(String(phone).trim())) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await getWhere('workers', 'email', '==', normalizedEmail);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A worker with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const worker = await createDoc('workers', {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ?? null,
      status: 'Active',
      password_hash,
    });
    res.status(201).json(stripPassword(worker));
  } catch (error) {
    console.error('Error creating worker:', error);
    res.status(500).json({ error: 'Failed to create worker' });
  }
});

// Update worker
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, phone, status, password } = req.body;

    if (phone && !PHONE_PATTERN.test(String(phone).trim())) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    const fields: Record<string, unknown> = {};
    if (name !== undefined) fields.name = name;
    if (phone !== undefined) fields.phone = phone;
    if (status !== undefined) fields.status = status;
    if (typeof password === 'string' && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      fields.password_hash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const worker = await updateDocById('workers', id, fields);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json(stripPassword(worker));
  } catch (error) {
    console.error('Error updating worker:', error);
    res.status(500).json({ error: 'Failed to update worker' });
  }
});

// Delete worker
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteDocById('workers', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted', id });
  } catch (error) {
    console.error('Error deleting worker:', error);
    res.status(500).json({ error: 'Failed to delete worker' });
  }
});

export default router;
