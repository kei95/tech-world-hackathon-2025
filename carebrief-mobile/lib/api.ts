import * as FileSystem from "expo-file-system/legacy";
import type { Patient, CareLog, CarePlan, AlertLevel } from "./types";

// API base URL - should be configured via environment variable in production
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:54321";

// API Response types
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

export interface UserDetailResponse {
  patient: Patient;
  careLogs: CareLog[];
}

// Helper functions
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "たった今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP");
}

function mapApiUserListToPatient(apiUser: ApiUserListResponse): Patient {
  const lastUpdate = apiUser.lastLogAt
    ? formatRelativeTime(new Date(apiUser.lastLogAt))
    : "";

  return {
    id: String(apiUser.id),
    name: apiUser.name,
    age: apiUser.age,
    gender: apiUser.gender,
    caregiver: apiUser.caregiver || "",
    careLevel: apiUser.careLevel,
    flagLevel: "none",
    flagReason: null,
    lastUpdate,
  };
}

function mapApiUserDetailToPatient(apiUser: ApiUserDetailResponse): Patient {
  return {
    id: String(apiUser.id),
    name: apiUser.name,
    age: apiUser.age,
    gender: apiUser.gender,
    phone: apiUser.phone,
    address: apiUser.address,
    caregiver: apiUser.caregiver?.name || "",
    careLevel: apiUser.careLevel,
    startDate: apiUser.startDate,
    flagLevel: "none",
    flagReason: null,
    lastUpdate: "",
  };
}

function mapApiLogToCareLog(apiLog: ApiLogResponse): CareLog {
  const date = new Date(apiLog.createdAt);
  return {
    id: apiLog.id,
    date: date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    author: apiLog.author,
    content: apiLog.content,
  };
}

// API functions
export async function fetchUsers(): Promise<Patient[]> {
  const response = await fetch(`${API_URL}/functions/v1/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data: ApiUserListResponse[] = await response.json();
  return data.map(mapApiUserListToPatient);
}

export async function fetchUserDetail(
  userId: string,
): Promise<UserDetailResponse> {
  const response = await fetch(
    `${API_URL}/functions/v1/users-detail/${userId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user detail");
  }
  const data: ApiUserDetailResponse = await response.json();
  return {
    patient: mapApiUserDetailToPatient(data),
    careLogs: (data.recentLogs || []).map(mapApiLogToCareLog),
  };
}

export async function fetchLogs(
  userId: string,
  limit = 50,
  offset = 0,
): Promise<{ user: FetchLogsResponse["user"]; logs: CareLog[] }> {
  const params = new URLSearchParams({
    userId,
    limit: String(limit),
    offset: String(offset),
  });
  const response = await fetch(`${API_URL}/functions/v1/logs?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }
  const data: FetchLogsResponse = await response.json();
  return {
    user: data.user,
    logs: data.logs.map(mapApiLogToCareLog),
  };
}

// Audio log preview
export async function logsPreview(audioUri: string): Promise<{ summary: string }> {
  // Verify file exists before uploading
  const fileInfo = await FileSystem.getInfoAsync(audioUri);
  if (!fileInfo.exists) {
    throw new Error(`Audio file does not exist: ${audioUri}`);
  }

  // Use FileSystem.uploadAsync for proper file upload in React Native
  const uploadResult = await FileSystem.uploadAsync(
    `${API_URL}/functions/v1/logs-preview`,
    audioUri,
    {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "audio",
      mimeType: "audio/m4a",
      parameters: {},
    }
  );

    console.log('logsPreview ----- result', uploadResult)


  if (uploadResult.status !== 200) {
    throw new Error("Failed to preview log");
  }

  return JSON.parse(uploadResult.body);
}

// Log confirmation (save to DB)
export async function logsConfirm(data: {
  userId: number;
  caregiverId: number;
  content: string;
}): Promise<{ success: boolean; logId?: number }> {
  const response = await fetch(`${API_URL}/functions/v1/logs-confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to confirm log");
  }

  // Handle empty response or non-JSON response
  const text = await response.text();
  if (!text) {
    return { success: true };
  }

  try {
    return JSON.parse(text);
  } catch {
    // If response is not JSON but request succeeded, treat as success
    return { success: true };
  }
}

// SSE stream URL
export function getLogsStreamUrl(userId: string): string {
  return `${API_URL}/functions/v1/logs-stream?userId=${userId}`;
}

// Care plan API
interface ApiCarePlanItem {
  id: number;
  plan_uuid: string;
  user_id: number;
  title: string;
  goal: string;
  level: "warning" | "critical" | "normal";
  status: "pending" | "completed";
  tasks: Array<{ text: string }>;
  created_at: string;
}

interface ApiCarePlanResponse {
  items: ApiCarePlanItem[];
}

function mapApiLevelToAlertLevel(level: string): AlertLevel {
  switch (level) {
    case "critical":
      return "red";
    case "warning":
      return "yellow";
    default:
      return "none";
  }
}

export async function fetchCarePlan(userId: string): Promise<CarePlan | null> {
  try {
    const response = await fetch(
      `${API_URL}/functions/v1/care-plans?user_id=${userId}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch care plan");
    }
    const data: ApiCarePlanResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    // Use the first item's plan_uuid as the CarePlan uuid
    const planUuid = data.items[0].plan_uuid;

    console.log('fetchCarePlan ----- data', data)

    return {
      uuid: planUuid,
      summary: "", // API doesn't provide summary, leave empty
      goals: data.items.map((item) => ({
        id: item.id,
        uuid: item.plan_uuid,
        category: item.title,
        goal: item.goal,
        completed: item.status === "completed",
        completedDate: item.status === "completed" ? item.created_at : null,
        level: mapApiLevelToAlertLevel(item.level),
        actions: item.tasks || [],
      })),
      notes: "", // API doesn't provide notes, leave empty
    };
  } catch (err) {
    console.error("Failed to fetch care plan:", err);
    return null;
  }
}
