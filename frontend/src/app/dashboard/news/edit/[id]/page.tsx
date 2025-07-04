"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditNewsForm from "@/components/publisher/EditNewsForm";

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Notícia</h1>
        </div>
      </div>

      <EditNewsForm newsId={newsId} />
    </div>
  );
}
