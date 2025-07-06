"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useExportData, useImportData } from "@/hooks/useDataOperations";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Database,
  Settings as SettingsIcon,
  FileDown,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{
    totalRows: number;
    successfulImports: number;
    failedImports: number;
    errors: Array<{ row: number; errors: Record<string, string[]> }>;
  } | null>(null);

  const exportData = useExportData();
  const importData = useImportData();
  const { showSuccess, showError } = useErrorNotification();

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

  const handleExport = (format: "json" | "csv") => {
    exportData.mutate(format, {
      onSuccess: () => {
        showSuccess(
          `Dados exportados com sucesso em formato ${format.toUpperCase()}!`
        );
      },
      onError: (error) => {
        showError(error as Error);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResults(null);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      showError(new Error("Por favor, selecione um arquivo para importar."));
      return;
    }

    importData.mutate(selectedFile, {
      onSuccess: (result) => {
        setImportResults(result.report);
        showSuccess(
          `Importação concluída! ${result.report.successfulImports} de ${result.report.totalRows} registros importados com sucesso.`
        );
        setSelectedFile(null);
        // Reset input
        const input = document.getElementById(
          "import-file"
        ) as HTMLInputElement;
        if (input) input.value = "";
      },
      onError: (error) => {
        showError(error as Error);
      },
    });
  };

  const clearResults = () => {
    setImportResults(null);
  };

  const downloadTemplate = () => {
    // Criar template CSV com estrutura esperada
    const templateData = [
      {
        title: "Título da Notícia (obrigatório)",
        text: "Conteúdo da notícia (obrigatório)",
        tagsKeywords: "tecnologia,inovação,exemplo (separadas por vírgula)",
        categoryIds:
          "uuid-categoria-1,uuid-categoria-2 (separados por vírgula)",
        expirationDate: "2025-12-31T23:59 (formato YYYY-MM-DDTHH:mm ou vazio)",
        publishedAt: "2025-01-01T10:00 (formato YYYY-MM-DDTHH:mm ou vazio)",
      },
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(templateData[0]).join(",") +
      "\n" +
      templateData.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_importacao_noticias.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess("Template CSV baixado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Configurações do Sistema
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie dados e configurações da plataforma
        </p>
      </div>

      {/* Exportação de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Exportação de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Exporte todos os dados das notícias da plataforma em formato JSON
              ou CSV.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => handleExport("json")}
                disabled={exportData.isPending}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {exportData.isPending ? "Exportando..." : "Exportar JSON"}
              </Button>

              <Button
                onClick={() => handleExport("csv")}
                disabled={exportData.isPending}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {exportData.isPending ? "Exportando..." : "Exportar CSV"}
              </Button>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                O arquivo exportado conterá todas as notícias com seus
                metadados, incluindo autor, revisor, categorias e mídias.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Importação de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            Importação de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Importe notícias de um arquivo CSV. As notícias importadas serão
              criadas como solicitações pendentes.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="import-file">Selecionar arquivo CSV</Label>
                <Button
                  onClick={downloadTemplate}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <FileDown className="w-4 h-4" />
                  Baixar Template
                </Button>
              </div>
              <Input
                id="import-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />

              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{selectedFile.name}</span>
                  <Badge variant="secondary">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              )}
            </div>

            <Button
              onClick={handleImport}
              disabled={!selectedFile || importData.isPending}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {importData.isPending ? "Importando..." : "Importar Dados"}
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> O arquivo CSV deve seguir o formato
                específico. As notícias importadas passarão pelo processo de
                aprovação normal.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Importação */}
      {importResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Resultados da Importação
              <Button
                onClick={clearResults}
                variant="ghost"
                size="sm"
                className="ml-auto"
              >
                <XCircle className="w-4 h-4" />
                Limpar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Total de Linhas</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {importResults.totalRows}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Importados</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {importResults.successfulImports}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Falhas</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {importResults.failedImports}
                  </p>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    Erros Encontrados:
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-800 mb-2">
                        <strong>Linha {error.row}:</strong>{" "}
                        {Object.entries(error.errors).map(
                          ([field, messages]) => (
                            <span key={field}>
                              {field}:{" "}
                              {Array.isArray(messages)
                                ? messages.join(", ")
                                : messages}
                            </span>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Versão:</strong> 1.0.0
            </p>
            <p>
              <strong>Última atualização:</strong>{" "}
              {new Date().toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Administrador:</strong> {user?.name || user?.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
