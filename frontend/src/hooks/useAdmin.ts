import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "@/services/api";
import { useErrorNotification } from "./useErrorHandler";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  AuthUser,
  ApiResponse,
} from "@/types/api";

export const ADMIN_QUERY_KEYS = {
  all: ["admin"] as const,
  users: () => [...ADMIN_QUERY_KEYS.all, "users"] as const,
  changes: () => [...ADMIN_QUERY_KEYS.all, "changes"] as const,
};

export const useAdminUsers = () => {
  return useQuery<AuthUser[], Error>({
    queryKey: ADMIN_QUERY_KEYS.users(),
    queryFn: getAdminUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  const { showError } = useErrorNotification();

  return useMutation<ApiResponse<AuthUser>, Error, CreateUserRequest>({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users() });
    },
    onError: (error) => {
      showError(error);
      console.error("Erro ao criar usuário:", error);
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  const { showError } = useErrorNotification();

  return useMutation<
    ApiResponse<AuthUser>,
    Error,
    { userId: string; data: UpdateUserRequest }
  >({
    mutationFn: ({ userId, data }) => updateAdminUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users() });
    },
    onError: (error) => {
      showError(error);
      console.error("Erro ao atualizar usuário:", error);
    },
  });
};
