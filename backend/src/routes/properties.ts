import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all properties
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM properties WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title, description, address, city, country, zip_code,
      price, type, status, bedrooms, bathrooms, area,
      land_area, year_built, building_age, floors, car_parking,
      parking_size, facing, water_source, drain_type, boundary_wall,
      rental_income, amenities, images, youtube_url, instagram_url
    } = req.body;

    const result = await query(
      `INSERT INTO properties (
        title, description, address, city, country, zip_code,
        price, type, status, bedrooms, bathrooms, area,
        land_area, year_built, building_age, floors, car_parking,
        parking_size, facing, water_source, drain_type, boundary_wall,
        rental_income, amenities, images, youtube_url, instagram_url,
        added_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
      RETURNING *`,
      [
        title, description, address, city, country || 'India', zip_code,
        price, type, status || 'Available', bedrooms || 0, bathrooms || 0, area || 0,
        land_area, year_built, building_age, floors || 1, car_parking || 0,
        parking_size, facing, water_source, drain_type, boundary_wall,
        rental_income, amenities || [], images || [], youtube_url, instagram_url,
        (req as any).userId
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const fieldKeys = Object.keys(fields);
    const fieldValues = Object.values(fields);

    const setClause = fieldKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const result = await query(
      `UPDATE properties SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fieldKeys.length + 1} RETURNING *`,
      [...fieldValues, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM properties WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted', id });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Get matching buyers for a property
router.get('/:id/matching-buyers', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const propertyResult = await query('SELECT * FROM properties WHERE id = $1', [id]);

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propertyResult.rows[0];
    const propertyPrice = parseFloat(property.price);
    const propertyType = property.type;
    const propertyCity = property.city;
    const propertyBedrooms = property.bedrooms;
    const propertyBathrooms = property.bathrooms;

    // Find matching buyers
    const buyersResult = await query('SELECT * FROM buyers');
    const buyers = buyersResult.rows;

    const matchingBuyers = buyers.filter(buyer => {
      const budgetMin = parseFloat(buyer.budget_min || 0);
      const budgetMax = parseFloat(buyer.budget_max || 0);
      const propertyTypes = buyer.property_types || [];
      const locations = buyer.preferred_locations || [];

      const meetsPrice = propertyPrice >= budgetMin && propertyPrice <= budgetMax;
      const meetsType = propertyTypes.length === 0 || propertyTypes.includes(propertyType);
      const meetsBedrooms = propertyBedrooms >= (buyer.min_bedrooms || 0);
      const meetsBathrooms = propertyBathrooms >= (buyer.min_bathrooms || 0);
      const meetsLocation = locations.length === 0 ||
        locations.some((loc: string) => propertyCity.toLowerCase().includes(loc.toLowerCase()));

      return meetsPrice && meetsType && meetsBedrooms && meetsBathrooms && meetsLocation;
    }).map(buyer => {
      let matchScore = 0;
      if (propertyPrice >= parseFloat(buyer.budget_min || 0) && propertyPrice <= parseFloat(buyer.budget_max || 0)) matchScore += 30;
      if ((buyer.property_types || []).includes(propertyType)) matchScore += 25;
      if (propertyBedrooms >= (buyer.min_bedrooms || 0)) matchScore += 20;
      if (propertyBathrooms >= (buyer.min_bathrooms || 0)) matchScore += 15;
      const locations = buyer.preferred_locations || [];
      if (locations.some((loc: string) => propertyCity.toLowerCase().includes(loc.toLowerCase()))) matchScore += 10;
      return { ...buyer, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchingBuyers);
  } catch (error) {
    console.error('Error finding matching buyers:', error);
    res.status(500).json({ error: 'Failed to find matching buyers' });
  }
});

export default router;
