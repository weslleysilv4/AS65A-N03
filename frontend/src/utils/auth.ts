import { AUTH_CONFIG } from "./constants";

/**
 * Authentication utilities
 */

/**
 * Get authentication token from cookies
 * @returns Token string or null if not found
 */
export const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AUTH_CONFIG.COOKIE_NAME}=`))
      ?.split("=")[1] || null
  );
};

/**
 * Set authentication token in cookies
 * @param token - The token to store
 */
export const setTokenInCookie = (token: string): void => {
  document.cookie = `${AUTH_CONFIG.COOKIE_NAME}=${token}; path=/; max-age=${AUTH_CONFIG.COOKIE_MAX_AGE}; SameSite=Lax`;
};

/**
 * Remove authentication token from cookies
 */
export const removeTokenFromCookie = (): void => {
  document.cookie = `${AUTH_CONFIG.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {
  return !!getTokenFromCookie();
};

/**
 * Decode JWT token payload
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeJWTPayload = (
  token: string
): Record<string, unknown> | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns Boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWTPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};
