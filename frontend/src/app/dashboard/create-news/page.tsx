"use client";

import CreateNewsForm from "@/components/publisher/CreateNewsForm";
import { Plus } from "lucide-react";

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Nova Notícia</h1>
              <p className="text-lg text-gray-600">
                Crie uma nova notícia para publicação
              </p>
            </div>
          </div>
        </div>
      </div>
      <CreateNewsForm />
    </div>
  );
}
