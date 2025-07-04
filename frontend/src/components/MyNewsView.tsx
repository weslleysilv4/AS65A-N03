"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">
            Erro ao carregar notícias
          </h3>
          <p className="text-red-600 text-sm mt-1">
            Não foi possível carregar suas notícias. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Gerenciar Notícias" : "Minhas Notícias"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin
              ? "Gerencie todas as notícias do sistema como administrador"
              : "Gerencie todas as suas notícias publicadas e rascunhos"}
          </p>
        </div>
        {!isAdmin && (
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Notícia
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.total}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Publicadas</p>
              <p className="text-2xl font-bold text-green-900">
                {statusCounts.published}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-900">
                {statusCounts.pending}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-900">
                {statusCounts.rejected}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="APPROVED">Aprovado</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="REJECTED">Rejeitado</SelectItem>
                <SelectItem value="ARCHIVED">Arquivado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <NewsTable
        news={sortedNews}
        userRole={user?.role || "PUBLISHER"}
        onEdit={handleEdit}
        onView={handleView}
        onArchive={handleArchive}
        isLoading={isLoading}
      />
    </div>
  );
}
