/**
 * Application constants
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  TIMEOUT: 10000,
} as const;

export const AUTH_CONFIG = {
  COOKIE_NAME: "token",
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
} as const;

export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
  MAX_RETRIES: 3,
  MAX_MUTATION_RETRIES: 1,
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
} as const;

export const EVENTS = {
  AUTH_LOGIN: "auth-login",
  AUTH_LOGOUT: "auth-logout",
  STORAGE: "storage",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  PUBLISHER: "PUBLISHER",
  USER: "USER",
} as const;

export const NEWS_STATUS = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
