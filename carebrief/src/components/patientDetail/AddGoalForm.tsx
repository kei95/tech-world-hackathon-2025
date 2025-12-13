import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { colors } from '../../lib/colors';
import type { GoalFormData, AlertLevel } from '../../types';

interface AddGoalFormProps {
  onAdd: (data: GoalFormData) => void;
  onCancel: () => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAdd, onCancel }) => {
  const [data, setData] = useState<GoalFormData>({ category: '', goal: '', level: 'yellow', actions: [] });
  const [newAction, setNewAction] = useState<string>('');
  const handleAddAction = () => { if (newAction.trim()) { setData(prev => ({ ...prev, actions: [...prev.actions, { text: newAction.trim() }] })); setNewAction(''); } };
  const handleSubmit = () => { if (data.category && data.goal) { onAdd(data); } };

  return (
    <div className="bg-white rounded-xl p-4" style={{ border: `2px dashed ${colors.primary}` }}>
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.primary }}><Plus size={16} />新しい目標を追加</h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>カテゴリ *</label>
          <input type="text" value={data.category} onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))} placeholder="例：リハビリ" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>優先度</label>
          <select value={data.level} onChange={(e) => setData(prev => ({ ...prev, level: e.target.value as AlertLevel }))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
            <option value="red">高</option>
            <option value="yellow">中</option>
            <option value="none">なし</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>目標 *</label>
          <input type="text" value={data.goal} onChange={(e) => setData(prev => ({ ...prev, goal: e.target.value }))} placeholder="目標を入力..." className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>支援内容</label>
          {data.actions.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {data.actions.map((action, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 text-sm px-3 py-1.5 rounded-lg" style={{ backgroundColor: colors.bgSecondary, color: colors.textSecondary }}>{action.text}</span>
                  <button onClick={() => setData(prev => ({ ...prev, actions: prev.actions.filter((_, idx) => idx !== i) }))} className="p-1 rounded hover:bg-gray-100"><X size={14} color={colors.alertRed} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input type="text" value={newAction} onChange={(e) => setNewAction(e.target.value)} placeholder="支援内容を入力..." className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }} onKeyPress={(e) => e.key === 'Enter' && handleAddAction()} />
            <button onClick={handleAddAction} className="px-3 py-2 rounded-lg" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}><Plus size={14} /></button>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-lg text-xs" style={{ border: `1px solid ${colors.border}`, color: colors.textSecondary }}>キャンセル</button>
          <button onClick={handleSubmit} disabled={!data.category || !data.goal} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50" style={{ backgroundColor: colors.primary }}><Plus size={12} />追加</button>
        </div>
      </div>
    </div>
  );
};
