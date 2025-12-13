import React, { useState } from 'react';
import { History, CheckCircle, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { colors } from '../../lib/colors';
import { GoalCard } from './GoalCard';
import { AddGoalForm } from './AddGoalForm';
import type { CarePlan, GoalFormData } from '../../types';

interface CarePlanSectionProps {
  plan: CarePlan;
  onToggleGoal: (goalId: number) => void;
  onEditGoal: (goalId: number, data: GoalFormData) => void;
  onDeleteGoal: (goalId: number) => void;
  onAddGoal: (data: GoalFormData) => void;
}

export const CarePlanSection: React.FC<CarePlanSectionProps> = ({ plan, onToggleGoal, onEditGoal, onDeleteGoal, onAddGoal }) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showCompletedGoals, setShowCompletedGoals] = useState<boolean>(false);

  const activeGoals = plan.goals.filter(g => !g.completed);
  const completedGoals = plan.goals.filter(g => g.completed);
  const totalGoals = plan.goals.length;
  const progress = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0;

  const handleAddGoal = (data: GoalFormData) => { onAddGoal(data); setShowAddForm(false); };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl" style={{ backgroundColor: colors.primaryLight, border: `1px solid ${colors.primaryMuted}40` }}>
        <p className="text-sm leading-relaxed mb-3" style={{ color: colors.textPrimary }}>{plan.summary}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: colors.primaryMuted + '40' }}><div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: colors.primary }} /></div>
          <span className="text-xs font-medium" style={{ color: colors.primary }}>{completedGoals.length}/{totalGoals} 完了</span>
        </div>
      </div>

      {activeGoals.length > 0 ? (
        activeGoals.map((goal) => (<GoalCard key={goal.id} goal={goal} onToggleComplete={onToggleGoal} onEdit={onEditGoal} onDelete={onDeleteGoal} />))
      ) : (
        <div className="bg-white rounded-xl p-6 text-center" style={{ border: `1px solid ${colors.border}` }}>
          <CheckCircle size={32} color={colors.success} className="mx-auto mb-2" />
          <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>すべての目標を達成しました</p>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>新しい目標を追加してください</p>
        </div>
      )}

      {showAddForm ? (<AddGoalForm onAdd={handleAddGoal} onCancel={() => setShowAddForm(false)} />) : (<button onClick={() => setShowAddForm(true)} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:opacity-80" style={{ border: `2px dashed ${colors.border}`, color: colors.textMuted }}><Plus size={16} />新しい目標を追加</button>)}

      {completedGoals.length > 0 && (
        <div className="rounded-xl" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.bgElevated }}>
          <button onClick={() => setShowCompletedGoals(!showCompletedGoals)} className="w-full p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} color={colors.textMuted} />
              <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>完了した目標</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.successLight, color: colors.success }}>{completedGoals.length}</span>
            </div>
            {showCompletedGoals ? <ChevronUp size={16} color={colors.textMuted} /> : <ChevronDown size={16} color={colors.textMuted} />}
          </button>
          {showCompletedGoals && (
            <div className="px-4 pb-4 space-y-3">
              {completedGoals.map((goal) => (<GoalCard key={goal.id} goal={goal} onToggleComplete={onToggleGoal} onEdit={onEditGoal} onDelete={onDeleteGoal} />))}
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}><p className="text-xs mb-1 font-medium" style={{ color: colors.textMuted }}>備考・留意事項</p><p className="text-sm" style={{ color: colors.textSecondary }}>{plan.notes}</p></div>
    </div>
  );
};
