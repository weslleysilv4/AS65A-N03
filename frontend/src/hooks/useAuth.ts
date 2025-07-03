import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login, register, logout } from "@/services/api";
import { useErrorNotification } from "./useErrorHandler";
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
      const token = data.user.session.access_token;
      
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        window.dispatchEvent(new CustomEvent('auth-login'));
        queryClient.invalidateQueries();
        router.push("/dashboard");
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
      router.push("/login");
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
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.dispatchEvent(new CustomEvent('auth-logout'));
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.clear();
      router.push("/login");
    },
    onError: (error) => {
      showError(error);
    },
  });
};

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
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

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-login", handleAuthLogin);
    window.addEventListener("auth-logout", handleAuthLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-login", handleAuthLogin);
      window.removeEventListener("auth-logout", handleAuthLogout);
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

    window.addEventListener("auth-logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth-logout", handleAuthLogout);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["auth", "status"],
    queryFn: () => {
      if (typeof window === "undefined") return null;

      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      return {
        isAuthenticated: !!token,
        token,
      };
    },
    enabled: isClient,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useAuthGuard = (redirectTo: string = "/login") => {
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

export const useAuthGuardQuery = (redirectTo: string = "/login") => {
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
