export type FlagLevel = 'red' | 'yellow' | 'none';
export type AlertLevel = 'red' | 'yellow' | 'none';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  flagLevel: FlagLevel;
  flagReason: string | null;
  lastUpdate: string;
  caregiver: string;
  phone?: string;
  address?: string;
  careLevel?: string;
  startDate?: string;
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
  id: number;
  uuid: string;
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
