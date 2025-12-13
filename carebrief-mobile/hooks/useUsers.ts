import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api';
import type { Patient } from '@/lib/types';

export function useUsers() {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Patient[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const refresh = async () => {
    await refetch();
  };

  return {
    users,
    loading,
    error: error?.message || null,
    refresh,
    isRefreshing: isRefetching,
  };
}
