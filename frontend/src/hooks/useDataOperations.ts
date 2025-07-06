import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exportNewsData, importNewsData } from "@/services/api";
import { NEWS_QUERY_KEYS } from "./useNews";

export const useExportData = () => {
  return useMutation({
    mutationFn: (format: "json" | "csv" = "json") => exportNewsData(format),
    onSuccess: (blob, format) => {
      // Criar URL para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `news_export.${format}`;
      document.body.appendChild(link);
      link.click();

      // Limpar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useImportData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importNewsData(file),
    onSuccess: () => {
      // Invalidar todas as consultas de notícias após importação
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.publisher() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.public() });
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.details() });
    },
  });
};
