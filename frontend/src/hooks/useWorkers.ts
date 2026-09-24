import { useState, useEffect, useCallback } from 'react';
import { workers as api } from '../lib/api';

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useWorkers() {
  const [data, setData] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      setError('Failed to load field workers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const create = async (data: { name: string; email: string; phone?: string; password: string }) => {
    const result = await api.create(data);
    setData((prev) => [result, ...prev]);
    return result;
  };

  const update = async (id: string | number, data: Partial<Worker> & { password?: string }) => {
    const result = await api.update(id, data);
    setData((prev) => prev.map((w) => (w.id === id ? result : w)));
    return result;
  };

  const remove = async (id: string | number) => {
    await api.delete(id);
    setData((prev) => prev.filter((w) => w.id !== id));
  };

  return { data, loading, error, refetch: fetchWorkers, create, update, remove };
}

export function useWorker(id: string | number) {
  const [data, setData] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorker = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getOne(id);
      setData(result);
    } catch (err) {
      setError('Failed to load field worker');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchWorker();
  }, [id, fetchWorker]);

  return { data, loading, error, refetch: fetchWorker };
}
