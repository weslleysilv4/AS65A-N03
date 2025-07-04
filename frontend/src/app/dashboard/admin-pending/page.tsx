"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import AdminPendingChanges from "@/components/admin/AdminPendingChanges";

export default function AdminPendingPage() {
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
      <AdminPendingChanges />
    </div>
  );
}
