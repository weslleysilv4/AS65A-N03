import { useState } from "react";
import { useCreatePendingChange } from "@/hooks/useNews";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CategorySelector from "@/components/ui/CategorySelector";
import { Plus, FileText, Upload, Calendar, Clock, Tag, X } from "lucide-react";
import type { CreateChangeRequest } from "@/types/api";

export default function CreateNewsForm() {
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    categoryIds: [] as string[],
    tagsKeywords: [] as string[],
    publishedAt: "",
    expirationDate: "",
    externalLinks: [] as { url: string; text: string }[],
    media: [] as File[],
  });

  const [tagInput, setTagInput] = useState("");
  const [linkData, setLinkData] = useState({ url: "", text: "" });
  const createChange = useCreatePendingChange();
  const { showSuccess, showError } = useErrorNotification();

  const resetForm = () => {
    setFormData({
      title: "",
      text: "",
      categoryIds: [],
      tagsKeywords: [],
      publishedAt: "",
      expirationDate: "",
      externalLinks: [],
      media: [],
    });
    setTagInput("");
    setLinkData({ url: "", text: "" });
  };

  const updateFormData = (
    field: keyof typeof formData,
    value: string | string[] | { url: string; text: string }[] | File[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetLinkData = () => setLinkData({ url: "", text: "" });

  const updateLinkData = (field: keyof typeof linkData, value: string) => {
    setLinkData((prev) => ({ ...prev, [field]: value }));
  };

  const isTagValid = (tag: string) =>
    tag.trim() && !formData.tagsKeywords.includes(tag.trim());

  const isLinkDataValid = () => linkData.url.trim() && linkData.text.trim();

  const hasExternalLinks = formData.externalLinks.length > 0;
  const hasTags = formData.tagsKeywords.length > 0;
  const isFormSubmitting = createChange.isPending;

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (isTagValid(trimmedTag)) {
      updateFormData("tagsKeywords", [...formData.tagsKeywords, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    updateFormData(
      "tagsKeywords",
      formData.tagsKeywords.filter((t) => t !== tag)
    );
  };

  const addExternalLink = () => {
    if (isLinkDataValid()) {
      updateFormData("externalLinks", [
        ...formData.externalLinks,
        { ...linkData },
      ]);
      resetLinkData();
    }
  };

  const removeExternalLink = (index: number) => {
    updateFormData(
      "externalLinks",
      formData.externalLinks.filter((_, i) => i !== index)
    );
  };

  const createChangeRequest = (): CreateChangeRequest => ({
    type: "CREATE",
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const changeRequest = createChangeRequest();

    createChange.mutate(changeRequest, {
      onSuccess: () => {
        resetForm();
        showSuccess("Solicitação de notícia enviada com sucesso!");
      },
      onError: (error) => {
        showError(error as Error);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Criar Artigo de Notícias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
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
                  onChange={(e) => updateFormData("title", e.target.value)}
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
                  onChange={(e) => updateFormData("text", e.target.value)}
                  placeholder="Digite o conteúdo da notícia"
                  rows={8}
                  required
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>{" "}
            <div className="h-px bg-gray-200 w-full" />
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Mídia</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="space-y-4">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-700">
                      Carregar Mídia
                    </p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      Arraste e solte imagens ou vídeos aqui, ou clique para
                      selecionar arquivos
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                  >
                    Procurar Arquivos
                  </Button>
                </div>
              </div>
            </div>{" "}
            <div className="h-px bg-gray-200 w-full" />
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                Links Externos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="linkUrl"
                    className="text-base font-medium text-gray-700"
                  >
                    URL do Link
                  </Label>
                  <Input
                    id="linkUrl"
                    type="url"
                    value={linkData.url}
                    onChange={(e) => updateLinkData("url", e.target.value)}
                    placeholder="Insira a URL do link externo"
                    className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="linkText"
                    className="text-base font-medium text-gray-700"
                  >
                    Texto do Link
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="linkText"
                      value={linkData.text}
                      onChange={(e) => updateLinkData("text", e.target.value)}
                      placeholder="Insira o texto a ser exibido para o link"
                      className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      onClick={addExternalLink}
                      size="sm"
                      className="h-12 px-4 rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {hasExternalLinks && (
                <div className="space-y-2">
                  {formData.externalLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">{link.text}</p>
                        <p className="text-sm text-blue-600 break-all">
                          {link.url}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExternalLink(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>{" "}
            <div className="h-px bg-gray-200 w-full" />
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Categorias</h3>
              <CategorySelector
                selectedCategories={formData.categoryIds}
                onCategoriesChange={(categories) =>
                  updateFormData("categoryIds", categories)
                }
                label="Selecionar Categoria"
                placeholder="Escolha uma categoria"
                maxSelections={5}
              />
            </div>{" "}
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
                        addTag();
                      }
                    }}
                    className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="sm"
                    variant="outline"
                    className="h-12 px-4 rounded-xl"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                {hasTags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tagsKeywords.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>{" "}
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
                      updateFormData("publishedAt", e.target.value)
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
                      updateFormData("expirationDate", e.target.value)
                    }
                    className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>{" "}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isFormSubmitting}
                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isFormSubmitting ? "Enviando..." : "Publicar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
