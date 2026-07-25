import { Router, Request, Response } from 'express';
import { getAll, DocData } from '../db/index.js';

const router = Router();

function statusBreakdown(rows: DocData[]): { status: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const status = row.status || 'Unknown';
    counts.set(status, (counts.get(status) || 0) + 1);
  }
  return Array.from(counts.entries()).map(([status, count]) => ({ status, count }));
}

// Get dashboard stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    // All lists come back sorted by created_at desc
    const [properties, buyers, sellers, enquiries] = await Promise.all([
      getAll('properties'),
      getAll('buyers'),
      getAll('sellers'),
      getAll('enquiries'),
    ]);

    res.json({
      totalProperties: properties.length,
      activeBuyers: buyers.filter((b) => b.status === 'Active').length,
      activeSellers: sellers.filter((s) => s.status === 'Active').length,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((e) => e.status === 'New').length,
      recentEnquiries: enquiries.slice(0, 5),
      recentBuyers: buyers.slice(0, 5),
      propertyStatus: statusBreakdown(properties),
      buyerStatus: statusBreakdown(buyers),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
