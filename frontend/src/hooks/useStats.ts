import { useQuery } from "@tanstack/react-query";
import { getNewsStats, getCategoryStats } from "@/services/api";
import type { NewsStats, CategoryStats } from "@/types/api";

export const STATS_QUERY_KEYS = {
  all: ["stats"] as const,
  news: () => [...STATS_QUERY_KEYS.all, "news"] as const,
  categories: () => [...STATS_QUERY_KEYS.all, "categories"] as const,
};

export const useNewsStats = () => {
  return useQuery<NewsStats, Error>({
    queryKey: STATS_QUERY_KEYS.news(),
    queryFn: getNewsStats,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useCategoryStats = () => {
  return useQuery<CategoryStats, Error>({
    queryKey: STATS_QUERY_KEYS.categories(),
    queryFn: getCategoryStats,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
};
