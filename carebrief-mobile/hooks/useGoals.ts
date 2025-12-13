import { useQuery } from '@tanstack/react-query';
import { fetchCarePlan } from '@/lib/api';
import type { CarePlan } from '@/lib/types';

interface UseGoalsOptions {
  userId: string;
  enabled?: boolean;
}

export function useGoals({ userId, enabled = true }: UseGoalsOptions) {
  const {
    data: carePlan,
    isLoading: loading,
    error,
    refetch,
    isRefetching,
  } = useQuery<CarePlan | null, Error>({
    queryKey: ['carePlan', userId],
    queryFn: () => fetchCarePlan(userId),
    enabled: !!userId && enabled,
  });

  const refresh = async () => {
    await refetch();
  };

  return {
    carePlan,
    goals: carePlan?.goals || [],
    summary: carePlan?.summary || '',
    notes: carePlan?.notes || '',
    loading,
    error: error?.message || null,
    refresh,
    isRefreshing: isRefetching,
  };
}
