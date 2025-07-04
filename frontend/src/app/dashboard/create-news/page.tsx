"use client";

import CreateNewsForm from "@/components/publisher/CreateNewsForm";

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nova Notícia</h1>
        <p className="text-gray-600 mt-1">
          Crie uma nova notícia para publicação
        </p>
      </div>

      <CreateNewsForm />
    </div>
  );
}
