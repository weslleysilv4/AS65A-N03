/**
 * Componente de teste para verificar upload de imagens
 * Para usar: importe e adicione em qualquer página para testar
 */
"use client";

import { useState } from 'react';
import { uploadFileAdmin } from '@/lib/supabaseStorageAdmin';

export default function SupabaseUploadTest() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      const url = await uploadFileAdmin(file, 'news-media', 'test-uploads');
      setUploadedUrl(url);
      console.log('Upload successful:', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-bold text-yellow-800 mb-4">
        🧪 Teste de Upload - Supabase
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione uma imagem para testar:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {uploading && (
          <div className="flex items-center text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Fazendo upload...
          </div>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {uploadedUrl && (
          <div className="text-green-600 bg-green-50 p-3 rounded border border-green-200">
            <strong>✅ Upload realizado com sucesso!</strong>
            <br />
            <a 
              href={uploadedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {uploadedUrl}
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Nota:</strong> Este componente é apenas para teste.</p>
        <p>Remova-o após confirmar que o upload está funcionando.</p>
      </div>
    </div>
  );
}
