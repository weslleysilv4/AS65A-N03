import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/api";
import type { NewsCategory, UpdateCategoryRequest } from "@/types/api";

export const CATEGORY_QUERY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...CATEGORY_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...CATEGORY_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_QUERY_KEYS.details(), id] as const,
};

export const useCategories = () => {
  return useQuery<NewsCategory[], Error>({
    queryKey: CATEGORY_QUERY_KEYS.lists(),
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Erro ao atualizar categoria:", error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Erro ao deletar categoria:", error);
    },
  });
};
