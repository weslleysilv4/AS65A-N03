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
import OptimizedImage from "@/components/OptimizedImage";

import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Tag,
  X,
  Sparkles,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-5xl mx-auto p-6">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-5xl mx-auto p-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Card className="border-0 shadow-xl bg-red-50 border-red-200">
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-800">
                  Erro ao carregar notícia
                </h3>
                <p className="text-red-600">
                  Não foi possível carregar os dados da notícia para edição.
                </p>
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto p-6">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Editar Notícia
                </h1>
                <p className="text-lg text-gray-600">
                  Faça as alterações necessárias na sua notícia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Essential Content Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label
                      htmlFor="title"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      Título
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormField("title", e.target.value)}
                      placeholder="Insira o título do artigo de notícias"
                      required
                      className="h-14 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg shadow-sm bg-white/80"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="text"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <FileText className="w-5 h-5 text-blue-500" />
                      Conteúdo
                    </Label>
                    <Textarea
                      id="text"
                      value={formData.text}
                      onChange={(e) => updateFormField("text", e.target.value)}
                      placeholder="Digite o conteúdo da notícia"
                      rows={10}
                      required
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none shadow-sm text-base leading-relaxed bg-white/80"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Settings Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-gray-600 font-semibold text-base">
                    Configurações Avançadas
                  </span>
                </div>
              </div>

              {/* Categories Section */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-600" />
                    Categorias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategorySelector
                    selectedCategories={formData.categoryIds}
                    onCategoriesChange={(categories) =>
                      updateFormField("categoryIds", categories)
                    }
                    label="Selecionar Categoria"
                    placeholder="Escolha uma categoria"
                    maxSelections={5}
                  />
                </CardContent>
              </Card>

              {/* Tags Section */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-600" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Insira tags para melhor categorização"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 shadow-sm bg-white/80"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        size="sm"
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    {formData.tagsKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tagsKeywords.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-800 border border-green-200 rounded-full hover:bg-green-200 transition-colors"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Section */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    Agendamento de Publicação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="publishedAt"
                        className="text-base font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4 text-amber-600" />
                        Data de Publicação
                      </Label>
                      <Input
                        id="publishedAt"
                        type="datetime-local"
                        value={formData.publishedAt}
                        onChange={(e) =>
                          updateFormField("publishedAt", e.target.value)
                        }
                        className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 shadow-sm bg-white/80"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="expirationDate"
                        className="text-base font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4 text-amber-600" />
                        Data de Expiração
                      </Label>
                      <Input
                        id="expirationDate"
                        type="datetime-local"
                        value={formData.expirationDate}
                        onChange={(e) =>
                          updateFormField("expirationDate", e.target.value)
                        }
                        className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 shadow-sm bg-white/80"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Preview Section */}
              {newsItem && newsItem.media && newsItem.media.length > 0 && (
                <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      Mídia Associada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {newsItem.media.map((media, index) => (
                        <div
                          key={media.id || index}
                          className="bg-white/80 rounded-xl border border-purple-200 overflow-hidden shadow-sm"
                        >
                          {media.type === "IMAGE" && (
                            <div className="aspect-video relative">
                              <OptimizedImage
                                src={media.url}
                                alt={
                                  media.alt ||
                                  media.title ||
                                  "Imagem da notícia"
                                }
                                fill
                                className="object-cover"
                                fallbackText="🖼️"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                {media.type === "IMAGE" && "Imagem"}
                                {media.type === "VIDEO" && "Vídeo"}
                                {media.type === "EXTERNAL_LINK" && "Link"}
                              </span>
                              <span className="text-xs text-gray-500">
                                #{media.order || index + 1}
                              </span>
                            </div>
                            {media.title && (
                              <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                                {media.title}
                              </h4>
                            )}
                            {media.description && (
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {media.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-700 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>
                          Para editar a mídia associada, entre em contato com o
                          administrador.
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-12 px-8 rounded-xl border-gray-300 hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateChange.isPending}
                  className="h-12 px-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {updateChange.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
