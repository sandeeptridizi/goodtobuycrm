import { useState, useEffect, useCallback } from 'react';
import { dashboard as api } from '../lib/api';
import { useEnquiries } from './useEnquiries';
import { useBuyers } from './useBuyers';

export interface DashboardStats {
  totalProperties: number;
  activeBuyers: number;
  activeSellers: number;
  totalEnquiries: number;
  newEnquiries: number;
  recentEnquiries: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    property: string;
    message: string;
    status: string;
    source: string;
    created_at: string;
    updated_at: string;
  }>;
  recentBuyers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    budget_min: number;
    budget_max: number;
    status: string;
    created_at: string;
  }>;
  propertyStatus: Array<{ status: string; count: string }>;
  buyerStatus: Array<{ status: string; count: string }>;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getStats();
      setStats(result);
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return formatCurrency(numPrice);
}
