import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login, register, logout } from "@/services/api";
import { useErrorNotification } from "./useErrorHandler";
import {
  getTokenFromCookie,
  setTokenInCookie,
  removeTokenFromCookie,
} from "@/utils/auth";
import { ROUTES, EVENTS, QUERY_CONFIG } from "@/utils/constants";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from "@/types/api";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showError } = useErrorNotification();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      try {
        const token = data.session?.access_token;
        const user = data.user;

        if (token && user) {
          setTokenInCookie(token);

          // Dispatch custom event with user data
          const authEvent = new CustomEvent(EVENTS.AUTH_LOGIN, {
            detail: { user, token },
          });
          window.dispatchEvent(authEvent);

          // Invalidate all queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["auth"] });

          // Use setTimeout to avoid issues with router.push during render
          setTimeout(() => {
            router.push(ROUTES.DASHBOARD);
          }, 0);
        }
      } catch (error) {
        console.error("Error in login success callback:", error);
        showError(error as Error);
      }
    },
    onError: (error) => {
      showError(error);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const { showError } = useErrorNotification();

  return useMutation<ApiResponse, Error, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => {
      showError(error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showError } = useErrorNotification();

  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      try {
        removeTokenFromCookie();
        window.dispatchEvent(new CustomEvent(EVENTS.AUTH_LOGOUT));
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        queryClient.clear();

        // Use setTimeout to avoid issues with router.push during render
        setTimeout(() => {
          router.push(ROUTES.LOGIN);
        }, 0);
      } catch (error) {
        console.error("Error in logout success callback:", error);
        showError(error as Error);
      }
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Utility functions
// (Removed duplicate - using imported version from utils/auth.ts)

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkAuth = () => {
      const token = getTokenFromCookie();
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    const handleAuthLogin = () => {
      checkAuth();
    };

    const handleAuthLogout = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener(EVENTS.STORAGE, handleStorageChange);
    window.addEventListener(EVENTS.AUTH_LOGIN, handleAuthLogin);
    window.addEventListener(EVENTS.AUTH_LOGOUT, handleAuthLogout);

    return () => {
      window.removeEventListener(EVENTS.STORAGE, handleStorageChange);
      window.removeEventListener(EVENTS.AUTH_LOGIN, handleAuthLogin);
      window.removeEventListener(EVENTS.AUTH_LOGOUT, handleAuthLogout);
    };
  }, []);

  return {
    isAuthenticated,
    isLoading,
    isClient,
  };
};

export const useAuth = () => {
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsClient(true);

    const handleAuthLogout = () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    };

    window.addEventListener(EVENTS.AUTH_LOGOUT, handleAuthLogout);

    return () => {
      window.removeEventListener(EVENTS.AUTH_LOGOUT, handleAuthLogout);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["auth", "status"],
    queryFn: () => {
      if (typeof window === "undefined") return null;

      const token = getTokenFromCookie();

      return {
        isAuthenticated: !!token,
        token,
      };
    },
    enabled: isClient,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useAuthGuard = (redirectTo: string = ROUTES.LOGIN) => {
  const { isAuthenticated, isLoading, isClient } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isClient, isLoading, isAuthenticated, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    isClient,
  };
};

export const useAuthGuardQuery = (redirectTo: string = ROUTES.LOGIN) => {
  const { data, isLoading, isError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!data?.isAuthenticated || isError)) {
      router.push(redirectTo);
    }
  }, [data?.isAuthenticated, isLoading, isError, router, redirectTo]);

  return {
    isAuthenticated: data?.isAuthenticated ?? false,
    isLoading,
    isClient: !isLoading,
  };
};
