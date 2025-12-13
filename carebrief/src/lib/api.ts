import type { Patient, CareLog } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// 一覧用APIレスポンスの型
interface ApiUserListResponse {
  id: number;
  name: string;
  nameKana?: string;
  age: number;
  gender: string;
  careLevel?: string;
  caregiver?: string;
  lastLogAt?: string | null;
}

// 詳細用APIレスポンスの型
interface ApiUserDetailResponse {
  id: number;
  name: string;
  nameKana?: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  careLevel?: string;
  startDate?: string;
  notes?: string;
  caregiver?: { id: number; name: string };
  recentLogs?: ApiLogResponse[];
}

interface ApiLogResponse {
  id: number;
  createdAt: string;
  author: string;
  content: string;
}

export interface UserDetailResponse {
  patient: Patient;
  careLogs: CareLog[];
}

// 一覧用: APIレスポンスをフロントエンドの型に変換
function mapApiUserListToPatient(apiUser: ApiUserListResponse): Patient {
  const lastUpdate = apiUser.lastLogAt
    ? formatRelativeTime(new Date(apiUser.lastLogAt))
    : '';

  return {
    id: String(apiUser.id),
    name: apiUser.name,
    age: apiUser.age,
    gender: apiUser.gender,
    phone: '',
    address: '',
    caregiver: apiUser.caregiver || '',
    careLevel: apiUser.careLevel,
    startDate: undefined,
    flagLevel: 'none',
    flagReason: null,
    flagDetails: [],
    lastUpdate,
    recentLogs: 0,
  };
}

// 詳細用: APIレスポンスをフロントエンドの型に変換
function mapApiUserDetailToPatient(apiUser: ApiUserDetailResponse): Patient {
  return {
    id: String(apiUser.id),
    name: apiUser.name,
    age: apiUser.age,
    gender: apiUser.gender,
    phone: apiUser.phone,
    address: apiUser.address,
    caregiver: apiUser.caregiver?.name || '',
    careLevel: apiUser.careLevel,
    startDate: apiUser.startDate,
    flagLevel: 'none',
    flagReason: null,
    flagDetails: [],
    lastUpdate: '',
    recentLogs: apiUser.recentLogs?.length || 0,
  };
}

// 相対時間を計算
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString('ja-JP');
}

function mapApiLogToCareLog(apiLog: ApiLogResponse): CareLog {
  const date = new Date(apiLog.createdAt);
  return {
    id: apiLog.id,
    date: date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
    time: date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    author: apiLog.author,
    content: apiLog.content,
  };
}

export async function fetchUsers(): Promise<Patient[]> {
  const response = await fetch(`${API_URL}/functions/v1/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data: ApiUserListResponse[] = await response.json();
  return data.map(mapApiUserListToPatient);
}

export async function fetchUserDetail(userId: string): Promise<UserDetailResponse> {
  const response = await fetch(`${API_URL}/functions/v1/users-detail/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user detail');
  }
  const data: ApiUserDetailResponse = await response.json();
  return {
    patient: mapApiUserDetailToPatient(data),
    careLogs: (data.recentLogs || []).map(mapApiLogToCareLog),
  };
}

// ログ一覧取得
interface FetchLogsResponse {
  user: {
    id: number;
    name: string;
    phone: string;
    address: string;
    caregiver: string;
    startDate: string;
  };
  logs: ApiLogResponse[];
}

export async function fetchLogs(
  userId: string,
  limit = 50,
  offset = 0
): Promise<{ user: FetchLogsResponse['user']; logs: CareLog[] }> {
  const params = new URLSearchParams({
    userId,
    limit: String(limit),
    offset: String(offset),
  });
  const response = await fetch(`${API_URL}/functions/v1/logs?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }
  const data: FetchLogsResponse = await response.json();
  return {
    user: data.user,
    logs: data.logs.map(mapApiLogToCareLog),
  };
}

// 音声からログ生成（プレビュー）
export async function logsPreview(audioFile: File): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await fetch(`${API_URL}/functions/v1/logs-preview`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to preview log');
  }
  return response.json();
}

// ログ確定（DB保存）
export async function logsConfirm(data: {
  userId: number;
  caregiverId: number;
  content: string;
}): Promise<{ success: boolean; logId: number }> {
  const response = await fetch(`${API_URL}/functions/v1/logs-confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to confirm log');
  }
  return response.json();
}

// SSE接続用URL取得
export function getLogsStreamUrl(userId: string): string {
  return `${API_URL}/functions/v1/logs-stream?userId=${userId}`;
}
