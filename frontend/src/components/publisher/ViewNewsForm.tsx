"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNewsById } from "@/hooks/useNews";
import { formatDate } from "@/utils/format";
import {
  Calendar,
  User,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Archive,
  ArrowLeft,
  Sparkles,
  FileText,
  Tag,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ViewNewsFormProps {
  newsId: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "APPROVED":
      return {
        icon: CheckCircle,
        color: "bg-green-50 text-green-700 border-green-200",
        text: "Aprovada",
      };
    case "PENDING":
      return {
        icon: Clock,
        color: "bg-amber-50 text-amber-700 border-amber-200",
        text: "Pendente",
      };
    case "REJECTED":
      return {
        icon: XCircle,
        color: "bg-red-50 text-red-700 border-red-200",
        text: "Rejeitada",
      };
    case "ARCHIVED":
      return {
        icon: Archive,
        color: "bg-gray-50 text-gray-700 border-gray-200",
        text: "Arquivada",
      };
    default:
      return {
        icon: Clock,
        color: "bg-gray-50 text-gray-700 border-gray-200",
        text: status,
      };
  }
};

export default function ViewNewsForm({ newsId }: ViewNewsFormProps) {
  const router = useRouter();
  const { data: news, isLoading, error } = useNewsById(newsId);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded-lg w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-6xl mx-auto p-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 rounded-xl shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card className="border-0 shadow-xl bg-red-50">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-red-800">
                    Erro ao carregar notícia
                  </h3>
                  <p className="text-red-600 max-w-md mx-auto">
                    {error
                      ? "Não foi possível carregar a notícia. Tente novamente."
                      : "Notícia não encontrada."}
                  </p>
                </div>
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

  const statusConfig = getStatusConfig(news.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 rounded-xl shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Visualizar Notícia
              </h1>
              <p className="text-gray-600">Detalhes completos da notícia</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 uppercase tracking-wide">
                      Artigo de Notícias
                    </span>
                  </div>

                  <CardTitle className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {news.title}
                  </CardTitle>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {news.text.length > 200
                      ? `${news.text.substring(0, 200)}...`
                      : news.text}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusIcon className="w-6 h-6" />
                  <Badge
                    className={`${statusConfig.color} px-4 py-2 text-base font-semibold border shadow-sm`}
                  >
                    {statusConfig.text}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700 mb-1">
                      Autor
                    </p>
                    <p className="font-bold text-blue-900 text-lg truncate">
                      ID: {news.authorId.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700 mb-1">
                      Criada em
                    </p>
                    <p className="font-bold text-green-900 text-sm">
                      {formatDate(news.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-700 mb-1">
                      Atualizada
                    </p>
                    <p className="font-bold text-purple-900 text-sm">
                      {formatDate(news.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-700 mb-1">
                      Publicação
                    </p>
                    <p className="font-bold text-orange-900 text-lg">
                      {news.published ? "Publicada" : "Não Publicada"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Conteúdo Completo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
                  {news.text}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Tag className="w-5 h-5 text-green-600" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                {news.tagsKeywords && news.tagsKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {news.tagsKeywords.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        className="px-4 py-2 text-sm bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors rounded-full"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Nenhuma tag adicionada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Tag className="w-5 h-5 text-blue-600" />
                  Categorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {news.categories && news.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {news.categories.map((category) => (
                      <Badge
                        key={category.id}
                        className="px-4 py-2 text-sm bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors rounded-full font-semibold"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Nenhuma categoria selecionada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {news.publishedAt && (
            <Card className="shadow-xl border-0 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-amber-600" />
                  Data de Publicação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-900">
                      {formatDate(news.publishedAt)}
                    </p>
                    <p className="text-amber-700">
                      Artigo publicado para visualização pública
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
