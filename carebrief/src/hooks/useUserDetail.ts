import { useState, useEffect } from 'react';
import type { Patient, CareLog, CarePlan } from '../types';
import { fetchUserDetail, fetchLogs } from '../lib/api';

export function useUserDetail(userId: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // /users-detail と /logs を並列で取得
    Promise.all([
      fetchUserDetail(userId),
      fetchLogs(userId),
    ])
      .then(([detailData, logsData]) => {
        // /users-detail からヘッダー情報、/logs からサイドバー情報を取得
        setPatient({
          ...detailData.patient,
          phone: logsData.user.phone,
          address: logsData.user.address,
          caregiver: logsData.user.caregiver,
          startDate: logsData.user.startDate,
        });
        setCareLogs(logsData.logs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return { patient, careLogs, setCareLogs, carePlan, setCarePlan, loading, error };
}
