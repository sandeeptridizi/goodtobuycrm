import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getById, getWhere } from '../db/index.js';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const workers = await getWhere('workers', 'email', '==', String(email).trim().toLowerCase());

    if (workers.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const worker = workers[0];

    if (worker.status === 'Inactive') {
      return res.status(403).json({ error: 'This account has been deactivated' });
    }

    const isValidPassword = await bcrypt.compare(password, worker.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { workerId: worker.id, email: worker.email, name: worker.name, role: 'worker' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      worker: {
        id: worker.id,
        email: worker.email,
        name: worker.name,
      },
    });
  } catch (error) {
    console.error('Worker login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      workerId: string;
      email: string;
      role?: string;
    };

    if (decoded.role !== 'worker') {
      return res.status(401).json({ valid: false });
    }

    const worker = await getById('workers', decoded.workerId);

    if (!worker || worker.status === 'Inactive') {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, worker: { id: worker.id, email: worker.email, name: worker.name } });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
