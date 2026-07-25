import { Router, Request, Response } from 'express';
import { getAll, getById, createDoc, updateDocById, deleteDocById } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all sellers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sellers = await getAll('sellers');
    res.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});

// Get single seller with properties
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const seller = await getById('sellers', id);

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Seller's properties are linked via the property_ids array on the seller doc
    const propertyIds: string[] = Array.isArray(seller.property_ids) ? seller.property_ids : [];
    const properties = (
      await Promise.all(propertyIds.map((propertyId) => getById('properties', propertyId)))
    ).filter((p) => p !== null);

    res.json({
      ...seller,
      properties,
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
      preferred_agent, notes, selling_reason, timeline, property_ids
    } = req.body;

    const seller = await createDoc('sellers', {
      name,
      email,
      phone,
      avatar,
      address,
      status: status || 'Active',
      preferred_agent,
      notes,
      selling_reason,
      timeline,
      property_ids: Array.isArray(property_ids) ? property_ids : [],
    });
    res.status(201).json(seller);
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ error: 'Failed to create seller' });
  }
});

// Update seller
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const seller = await updateDocById('sellers', id, req.body);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ error: 'Failed to update seller' });
  }
});

// Delete seller
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteDocById('sellers', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    res.json({ message: 'Seller deleted', id });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Failed to delete seller' });
  }
});

export default router;
