import { useState, useEffect, useCallback } from 'react';
import { enquiries as api } from '../lib/api';

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  message: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export function useEnquiries() {
  const [data, setData] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      setError('Failed to load enquiries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const create = async (data: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await api.create(data);
    setData((prev) => [result, ...prev]);
    return result;
  };

  const update = async (id: number, data: Partial<Enquiry>) => {
    const result = await api.update(id, data);
    setData((prev) => prev.map((e) => (e.id === id ? result : e)));
    return result;
  };

  const remove = async (id: number) => {
    await api.delete(id);
    setData((prev) => prev.filter((e) => e.id !== id));
  };

  return { data, loading, error, refetch: fetchEnquiries, create, update, remove };
}

export function useEnquiry(id: number) {
  const [data, setData] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiry = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getOne(id);
      setData(result);
    } catch (err) {
      setError('Failed to load enquiry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchEnquiry();
  }, [id, fetchEnquiry]);

  return { data, loading, error, refetch: fetchEnquiry };
}
