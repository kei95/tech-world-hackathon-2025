import { Heart, X, AlertTriangle, Phone, MapPin, FileText, ExternalLink, Sun, Coffee, Pill, Activity, UtensilsCrossed, Moon } from 'lucide-react';
import { colors } from '../../lib/colors';
import type { Patient, RoutineItem } from '../../types';

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
}

const routineItems: RoutineItem[] = [
  { time: '07:00', activity: '起床', Icon: Sun },
  { time: '07:30', activity: '朝食', Icon: Coffee },
  { time: '08:00', activity: '服薬', Icon: Pill },
  { time: '10:00', activity: '散歩', Icon: Activity },
  { time: '12:00', activity: '昼食', Icon: UtensilsCrossed },
  { time: '18:00', activity: '夕食', Icon: UtensilsCrossed },
  { time: '21:00', activity: '就寝', Icon: Moon },
];

export const PatientDetailModal = ({ patient, onClose }: PatientDetailModalProps) => (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 p-6"
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-6 border-b flex items-start justify-between" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <Heart size={28} color={colors.primary} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1" style={{ color: colors.textPrimary }}>
              {patient.name}
            </h2>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              {patient.age}歳 · {patient.gender} · {patient.address}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-gray-50"
          style={{ borderColor: colors.border }}
        >
          <X size={18} color={colors.textSecondary} />
        </button>
      </div>

      {/* Alert */}
      {patient.flagLevel !== 'none' && (
        <div
          className="px-6 py-5"
          style={{ backgroundColor: patient.flagLevel === 'red' ? colors.alertRedLight : colors.alertYellowLight }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <AlertTriangle
              size={20}
              color={patient.flagLevel === 'red' ? colors.alertRed : colors.alertYellow}
              strokeWidth={2}
            />
            <span className="text-base font-semibold" style={{ color: colors.textPrimary }}>
              {patient.flagReason}
            </span>
          </div>
          <div className="pl-7 space-y-1.5">
            {patient.flagDetails.map((detail, i) => (
              <p key={i} className="text-sm" style={{ color: colors.textSecondary }}>• {detail}</p>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>連絡先</h3>
          <div className="flex gap-4">
            <div
              className="flex-1 p-3.5 rounded-xl flex items-center gap-2.5"
              style={{ backgroundColor: colors.bgSecondary }}
            >
              <Phone size={18} color={colors.primary} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>{patient.phone}</span>
            </div>
            <div
              className="flex-1 p-3.5 rounded-xl flex items-center gap-2.5"
              style={{ backgroundColor: colors.bgSecondary }}
            >
              <MapPin size={18} color={colors.primary} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>{patient.address}</span>
            </div>
          </div>
        </div>

        {/* Routine */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
            典型的なルーティン
          </h3>
          <div
            className="rounded-2xl p-5 grid grid-cols-4 gap-3"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            {routineItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl"
              >
                <item.Icon size={20} color={colors.primary} strokeWidth={1.5} />
                <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                  {item.activity}
                </span>
                <span className="text-xs" style={{ color: colors.textMuted }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            <FileText size={18} color={colors.textSecondary} />
            ログを見る
          </button>
          <button
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <ExternalLink size={18} color="white" />
            共有リンクを作成
          </button>
        </div>
      </div>
    </div>
  </div>
);
