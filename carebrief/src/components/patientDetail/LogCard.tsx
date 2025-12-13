import React from 'react';
import { Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import { colors } from '../../lib/colors';
import type { CareLog } from '../../types';

interface LogCardProps {
  log: CareLog;
  expanded: boolean;
  onToggle: () => void;
}

export const LogCard: React.FC<LogCardProps> = ({ log, expanded, onToggle }) => (
  <div className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow" style={{ border: `1px solid ${colors.border}` }}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <Calendar size={14} color={colors.textMuted} />
        <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{log.date}</span>
        <span className="text-sm" style={{ color: colors.textMuted }}>{log.time}</span>
      </div>
      <div className="flex items-center gap-2">
        <User size={14} color={colors.textMuted} />
        <span className="text-xs" style={{ color: colors.textMuted }}>{log.author}</span>
      </div>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary, display: expanded ? 'block' : '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: expanded ? 'visible' : 'hidden' }}>{log.content}</p>
    <div className="flex items-center justify-end mt-3">
      <button onClick={onToggle} className="text-xs flex items-center gap-1 hover:underline" style={{ color: colors.primary }}>
        {expanded ? <>閉じる <ChevronUp size={12} /></> : <>詳細 <ChevronDown size={12} /></>}
      </button>
    </div>
  </div>
);
