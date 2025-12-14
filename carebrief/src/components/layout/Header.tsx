import { colors } from "../../lib/colors";

export const Header = () => {
  const today = new Date();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const formatted = `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日(${weekdays[today.getDay()]})`;
  return (
    <header
      className="px-8 py-3 bg-white border-b flex items-center justify-between"
      style={{ borderColor: colors.border }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#C1437B" }}>
          CareBrief
        </h1>
        <div className="flex items-center gap-1">- ダッシュボード</div>
      </div>
      <p className="text-sm" style={{ color: colors.textMuted }}>
        {formatted}
      </p>
    </header>
  );
};
