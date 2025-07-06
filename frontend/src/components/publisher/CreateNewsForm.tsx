"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCreatePendingChange } from "@/hooks/useNews";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import { uploadFileAdmin } from "@/lib/supabaseStorageAdmin"; // Usando versão admin temporariamente
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CategorySelector from "@/components/ui/CategorySelector";
import {
  Plus,
  FileText,
  Upload,
  Calendar,
  Clock,
  Tag,
  X,
  Sparkles,
  Send,
} from "lucide-react";
import type { CreateChangeRequest } from "@/types/api";

export default function CreateNewsForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    categoryIds: [] as string[],
    tagsKeywords: [] as string[],
    publishedAt: "",
    expirationDate: "",
    externalLinks: [] as { url: string; text: string }[],
    media: [] as {
      url: string;
      path: string;
      alt?: string;
      title?: string;
      description?: string;
      caption?: string;
      copyright?: string;
      type: "IMAGE" | "VIDEO" | "EXTERNAL_LINK";
      order: number;
      isUploading?: boolean;
    }[],
  });

  const [tagInput, setTagInput] = useState("");
  const [linkData, setLinkData] = useState({ url: "", text: "" });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<number>>(new Set());
  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});
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
    setPreviewUrls([]);
    setUploadingFiles(new Set());
    setUploadErrors({});
  };

  const updateFormData = (
    field: string,
    value: string | string[] | unknown[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetLinkData = () => setLinkData({ url: "", text: "" });

  const updateLinkData = (field: keyof typeof linkData, value: string) => {
    setLinkData((prev) => ({ ...prev, [field]: value }));
  };

  const processFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Criar mídia inicial com URLs locais para preview
    const newMedia = fileArray.map((file, index) => ({
      url: URL.createObjectURL(file),
      path: `/uploads/${file.name}`,
      alt: `Imagem ${index + 1}`,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extensão
      description: "",
      caption: "",
      copyright: "",
      type: file.type.startsWith("video/")
        ? ("VIDEO" as const)
        : ("IMAGE" as const),
      order: formData.media.length + index + 1,
      isUploading: true, // Flag para indicar que está fazendo upload
    }));

    // Criar URLs de preview
    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);

    // Adicionar à lista de mídia
    const currentMediaLength = formData.media.length;
    updateFormData("media", [...formData.media, ...newMedia]);

    // Fazer upload de cada arquivo
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const mediaIndex = currentMediaLength + i;
      
      try {
        // Marcar arquivo como fazendo upload
        setUploadingFiles(prev => new Set(prev).add(mediaIndex));
        
        // Fazer upload para o Supabase Storage
        const publicUrl = await uploadFileAdmin(file, 'news-media', 'images');
        
        // Atualizar o item da mídia com a URL real
        setFormData(prev => ({
          ...prev,
          media: prev.media.map((mediaItem, index) => {
            if (index === mediaIndex) {
              return {
                ...mediaItem,
                url: publicUrl,
                path: publicUrl,
                isUploading: false,
              };
            }
            return mediaItem;
          })
        }));
        
        // Remover da lista de uploads
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(mediaIndex);
          return newSet;
        });
        
        // Limpar erro se havia
        setUploadErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[mediaIndex];
          return newErrors;
        });
        
      } catch (error) {
        console.error(`Erro ao fazer upload do arquivo ${file.name}:`, error);
        
        // Marcar erro
        setUploadErrors(prev => ({
          ...prev,
          [mediaIndex]: error instanceof Error ? error.message : 'Erro desconhecido no upload'
        }));
        
        // Remover da lista de uploads
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(mediaIndex);
          return newSet;
        });
        
        // Marcar como não fazendo upload
        setFormData(prev => ({
          ...prev,
          media: prev.media.map((mediaItem, index) => {
            if (index === mediaIndex) {
              return {
                ...mediaItem,
                isUploading: false,
              };
            }
            return mediaItem;
          })
        }));
        
        showError(new Error(`Erro ao fazer upload de ${file.name}: ${error}`));
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
  };

  const isTagValid = (tag: string) =>
    tag.trim() && !formData.tagsKeywords.includes(tag.trim());

  const isLinkDataValid = () => linkData.url.trim() && linkData.text.trim();

  const hasExternalLinks = formData.externalLinks.length > 0;
  const hasTags = formData.tagsKeywords.length > 0;
  const hasMedia = formData.media.length > 0;
  const isFormSubmitting = createChange.isPending;
  const hasUploadsPending = uploadingFiles.size > 0;
  const hasUploadErrors = Object.keys(uploadErrors).length > 0;

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

  const removeMedia = (index: number) => {
    // Limpar URL de preview se existir
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    updateFormData(
      "media",
      formData.media.filter((_, i) => i !== index)
    );

    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
      media: formData.media.length > 0 ? formData.media.map((mediaItem) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isUploading, ...media } = mediaItem;
        return media;
      }) : undefined,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar se há uploads em andamento
    if (hasUploadsPending) {
      showError(new Error("Aguarde o upload de todos os arquivos ser concluído antes de publicar."));
      return;
    }

    // Verificar se há erros de upload
    if (hasUploadErrors) {
      showError(new Error("Existem erros no upload de arquivos. Remova os arquivos com erro ou tente novamente."));
      return;
    }

    const changeRequest = createChangeRequest();

    createChange.mutate(changeRequest, {
      onSuccess: () => {
        resetForm();
        showSuccess("Solicitação de notícia enviada com sucesso!");
        router.push("/dashboard/my-news");
      },
      onError: (error) => {
        showError(error as Error);
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
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
                    onChange={(e) => updateFormData("title", e.target.value)}
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
                    onChange={(e) => updateFormData("text", e.target.value)}
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
                    updateFormData("categoryIds", categories)
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
                          addTag();
                        }
                      }}
                      className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 shadow-sm bg-white/80"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      size="sm"
                      variant="outline"
                      className="h-12 px-6 rounded-xl border-green-300 text-green-700 hover:bg-green-50"
                      disabled={!isTagValid(tagInput)}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  {hasTags && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tagsKeywords.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-800 rounded-full border border-green-200 hover:bg-green-200 transition-colors"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
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

            {/* External Links Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  Links Externos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="linkUrl"
                      className="text-base font-semibold text-gray-700"
                    >
                      URL do Link
                    </Label>
                    <Input
                      id="linkUrl"
                      type="url"
                      value={linkData.url}
                      onChange={(e) => updateLinkData("url", e.target.value)}
                      placeholder="https://exemplo.com"
                      className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm bg-white/80"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="linkText"
                      className="text-base font-semibold text-gray-700"
                    >
                      Texto do Link
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="linkText"
                        value={linkData.text}
                        onChange={(e) => updateLinkData("text", e.target.value)}
                        placeholder="Texto a ser exibido"
                        className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm bg-white/80"
                      />
                      <Button
                        type="button"
                        onClick={addExternalLink}
                        size="sm"
                        className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                        disabled={!isLinkDataValid()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {hasExternalLinks && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Links Adicionados:
                    </h4>
                    {formData.externalLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-indigo-200 shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-indigo-900">
                            {link.text}
                          </p>
                          <p className="text-sm text-indigo-600 break-all">
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
                        updateFormData("publishedAt", e.target.value)
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
                        updateFormData("expirationDate", e.target.value)
                      }
                      className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 shadow-sm bg-white/80"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Mídia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                    <Label htmlFor="media-files" className="cursor-pointer">
                      <span className="text-lg font-semibold text-purple-700">
                        Clique para selecionar arquivos
                      </span>
                      <p className="text-sm text-purple-600 mt-2">
                        Suporte para imagens (PNG, JPG, JPEG, GIF) e vídeos
                        (MP4, MOV, AVI)
                      </p>
                    </Label>
                    <Input
                      id="media-files"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {hasMedia && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Arquivos Selecionados ({formData.media.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.media.map((media, index) => (
                          <div
                            key={index}
                            className="relative group bg-white/80 rounded-xl border border-purple-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                              {/* Indicador de upload */}
                              {media.isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                  <div className="text-white text-center">
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <span className="text-sm">Enviando...</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Indicador de erro */}
                              {uploadErrors[index] && (
                                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center z-10">
                                  <div className="text-white text-center p-2">
                                    <X className="w-8 h-8 mx-auto mb-2" />
                                    <span className="text-xs">Erro no upload</span>
                                  </div>
                                </div>
                              )}
                              
                              {media.type === "IMAGE" ? (
                                <Image
                                  src={media.url}
                                  alt={
                                    media.alt ||
                                    media.title ||
                                    "Imagem da notícia"
                                  }
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="text-purple-600 text-center">
                                  <Upload className="mx-auto h-8 w-8 mb-2" />
                                  <span className="text-sm font-medium">
                                    {media.type === "VIDEO"
                                      ? "Vídeo"
                                      : "Arquivo"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h5 className="font-medium text-purple-900 truncate mb-1">
                                {media.title || "Arquivo sem título"}
                              </h5>
                              <p className="text-sm text-purple-600 truncate">
                                {uploadErrors[index] ? (
                                  <span className="text-red-600">{uploadErrors[index]}</span>
                                ) : (
                                  media.path
                                )}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeMedia(index)}
                              className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={media.isUploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="h-12 px-8 rounded-xl border-gray-300 hover:bg-gray-50 font-medium"
              >
                Limpar
              </Button>
              <Button
                type="submit"
                disabled={isFormSubmitting || hasUploadsPending}
                className="h-12 px-10 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isFormSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </>
                ) : hasUploadsPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Aguardando uploads...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publicar Notícia
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
    // </div>
  );
}
