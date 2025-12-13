import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Patient, CareLog, CarePlan } from '../types';
import { fetchUserDetail, fetchLogs } from '../lib/api';

export function useUserDetail(userId: string) {
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['userDetail', userId],
    queryFn: async () => {
      const [detailData, logsData] = await Promise.all([
        fetchUserDetail(userId),
        fetchLogs(userId),
      ]);

      const patient: Patient = {
        ...detailData.patient,
        phone: logsData.user.phone,
        address: logsData.user.address,
        caregiver: logsData.user.caregiver,
        startDate: logsData.user.startDate,
      };

      return { patient, logs: logsData.logs };
    },
    enabled: !!userId,
  });

  // SSE経由でログが更新されるため、初回ロード後はcareLogsステートを使用
  const effectiveLogs = careLogs.length > 0 ? careLogs : (data?.logs || []);

  return {
    patient: data?.patient || null,
    careLogs: effectiveLogs,
    setCareLogs,
    carePlan,
    setCarePlan,
    loading,
    error: error?.message || null
  };
}
