import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Heart, ArrowLeft, Phone, MapPin, Calendar,
  FileText, Sparkles, User, Activity, Download
} from 'lucide-react';
import { colors } from '../lib/colors';
import { useUserDetail } from '../hooks/useUserDetail';
import { useLogsStream } from '../hooks/useLogsStream';
import { LogCard } from '../components/patientDetail/LogCard';
import { CarePlanSection } from '../components/patientDetail/CarePlanSection';
import type { GoalFormData, CareLog } from '../types';

type TabType = 'logs' | 'plan';

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { patient, careLogs, setCareLogs, carePlan, setCarePlan, loading, error } = useUserDetail(userId || '');

  const [expandedLogs, setExpandedLogs] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<TabType>('logs');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // SSEで新しいログを受信したら先頭に追加
  const handleNewLog = useCallback((newLog: CareLog) => {
    setCareLogs((prev) => [newLog, ...prev]);
  }, [setCareLogs]);

  // SSE接続
  useLogsStream({
    userId: userId || '',
    onNewLog: handleNewLog,
    enabled: !!userId,
  });

  const toggleLog = (id: number) => setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleGeneratePlan = () => { setIsGenerating(true); setTimeout(() => { setCarePlan(carePlan); setIsGenerating(false); setActiveTab('plan'); }, 2000); };
  const handleToggleGoal = (goalId: number) => { setCarePlan(prev => prev ? { ...prev, goals: prev.goals.map(goal => goal.id === goalId ? { ...goal, completed: !goal.completed, completedDate: !goal.completed ? '2024年12月13日' : null } : goal) } : null); };
  const handleEditGoal = (goalId: number, data: GoalFormData) => { setCarePlan(prev => prev ? { ...prev, goals: prev.goals.map(goal => goal.id === goalId ? { ...goal, ...data } : goal) } : null); };
  const handleDeleteGoal = (goalId: number) => { setCarePlan(prev => prev ? { ...prev, goals: prev.goals.filter(goal => goal.id !== goalId) } : null); };
  const handleAddGoal = (data: GoalFormData) => { setCarePlan(prev => prev ? { ...prev, goals: [...prev.goals, { id: Date.now(), category: data.category, goal: data.goal, level: data.level, actions: data.actions, completed: false, completedDate: null }] } : null); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgSecondary }}>
        <p style={{ color: colors.textMuted }}>読み込み中...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgSecondary }}>
        <p style={{ color: colors.textMuted }}>エラーが発生しました</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bgSecondary, minHeight: '100vh', fontFamily: "system-ui, sans-serif" }}>
      <header className="bg-white px-4 py-3 sticky top-0 z-10" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50" style={{ border: `1px solid ${colors.border}` }}><ArrowLeft size={16} color={colors.textSecondary} /></button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.primaryLight }}><Heart size={20} color={colors.primary} /></div>
              <div><h1 className="text-base font-bold" style={{ color: colors.textPrimary }}>{patient.name}</h1><p className="text-xs" style={{ color: colors.textMuted }}>{patient.age}歳 · {patient.gender} · {patient.careLevel}</p></div>
            </div>
          </div>
          <button onClick={handleGeneratePlan} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: colors.primary }}><Sparkles size={14} />{isGenerating ? '生成中...' : '介護計画を生成'}</button>
        </div>
      </header>

      <div className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              {[{ id: 'logs' as TabType, label: '日報ログ', Icon: FileText }, { id: 'plan' as TabType, label: '介護計画', Icon: Activity, badge: carePlan ? 'NEW' : null }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: activeTab === tab.id ? colors.primaryLight : 'white', color: activeTab === tab.id ? colors.primary : colors.textSecondary, border: `1px solid ${activeTab === tab.id ? colors.primary : colors.border}` }}>
                  <tab.Icon size={14} />{tab.label}{tab.badge && <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: colors.primary, color: 'white' }}>{tab.badge}</span>}
                </button>
              ))}
            </div>

            {activeTab === 'logs' && (<div className="space-y-2.5">{careLogs.map((log) => <LogCard key={log.id} log={log} expanded={expandedLogs[log.id]} onToggle={() => toggleLog(log.id)} />)}</div>)}

            {activeTab === 'plan' && (
              <div>
                {carePlan ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2"><Sparkles size={16} color={colors.primary} /><span className="text-xs font-medium" style={{ color: colors.textPrimary }}>AIが生成した介護計画の叩き台</span></div>
                      <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs hover:bg-gray-50" style={{ border: `1px solid ${colors.border}`, color: colors.textSecondary }}><Download size={12} />出力</button>
                    </div>
                    <CarePlanSection plan={carePlan} onToggleGoal={handleToggleGoal} onEditGoal={handleEditGoal} onDeleteGoal={handleDeleteGoal} onAddGoal={handleAddGoal} />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 text-center" style={{ border: `1px solid ${colors.border}` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: colors.bgSecondary }}><Sparkles size={24} color={colors.textMuted} /></div>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>介護計画を生成しましょう</h3>
                    <p className="text-xs mb-3" style={{ color: colors.textMuted }}>日報ログと要注意点をAIが分析し、<br />介護計画の叩き台を自動生成します</p>
                    <button onClick={handleGeneratePlan} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: colors.primary }}><Sparkles size={14} />生成を開始</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-72 space-y-3 shrink-0">
            <div className="bg-white rounded-xl p-3" style={{ border: `1px solid ${colors.border}` }}>
              <h3 className="text-xs font-semibold mb-2.5" style={{ color: colors.textPrimary }}>基本情報</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><Phone size={14} color={colors.textMuted} /><span className="text-xs" style={{ color: colors.textSecondary }}>{patient.phone}</span></div>
                <div className="flex items-center gap-2"><MapPin size={14} color={colors.textMuted} /><span className="text-xs" style={{ color: colors.textSecondary }}>{patient.address}</span></div>
                <div className="flex items-center gap-2"><User size={14} color={colors.textMuted} /><span className="text-xs" style={{ color: colors.textSecondary }}>担当: {patient.caregiver}</span></div>
                <div className="flex items-center gap-2"><Calendar size={14} color={colors.textMuted} /><span className="text-xs" style={{ color: colors.textSecondary }}>開始日: {patient.startDate}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
