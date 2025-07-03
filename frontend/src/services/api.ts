import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  NewsItem,
  NewsCategory,
  CreateNewsRequest,
  UpdateNewsRequest,
  PendingChange,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  NewsStats,
  CategoryStats,
} from "@/types/api";

const API_BASE_URL = "http://localhost:3000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        window.dispatchEvent(new CustomEvent("auth-logout"));

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      if (error.response?.status === 403) {
        console.error("Acesso negado. Você não tem permissão para esta ação.");
      }
    }

    return Promise.reject(error);
  }
);

export const get = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

export const post = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

export const put = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

export const patch = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.patch<T>(url, data, config);
  return response.data;
};

export const del = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};

export const login = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  return post<AuthResponse>("/auth/login", credentials);
};

export const register = async (
  userData: RegisterRequest
): Promise<ApiResponse> => {
  return post<ApiResponse>("/auth/register", userData);
};

export const logout = async (): Promise<void> => {
  removeAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// ============ NEWS OPERATIONS ============

export const getNews = async (): Promise<NewsItem[]> => {
  const response = await get<{ data: NewsItem[] }>("/publisher/news");
  return response.data;
};

export const createNews = async (
  newsData: CreateNewsRequest
): Promise<ApiResponse<NewsItem>> => {
  return post<ApiResponse<NewsItem>>("/publisher/changes", newsData);
};

export const updateNews = async (
  id: string,
  newsData: UpdateNewsRequest
): Promise<ApiResponse<NewsItem>> => {
  return put<ApiResponse<NewsItem>>(`/publisher/changes/${id}`, newsData);
};

export const deleteNews = async (id: string): Promise<ApiResponse> => {
  return del<ApiResponse>(`/publisher/changes/${id}`);
};

export const getPendingChanges = async (): Promise<PendingChange[]> => {
  const response = await get<{ data: PendingChange[] }>("/publisher/changes");
  return response.data;
};

// ============ CATEGORY OPERATIONS ============

export const getCategories = async (): Promise<NewsCategory[]> => {
  const response = await get<{ data: NewsCategory[] }>("/categories");
  return response.data;
};

export const createCategory = async (
  categoryData: CreateCategoryRequest
): Promise<ApiResponse<NewsCategory>> => {
  return post<ApiResponse<NewsCategory>>("/categories", categoryData);
};

export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryRequest
): Promise<ApiResponse<NewsCategory>> => {
  return put<ApiResponse<NewsCategory>>(`/categories/${id}`, categoryData);
};

export const deleteCategory = async (id: string): Promise<ApiResponse> => {
  return del<ApiResponse>(`/categories/${id}`);
};

// ============ STATS OPERATIONS ============

export const getNewsStats = async (): Promise<NewsStats> => {
  const response = await get<{ data: NewsStats }>("/stats/news");
  return response.data;
};

export const getCategoryStats = async (): Promise<CategoryStats> => {
  const response = await get<{ data: CategoryStats }>("/stats/categories");
  return response.data;
};

export default api;
