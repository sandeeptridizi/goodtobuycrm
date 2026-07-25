import { useState, useEffect, useCallback } from 'react';
import { employees as api } from '../lib/api';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  join_date: string;
  avatar: string;
  address: string;
  emergency_contact: string;
  skills: string[];
  qualifications: string;
  languages: string[];
  created_at: string;
  updated_at: string;
}

export function useEmployees() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const create = async (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await api.create(data);
    setData((prev) => [result, ...prev]);
    return result;
  };

  const update = async (id: string | number, data: Partial<Employee>) => {
    const result = await api.update(id, data);
    setData((prev) => prev.map((e) => (e.id === id ? result : e)));
    return result;
  };

  const remove = async (id: string | number) => {
    await api.delete(id);
    setData((prev) => prev.filter((e) => e.id !== id));
  };

  return { data, loading, error, refetch: fetchEmployees, create, update, remove };
}

export function useEmployee(id: string | number) {
  const [data, setData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getOne(id);
      setData(result);
    } catch (err) {
      setError('Failed to load employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchEmployee();
  }, [id, fetchEmployee]);

  return { data, loading, error, refetch: fetchEmployee };
}
