"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import Loading from "@/components/Loading";

interface ViewNewsFormProps {
  newsId: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "PENDING":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "REJECTED":
      return <XCircle className="w-4 h-4 text-red-600" />;
    case "ARCHIVED":
      return <Archive className="w-4 h-4 text-gray-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "Aprovada";
    case "PENDING":
      return "Pendente";
    case "REJECTED":
      return "Rejeitada";
    case "ARCHIVED":
      return "Arquivada";
    default:
      return status;
  }
};

export default function ViewNewsForm({ newsId }: ViewNewsFormProps) {
  const { data: news, isLoading, error } = useNewsById(newsId);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !news) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium text-lg mb-2">
          Erro ao carregar notícia
        </h3>
        <p className="text-red-600">
          {error
            ? "Não foi possível carregar a notícia. Tente novamente."
            : "Notícia não encontrada."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da notícia */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {news.title}
              </CardTitle>
              <p className="text-gray-600 text-lg leading-relaxed">
                {news.text.length > 200
                  ? `${news.text.substring(0, 200)}...`
                  : news.text}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {getStatusIcon(news.status)}
              <Badge className={getStatusColor(news.status)}>
                {getStatusText(news.status)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metadados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Autor ID</p>
                <p className="font-medium text-gray-900">{news.authorId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Criada em</p>
                <p className="font-medium text-gray-900">
                  {formatDate(news.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Atualizada em</p>
                <p className="font-medium text-gray-900">
                  {formatDate(news.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-gray-900">
                  {news.published ? "Publicada" : "Não Publicada"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Conteúdo da Notícia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {news.text}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags e Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {news.tagsKeywords && news.tagsKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {news.tagsKeywords.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma tag adicionada</p>
            )}
          </CardContent>
        </Card>

        {/* Categorias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            {news.categories && news.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {news.categories.map((category) => (
                  <Badge key={category.id} className="text-sm">
                    {category.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Nenhuma categoria selecionada
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data de publicação */}
      {news.publishedAt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Publicação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900">
              Publicada em:{" "}
              <span className="font-medium">
                {formatDate(news.publishedAt)}
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
