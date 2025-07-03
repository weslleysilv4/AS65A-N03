export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  errorCode?: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: "ADM" | "PUBLISHER";
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface AuthResponse {
  user: {
    user: AuthUser;
    session: AuthSession;
  };
}

export interface NewsCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  text: string;
  authorId: string;
  categoryIds: string[];
  categories?: NewsCategory[];
  imageUrl?: string;
  scheduledFor?: string;
  expiresAt?: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  title: string;
  text: string;
  categoryIds: string[];
  imageUrl?: string;
  scheduledFor?: string;
  expiresAt?: string;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: string;
}

export interface PendingChange {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  authorId: string;
  newsId?: string;
  content: Record<string, unknown>;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export interface NewsStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  scheduledNews: number;
  expiredNews: number;
}

export interface CategoryStats {
  totalCategories: number;
  newsPerCategory: Record<string, number>;
}

export interface ApiError {
  message: string;
  errorCode?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
