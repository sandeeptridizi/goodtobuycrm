import { Router, Response } from 'express';
import { Request } from 'express';
import { getAll, getById, getWhere, createDoc, updateDocById, deleteDocById } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { workerAuthMiddleware, type WorkerAuthRequest } from '../middleware/workerAuth.js';
import { uploadImages, InvalidImageError } from '../lib/storage.js';

const router = Router();

const FLAT_TYPES = ['Villa', 'House', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Shop', 'Commercial Property'];
const FURNISHING_TYPES = ['Fully Furnished', 'Semi Furnished', 'Un Furnished'];
const STATUSES = ['New', 'Contacted', 'Interested', 'Not Interested', 'Converted'];
const PHONE_PATTERN = /^\d{10}$/;
const MAX_PHOTOS = 10;

// Submit a new promotion lead (field worker)
router.post('/', workerAuthMiddleware, async (req: WorkerAuthRequest, res: Response) => {
  try {
    const {
      property_name, flat_no, flat_type, square_feet, furnishing_type,
      address, location_area, phone, alternate_phone,
      gps_lat, gps_lng, photos_base64, photo_base64,
    } = req.body;

    // Older app versions send a single photo_base64; newer ones send photos_base64.
    const photos: unknown[] = Array.isArray(photos_base64)
      ? photos_base64
      : photo_base64 ? [photo_base64] : [];

    if (typeof property_name !== 'string' || property_name.trim() === '') {
      return res.status(400).json({ error: 'Property / Apartment name is required' });
    }
    if (!FLAT_TYPES.includes(flat_type)) {
      return res.status(400).json({ error: 'A valid flat type is required' });
    }
    if (!FURNISHING_TYPES.includes(furnishing_type)) {
      return res.status(400).json({ error: 'A valid furnishing type is required' });
    }
    if (typeof phone !== 'string' || !PHONE_PATTERN.test(phone.trim())) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }
    if (alternate_phone && !PHONE_PATTERN.test(String(alternate_phone).trim())) {
      return res.status(400).json({ error: 'Alternative number must be exactly 10 digits' });
    }
    if (gps_lat === undefined || gps_lat === null || gps_lng === undefined || gps_lng === null) {
      return res.status(400).json({ error: 'GPS location is required' });
    }
    if (photos.length === 0 || photos.some((p) => typeof p !== 'string' || p.trim() === '')) {
      return res.status(400).json({ error: 'At least one photo of the sale board is required' });
    }
    if (photos.length > MAX_PHOTOS) {
      return res.status(400).json({ error: `You can upload up to ${MAX_PHOTOS} photos` });
    }

    let photo_urls: string[];
    try {
      photo_urls = await uploadImages(photos, 'promotions');
    } catch (error) {
      if (error instanceof InvalidImageError) {
        return res.status(400).json({ error: 'One of the photos is invalid. Please retake it.' });
      }
      throw error;
    }

    const promotion = await createDoc('promotions', {
      worker_id: req.workerId,
      worker_name: req.workerName,
      property_name: property_name.trim(),
      flat_no: flat_no ?? null,
      flat_type,
      square_feet: Number(square_feet) || null,
      furnishing_type,
      address: address ?? null,
      location_area: location_area ?? null,
      phone: phone.trim(),
      alternate_phone: alternate_phone ?? null,
      gps_lat: Number(gps_lat),
      gps_lng: Number(gps_lng),
      photo_urls,
      // First photo doubles as the cover, so anything reading photo_url keeps working.
      photo_url: photo_urls[0],
      status: 'New',
      commission_amount: 0,
      is_paid: false,
      paid_at: null,
    });
    res.status(201).json(promotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ error: 'Failed to submit property' });
  }
});

// Lifetime count of promotions submitted by the logged-in worker
router.get('/count', workerAuthMiddleware, async (req: WorkerAuthRequest, res: Response) => {
  try {
    const promotions = await getWhere('promotions', 'worker_id', '==', req.workerId!);
    res.json({ count: promotions.length });
  } catch (error) {
    console.error('Error counting promotions:', error);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

// List all promotions (admin), optionally filtered by status
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const promotions = typeof status === 'string' && status !== 'All'
      ? await getWhere('promotions', 'status', '==', status)
      : await getAll('promotions');
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

// Get single promotion (admin)
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const promotion = await getById('promotions', id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    res.status(500).json({ error: 'Failed to fetch promotion' });
  }
});

// Update status (admin)
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const promotion = await updateDocById('promotions', id, { status });
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    console.error('Error updating promotion status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Fields the admin is allowed to edit. Anything else is silently dropped.
const UPDATABLE_PROMOTION_FIELDS = [
  'property_name', 'flat_no', 'flat_type', 'square_feet', 'furnishing_type',
  'address', 'location_area', 'phone', 'alternate_phone', 'gps_lat', 'gps_lng',
  'commission_amount', 'is_paid', 'paid_at',
] as const;

// Update lead details (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const body = req.body as Record<string, unknown>;

    if (body.flat_type !== undefined && !FLAT_TYPES.includes(body.flat_type as string)) {
      return res.status(400).json({ error: 'A valid flat type is required' });
    }
    if (body.furnishing_type !== undefined && !FURNISHING_TYPES.includes(body.furnishing_type as string)) {
      return res.status(400).json({ error: 'A valid furnishing type is required' });
    }
    if (body.phone !== undefined && !PHONE_PATTERN.test(String(body.phone).trim())) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }
    if (body.alternate_phone && !PHONE_PATTERN.test(String(body.alternate_phone).trim())) {
      return res.status(400).json({ error: 'Alternative number must be exactly 10 digits' });
    }

    const fields: Record<string, unknown> = {};
    for (const key of UPDATABLE_PROMOTION_FIELDS) {
      if (key in body) {
        fields[key] = body[key];
      }
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const promotion = await updateDocById('promotions', id, fields);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});

// Delete a promotion (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteDocById('promotions', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted', id });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
});

export default router;
