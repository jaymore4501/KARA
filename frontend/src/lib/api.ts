/**
 * KARA Frontend - API Client
 * Centralized HTTP client for backend communication.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
}

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, token } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }

    let errorMessage = "An unexpected error occurred";
    if (errorData?.detail) {
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        const firstError = errorData.detail[0];
        if (firstError) {
          errorMessage = typeof firstError === "string"
            ? firstError
            : (firstError.msg || JSON.stringify(firstError));
        }
      } else if (typeof errorData.detail === "object") {
        errorMessage = errorData.detail.message || JSON.stringify(errorData.detail);
      }
    }

    throw new ApiError(
      response.status,
      errorMessage,
      errorData
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ── Auth API ───────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  plan: string;
  credits: number;
  created_at: string;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient<TokenResponse>("/auth/register", { method: "POST", body: data }),

  login: (data: { email: string; password: string }) =>
    apiClient<TokenResponse>("/auth/login", { method: "POST", body: data }),

  refresh: (refresh_token: string) =>
    apiClient<TokenResponse>("/auth/refresh", { method: "POST", body: { refresh_token } }),

  getMe: (token: string) =>
    apiClient<UserResponse>("/auth/me", { token }),

  changePassword: (token: string, data: Record<string, string>) =>
    apiClient<{ message: string }>("/auth/change-password", { method: "POST", body: data, token }),
};

// ── Projects API ───────────────────────────────────────────

export interface ProjectResponse {
  id: string;
  name: string;
  idea: string;
  problem: string | null;
  target_users: string | null;
  country: string | null;
  budget: string | null;
  status: string;
  startup_score: number | null;
  total_tokens_used: number;
  total_agents_run: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface ProjectListResponse {
  projects: ProjectResponse[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateProjectData {
  name: string;
  idea: string;
  problem?: string;
  target_users?: string;
  country?: string;
  budget?: string;
}

export const projectsApi = {
  list: (token: string, page = 1, perPage = 10, status?: string) => {
    let url = `/projects/?page=${page}&per_page=${perPage}`;
    if (status) url += `&status=${status}`;
    return apiClient<ProjectListResponse>(url, { token });
  },

  create: (token: string, data: CreateProjectData) =>
    apiClient<ProjectResponse>("/projects/", { method: "POST", body: data, token }),

  get: (token: string, projectId: string) =>
    apiClient<ProjectResponse>(`/projects/${projectId}`, { token }),

  update: (token: string, projectId: string, data: Partial<CreateProjectData>) =>
    apiClient<ProjectResponse>(`/projects/${projectId}`, { method: "PATCH", body: data, token }),

  delete: (token: string, projectId: string) =>
    apiClient<void>(`/projects/${projectId}`, { method: "DELETE", token }),
};

export interface AnalyticsSummaryResponse {
  total_projects: number;
  total_tokens_used: number;
  total_agents_run: number;
  credits_remaining: number;
  plan_type: string;
}

export const analyticsApi = {
  getSummary: (token: string) =>
    apiClient<AnalyticsSummaryResponse>("/analytics/summary", { token }),
};

export interface DocumentResponse {
  id: string;
  title: string;
  doc_type: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export const documentsApi = {
  list: (token: string, projectId: string) =>
    apiClient<DocumentResponse[]>(`/documents/${projectId}`, { token }),
  
  upload: (token: string, projectId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/documents/upload/${projectId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    }).then(async (res) => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Upload failed");
      }
      return res.json();
    });
  }
};

export { ApiError };
export default apiClient;
