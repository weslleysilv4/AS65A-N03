"use client";

import { useAuthGuard } from "@/hooks/useAuth";
import Loading from "@/components/Loading";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, isClient } = useAuthGuard();

  if (!isClient || isLoading) {
    return <Loading message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Painel Administrativo!
        </h1>
        <p className="text-gray-600">
          Você está autenticado e pode acessar todas as funcionalidades.
        </p>
      </div>
    </div>
  );
}
