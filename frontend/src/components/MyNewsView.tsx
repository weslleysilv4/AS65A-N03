"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Filter, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import NewsTable from "@/components/NewsTable";
import { useArchiveNews, useAdminNews } from "@/hooks/useNews";
import { useAuthContext } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import type { NewsItem } from "@/types/api";

export default function MyNewsView() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { showSuccess, showError } = useErrorNotification();

  const isAdmin = user?.role === "ADMIN";

  const {
    data: adminNews = [],
    isLoading: isAdminLoading,
    error: adminError,
  } = useAdminNews();

  const adminNewsArray = Array.isArray(adminNews) ? adminNews : [];
  const news = isAdmin
    ? adminNewsArray
    : adminNewsArray.filter((item: NewsItem) => item.authorId === user?.id);

  const isLoading = isAdminLoading;
  const error = adminError;

  const archiveNewsMutation = useArchiveNews();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const filterNews = (items: NewsItem[]) => {
    return items.filter((item: NewsItem) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.text.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const sortNews = (items: NewsItem[]) => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        case "date":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });
  };

  const filteredNews = filterNews(news);
  const sortedNews = sortNews(filteredNews);

  const getStatusCounts = () => {
    const total = news.length;
    const published = news.filter(
      (item) => item.status === "APPROVED" && item.published
    ).length;
    const pending = news.filter((item) => item.status === "PENDING").length;
    const rejected = news.filter((item) => item.status === "REJECTED").length;

    return { total, published, pending, rejected };
  };

  const statusCounts = getStatusCounts();

  const handleEdit = (newsId: string) => {
    router.push(`/dashboard/news/edit/${newsId}`);
  };

  const handleView = (newsId: string) => {
    router.push(`/dashboard/news/view/${newsId}`);
  };

  const handleArchive = async (newsId: string) => {
    if (window.confirm("Tem certeza que deseja arquivar esta notícia?")) {
      try {
        await archiveNewsMutation.mutateAsync(newsId);
        showSuccess("Notícia arquivada com sucesso!");
      } catch (error) {
        showError(error as Error);
      }
    }
  };

  const handleCreateNew = () => {
    router.push("/dashboard/create-news");
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-semibold text-lg">
            Erro ao carregar notícias
          </h3>
          <p className="text-red-600 mt-2">
            Não foi possível carregar suas notícias. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? "Gerenciar Notícias" : "Minhas Notícias"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isAdmin
              ? "Gerencie todas as notícias do sistema como administrador"
              : "Gerencie todas as suas notícias publicadas e rascunhos"}
          </p>
        </div>
        {!isAdmin && (
          <Button
            onClick={handleCreateNew}
            size="lg"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nova Notícia
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-700">Total</p>
              <p className="text-3xl font-bold text-blue-900">
                {statusCounts.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700">Publicadas</p>
              <p className="text-3xl font-bold text-green-900">
                {statusCounts.published}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-yellow-700">Pendentes</p>
              <p className="text-3xl font-bold text-yellow-900">
                {statusCounts.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-700">Rejeitadas</p>
              <p className="text-3xl font-bold text-red-900">
                {statusCounts.rejected}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-sm">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por título ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-11 border-gray-300">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Todos
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="APPROVED">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-500 text-xs">
                        Aprovado
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="PENDING">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="bg-yellow-500 text-xs"
                      >
                        Pendente
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-red-500 text-xs">
                        Rejeitado
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="ARCHIVED">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Arquivado
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <SortDesc className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 h-11 border-gray-300">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">📅 Data</SelectItem>
                  <SelectItem value="title">📝 Título</SelectItem>
                  <SelectItem value="status">🏷️ Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter !== "all" || searchTerm) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">Filtros ativos:</span>
            {statusFilter !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => setStatusFilter("all")}
              >
                Status: {statusFilter} ×
              </Badge>
            )}
            {searchTerm && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => setSearchTerm("")}
              >
                Busca: &ldquo;{searchTerm}&rdquo; ×
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* News Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <NewsTable
          news={sortedNews}
          userRole={user?.role || "PUBLISHER"}
          onEdit={handleEdit}
          onView={handleView}
          onArchive={handleArchive}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
