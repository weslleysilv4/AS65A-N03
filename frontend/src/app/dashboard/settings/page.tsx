"use client";

import { useAuthContext } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuthContext();

  if (user?.role !== "ADMIN") {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Acesso Negado</h3>
          <p className="text-red-600 text-sm mt-1">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Configure o sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
      </div>
    </div>
  );
}
