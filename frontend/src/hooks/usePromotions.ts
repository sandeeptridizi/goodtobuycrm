import { useState, useEffect, useCallback } from 'react';
import { promotions as api } from '../lib/api';

export interface Promotion {
  id: string;
  worker_id: string;
  worker_name: string;
  property_name: string;
  flat_no: string;
  flat_type: string;
  square_feet: number;
  furnishing_type: string;
  address: string;
  location_area: string;
  phone: string;
  alternate_phone: string;
  gps_lat: number;
  gps_lng: number;
  photo_url: string;
  status: string;
  commission_amount: number;
  is_paid: boolean;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export function usePromotions(status?: string) {
  const [data, setData] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAll(status);
      setData(result);
    } catch (err) {
      setError('Failed to load promotions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const updateStatus = async (id: string | number, nextStatus: string) => {
    const result = await api.updateStatus(id, nextStatus);
    setData((prev) => prev.map((p) => (p.id === id ? result : p)));
    return result;
  };

  const update = async (id: string | number, data: Partial<Promotion>) => {
    const result = await api.update(id, data);
    setData((prev) => prev.map((p) => (p.id === id ? result : p)));
    return result;
  };

  const remove = async (id: string | number) => {
    await api.delete(id);
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  return { data, loading, error, refetch: fetchPromotions, updateStatus, update, remove };
}

export function usePromotion(id: string | number) {
  const [data, setData] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getOne(id);
      setData(result);
    } catch (err) {
      setError('Failed to load promotion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchPromotion();
  }, [id, fetchPromotion]);

  return { data, loading, error, refetch: fetchPromotion };
}
