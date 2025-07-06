"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { usePendingChanges } from "@/hooks/useNews";
import Loading from "@/components/Loading";

export default function PendingPage() {
  const { user } = useAuthContext();
  const { data: pendingChanges, isLoading } = usePendingChanges();

  if (user?.role !== "PUBLISHER") {
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
        <h1 className="text-2xl font-bold text-gray-900">Mudanças Pendentes</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe o status das suas solicitações de mudança
        </p>
      </div>

      {isLoading ? (
        <Loading message="Carregando solicitações pendentes..." />
      ) : pendingChanges && pendingChanges.length > 0 ? (
        <div className="space-y-4">
          {pendingChanges.map((change) => (
            <div
              key={change.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {change.type === "CREATE"
                      ? "Nova Notícia"
                      : "Atualização de Notícia"}
                  </h3>
                  {change.news && (
                    <p className="text-sm text-gray-600 mt-1">
                      Notícia: {change.news.title}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    change.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : change.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {change.status}
                </span>
              </div>

              {change.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    <strong>Motivo da rejeição:</strong>{" "}
                    {change.rejectionReason}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  Tipo: {change.type}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(change.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Nenhuma mudança pendente.</p>
        </div>
      )}
    </div>
  );
}
