import { AxiosError } from "axios";
import { useCallback } from "react";
import type { ApiError } from "@/types/api";

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error) => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError;

      if (error.response?.status === 401) {
        return {
          title: "Erro de Autenticação",
          message:
            apiError?.message || "Sessão expirada. Faça login novamente.",
          type: "auth" as const,
        };
      }

      if (error.response?.status === 403) {
        return {
          title: "Acesso Negado",
          message:
            apiError?.message ||
            "Você não tem permissão para realizar esta ação.",
          type: "permission" as const,
        };
      }

      if (error.response?.status === 400) {
        return {
          title: "Erro de Validação",
          message: apiError?.message || "Dados inválidos enviados.",
          type: "validation" as const,
          details: apiError?.errors,
        };
      }

      if (error.response?.status === 404) {
        return {
          title: "Recurso não encontrado",
          message:
            apiError?.message || "O recurso solicitado não foi encontrado.",
          type: "not_found" as const,
        };
      }

      if (error.response?.status && error.response.status >= 500) {
        return {
          title: "Erro interno do servidor",
          message:
            apiError?.message ||
            "Ocorreu um erro interno. Tente novamente mais tarde.",
          type: "server" as const,
        };
      }

      if (error.request && !error.response) {
        return {
          title: "Erro de Conexão",
          message:
            "Não foi possível conectar ao servidor. Verifique sua conexão.",
          type: "network" as const,
        };
      }
    }

    return {
      title: "Erro Inesperado",
      message: error.message || "Ocorreu um erro inesperado.",
      type: "generic" as const,
    };
  }, []);

  return { handleError };
};

// Hook para exibir notificações de erro (pode ser integrado com toast libraries)
export const useErrorNotification = () => {
  const { handleError } = useErrorHandler();

  const showError = useCallback(
    (error: Error) => {
      const errorInfo = handleError(error);

      // Aqui você pode integrar com qualquer biblioteca de notificação
      // Por exemplo: react-hot-toast, react-toastify, etc.
      console.error(`${errorInfo.title}: ${errorInfo.message}`);

      // Para desenvolvimento, mostra um alert
      if (process.env.NODE_ENV === "development") {
        alert(`${errorInfo.title}: ${errorInfo.message}`);
      }

      return errorInfo;
    },
    [handleError]
  );

  return { showError };
};
