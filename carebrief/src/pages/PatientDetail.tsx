import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Sparkles,
  User,
  Activity,
} from "lucide-react";
import { colors } from "../lib/colors";
import { LogCard } from "../components/patientDetail/LogCard";
import { CarePlanSection } from "../components/patientDetail/CarePlanSection";
import type { CareLog, CarePlan, GoalFormData } from "../types";
import { useUserDetail } from "../hooks/useUserDetail";
import { useLogsStream } from "../hooks/useLogsStream";

type TabType = "logs" | "plan";

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const {
    patient,
    careLogs,
    setCareLogs,
    carePlan,
    setCarePlan,
    loading,
    error,
  } = useUserDetail(userId || "");

  const [expandedLogs, setExpandedLogs] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<TabType>("logs");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [carePlanLoading, setCarePlanLoading] = useState<boolean>(false);
  const [showConfirmGenerate, setShowConfirmGenerate] =
    useState<boolean>(false);

  // SSEで新しいログを受信したら先頭に追加
  const handleNewLog = useCallback(
    (newLog: CareLog) => {
      setCareLogs((prev) => [newLog, ...prev]);
    },
    [setCareLogs],
  );

  // SSE接続
  useLogsStream({
    userId: userId || "",
    onNewLog: handleNewLog,
    enabled: !!userId,
  });

  // assess-risk レスポンス → CarePlan 変換の最小実装
  type RiskItem = {
    uuid?: string;
    plan_uuid?: string;
    id?: number | string;
    level: string; // e.g. "alert" | "warning" | "none"
    title: string;
    goal?: string;
    tasks?: string[];
    description?: string;
    status?: string; // "done" | "pending" など
    completed?: boolean;
    completedAt?: string;
    completed_at?: string;
  };
  const toAlertLevel = (level: string): CarePlan["goals"][number]["level"] => {
    const lv = String(level).toLowerCase();
    if (lv === "alert" || lv === "high" || lv === "red") return "red";
    if (lv === "warning" || lv === "medium" || lv === "yellow") return "yellow";
    return "none";
  };
  const buildCarePlanFromRisks = (risks: RiskItem[]): CarePlan => {
    const goals: CarePlan["goals"] = risks.map((r, idx) => ({
      id: typeof r.id === "number" ? r.id : idx + 1,
      uuid: r.uuid ?? r.plan_uuid ?? "",
      category: r.title,
      goal: r.goal ?? r.title,
      completed:
        r.completed === true ||
        (typeof r.status === "string" && r.status.toLowerCase() === "done"),
      completedDate: r.completedAt ?? r.completed_at ?? null,
      level: toAlertLevel(r.level),
      actions:
        r.tasks && r.tasks.length > 0
          ? r.tasks.map((t) => ({ text: t }))
          : r.description
            ? [{ text: r.description }]
            : [],
    }));
    const summary =
      risks.length > 0 ? risks.map((r) => r.title).join(" / ") : "特記なし";
    const notes =
      "AI抽出の危険兆候に基づく自動生成プラン（初期版）。臨床判断で適宜修正してください。";
    const planUuid = risks[0]?.uuid ?? risks[0]?.plan_uuid ?? "";
    return { uuid: planUuid, summary, goals, notes };
  };

  // care-plans API レスポンスを取り込み
  function mapCarePlanFromAny(data: any): CarePlan | null {
    // 1) assess-risk 互換: 配列をそのままゴール配列として解釈
    if (Array.isArray(data)) {
      return buildCarePlanFromRisks(data as RiskItem[]);
    }
    // 2) ラッパーオブジェクト: { items: [...] } or { data: [...] }
    if (Array.isArray(data?.items)) {
      return buildCarePlanFromRisks(data.items as RiskItem[]);
    }
    if (Array.isArray(data?.data)) {
      return buildCarePlanFromRisks(data.data as RiskItem[]);
    }
    // 3) CarePlan風のオブジェクト: { uuid, goals: [...], summary?, notes? }
    if (data && Array.isArray(data.goals)) {
      const risks: RiskItem[] = (data.goals as any[]).map((g) => ({
        uuid: g.uuid ?? undefined,
        plan_uuid: g.plan_uuid ?? undefined,
        level: g.level ?? "none",
        title: g.title ?? g.category ?? g.goal ?? "無題",
        goal: g.goal ?? g.title ?? g.category ?? "無題",
        tasks: Array.isArray(g.tasks)
          ? g.tasks
          : Array.isArray(g.actions)
            ? g.actions.map((a: any) => a.text ?? String(a))
            : [],
        description: g.description,
        status: g.status,
        completed: g.completed,
        completedAt: g.completedAt ?? g.completed_at,
      }));
      const plan = buildCarePlanFromRisks(risks);
      return {
        uuid: data.uuid ?? plan.uuid,
        summary: data.summary ?? plan.summary,
        notes: data.notes ?? plan.notes,
        goals: plan.goals,
      };
    }
    return null;
  }

  const FUNCTIONS_URL =
    (import.meta as any).env?.VITE_FUNCTIONS_URL ??
    "http://localhost:54321/functions/v1";

  async function loadCarePlanFromServer() {
    if (!userId) return;
    try {
      setCarePlanLoading(true);
      const url = `${FUNCTIONS_URL}/care-plans?user_id=${encodeURIComponent(
        String(userId),
      )}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("care-plans fetch failed", res.status);
        return;
      }
      const data: any = await res.json();

      console.log("care-plans result", res.status, data);
      const plan = mapCarePlanFromAny(data);
      if (plan) {
        setCarePlan(plan);
      } else {
        console.warn("care-plans: unsupported response shape");
      }
    } catch (e) {
      console.error("care-plans load error", e);
    } finally {
      setCarePlanLoading(false);
    }
  }

  // タブ遷移で「介護計画」を開いた時に取得
  useEffect(() => {
    if (activeTab === "plan") {
      void loadCarePlanFromServer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const toggleLog = (id: number) =>
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleClickGenerate = () => {
    if (isGenerating) return;
    const hasIncomplete =
      !!carePlan && carePlan.goals.some((g) => g.completed !== true);
    if (hasIncomplete) {
      setShowConfirmGenerate(true);
      return;
    }
    void handleGeneratePlan();
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const form = new FormData();
      form.append("user_id", String(userId || patient?.id || "1"));
      const res = await fetch(`${FUNCTIONS_URL}/assess-risk`, {
        method: "POST",
        body: form,
      });
      let data: unknown = null as unknown;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      console.log("assess-risk result", res.status, data);
      if (Array.isArray(data)) {
        const plan = buildCarePlanFromRisks(data as RiskItem[]);
        setCarePlan(plan);
        setActiveTab("plan");
      } else {
        // 想定外のレスポンス形式時はプラン未設定のままにする
      }
    } catch (e) {
      console.error("assess-risk call failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmAndGenerate = () => {
    setShowConfirmGenerate(false);
    void handleGeneratePlan();
  };

  const handleToggleGoal = (goalId: number) => {
    setCarePlan((prev) =>
      prev
        ? {
            ...prev,
            goals: prev.goals.map((goal) =>
              goal.id === goalId
                ? {
                    ...goal,
                    completed: !goal.completed,
                    completedDate: !goal.completed ? "2024年12月13日" : null,
                  }
                : goal,
            ),
          }
        : null,
    );
  };
  const handleEditGoal = (goalId: number, data: GoalFormData) => {
    setCarePlan((prev) =>
      prev
        ? {
            ...prev,
            goals: prev.goals.map((goal) =>
              goal.id === goalId ? { ...goal, ...data } : goal,
            ),
          }
        : null,
    );
  };
  const handleDeleteGoal = (goalId: number) => {
    setCarePlan((prev) =>
      prev
        ? { ...prev, goals: prev.goals.filter((goal) => goal.id !== goalId) }
        : null,
    );
  };
  const handleAddGoal = (data: GoalFormData) => {
    setCarePlan((prev) =>
      prev
        ? {
            ...prev,
            goals: [
              ...prev.goals,
              {
                id: Date.now(),
                uuid: "",
                category: data.category,
                goal: data.goal,
                level: data.level,
                actions: data.actions,
                completed: false,
                completedDate: null,
              },
            ],
          }
        : null,
    );
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.bgSecondary }}
      >
        <p style={{ color: colors.textMuted }}>読み込み中...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.bgSecondary }}
      >
        <p style={{ color: colors.textMuted }}>エラーが発生しました</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: colors.bgSecondary,
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        className="bg-white px-4 py-3 sticky top-0 z-10"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50"
              style={{ border: `1px solid ${colors.border}` }}
            >
              <ArrowLeft size={16} color={colors.textSecondary} />
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Heart size={20} color={colors.primary} />
              </div>
              <div>
                <h1
                  className="text-base font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  {patient.name}
                </h1>
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  {patient.age}歳 · {patient.gender} · {patient.careLevel}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClickGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: colors.primary }}
          >
            <Sparkles size={14} />
            {isGenerating ? "生成中..." : "介護計画を生成"}
          </button>
        </div>
      </header>

      <div className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              {[
                { id: "logs" as TabType, label: "日報ログ", Icon: FileText },
                {
                  id: "plan" as TabType,
                  label: "介護計画",
                  Icon: Activity,
                  badge: carePlan ? "NEW" : null,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor:
                      activeTab === tab.id ? colors.primaryLight : "white",
                    color:
                      activeTab === tab.id
                        ? colors.primary
                        : colors.textSecondary,
                    border: `1px solid ${
                      activeTab === tab.id ? colors.primary : colors.border
                    }`,
                  }}
                >
                  <tab.Icon size={14} />
                  {tab.label}
                  {tab.badge && (
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: colors.primary,
                        color: "white",
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === "logs" && (
              <div className="space-y-2.5">
                {careLogs.map((log) => (
                  <LogCard
                    key={log.id}
                    log={log}
                    expanded={expandedLogs[log.id]}
                    onToggle={() => toggleLog(log.id)}
                  />
                ))}
              </div>
            )}

            {activeTab === "plan" && (
              <div>
                {carePlan ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} color={colors.primary} />
                        <span
                          className="text-xs font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          AIが生成した介護計画
                        </span>
                      </div>
                    </div>
                    <CarePlanSection
                      plan={carePlan}
                      userId={userId || ""}
                      onToggleGoal={handleToggleGoal}
                      onEditGoal={handleEditGoal}
                      onDeleteGoal={handleDeleteGoal}
                      onAddGoal={handleAddGoal}
                    />
                  </div>
                ) : carePlanLoading ? (
                  <div
                    className="bg-white rounded-xl p-6 text-center"
                    style={{ border: `1px solid ${colors.border}` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: colors.bgSecondary }}
                    >
                      <Sparkles size={24} color={colors.textMuted} />
                    </div>
                    <h3
                      className="text-sm font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      介護計画を読み込み中…
                    </h3>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      少々お待ちください
                    </p>
                  </div>
                ) : (
                  <div
                    className="bg-white rounded-xl p-6 text-center"
                    style={{ border: `1px solid ${colors.border}` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: colors.bgSecondary }}
                    >
                      <Sparkles size={24} color={colors.textMuted} />
                    </div>
                    <h3
                      className="text-sm font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      介護計画を生成しましょう
                    </h3>
                    <p
                      className="text-xs mb-3"
                      style={{ color: colors.textMuted }}
                    >
                      日報ログと要注意点をAIが分析し、
                      <br />
                      介護計画の叩き台を自動生成します
                    </p>
                    <button
                      onClick={handleClickGenerate}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-60 text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Sparkles size={14} />
                      {isGenerating ? "生成中..." : "介護計画を生成"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-72 space-y-3 shrink-0">
            <div
              className="bg-white rounded-xl p-3"
              style={{ border: `1px solid ${colors.border}` }}
            >
              <h3
                className="text-xs font-semibold mb-2.5"
                style={{ color: colors.textPrimary }}
              >
                基本情報
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone size={14} color={colors.textMuted} />
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {patient.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} color={colors.textMuted} />
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {patient.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} color={colors.textMuted} />
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    担当: {patient.caregiver}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} color={colors.textMuted} />
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    開始日: {patient.startDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmGenerate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm mx-4 rounded-xl p-4 bg-white"
            style={{ border: `1px solid ${colors.border}` }}
          >
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              現在の介護計画が消えます
            </h3>
            <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>
              未完了の介護計画があります。新しく生成すると現在の未完了の計画は消去されます。続行しますか？
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmGenerate(false)}
                className="px-3 py-1.5 rounded-lg text-xs"
                style={{
                  border: `1px solid ${colors.border}`,
                  color: colors.textSecondary,
                }}
              >
                キャンセル
              </button>
              <button
                onClick={confirmAndGenerate}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ backgroundColor: colors.primary }}
              >
                続行して生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
