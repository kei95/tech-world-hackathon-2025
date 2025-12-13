import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { colors } from "../../lib/colors";
import type { GoalFormData, AlertLevel } from "../../types";

interface AddGoalFormProps {
  onAdd: (data: GoalFormData) => void;
  onCancel: () => void;
  userId: number | string;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({
  onAdd,
  onCancel,
  userId,
}) => {
  const [data, setData] = useState<GoalFormData>({
    category: "",
    goal: "",
    level: "yellow",
    actions: [],
  });
  const [newAction, setNewAction] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const FUNCTIONS_URL =
    (import.meta as any).env?.VITE_FUNCTIONS_URL ??
    "http://localhost:54321/functions/v1";
  const handleAddAction = () => {
    if (newAction.trim()) {
      setData((prev) => ({
        ...prev,
        actions: [...prev.actions, { text: newAction.trim() }],
      }));
      setNewAction("");
    }
  };
  const levelToSeverity = (lv: AlertLevel): string =>
    lv === "red" ? "alert" : lv === "yellow" ? "warning" : "none";
  const generateUuid = (): string => {
    // @ts-ignore
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      // @ts-ignore
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  const handleSubmit = async () => {
    if (!data.category || !data.goal) return;
    try {
      setSubmitting(true);
      const payload = {
        user_id: userId,
        replace_pending: false,
        items: [
          {
            uuid: generateUuid(),
            title: data.category,
            goal: data.goal,
            tasks: data.actions.map((a) => a.text),
            level: levelToSeverity(data.level),
            status: "pending",
          },
        ],
      };
      // eslint-disable-next-line no-console
      console.log("POST /care-plans-create payload", payload);
      await fetch(`${FUNCTIONS_URL}/care-plans-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onAdd(data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("care-plans-create call failed", e);
      onAdd(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-xl p-4"
      style={{ border: `2px dashed ${colors.primary}` }}
    >
      <h4
        className="text-sm font-semibold mb-3 flex items-center gap-2"
        style={{ color: colors.primary }}
      >
        <Plus size={16} />
        新しい目標を追加
      </h4>
      <div className="space-y-3">
        <div>
          <label
            className="text-xs font-medium block mb-1"
            style={{ color: colors.textMuted }}
          >
            タイトル *
          </label>
          <input
            type="text"
            value={data.category}
            onChange={(e) =>
              setData((prev) => ({ ...prev, category: e.target.value }))
            }
            placeholder="例：リハビリ"
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
            value={data.level}
            onChange={(e) =>
              setData((prev) => ({
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
            目標 *
          </label>
          <input
            type="text"
            value={data.goal}
            onChange={(e) =>
              setData((prev) => ({ ...prev, goal: e.target.value }))
            }
            placeholder="目標を入力..."
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
          {data.actions.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {data.actions.map((action, i) => (
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
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        actions: prev.actions.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <X size={14} color={colors.alertRed} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="支援内容を入力..."
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
              onKeyPress={(e) => e.key === "Enter" && handleAddAction()}
            />
            <button
              onClick={handleAddAction}
              className="px-3 py-2 rounded-lg"
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
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !data.category || !data.goal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={12} />
            {submitting ? "送信中…" : "追加"}
          </button>
        </div>
      </div>
    </div>
  );
};
