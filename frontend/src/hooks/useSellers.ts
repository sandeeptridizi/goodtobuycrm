import { useState, useEffect, useCallback } from 'react';
import { sellers as api } from '../lib/api';
import { Property } from './useProperties';

export interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  status: string;
  preferred_agent: number;
  notes: string;
  selling_reason: string;
  timeline: string;
  created_at: string;
  updated_at: string;
  properties?: Property[];
}

export function useSellers() {
  const [data, setData] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      setError('Failed to load sellers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const create = async (data: Omit<Seller, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await api.create(data);
    setData((prev) => [result, ...prev]);
    return result;
  };

  const update = async (id: number, data: Partial<Seller>) => {
    const result = await api.update(id, data);
    setData((prev) => prev.map((s) => (s.id === id ? result : s)));
    return result;
  };

  const remove = async (id: number) => {
    await api.delete(id);
    setData((prev) => prev.filter((s) => s.id !== id));
  };

  return { data, loading, error, refetch: fetchSellers, create, update, remove };
}

export function useSeller(id: number) {
  const [data, setData] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeller = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getOne(id);
      setData(result);
    } catch (err) {
      setError('Failed to load seller');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchSeller();
  }, [id, fetchSeller]);

  return { data, loading, error, refetch: fetchSeller };
}
