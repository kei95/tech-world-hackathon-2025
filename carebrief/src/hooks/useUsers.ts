import { useQuery } from '@tanstack/react-query';
import type { Patient } from '../types';
import { fetchUsers } from '../lib/api';

export function useUsers() {
  const { data: users = [], isLoading: loading, error } = useQuery<Patient[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return {
    users,
    loading,
    error: error?.message || null
  };
}
