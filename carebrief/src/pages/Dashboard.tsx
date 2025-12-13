import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { colors } from '../lib/colors';
import { patients } from '../data/mockData';
import { Header } from '../components/layout/Header';
import { PatientCard } from '../components/dashboard/PatientCard';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ backgroundColor: colors.bgSecondary, fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      <main className="w-full min-h-screen flex flex-col">
        <Header alertCount={0} />
        <div className="p-8 flex-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                患者一覧
              </h2>
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white w-80"
                style={{ border: `1px solid ${colors.border}` }}
              >
                <Search size={18} color={colors.textMuted} />
                <input
                  type="text"
                  placeholder="患者を検索..."
                  className="bg-transparent outline-none text-sm flex-1"
                  style={{ color: colors.textPrimary }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {patients.map(patient => (
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
    </div>
  );
}
