import { ArrowRight, ChevronRight, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { colors } from '../../lib/colors';
import type { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => (
  <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: colors.border }}>
    <div
      className="px-5 py-4 border-b flex items-center justify-between"
      style={{ borderColor: colors.border }}
    >
      <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
        最近のアクティビティ
      </h3>
      <button className="text-sm flex items-center gap-1" style={{ color: colors.primary }}>
        すべて見る
        <ArrowRight size={14} />
      </button>
    </div>
    <div>
      {activities.map((activity, i) => (
        <div
          key={activity.id}
          className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
          style={{ borderBottom: i < activities.length - 1 ? `1px solid ${colors.borderLight}` : 'none' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: activity.type === 'alert'
                ? colors.alertYellowLight
                : activity.type === 'log'
                ? colors.primaryLight
                : colors.secondaryLight
            }}
          >
            {activity.type === 'alert' && <AlertTriangle size={16} color={colors.alertYellow} />}
            {activity.type === 'log' && <FileText size={16} color={colors.primary} />}
            {activity.type === 'routine' && <Calendar size={16} color={colors.secondary} />}
          </div>
          <div className="flex-1">
            <p className="text-sm" style={{ color: colors.textPrimary }}>
              <span className="font-medium">{activity.patient}</span> - {activity.action}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>{activity.time}</p>
          </div>
          <ChevronRight size={16} color={colors.textMuted} />
        </div>
      ))}
    </div>
  </div>
);
