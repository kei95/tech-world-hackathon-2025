import { Shield, Home, Users, AlertTriangle, BarChart3, Settings, Menu } from 'lucide-react';
import { colors } from '../../lib/colors';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'ダッシュボード', Icon: Home },
  { id: 'patients', label: '患者一覧', Icon: Users },
  { id: 'alerts', label: 'アラート', Icon: AlertTriangle, badge: 3 },
  { id: 'reports', label: 'レポート', Icon: BarChart3 },
  { id: 'settings', label: '設定', Icon: Settings },
];

export const Sidebar = ({ collapsed, onToggle, activeItem, onItemClick }: SidebarProps) => {
  return (
    <aside
      className="flex flex-col border-r bg-white shrink-0 transition-all duration-200"
      style={{ width: collapsed ? '72px' : '240px', borderColor: colors.border }}
    >
      {/* Logo */}
      <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: colors.border }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.primary }}
        >
          <Shield size={20} color="white" strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            CareBrief
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3">
        {menuItems.map(item => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className="w-full mb-1 rounded-xl flex items-center transition-colors"
              style={{
                padding: collapsed ? '12px' : '12px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '12px',
                backgroundColor: isActive ? colors.primaryLight : 'transparent',
              }}
            >
              <item.Icon
                size={20}
                color={isActive ? colors.primary : colors.textSecondary}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {!collapsed && (
                <>
                  <span
                    className="text-sm"
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? colors.primary : colors.textSecondary
                    }}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: colors.alertRedLight, color: colors.alertRed }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="p-3 border-t" style={{ borderColor: colors.border }}>
        <button
          onClick={onToggle}
          className="w-full p-2.5 rounded-xl border flex items-center justify-center gap-2 hover:bg-gray-50"
          style={{ borderColor: colors.border }}
        >
          <Menu size={18} color={colors.textSecondary} />
          {!collapsed && (
            <span className="text-sm" style={{ color: colors.textSecondary }}>閉じる</span>
          )}
        </button>
      </div>
    </aside>
  );
};
