"use client";

import { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Archive,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NewsItem } from "@/types/api";

interface NewsTableProps {
  news: NewsItem[];
  userRole: "ADMIN" | "PUBLISHER";
  onEdit?: (newsId: string) => void;
  onDelete?: (newsId: string) => void;
  onArchive?: (newsId: string) => void;
  onView?: (newsId: string) => void;
  onPublish?: (newsId: string) => void;
  onUnpublish?: (newsId: string) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "DRAFT":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "Aprovado";
    case "PENDING":
      return "Pendente";
    case "REJECTED":
      return "Rejeitado";
    case "DRAFT":
      return "Rascunho";
    default:
      return status;
  }
};

export default function NewsTable({
  news,
  userRole,
  onEdit,
  onDelete,
  onArchive,
  onView,
  onPublish,
  onUnpublish,
  isLoading,
}: NewsTableProps) {
  const [selectedNews, setSelectedNews] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNews(news.map((item) => item.id));
    } else {
      setSelectedNews([]);
    }
  };

  const handleSelectNews = (newsId: string, checked: boolean) => {
    if (checked) {
      setSelectedNews((prev) => [...prev, newsId]);
    } else {
      setSelectedNews((prev) => prev.filter((id) => id !== newsId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "agora mesmo";
    if (diffInMinutes < 60)
      return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30)
      return `há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;

    return date.toLocaleDateString("pt-BR");
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4">
                  <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-gray-500">
              Não há notícias para exibir no momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Notícias ({news.length})
            </h2>
            {selectedNews.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedNews.length} selecionado(s)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedNews.forEach((id) => onArchive?.(id));
                    setSelectedNews([]);
                  }}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Arquivar
                </Button>
              </div>
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedNews.length === news.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead className="min-w-[300px]">Título</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Autor</TableHead>
              <TableHead className="min-w-[120px]">Data</TableHead>
              <TableHead className="min-w-[100px]">Categorias</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedNews.includes(item.id)}
                    onChange={(e) =>
                      handleSelectNews(item.id, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {truncateText(item.text)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      {item.published && (
                        <span className="inline-flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Publicado
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(item.status)}
                  >
                    {getStatusText(item.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      ID: {item.authorId}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(item.publishedAt || item.createdAt)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.categories?.slice(0, 2).map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {category.name}
                      </Badge>
                    ))}
                    {item.categories && item.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView?.(item.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(item.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {userRole === "ADMIN" && (
                        <>
                          {item.published ? (
                            <DropdownMenuItem
                              onClick={() => onUnpublish?.(item.id)}
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              Despublicar
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onPublish?.(item.id)}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Publicar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete?.(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => onArchive?.(item.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Arquivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
