"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NewsTable from "@/components/NewsTable";
import {
  useAdminNews,
  useUpdateAdminNews,
  useDeleteNews,
  useArchiveNews,
} from "@/hooks/useNews";
import type { NewsItem } from "@/types/api";

export default function AllNewsView() {
  const router = useRouter();
  const { data: adminNews = [], isLoading, error } = useAdminNews();

  // Garantir que adminNews é sempre um array
  const news = Array.isArray(adminNews) ? adminNews : [];

  const updateNewsMutation = useUpdateAdminNews();
  const deleteNewsMutation = useDeleteNews();
  const archiveNewsMutation = useArchiveNews();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const authors = Array.from(
    new Set(news.map((item: NewsItem) => item.authorId))
  ).filter(Boolean);

  const filteredNews = news.filter((item: NewsItem) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.text.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesAuthor =
      authorFilter === "all" || item.authorId === authorFilter;

    return matchesSearch && matchesStatus && matchesAuthor;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return a.status.localeCompare(b.status);
      case "author":
        return a.authorId.localeCompare(b.authorId);
      case "date":
      default:
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  });

  const handleEdit = (newsId: string) => {
    router.push(`/dashboard/news/edit/${newsId}`);
  };

  const handleView = (newsId: string) => {
    router.push(`/news/${newsId}`);
  };

  const handleDelete = (newsId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta notícia?")) {
      deleteNewsMutation.mutate(newsId);
    }
  };

  const handleArchive = (newsId: string) => {
    if (window.confirm("Tem certeza que deseja arquivar esta notícia?")) {
      archiveNewsMutation.mutate(newsId);
    }
  };

  const handlePublish = (newsId: string) => {
    updateNewsMutation.mutate({
      id: newsId,
      data: { published: true, status: "APPROVED" },
    });
  };

  const handleUnpublish = (newsId: string) => {
    updateNewsMutation.mutate({
      id: newsId,
      data: { published: false },
    });
  };

  const stats = {
    total: news.length,
    published: news.filter(
      (item) => item.status === "APPROVED" && item.published
    ).length,
    pending: news.filter((item) => item.status === "PENDING").length,
    rejected: news.filter((item) => item.status === "REJECTED").length,
    authors: authors.length,
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">
            Erro ao carregar notícias
          </h3>
          <p className="text-red-600 text-sm mt-1">
            Não foi possível carregar as notícias. Tente novamente.
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
            Todas as Notícias
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as notícias do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                {stats.published}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.pending}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-900">
                {stats.rejected}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Autores</p>
              <p className="text-2xl font-bold text-indigo-900">
                {stats.authors}
              </p>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-600" />
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

            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Autor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os autores</SelectItem>
                {authors.map((authorId) => (
                  <SelectItem key={authorId} value={authorId}>
                    {authorId}
                  </SelectItem>
                ))}
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
                <SelectItem value="author">Autor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <NewsTable
        news={sortedNews}
        userRole="ADMIN"
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        isLoading={isLoading}
      />
    </div>
  );
}
