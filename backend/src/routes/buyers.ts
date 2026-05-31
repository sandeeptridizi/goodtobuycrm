import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all buyers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM buyers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ error: 'Failed to fetch buyers' });
  }
});

// Get single buyer
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM buyers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    res.json(result.rows[0]);
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

    const result = await query(
      `INSERT INTO buyers (
        name, email, phone, budget_min, budget_max, property_types,
        min_bedrooms, max_bedrooms, min_bathrooms, max_bathrooms,
        min_area, preferred_locations, avatar, status, lead_source,
        notes, timeline, financing, amenities_required, assigned_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        name,
        email || null,
        phone,
        budget_min || null,
        budget_max || null,
        property_types || [],
        min_bedrooms || 0,
        max_bedrooms || 10,
        min_bathrooms || 0,
        max_bathrooms || 10,
        min_area || 0,
        preferred_locations || [],
        avatar || null,
        status || 'Active',
        lead_source || null,
        notes || null,
        timeline || null,
        financing || null,
        amenities_required || [],
        assigned_agent || null
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating buyer:', error);
    res.status(500).json({ error: 'Failed to create buyer' });
  }
});

// Update buyer
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const fieldKeys = Object.keys(fields);
    const fieldValues: unknown[] = Object.values(fields);

    // Convert array fields to PostgreSQL array format
    const processedValues = fieldValues.map((value) => {
      if (Array.isArray(value)) {
        // Convert JS array to PostgreSQL array format: {item1,item2}
        if (value.length === 0) return '{}';
        return `{${value.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(',')}}`;
      }
      // Convert 0 to null for foreign key fields to avoid FK violations
      if (value === 0 || value === "0") {
        return null;
      }
      return value;
    });

    const setClause = fieldKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const result = await query(
      `UPDATE buyers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fieldKeys.length + 1} RETURNING *`,
      [...processedValues, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating buyer:', error);
    res.status(500).json({ error: 'Failed to update buyer' });
  }
});

// Delete buyer
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM buyers WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
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
    const { id } = req.params;
    const buyerResult = await query('SELECT * FROM buyers WHERE id = $1', [id]);

    if (buyerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const buyer = buyerResult.rows[0];
    const budgetMin = parseFloat(buyer.budget_min || 0);
    const budgetMax = parseFloat(buyer.budget_max || 0);
    const propertyTypes = buyer.property_types || [];
    const locations = buyer.preferred_locations || [];
    const minBedrooms = buyer.min_bedrooms || 0;
    const maxBedrooms = buyer.max_bedrooms || 10;
    const minBathrooms = buyer.min_bathrooms || 0;
    const minArea = buyer.min_area || 0;

    const propertiesResult = await query('SELECT * FROM properties WHERE status = $1', ['Available']);
    const properties = propertiesResult.rows;

    const matchingProperties = properties.filter(property => {
      const propertyPrice = parseFloat(property.price);

      const meetsPrice = propertyPrice >= budgetMin && propertyPrice <= budgetMax;
      const meetsType = propertyTypes.length === 0 || propertyTypes.includes(property.type);
      const meetsBedrooms = property.bedrooms >= minBedrooms && property.bedrooms <= maxBedrooms;
      const meetsBathrooms = property.bathrooms >= minBathrooms;
      const meetsArea = property.area >= minArea;
      const meetsLocation = locations.length === 0 ||
        locations.some((loc: string) => property.city.toLowerCase().includes(loc.toLowerCase()));

      return meetsPrice && meetsType && meetsBedrooms && meetsBathrooms && meetsArea && meetsLocation;
    }).map(property => {
      let matchScore = 0;
      if (propertyPrice >= budgetMin && propertyPrice <= budgetMax) matchScore += 30;
      if (propertyTypes.includes(property.type)) matchScore += 25;
      if (property.bedrooms >= minBedrooms && property.bedrooms <= maxBedrooms) matchScore += 20;
      if (property.bathrooms >= minBathrooms) matchScore += 15;
      if (property.area >= minArea) matchScore += 5;
      if (locations.some((loc: string) => property.city.toLowerCase().includes(loc.toLowerCase()))) matchScore += 5;
      return { ...property, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchingProperties);
  } catch (error) {
    console.error('Error finding matching properties:', error);
    res.status(500).json({ error: 'Failed to find matching properties' });
  }
});

export default router;
