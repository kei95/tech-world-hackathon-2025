import { Heart, Clock, ChevronRight, UserCog, FileText } from 'lucide-react';
import { colors } from '../../lib/colors';
import type { Patient } from '../../types';
import { AlertFlag } from '../shared/AlertFlag';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export const PatientCard = ({ patient, onClick }: PatientCardProps) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl p-5 border hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    style={{ borderColor: colors.border }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3.5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <Heart size={22} color={colors.primary} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
            {patient.name}
          </h3>
          <div className="flex items-center gap-2 text-sm" style={{ color: colors.textMuted }}>
            <span>{patient.age}歳</span>
            <span style={{ color: colors.border }}>·</span>
            <span>{patient.gender}</span>
            <span style={{ color: colors.border }}>·</span>
            <Clock size={12} />
            <span>{patient.lastUpdate}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {patient.flagLevel !== 'none' && (
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: patient.flagLevel === 'red' ? colors.alertRed : colors.alertYellow,
              boxShadow: `0 0 8px ${patient.flagLevel === 'red' ? colors.alertRed : colors.alertYellow}60`
            }}
          />
        )}
        <ChevronRight size={18} color={colors.textMuted} />
      </div>
    </div>

    {patient.flagReason && <AlertFlag level={patient.flagLevel} reason={patient.flagReason} />}

    <div
      className="flex items-center justify-between mt-4 pt-4"
      style={{ borderTop: `1px solid ${colors.borderLight}` }}
    >
      <div className="flex items-center gap-1.5 text-xs" style={{ color: colors.textMuted }}>
        <UserCog size={14} />
        <span>{patient.caregiver}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs" style={{ color: colors.textMuted }}>
        <FileText size={14} />
        <span>直近{patient.recentLogs}件</span>
      </div>
    </div>
  </div>
);
