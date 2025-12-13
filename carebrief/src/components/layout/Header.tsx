import { Search, Bell } from 'lucide-react';
import { colors } from '../../lib/colors';

interface HeaderProps {
  alertCount: number;
}

export const Header = ({ alertCount }: HeaderProps) => {
  return (
    <header
      className="px-8 py-5 bg-white border-b flex items-center justify-between"
      style={{ borderColor: colors.border }}
    >
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
          ダッシュボード
        </h1>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          2024年12月13日(金)
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl w-60"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <Search size={18} color={colors.textMuted} />
          <input
            type="text"
            placeholder="患者を検索..."
            className="bg-transparent outline-none text-sm flex-1"
            style={{ color: colors.textPrimary }}
          />
        </div>
        <button
          className="relative w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-gray-50"
          style={{ borderColor: colors.border }}
        >
          <Bell size={18} color={colors.textSecondary} />
          {alertCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center text-white"
              style={{ backgroundColor: colors.alertRed }}
            >
              {alertCount}
            </span>
          )}
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold cursor-pointer"
          style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
        >
          田
        </div>
      </div>
    </header>
  );
};
