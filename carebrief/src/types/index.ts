export type FlagLevel = "red" | "yellow" | "none";
export type Trend = "up" | "down" | "stable";
export type AlertLevel = "red" | "yellow" | "none";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  flagLevel: FlagLevel;
  flagReason: string | null;
  flagDetails: string[];
  lastUpdate: string;
  caregiver: string;
  phone: string;
  address: string;
  recentLogs: number;
  trend?: Trend;
  careLevel?: string;
  startDate?: string;
}

export interface Activity {
  id: number;
  patient: string;
  action: string;
  time: string;
  type: "log" | "alert" | "routine" | "comment";
}

export interface RoutineItem {
  time: string;
  activity: string;
  Icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
}

export interface CareLog {
  id: number;
  date: string;
  time: string;
  author: string;
  content: string;
}

export interface Action {
  text: string;
}

export interface Goal {
  id: number; // UI用のローカルID
  uuid: string; // サーバから返る各ゴールのUUID
  category: string;
  goal: string;
  completed: boolean;
  completedDate: string | null;
  level: AlertLevel;
  actions: Action[];
}

export interface CarePlan {
  uuid: string;
  summary: string;
  goals: Goal[];
  notes: string;
}

export interface GoalFormData {
  category: string;
  goal: string;
  level: AlertLevel;
  actions: Action[];
}
