import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface WorkerAuthRequest extends Request {
  workerId?: string;
  workerEmail?: string;
  workerName?: string;
}

export function workerAuthMiddleware(req: WorkerAuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      workerId: string;
      email: string;
      name: string;
      role?: string;
    };
    // Admin tokens (and any other role) are a distinct credential space — never valid here.
    if (decoded.role !== 'worker') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.workerId = decoded.workerId;
    req.workerEmail = decoded.email;
    req.workerName = decoded.name;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
