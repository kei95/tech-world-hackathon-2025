import { AlertTriangle } from 'lucide-react';
import { colors } from '../../lib/colors';
import type { FlagLevel } from '../../types';

interface AlertFlagProps {
  level: FlagLevel;
  reason: string | null;
}

export const AlertFlag = ({ level, reason }: AlertFlagProps) => {
  if (level === 'none' || !reason) return null;
  const isRed = level === 'red';

  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
      style={{
        backgroundColor: isRed ? colors.alertRedLight : colors.alertYellowLight,
        border: `1px solid ${isRed ? colors.alertRedMuted : colors.alertYellowMuted}40`
      }}
    >
      <AlertTriangle size={16} color={isRed ? colors.alertRed : colors.alertYellow} strokeWidth={2} />
      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{reason}</span>
    </div>
  );
};
