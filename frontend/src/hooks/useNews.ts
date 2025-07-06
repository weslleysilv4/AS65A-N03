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

const QUERY_CONFIG = {
  STALE_TIME: {
    SHORT: 1 * 60 * 1000,
    MEDIUM: 2 * 60 * 1000,
    LONG: 5 * 60 * 1000,
  },
  RETRY_COUNT: 1,
} as const;

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

export const usePublicNews = (params?: {
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery<NewsItem[], Error>({
    queryKey: [...NEWS_QUERY_KEYS.public(), params],
    queryFn: () => getPublicNews(params),
    staleTime: QUERY_CONFIG.STALE_TIME.MEDIUM,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};

export const usePublicNewsById = (id: string) => {
  return useQuery<NewsItem, Error>({
    queryKey: NEWS_QUERY_KEYS.detail(id),
    queryFn: () => getPublicNewsById(id),
    staleTime: QUERY_CONFIG.STALE_TIME.LONG,
    retry: QUERY_CONFIG.RETRY_COUNT,
    enabled: !!id,
  });
};

export const useNewsById = (id: string) => {
  return useQuery<NewsItem, Error>({
    queryKey: NEWS_QUERY_KEYS.detail(id),
    queryFn: () => getPublicNewsById(id),
    staleTime: QUERY_CONFIG.STALE_TIME.LONG,
    retry: QUERY_CONFIG.RETRY_COUNT,
    enabled: !!id,
  });
};

export const useNews = () => {
  return useQuery<NewsItem[], Error>({
    queryKey: NEWS_QUERY_KEYS.publisher(),
    queryFn: getPublisherNews,
    staleTime: QUERY_CONFIG.STALE_TIME.MEDIUM,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};

export const usePendingChanges = () => {
  return useQuery<PendingChange[], Error>({
    queryKey: NEWS_QUERY_KEYS.pending(),
    queryFn: getPublisherPendingChanges,
    staleTime: QUERY_CONFIG.STALE_TIME.SHORT,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};

export const useCreatePendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPendingChange,
    onSuccess: () => {
      // Invalidar consultas relacionadas a mudanças pendentes
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.pending() });
      queryClient.invalidateQueries({ queryKey: [...NEWS_QUERY_KEYS.pending(), "admin"] });
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

export const useAdminNews = () => {
  return useQuery<NewsItem[], Error>({
    queryKey: NEWS_QUERY_KEYS.admin(),
    queryFn: getAdminNews,
    staleTime: QUERY_CONFIG.STALE_TIME.MEDIUM,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};

export const useAdminPendingChanges = () => {
  return useQuery<PendingChange[], Error>({
    queryKey: [...NEWS_QUERY_KEYS.pending(), "admin"],
    queryFn: getAdminPendingChanges,
    staleTime: QUERY_CONFIG.STALE_TIME.SHORT,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};

export const useUpdateAdminNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsItem> }) =>
      updateAdminNews(id, data),
    onSuccess: () => {
      // Invalidar todas as consultas relacionadas
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.public() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.details() });
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
      // Invalidar todas as consultas relacionadas
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.public() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.details() });
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
      // Invalidar todas as consultas relacionadas
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.public() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.details() });
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
      // Invalidar todas as consultas relacionadas a notícias
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.pending() });
      queryClient.invalidateQueries({ queryKey: [...NEWS_QUERY_KEYS.pending(), "admin"] });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.public() });
      // Invalidar também as queries de detalhes
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.details() });
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
      // Invalidar todas as consultas relacionadas a notícias pendentes
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.pending() });
      queryClient.invalidateQueries({ queryKey: [...NEWS_QUERY_KEYS.pending(), "admin"] });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      toast.success("Mudança rejeitada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao rejeitar mudança:", error);
      toast.error("Erro ao rejeitar mudança. Tente novamente.");
    },
  });
};
