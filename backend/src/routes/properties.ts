import { Router, Request, Response } from 'express';
import { getAll, getById, createDoc, updateDocById, deleteDocById } from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

function num(value: unknown, fallback: number | null = null): number | null {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

// Get all properties
router.get('/', async (_req: Request, res: Response) => {
  try {
    const properties = await getAll('properties');
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const property = await getById('properties', id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
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

    const property = await createDoc('properties', {
      title,
      description,
      address,
      city,
      country: country || 'India',
      zip_code,
      price: num(price, 0),
      type,
      status: status || 'Available',
      bedrooms: num(bedrooms, 0),
      bathrooms: num(bathrooms, 0),
      area: num(area, 0),
      land_area: num(land_area),
      year_built: num(year_built),
      building_age: num(building_age),
      floors: num(floors, 1),
      car_parking: num(car_parking, 0),
      parking_size: num(parking_size),
      facing,
      water_source,
      drain_type,
      boundary_wall,
      rental_income: num(rental_income),
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [],
      youtube_url,
      instagram_url,
      added_by: (req as AuthRequest).userId ?? null,
    });
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const property = await updateDocById('properties', id, req.body);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteDocById('properties', id);
    if (!deleted) {
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
    const id = String(req.params.id);
    const property = await getById('properties', id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const propertyPrice = parseFloat(property.price) || 0;
    const propertyType = property.type;
    const propertyCity = property.city || '';
    const propertyBedrooms = property.bedrooms || 0;
    const propertyBathrooms = property.bathrooms || 0;

    // Find matching buyers
    const buyers = await getAll('buyers');

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
