import { TrendingUp, TrendingDown } from 'lucide-react';
import { colors } from '../../lib/colors';

interface StatCardProps {
  label: string;
  value: number;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export const StatCard = ({ label, value, Icon, color, trend, trendValue }: StatCardProps) => (
  <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={22} color={color} strokeWidth={1.5} />
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp size={14} color={colors.success} />}
          {trend === 'down' && <TrendingDown size={14} color={colors.alertRed} />}
          <span className="text-xs" style={{ color: trend === 'up' ? colors.success : colors.alertRed }}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
    <p className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>{value}</p>
    <p className="text-sm" style={{ color: colors.textMuted }}>{label}</p>
  </div>
);
