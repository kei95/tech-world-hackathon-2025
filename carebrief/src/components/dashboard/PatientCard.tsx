import { Heart, Clock, ChevronRight, UserCog } from "lucide-react";
import { colors } from "../../lib/colors";
import type { Patient } from "../../types";

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export const PatientCard = ({ patient, onClick }: PatientCardProps) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl p-4 border hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
    style={{ borderColor: colors.border }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <Heart size={18} color={colors.primary} strokeWidth={1.5} />
        </div>
        <div>
          <h3
            className="text-sm font-semibold mb-0.5"
            style={{ color: colors.textPrimary }}
          >
            {patient.name}
          </h3>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: colors.textMuted }}
          >
            <span>{patient.age}歳</span>
            <span style={{ color: colors.border }}>·</span>
            <span>{patient.gender}</span>
          </div>
        </div>
      </div>
      <ChevronRight size={16} color={colors.textMuted} className="shrink-0" />
    </div>

    <div className="space-y-2">
      <div
        className="flex items-center gap-1.5 text-xs"
        style={{ color: colors.textMuted }}
      >
        <UserCog size={13} />
        <span>{patient.caregiver}</span>
      </div>

      <div
        className="flex items-center gap-1.5 text-xs"
        style={{ color: colors.textMuted }}
      >
        <Clock size={13} />
        <span>{patient.lastUpdate}</span>
      </div>
    </div>
  </div>
);
