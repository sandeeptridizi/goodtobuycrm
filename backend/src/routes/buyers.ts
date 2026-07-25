import { Router, Request, Response } from 'express';
import { getAll, getById, getWhere, createDoc, updateDocById, deleteDocById } from '../db/index.js';

const router = Router();

function num(value: unknown, fallback: number | null = null): number | null {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

// Get all buyers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const buyers = await getAll('buyers');
    res.json(buyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ error: 'Failed to fetch buyers' });
  }
});

// Get single buyer
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const buyer = await getById('buyers', id);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    res.json(buyer);
  } catch (error) {
    console.error('Error fetching buyer:', error);
    res.status(500).json({ error: 'Failed to fetch buyer' });
  }
});

// Create buyer
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name, email, phone, budget_min, budget_max, property_types,
      min_bedrooms, max_bedrooms, min_bathrooms, max_bathrooms,
      min_area, preferred_locations, avatar, status, lead_source,
      notes, timeline, financing, amenities_required, assigned_agent
    } = req.body;

    const buyer = await createDoc('buyers', {
      name,
      email: email || null,
      phone,
      budget_min: num(budget_min),
      budget_max: num(budget_max),
      property_types: Array.isArray(property_types) ? property_types : [],
      min_bedrooms: num(min_bedrooms, 0),
      max_bedrooms: num(max_bedrooms, 10),
      min_bathrooms: num(min_bathrooms, 0),
      max_bathrooms: num(max_bathrooms, 10),
      min_area: num(min_area, 0),
      preferred_locations: Array.isArray(preferred_locations) ? preferred_locations : [],
      avatar: avatar || null,
      status: status || 'Active',
      lead_source: lead_source || null,
      notes: notes || null,
      timeline: timeline || null,
      financing: financing || null,
      amenities_required: Array.isArray(amenities_required) ? amenities_required : [],
      assigned_agent: assigned_agent || null,
    });
    res.status(201).json(buyer);
  } catch (error) {
    console.error('Error creating buyer:', error);
    res.status(500).json({ error: 'Failed to create buyer' });
  }
});

// Update buyer
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const fields = { ...req.body };

    // "0" means "no agent assigned" — store null instead
    if (fields.assigned_agent === 0 || fields.assigned_agent === '0') {
      fields.assigned_agent = null;
    }

    const buyer = await updateDocById('buyers', id, fields);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    res.json(buyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    res.status(500).json({ error: 'Failed to update buyer' });
  }
});

// Delete buyer
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteDocById('buyers', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    res.json({ message: 'Buyer deleted', id });
  } catch (error) {
    console.error('Error deleting buyer:', error);
    res.status(500).json({ error: 'Failed to delete buyer' });
  }
});

// Get matching properties for a buyer
router.get('/:id/matching-properties', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const buyer = await getById('buyers', id);

    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const budgetMin = parseFloat(buyer.budget_min || 0);
    const budgetMax = parseFloat(buyer.budget_max || 0);
    const propertyTypes = buyer.property_types || [];
    const locations = buyer.preferred_locations || [];
    const minBedrooms = buyer.min_bedrooms || 0;
    const maxBedrooms = buyer.max_bedrooms || 10;
    const minBathrooms = buyer.min_bathrooms || 0;
    const minArea = buyer.min_area || 0;

    const properties = await getWhere('properties', 'status', '==', 'Available');

    const matchingProperties = properties.filter(property => {
      const propertyPrice = parseFloat(property.price) || 0;
      const propertyCity = property.city || '';

      const meetsPrice = propertyPrice >= budgetMin && propertyPrice <= budgetMax;
      const meetsType = propertyTypes.length === 0 || propertyTypes.includes(property.type);
      const meetsBedrooms = (property.bedrooms || 0) >= minBedrooms && (property.bedrooms || 0) <= maxBedrooms;
      const meetsBathrooms = (property.bathrooms || 0) >= minBathrooms;
      const meetsArea = (property.area || 0) >= minArea;
      const meetsLocation = locations.length === 0 ||
        locations.some((loc: string) => propertyCity.toLowerCase().includes(loc.toLowerCase()));

      return meetsPrice && meetsType && meetsBedrooms && meetsBathrooms && meetsArea && meetsLocation;
    }).map(property => {
      const propertyPrice = parseFloat(property.price) || 0;
      const propertyCity = property.city || '';

      let matchScore = 0;
      if (propertyPrice >= budgetMin && propertyPrice <= budgetMax) matchScore += 30;
      if (propertyTypes.includes(property.type)) matchScore += 25;
      if ((property.bedrooms || 0) >= minBedrooms && (property.bedrooms || 0) <= maxBedrooms) matchScore += 20;
      if ((property.bathrooms || 0) >= minBathrooms) matchScore += 15;
      if ((property.area || 0) >= minArea) matchScore += 5;
      if (locations.some((loc: string) => propertyCity.toLowerCase().includes(loc.toLowerCase()))) matchScore += 5;
      return { ...property, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchingProperties);
  } catch (error) {
    console.error('Error finding matching properties:', error);
    res.status(500).json({ error: 'Failed to find matching properties' });
  }
});

export default router;
