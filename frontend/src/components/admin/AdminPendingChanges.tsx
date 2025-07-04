import { useState } from "react";
import {
  useAdminPendingChanges,
  useApproveChange,
  useRejectChange,
} from "@/hooks/useNews";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { Check, X, Clock, FileText } from "lucide-react";

export default function AdminPendingChanges() {
  const { data: pendingChanges, isLoading } = useAdminPendingChanges();
  const approveChange = useApproveChange();
  const rejectChange = useRejectChange();
  const { showError } = useErrorNotification();
  const [rejectionReason, setRejectionReason] = useState<
    Record<string, string>
  >({});

  const handleApprove = (id: string) => {
    approveChange.mutate({
      id,
      data: { status: "APPROVED" },
    });
  };

  const handleReject = (id: string) => {
    const reason = rejectionReason[id];
    if (!reason) {
      showError(new Error("Por favor, forneça um motivo para a rejeição."));
      return;
    }

    rejectChange.mutate({
      id,
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  };

  const setReasonForChange = (id: string, reason: string) => {
    setRejectionReason((prev) => ({
      ...prev,
      [id]: reason,
    }));
  };

  if (isLoading) {
    return <Loading message="Carregando mudanças pendentes..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aprovar Mudanças</h1>
          <p className="text-gray-600 mt-1">
            Analise e aprove mudanças solicitadas pelos publishers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          <span className="text-sm text-gray-600">
            {pendingChanges?.length || 0} pendente(s)
          </span>
        </div>
      </div>

      {!pendingChanges || pendingChanges.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <p className="text-gray-500">Nenhuma mudança pendente para revisão</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingChanges.map((change) => (
            <div
              key={change.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {change.type === "CREATE"
                        ? "Nova Notícia"
                        : "Atualização de Notícia"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Por {change.author?.name || "Usuário"} •{" "}
                      {new Date(change.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                  {change.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <strong className="text-sm text-gray-600">Título:</strong>
                  <p className="text-gray-900">
                    {(change.content as { title?: string })?.title ||
                      "Sem título"}
                  </p>
                </div>
                <div>
                  <strong className="text-sm text-gray-600">Conteúdo:</strong>
                  <p className="text-gray-700 line-clamp-3">
                    {(change.content as { text?: string })?.text ||
                      "Sem conteúdo"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  placeholder="Motivo da rejeição (obrigatório para rejeitar)"
                  value={rejectionReason[change.id] || ""}
                  onChange={(e) =>
                    setReasonForChange(change.id, e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={2}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(change.id)}
                    disabled={approveChange.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>

                  <Button
                    onClick={() => handleReject(change.id)}
                    disabled={rejectChange.isPending}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
