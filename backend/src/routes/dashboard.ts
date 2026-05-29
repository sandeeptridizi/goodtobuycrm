import { Router, Request, Response } from 'express';
import { query } from '../db/index.js';

const router = Router();

// Get dashboard stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    // Get counts from all tables
    const propertiesCount = await query('SELECT COUNT(*) as count FROM properties');
    const activeBuyersCount = await query("SELECT COUNT(*) as count FROM buyers WHERE status = 'Active'");
    const activeSellersCount = await query("SELECT COUNT(*) as count FROM sellers WHERE status = 'Active'");
    const enquiriesCount = await query('SELECT COUNT(*) as count FROM enquiries');
    const newEnquiriesCount = await query("SELECT COUNT(*) as count FROM enquiries WHERE status = 'New'");

    // Get recent enquiries
    const recentEnquiries = await query(
      "SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5"
    );

    // Get recent buyers
    const recentBuyers = await query(
      "SELECT * FROM buyers ORDER BY created_at DESC LIMIT 5"
    );

    // Get status breakdown
    const propertyStatus = await query(
      'SELECT status, COUNT(*) as count FROM properties GROUP BY status'
    );
    const buyerStatus = await query(
      'SELECT status, COUNT(*) as count FROM buyers GROUP BY status'
    );

    res.json({
      totalProperties: parseInt(propertiesCount.rows[0].count),
      activeBuyers: parseInt(activeBuyersCount.rows[0].count),
      activeSellers: parseInt(activeSellersCount.rows[0].count),
      totalEnquiries: parseInt(enquiriesCount.rows[0].count),
      newEnquiries: parseInt(newEnquiriesCount.rows[0].count),
      recentEnquiries: recentEnquiries.rows,
      recentBuyers: recentBuyers.rows,
      propertyStatus: propertyStatus.rows,
      buyerStatus: buyerStatus.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
