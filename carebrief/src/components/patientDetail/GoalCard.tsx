import React, { useMemo, useState } from "react";
import {
  Activity,
  CheckCircle,
  Edit3,
  Check,
  RotateCcw,
  Trash2,
  Save,
  Plus,
  X,
} from "lucide-react";
import { colors } from "../../lib/colors";
import type { Goal, GoalFormData, AlertLevel } from "../../types";

interface GoalCardProps {
  goal: Goal;
  userId: number | string;
  onToggleComplete: (goalId: number) => void;
  onEdit: (goalId: number, data: GoalFormData) => void;
  onDelete: (goalId: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  userId,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<GoalFormData>({
    category: goal.category,
    goal: goal.goal,
    level: goal.level,
    actions: [...goal.actions],
  });
  const [newAction, setNewAction] = useState<string>("");
  const [reverting, setReverting] = useState<boolean>(false);
  const [completing, setCompleting] = useState<boolean>(false);
  const FUNCTIONS_URL =
    (import.meta as any).env?.VITE_FUNCTIONS_URL ??
    "http://localhost:54321/functions/v1";
  // ユーザーIDとgoal.idから決定的に生成される安定UUID
  const makeDeterministicUuid = (input: string): string => {
    // FNV-1a ベースの簡易ハッシュで 128bit を作る
    let h1 = 0x811c9dc5 >>> 0;
    let h2 = 0x811c9dc5 >>> 0;
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i);
      h1 ^= c;
      h1 = Math.imul(h1, 16777619) >>> 0;
      h2 ^= c + i;
      h2 = Math.imul(h2, 16777619) >>> 0;
    }
    const p3 = (h1 ^ 0x9e3779b9) >>> 0;
    const p4 = (h2 ^ 0x7f4a7c15) >>> 0;
    const parts = [h1, h2, p3, p4];
    const bytes = new Uint8Array(16);
    for (let j = 0; j < 4; j++) {
      const v = parts[j];
      bytes[j * 4 + 0] = v & 0xff;
      bytes[j * 4 + 1] = (v >>> 8) & 0xff;
      bytes[j * 4 + 2] = (v >>> 16) & 0xff;
      bytes[j * 4 + 3] = (v >>> 24) & 0xff;
    }
    // UUID v5 風（version/variant のみ適用）
    bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };
  const stableUuid = useMemo(
    () => makeDeterministicUuid(`${userId}:${goal.uuid || goal.id}`),
    [userId, goal.uuid, goal.id]
  );

  const handleSave = () => {
    onEdit(goal.id, editData);
    setIsEditing(false);
  };
  const handleAddAction = () => {
    if (newAction.trim()) {
      setEditData((prev) => ({
        ...prev,
        actions: [...prev.actions, { text: newAction.trim() }],
      }));
      setNewAction("");
    }
  };
  const handleRemoveAction = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };
  const handleRevert = async () => {
    try {
      setReverting(true);
      await fetch(`${FUNCTIONS_URL}/care-plans-pending`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: goal.uuid || stableUuid,
          user_id: userId,
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("care-plans-pending call failed", e);
    } finally {
      setReverting(false);
      onToggleComplete(goal.id);
    }
  };
  const handleComplete = async () => {
    try {
      setCompleting(true);
      await fetch(`${FUNCTIONS_URL}/care-plans-done`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: goal.uuid || stableUuid,
          user_id: userId,
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("care-plans-done call failed", e);
    } finally {
      setCompleting(false);
      onToggleComplete(goal.id);
    }
  };

  if (isEditing) {
    return (
      <div
        className="bg-white rounded-xl p-4"
        style={{ border: `2px solid ${colors.primary}` }}
      >
        <div className="space-y-3">
          <div>
            <label
              className="text-xs font-medium block mb-1"
              style={{ color: colors.textMuted }}
            >
              カテゴリ
            </label>
            <input
              type="text"
              value={editData.category}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            />
          </div>
          <div>
            <label
              className="text-xs font-medium block mb-1"
              style={{ color: colors.textMuted }}
            >
              優先度
            </label>
            <select
              value={editData.level}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  level: e.target.value as AlertLevel,
                }))
              }
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            >
              <option value="red">高</option>
              <option value="yellow">中</option>
              <option value="none">なし</option>
            </select>
          </div>
          <div>
            <label
              className="text-xs font-medium block mb-1"
              style={{ color: colors.textMuted }}
            >
              目標
            </label>
            <input
              type="text"
              value={editData.goal}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, goal: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            />
          </div>
          <div>
            <label
              className="text-xs font-medium block mb-1"
              style={{ color: colors.textMuted }}
            >
              支援内容
            </label>
            <div className="space-y-1.5 mb-2">
              {editData.actions.map((action, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="flex-1 text-sm px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      color: colors.textSecondary,
                    }}
                  >
                    {action.text}
                  </span>
                  <button
                    onClick={() => handleRemoveAction(i)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <X size={14} color={colors.alertRed} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="新しい支援内容を追加..."
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                onKeyPress={(e) => e.key === "Enter" && handleAddAction()}
              />
              <button
                onClick={handleAddAction}
                className="px-3 py-2 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
              }}
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ backgroundColor: colors.primary }}
            >
              <Save size={12} />
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl p-4 transition-all"
      style={{
        border: `1px solid ${goal.completed ? colors.success : colors.border}`,
        opacity: goal.completed ? 0.85 : 1,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4
            className="text-sm font-semibold flex items-center gap-2"
            style={{
              color: goal.completed ? colors.success : colors.primary,
              textDecoration: goal.completed ? "line-through" : "none",
            }}
          >
            <Activity size={16} />
            {goal.category}
          </h4>
          {goal.level !== "none" && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor:
                  goal.level === "red"
                    ? colors.alertRedLight
                    : colors.alertYellowLight,
                color:
                  goal.level === "red" ? colors.alertRed : colors.alertYellow,
              }}
            >
              {goal.level === "red" ? "高" : "中"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {goal.completed ? (
            <>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: colors.successLight,
                  color: colors.success,
                }}
              >
                達成
              </span>
              <button
                onClick={handleRevert}
                disabled={reverting}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80 disabled:opacity-60"
                style={{
                  backgroundColor: colors.bgSecondary,
                  color: colors.textSecondary,
                  border: `1px solid ${colors.border}`,
                }}
                title="未完了に戻す"
              >
                <RotateCcw size={12} />
                {reverting ? "送信中…" : "戻す"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                title="編集"
              >
                <Edit3 size={14} color={colors.textMuted} />
              </button>
              <button
                onClick={() => onDelete(goal.id)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                title="削除"
              >
                <Trash2 size={14} color={colors.alertRed} />
              </button>
              <button
                onClick={handleComplete}
                disabled={completing}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80"
                style={{
                  backgroundColor: colors.success,
                  color: "white",
                  opacity: completing ? 0.6 : 1,
                }}
              >
                <Check size={12} />
                {completing ? "送信中…" : "完了"}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mb-3">
        <p className="text-xs mb-1" style={{ color: colors.textMuted }}>
          目標
        </p>
        <p className="text-sm" style={{ color: colors.textPrimary }}>
          {goal.goal}
        </p>
      </div>
      <div>
        <p className="text-xs mb-2" style={{ color: colors.textMuted }}>
          支援内容
        </p>
        <ul className="space-y-1.5">
          {goal.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-xs mt-1" style={{ color: colors.primary }}>
                •
              </span>
              <span
                className="flex-1 text-sm"
                style={{
                  color: goal.completed
                    ? colors.textMuted
                    : colors.textSecondary,
                  textDecoration: goal.completed ? "line-through" : "none",
                }}
              >
                {action.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {goal.completed && goal.completedDate && (
        <div
          className="mt-3 pt-3 flex items-center gap-2"
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <CheckCircle size={14} color={colors.success} />
          <span className="text-xs" style={{ color: colors.textMuted }}>
            {goal.completedDate} に達成
          </span>
        </div>
      )}
    </div>
  );
};
