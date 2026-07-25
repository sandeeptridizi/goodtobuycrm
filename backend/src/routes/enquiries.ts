import { Router, Request, Response } from 'express';
import { getAll, getById, createDoc, updateDocById, deleteDocById } from '../db/index.js';

const router = Router();

// Get all enquiries
router.get('/', async (_req: Request, res: Response) => {
  try {
    const enquiries = await getAll('enquiries');
    res.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Get single enquiry
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const enquiry = await getById('enquiries', id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
});

// Create enquiry
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, property, message, status, source } = req.body;

    const enquiry = await createDoc('enquiries', {
      name,
      email,
      phone,
      property,
      message,
      status: status || 'New',
      source: source || 'Website',
    });
    res.status(201).json(enquiry);
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
});

// Update enquiry
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const enquiry = await updateDocById('enquiries', id, req.body);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(enquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Delete enquiry
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteDocById('enquiries', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted', id });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
