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
  role?: 'ADMIN' | 'PUBLISHER';
  user_metadata?: {
    name?: string;
    role?: 'ADMIN' | 'PUBLISHER';
  };
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  refresh_token?: string;
  user: AuthUser;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}

export interface BackendAuthResponse {
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

export interface MediaItem {
  id: string;
  url: string;
  path: string;
  alt?: string;
  title?: string;
  description?: string;
  caption?: string;
  copyright?: string;
  type: 'IMAGE' | 'VIDEO' | 'EXTERNAL_LINK';
  order: number;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  text: string;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  revisorId?: string;
  imageUrl?: string;
  categoryIds?: string[];
  categories?: NewsCategory[];
  media?: MediaItem[];
  publishedAt?: string;
  expirationDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  published: boolean;
  tagsKeywords?: string[];
  viewCount?: number;
  revisionDate?: string;
  mainPageDisplayDate?: string;
  newsListPageDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  title: string;
  text: string;
  categoryIds?: string[];
  imageUrl?: string;
  publishedAt?: string;
  expirationDate?: string;
  tagsKeywords?: string[];
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: string;
}

export interface PendingChange {
  id: string;
  type: 'CREATE' | 'UPDATE';
  authorId: string;
  reviewerId?: string;
  newsId?: string;
  content: Record<string, unknown>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  author?: AuthUser;
  reviewer?: AuthUser;
  news?: NewsItem;
}

// Admin interfaces
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'PUBLISHER';
}

export interface UpdateUserRequest {
  name?: string;
  role?: 'ADMIN' | 'PUBLISHER';
}

export interface ApproveChangeRequest {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

// Publisher interfaces for pending changes
export interface CreateChangeRequest {
  type: 'CREATE';
  content: {
    title: string;
    text: string;
    categoryIds?: string[];
    tagsKeywords?: string[];
    publishedAt?: string;
    expirationDate?: string;
    media?: {
      url: string;
      path: string;
      alt?: string;
      title?: string;
      description?: string;
      caption?: string;
      copyright?: string;
      type: 'IMAGE' | 'VIDEO' | 'EXTERNAL_LINK';
      order: number;
    }[];
  };
}

export interface UpdateChangeRequest {
  type: 'UPDATE';
  newsId: string;
  content: {
    title?: string;
    text?: string;
    categoryIds?: string[];
    tagsKeywords?: string[];
    publishedAt?: string;
    expirationDate?: string;
    media?: {
      url: string;
      path: string;
      alt?: string;
      title?: string;
      description?: string;
      caption?: string;
      copyright?: string;
      type: 'IMAGE' | 'VIDEO' | 'EXTERNAL_LINK';
      order: number;
    }[];
  };
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
