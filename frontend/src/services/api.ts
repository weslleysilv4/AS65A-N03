import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import type {
  ApiResponse,
  BackendAuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  NewsItem,
  NewsCategory,
  PendingChange,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  NewsStats,
  CategoryStats,
  CreateChangeRequest,
  UpdateChangeRequest,
  ApproveChangeRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/types/api';

const API_BASE_URL = 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

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
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        document.cookie =
          'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.dispatchEvent(new CustomEvent('auth-logout'));

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      if (error.response?.status === 403) {
        console.error('Acesso negado. Você não tem permissão para esta ação.');
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
  if (typeof window !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; SameSite=Lax`;
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    return !!token;
  }
  return false;
};

export const login = async (
  credentials: LoginRequest
): Promise<BackendAuthResponse> => {
  const response = await post<BackendAuthResponse>('/auth/login', credentials);
  return response;
};

export const register = async (
  userData: RegisterRequest
): Promise<ApiResponse> => {
  return post<ApiResponse>('/auth/register', userData);
};

export const logout = async (): Promise<void> => {
  try {
    await post('/auth/logout');
  } catch (error) {
    console.warn('Erro ao fazer logout no servidor:', error);
  } finally {
    removeAuthToken();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-logout'));
      window.location.href = '/login';
    }
  }
};

// ============ NEWS OPERATIONS ============

// Public news endpoints
export const getPublicNews = async (params?: {
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<NewsItem[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const url = `/news${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    const response = await get<{
      data: { news: NewsItem[]; pagination: number };
    }>(url);
    return Array.isArray(response.data.news) ? response.data.news : [];
  } catch (error) {
    console.error('Erro ao buscar notícias públicas:', error);
    return [];
  }
};

export const getPublicNewsById = async (id: string): Promise<NewsItem> => {
  const response = await get<{ data: NewsItem }>(`/news/${id}`);
  return response.data;
};

// Registra a visualização de uma notícia publicada
export const registerNewsView = async (id: string): Promise<void> => {
  await post<void>(`/news/${id}/view`);
};

// Publisher news endpoints
export const getPublisherNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await get<{ data: NewsItem[] }>('/publisher/news');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao buscar notícias do publisher:', error);
    return [];
  }
};

export const getPublisherPendingChanges = async (): Promise<
  PendingChange[]
> => {
  try {
    const response = await get<{ data: PendingChange[] }>('/publisher/changes');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao buscar mudanças pendentes do publisher:', error);
    return [];
  }
};

export const createPendingChange = async (
  changeData: CreateChangeRequest
): Promise<ApiResponse<PendingChange>> => {
  return post<ApiResponse<PendingChange>>('/publisher/changes', changeData);
};

export const updatePendingChange = async (
  id: string,
  changeData: UpdateChangeRequest
): Promise<ApiResponse<PendingChange>> => {
  return put<ApiResponse<PendingChange>>(
    `/publisher/changes/${id}`,
    changeData
  );
};

export const getAdminNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await get<{
      data: {
        news: NewsItem[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>('/admin/news');

    // Garantir que sempre retorna um array
    return Array.isArray(response.data.news) ? response.data.news : [];
  } catch (error) {
    console.error('Erro ao buscar notícias admin:', error);
    return [];
  }
};

export const updateAdminNews = async (
  id: string,
  newsData: Partial<NewsItem>
): Promise<ApiResponse<NewsItem>> => {
  return put<ApiResponse<NewsItem>>(`/admin/news/${id}`, newsData);
};

export const deleteNews = async (id: string): Promise<ApiResponse> => {
  return updateAdminNews(id, { status: 'ARCHIVED' });
};

export const archiveNews = async (
  id: string
): Promise<ApiResponse<NewsItem>> => {
  return updateAdminNews(id, { status: 'ARCHIVED', published: false });
};

export const getAdminPendingChanges = async (): Promise<PendingChange[]> => {
  try {
    const response = await get<{ data: PendingChange[] }>(
      '/admin/changes/pending'
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao buscar mudanças pendentes:', error);
    return [];
  }
};

export const approveChange = async (
  id: string,
  data: ApproveChangeRequest
): Promise<ApiResponse<PendingChange>> => {
  return post<ApiResponse<PendingChange>>(`/admin/changes/${id}/approve`, data);
};

export const rejectChange = async (
  id: string,
  data: ApproveChangeRequest
): Promise<ApiResponse<PendingChange>> => {
  return post<ApiResponse<PendingChange>>(`/admin/changes/${id}/reject`, data);
};

export const createAdminUser = async (
  userData: CreateUserRequest
): Promise<ApiResponse<AuthUser>> => {
  return post<ApiResponse<AuthUser>>('/admin/users', userData);
};

export const getAdminUsers = async (): Promise<AuthUser[]> => {
  const response = await get<{ users: AuthUser[] }>('/admin/users');
  return response.users;
};

export const updateAdminUser = async (
  userId: string,
  userData: UpdateUserRequest
): Promise<ApiResponse<AuthUser>> => {
  return put<ApiResponse<AuthUser>>(`/admin/users/${userId}`, userData);
};

// ============ CATEGORY OPERATIONS ============

export const getCategories = async (): Promise<NewsCategory[]> => {
  const response = await get<{ categories: NewsCategory[] }>('/categories');
  return response.categories;
};

export const createCategory = async (
  categoryData: CreateCategoryRequest
): Promise<ApiResponse<NewsCategory>> => {
  return post<ApiResponse<NewsCategory>>('/categories', categoryData);
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
  const response = await get<{ data: NewsStats }>('/stats/news');
  return response.data;
};

export const getCategoryStats = async (): Promise<CategoryStats> => {
  const response = await get<{ data: CategoryStats }>('/stats/categories');
  return response.data;
};

export default api;
