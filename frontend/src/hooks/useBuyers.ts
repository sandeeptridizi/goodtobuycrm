import { useState, useEffect, useCallback } from 'react';
import { buyers as api } from '../lib/api';
import { Property } from './useProperties';

export interface Buyer {
  id: number;
  name: string;
  email: string;
  phone: string;
  budget_min: number;
  budget_max: number;
  property_types: string[];
  min_bedrooms: number;
  max_bedrooms: number;
  min_bathrooms: number;
  max_bathrooms: number;
  min_area: number;
  preferred_locations: string[];
  avatar: string;
  status: string;
  lead_source: string;
  assigned_agent: number;
  notes: string;
  timeline: string;
  financing: string;
  amenities_required: string[];
  created_at: string;
  updated_at: string;
  matchScore?: number;
}

export function useBuyers() {
  const [data, setData] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      setError('Failed to load buyers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  const create = async (data: Omit<Buyer, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await api.create(data);
    setData((prev) => [result, ...prev]);
    return result;
  };

  const update = async (id: number, data: Partial<Buyer>) => {
    const result = await api.update(id, data);
    setData((prev) => prev.map((b) => (b.id === id ? result : b)));
    return result;
  };

  const remove = async (id: number) => {
    await api.delete(id);
    setData((prev) => prev.filter((b) => b.id !== id));
  };

  return { data, loading, error, refetch: fetchBuyers, create, update, remove };
}

export function useBuyer(id: number) {
  const [data, setData] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getOne(id);
      setData(result);
    } catch (err) {
      setError('Failed to load buyer');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchBuyer();
  }, [id, fetchBuyer]);

  return { data, loading, error, refetch: fetchBuyer };
}

export function useMatchingProperties(buyerId: number) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatching() {
      try {
        setLoading(true);
        setError(null);
        const result = await api.getMatchingProperties(buyerId);
        setData(result);
      } catch (err) {
        setError('Failed to load matching properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (buyerId) fetchMatching();
  }, [buyerId]);

  return { data, loading, error };
}
