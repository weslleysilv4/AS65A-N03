import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  getPendingChanges,
} from "@/services/api";
import type { NewsItem, UpdateNewsRequest, PendingChange } from "@/types/api";

export const NEWS_QUERY_KEYS = {
  all: ["news"] as const,
  lists: () => [...NEWS_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...NEWS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...NEWS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...NEWS_QUERY_KEYS.details(), id] as const,
  pending: () => [...NEWS_QUERY_KEYS.all, "pending"] as const,
};

export const useNews = () => {
  return useQuery<NewsItem[], Error>({
    queryKey: NEWS_QUERY_KEYS.lists(),
    queryFn: getNews,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePendingChanges = () => {
  return useQuery<PendingChange[], Error>({
    queryKey: NEWS_QUERY_KEYS.pending(),
    queryFn: getPendingChanges,
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Erro ao criar notícia:", error);
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsRequest }) =>
      updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Erro ao atualizar notícia:", error);
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("Erro ao deletar notícia:", error);
    },
  });
};
