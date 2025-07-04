import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getPublicNews,
  getPublicNewsById,
  getPublisherNews,
  getPublisherPendingChanges,
  createPendingChange,
  updatePendingChange,
  getAdminNews,
  updateAdminNews,
  deleteNews,
  archiveNews,
  getAdminPendingChanges,
  approveChange,
  rejectChange,
} from "@/services/api";
import type {
  NewsItem,
  PendingChange,
  UpdateChangeRequest,
  ApproveChangeRequest,
} from "@/types/api";

export const NEWS_QUERY_KEYS = {
  all: ["news"] as const,
  lists: () => [...NEWS_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...NEWS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...NEWS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...NEWS_QUERY_KEYS.details(), id] as const,
  pending: () => [...NEWS_QUERY_KEYS.all, "pending"] as const,
  publisher: () => [...NEWS_QUERY_KEYS.all, "publisher"] as const,
  admin: () => [...NEWS_QUERY_KEYS.all, "admin"] as const,
  public: () => [...NEWS_QUERY_KEYS.all, "public"] as const,
};

// Public news hooks
export const usePublicNews = (params?: {
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery<NewsItem[], Error>({
    queryKey: [...NEWS_QUERY_KEYS.public(), params],
    queryFn: () => getPublicNews(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

export const usePublicNewsById = (id: string) => {
  return useQuery<NewsItem, Error>({
    queryKey: NEWS_QUERY_KEYS.detail(id),
    queryFn: () => getPublicNewsById(id),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!id,
  });
};

export const useNewsById = (id: string) => {
  return useQuery<NewsItem, Error>({
    queryKey: NEWS_QUERY_KEYS.detail(id),
    queryFn: () => getPublicNewsById(id),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!id,
  });
};

// Publisher hooks
export const useNews = () => {
  return useQuery<NewsItem[], Error>({
    queryKey: NEWS_QUERY_KEYS.publisher(),
    queryFn: getPublisherNews,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

export const usePendingChanges = () => {
  return useQuery<PendingChange[], Error>({
    queryKey: NEWS_QUERY_KEYS.pending(),
    queryFn: getPublisherPendingChanges,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
};

export const useCreatePendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPendingChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.pending() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      toast.success("Solicitação de mudança criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar solicitação de mudança:", error);
      toast.error("Erro ao criar solicitação de mudança. Tente novamente.");
    },
  });
};

export const useUpdatePendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChangeRequest }) =>
      updatePendingChange(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.pending() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
    },
    onError: (error) => {
      console.error("Erro ao atualizar solicitação de mudança:", error);
    },
  });
};

// Admin hooks
export const useAdminNews = () => {
  return useQuery<NewsItem[], Error>({
    queryKey: NEWS_QUERY_KEYS.admin(),
    queryFn: getAdminNews,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

export const useAdminPendingChanges = () => {
  return useQuery<PendingChange[], Error>({
    queryKey: [...NEWS_QUERY_KEYS.pending(), "admin"],
    queryFn: getAdminPendingChanges,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
};

export const useUpdateAdminNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsItem> }) =>
      updateAdminNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      toast.success("Notícia atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar notícia (admin):", error);
      toast.error("Erro ao atualizar notícia. Tente novamente.");
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      toast.success("Notícia excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir notícia:", error);
      toast.error("Erro ao excluir notícia. Tente novamente.");
    },
  });
};

export const useArchiveNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      toast.success("Notícia arquivada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao arquivar notícia:", error);
      toast.error("Erro ao arquivar notícia. Tente novamente.");
    },
  });
};

export const useApproveChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveChangeRequest }) =>
      approveChange(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.pending() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      toast.success("Mudança aprovada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao aprovar mudança:", error);
      toast.error("Erro ao aprovar mudança. Tente novamente.");
    },
  });
};

export const useRejectChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveChangeRequest }) =>
      rejectChange(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.pending() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      toast.success("Mudança rejeitada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao rejeitar mudança:", error);
      toast.error("Erro ao rejeitar mudança. Tente novamente.");
    },
  });
};
