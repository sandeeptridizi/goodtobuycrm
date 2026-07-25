import { Router, Request, Response } from 'express';
import { getAll, getById, createDoc, updateDocById, deleteDocById } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all employees
router.get('/', async (_req: Request, res: Response) => {
  try {
    const employees = await getAll('employees');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get single employee
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const employee = await getById('employees', id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
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

    const employee = await createDoc('employees', {
      name: name.trim(),
      email: email ?? null,
      phone: phone ?? null,
      role: role ?? null,
      department: department ?? null,
      status: status || 'Active',
      join_date: join_date ?? null,
      avatar: avatar ?? null,
      address: address ?? null,
      emergency_contact: emergency_contact ?? null,
      skills: Array.isArray(skills) ? skills : [],
      qualifications: qualifications ?? null,
      languages: Array.isArray(languages) ? languages : [],
    });
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Fields the client is allowed to update. Anything else is silently dropped.
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
    const id = String(req.params.id);

    // Whitelist + drop unknown keys. Never trust client-provided field names.
    const fields: Record<string, unknown> = {};
    for (const key of UPDATABLE_EMPLOYEE_FIELDS) {
      if (key in req.body) {
        fields[key] = req.body[key];
      }
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const employee = await updateDocById('employees', id, fields);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteDocById('employees', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted', id });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
