"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ReactQueryProviderProps {
  children: ReactNode;
}

const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
  MAX_RETRIES: 3,
  MAX_MUTATION_RETRIES: 1,
} as const;

const shouldRetryOnError = (
  failureCount: number,
  error: unknown,
  maxRetries: number
): boolean => {
  const axiosError = error as { response?: { status?: number } };
  const statusCode = axiosError?.response?.status;

  if (statusCode && (statusCode === 401 || statusCode === 403)) {
    return false;
  }

  return failureCount < maxRetries;
};

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_CONFIG.STALE_TIME,
            gcTime: QUERY_CONFIG.GC_TIME,
            retry: (failureCount, error) =>
              shouldRetryOnError(failureCount, error, QUERY_CONFIG.MAX_RETRIES),
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            throwOnError: false,
          },
          mutations: {
            retry: (failureCount, error) =>
              shouldRetryOnError(
                failureCount,
                error,
                QUERY_CONFIG.MAX_MUTATION_RETRIES
              ),
            throwOnError: false,
            onError: (error) => {
              console.error("Mutation error:", error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
