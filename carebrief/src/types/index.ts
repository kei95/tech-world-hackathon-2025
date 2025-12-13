export type FlagLevel = 'red' | 'yellow' | 'none';
export type Trend = 'up' | 'down' | 'stable';

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
}

export interface Activity {
  id: number;
  patient: string;
  action: string;
  time: string;
  type: 'log' | 'alert' | 'routine' | 'comment';
}

export interface RoutineItem {
  time: string;
  activity: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}
