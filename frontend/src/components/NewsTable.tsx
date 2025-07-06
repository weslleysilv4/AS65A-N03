"use client";

import { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Archive,
  Calendar,
  Tag,
  MoreHorizontal,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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

const STATUS_CONFIG = {
  APPROVED: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
    text: "Aprovado",
  },
  PENDING: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    text: "Pendente",
  },
  REJECTED: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    text: "Rejeitado",
  },
  ARCHIVED: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: Archive,
    text: "Arquivado",
  },
} as const;

const DEFAULT_STATUS_CONFIG = {
  color: "bg-gray-50 text-gray-700 border-gray-200",
  icon: AlertCircle,
  text: "Desconhecido",
};

const DATE_CONSTANTS = {
  MILLISECONDS_PER_MINUTE: 1000 * 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_MONTH: 30,
  DEFAULT_TEXT_MAX_LENGTH: 120,
  CATEGORIES_DISPLAY_LIMIT: 2,
  SKELETON_ROWS: 5,
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

  const isAllSelected = selectedNews.length === news.length && news.length > 0;
  const hasSelectedNews = selectedNews.length > 0;
  const isAdmin = userRole === "ADMIN";

  const handleSelectAll = (checked: boolean) => {
    setSelectedNews(checked ? news.map((item) => item.id) : []);
  };

  const handleSelectNews = (newsId: string, checked: boolean) => {
    setSelectedNews((prev) =>
      checked ? [...prev, newsId] : prev.filter((id) => id !== newsId)
    );
  };

  const handleBulkArchive = () => {
    selectedNews.forEach((id) => onArchive?.(id));
    setSelectedNews([]);
  };

  const getStatusConfig = (status: string) => {
    return (
      STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
      DEFAULT_STATUS_CONFIG
    );
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / DATE_CONSTANTS.MILLISECONDS_PER_MINUTE
    );

    if (diffInMinutes < 1) return "agora mesmo";
    if (diffInMinutes < DATE_CONSTANTS.MINUTES_PER_HOUR) {
      return `há ${diffInMinutes} min`;
    }

    const diffInHours = Math.floor(
      diffInMinutes / DATE_CONSTANTS.MINUTES_PER_HOUR
    );
    if (diffInHours < DATE_CONSTANTS.HOURS_PER_DAY) {
      return `há ${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / DATE_CONSTANTS.HOURS_PER_DAY);
    if (diffInDays < DATE_CONSTANTS.DAYS_PER_MONTH) {
      return `há ${diffInDays}d`;
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (
    text: string,
    maxLength = DATE_CONSTANTS.DEFAULT_TEXT_MAX_LENGTH
  ) => {
    return text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;
  };

  const getAuthorInitials = (authorId: string) => {
    return authorId.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-32"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: DATE_CONSTANTS.SKELETON_ROWS }).map(
              (_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
          <Eye className="w-10 h-10 text-blue-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Nenhuma notícia encontrada
          </h3>
          <p className="text-gray-500 max-w-sm">
            Não há notícias para exibir no momento. Que tal criar a primeira?
          </p>
        </div>
      </div>
    </div>
  );

  const renderTableHeader = () => (
    <div className="flex items-center justify-between">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900">Notícias</h2>
        <p className="text-sm text-gray-500">
          {news.length}{" "}
          {news.length === 1 ? "notícia encontrada" : "notícias encontradas"}
        </p>
      </div>
      {hasSelectedNews && (
        <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-4 py-2 border border-blue-200">
          <span className="text-sm font-medium text-blue-700">
            {selectedNews.length} selecionada
            {selectedNews.length > 1 ? "s" : ""}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkArchive}
            className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Archive className="w-4 h-4 mr-2" />
            Arquivar Selecionadas
          </Button>
        </div>
      )}
    </div>
  );

  const renderCategoryBadges = (categories: NewsItem["categories"]) => {
    if (!categories?.length) return null;

    const visibleCategories = categories.slice(
      0,
      DATE_CONSTANTS.CATEGORIES_DISPLAY_LIMIT
    );
    const remainingCount =
      categories.length - DATE_CONSTANTS.CATEGORIES_DISPLAY_LIMIT;

    return (
      <div className="flex flex-wrap gap-1.5">
        {visibleCategories.map((category) => (
          <Badge
            key={category.id}
            variant="outline"
            className="text-xs bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Tag className="w-3 h-3 mr-1" />
            {category.name}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <div className="relative group">
            <Badge
              variant="outline"
              className="text-xs bg-gray-100 border-gray-300 cursor-help"
            >
              +{remainingCount}
            </Badge>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              {categories
                .slice(DATE_CONSTANTS.CATEGORIES_DISPLAY_LIMIT)
                .map((cat) => cat.name)
                .join(", ")}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderActionDropdown = (item: NewsItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-9 p-0 hover:bg-gray-100 transition-colors"
        >
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-semibold">
          Ações da Notícia
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onView?.(item.id)}
          className="cursor-pointer"
        >
          <Eye className="mr-3 h-4 w-4 text-blue-500" />
          Visualizar
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEdit?.(item.id)}
          className="cursor-pointer"
        >
          <Edit className="mr-3 h-4 w-4 text-amber-500" />
          Editar
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            {item.published ? (
              <DropdownMenuItem
                onClick={() => onUnpublish?.(item.id)}
                className="cursor-pointer"
              >
                <Archive className="mr-3 h-4 w-4 text-orange-500" />
                Despublicar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onPublish?.(item.id)}
                className="cursor-pointer"
              >
                <ExternalLink className="mr-3 h-4 w-4 text-green-500" />
                Publicar
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onArchive?.(item.id)}
          className="cursor-pointer"
        >
          <Archive className="mr-3 h-4 w-4 text-gray-500" />
          Arquivar
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onDelete?.(item.id)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-3 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isLoading) return renderLoadingState();
  if (!news?.length) return renderEmptyState();

  return (
    <div className="space-y-2">
      {renderTableHeader()}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-12 pl-6">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-900 px-4">
                Notícia
              </TableHead>
              <TableHead className="font-semibold text-gray-900 px-4">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 px-4">
                Autor
              </TableHead>
              <TableHead className="font-semibold text-gray-900 px-4">
                Data
              </TableHead>
              <TableHead className="font-semibold text-gray-900 px-4">
                Categorias
              </TableHead>
              <TableHead className="w-[80px] pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              const StatusIcon = statusConfig.icon;
              const isLastRow = index === news.length - 1;

              return (
                <TableRow
                  key={item.id}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    isLastRow ? "border-b-0" : ""
                  }`}
                >
                  <TableCell className="pl-6">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedNews.includes(item.id)}
                      onChange={(e) =>
                        handleSelectNews(item.id, e.target.checked)
                      }
                    />
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="space-y-2 max-w-md">
                      <div className="font-semibold text-gray-900 line-clamp-1 text-base">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {truncateText(item.text)}
                      </div>
                      <div className="flex items-center space-x-3">
                        {item.published && (
                          <div className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Publicado
                          </div>
                        )}
                        {item.viewCount !== undefined && (
                          <div className="inline-flex items-center text-xs text-gray-500">
                            <Eye className="w-3 h-3 mr-1" />
                            {item.viewCount} visualizações
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${statusConfig.color} font-medium flex items-center gap-1.5 w-fit`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.text}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 text-xs font-semibold">
                          {getAuthorInitials(item.authorId)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          Autor
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          ID: {item.authorId.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatRelativeDate(item.publishedAt || item.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{renderCategoryBadges(item.categories)}</TableCell>

                  <TableCell className="pr-6">
                    {renderActionDropdown(item)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
