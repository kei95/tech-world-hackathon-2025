import { colors } from "../../lib/colors";

export const Header = () => {
  return (
    <header
      className="px-8 py-3 bg-white border-b flex items-center justify-between"
      style={{ borderColor: colors.border }}
    >
      <div className="flex items-center gap-3">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: colors.textPrimary }}
        >
          CareBrief
        </h1>
        <div className="flex items-center gap-1">- ダッシュボード</div>
      </div>
      <p className="text-sm" style={{ color: colors.textMuted }}>
        2024年12月13日(金)
      </p>
    </header>
  );
};
