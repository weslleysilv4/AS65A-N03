"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUpdatePendingChange, useNewsById } from "@/hooks/useNews";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CategorySelector from "@/components/ui/CategorySelector";
import { ArrowLeft, Save, Calendar, Clock, Tag, X } from "lucide-react";
import type { UpdateChangeRequest } from "@/types/api";

interface EditNewsFormProps {
  newsId: string;
}

export default function EditNewsForm({ newsId }: EditNewsFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useErrorNotification();
  const { data: newsItem, isLoading, error } = useNewsById(newsId);
  const updateChange = useUpdatePendingChange();

  const [formData, setFormData] = useState({
    title: "",
    text: "",
    categoryIds: [] as string[],
    tagsKeywords: [] as string[],
    publishedAt: "",
    expirationDate: "",
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || "",
        text: newsItem.text || "",
        categoryIds:
          newsItem.categories?.map((cat: { id: string }) => cat.id) || [],
        tagsKeywords: newsItem.tagsKeywords || [],
        publishedAt: newsItem.publishedAt
          ? formatDateTimeForInput(newsItem.publishedAt)
          : "",
        expirationDate: newsItem.expirationDate
          ? formatDateTimeForInput(newsItem.expirationDate)
          : "",
      });
    }
  }, [newsItem]);

  const formatDateTimeForInput = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const updateFormField = (
    field: keyof typeof formData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tagsKeywords.includes(trimmedTag)) {
      updateFormField("tagsKeywords", [...formData.tagsKeywords, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    updateFormField(
      "tagsKeywords",
      formData.tagsKeywords.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateRequest: UpdateChangeRequest = {
      type: "UPDATE",
      newsId: newsId,
      content: {
        title: formData.title,
        text: formData.text,
        categoryIds:
          formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
        tagsKeywords:
          formData.tagsKeywords.length > 0 ? formData.tagsKeywords : undefined,
        publishedAt: formData.publishedAt || undefined,
        expirationDate: formData.expirationDate || undefined,
      },
    };

    try {
      await updateChange.mutateAsync({ id: newsId, data: updateRequest });
      showSuccess("Notícia atualizada com sucesso!");
      router.push("/dashboard/my-news");
    } catch (error) {
      showError(error as Error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Erro ao carregar notícia
              </h3>
              <p className="text-red-600 mb-4">
                Não foi possível carregar os dados da notícia para edição.
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Button onClick={handleBack} variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Editar Notícia</h1>
        <p className="text-gray-600 mt-1">
          Faça as alterações necessárias na sua notícia
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Save className="h-5 w-5 text-blue-600" />
            Editar Artigo de Notícias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-base font-medium text-gray-700"
                >
                  Título
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormField("title", e.target.value)}
                  placeholder="Insira o título do artigo de notícias"
                  required
                  className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="text"
                  className="text-base font-medium text-gray-700"
                >
                  Conteúdo
                </Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => updateFormField("text", e.target.value)}
                  placeholder="Digite o conteúdo da notícia"
                  rows={8}
                  required
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Categorias</h3>
              <CategorySelector
                selectedCategories={formData.categoryIds}
                onCategoriesChange={(categories) =>
                  updateFormField("categoryIds", categories)
                }
                label="Selecionar Categoria"
                placeholder="Escolha uma categoria"
                maxSelections={5}
              />
            </div>

            <div className="h-px bg-gray-200 w-full" />

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Tags</h3>
              <div className="space-y-3">
                <Label
                  htmlFor="tags"
                  className="text-base font-medium text-gray-700"
                >
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Insira tags separadas por vírgulas"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    size="sm"
                    variant="outline"
                    className="h-12 px-4 rounded-xl"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                {formData.tagsKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tagsKeywords.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                Agendamento de Publicação
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="publishedAt"
                    className="text-base font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Data de Publicação
                  </Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) =>
                      updateFormField("publishedAt", e.target.value)
                    }
                    className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="expirationDate"
                    className="text-base font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Data de Expiração
                  </Label>
                  <Input
                    id="expirationDate"
                    type="datetime-local"
                    value={formData.expirationDate}
                    onChange={(e) =>
                      updateFormField("expirationDate", e.target.value)
                    }
                    className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateChange.isPending}
                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updateChange.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
