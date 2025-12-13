import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { colors } from '../lib/colors';
import { patients } from '../data/mockData';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { PatientCard } from '../components/dashboard/PatientCard';
import { PatientDetailModal } from '../components/dashboard/PatientDetailModal';
import type { Patient, FlagLevel } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | FlagLevel>('all');

  const filteredPatients = patients.filter(p => {
    if (filterStatus === 'all') return true;
    return p.flagLevel === filterStatus;
  });

  const redCount = patients.filter(p => p.flagLevel === 'red').length;
  const yellowCount = patients.filter(p => p.flagLevel === 'yellow').length;
  const alertCount = redCount + yellowCount;

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ backgroundColor: colors.bgSecondary, fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* Main */}
      <main className="w-full min-h-screen flex flex-col">
        {/* Header */}
        <Header alertCount={alertCount} />

        {/* Content */}
        <div className="p-8 flex-1">
          {/* Stats */}
          <div className="flex gap-4 mb-6">
            <StatCard
              label="担当患者"
              value={patients.length}
              Icon={Users}
              color={colors.primary}
              trend="up"
              trendValue="+2 今月"
            />
            <StatCard
              label="要注意(高)"
              value={redCount}
              Icon={AlertTriangle}
              color={colors.alertRed}
            />
            <StatCard
              label="要注意(中)"
              value={yellowCount}
              Icon={AlertTriangle}
              color={colors.alertYellow}
            />
            <StatCard
              label="本日更新"
              value={8}
              Icon={CheckCircle}
              color={colors.success}
            />
          </div>

          {/* Patient List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                患者一覧
              </h2>
              <div className="flex gap-2">
                {(['all', 'red', 'yellow'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                    style={{
                      border: `1px solid ${filterStatus === status ? colors.primary : colors.border}`,
                      backgroundColor: filterStatus === status ? colors.primaryLight : 'white',
                      color: filterStatus === status ? colors.primary : colors.textSecondary,
                    }}
                  >
                    {status === 'all' && 'すべて'}
                    {status === 'red' && (
                      <>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.alertRed }}
                        />
                        高
                      </>
                    )}
                    {status === 'yellow' && (
                      <>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.alertYellow }}
                        />
                        中
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-3xl mx-auto">
              {filteredPatients.map(patient => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => navigate(`/${patient.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
