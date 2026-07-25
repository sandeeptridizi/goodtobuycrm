import { useState, useEffect, useCallback } from 'react';
import { properties as api } from '../lib/api';

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  zip_code: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  land_area: number;
  year_built: number;
  building_age: number;
  floors: number;
  car_parking: number;
  parking_size: number;
  facing: string;
  water_source: string;
  drain_type: string;
  boundary_wall: string;
  rental_income: number;
  amenities: string[];
  images: string[];
  youtube_url: string;
  instagram_url: string;
  added_by: number;
  created_at: string;
  updated_at: string;
  matchScore?: number;
}

export function useProperties() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const create = async (data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await api.create(data);
    setData((prev) => [result, ...prev]);
    return result;
  };

  const update = async (id: string | number, data: Partial<Property>) => {
    const result = await api.update(id, data);
    setData((prev) => prev.map((p) => (p.id === id ? result : p)));
    return result;
  };

  const remove = async (id: string | number) => {
    await api.delete(id);
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  return { data, loading, error, refetch: fetchProperties, create, update, remove };
}

export function useProperty(id: string | number) {
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getOne(id);
      setData(result);
    } catch (err) {
      setError('Failed to load property');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id, fetchProperty]);

  return { data, loading, error, refetch: fetchProperty };
}

export function useMatchingBuyers(propertyId: string | number) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatching() {
      try {
        setLoading(true);
        setError(null);
        const result = await api.getMatchingBuyers(propertyId);
        setData(result);
      } catch (err) {
        setError('Failed to load matching buyers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (propertyId) fetchMatching();
  }, [propertyId]);

  return { data, loading, error };
}

export function useMatchingProperties(buyerId: string | number) {
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
