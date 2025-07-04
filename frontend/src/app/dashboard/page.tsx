"use client";

import { useAuthGuard } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNews, useAdminNews, usePublicNews } from "@/hooks/useNews";
import { useCategories } from "@/hooks/useCategories";
import Loading from "@/components/Loading";
import Link from "next/link";
import { Home, BarChart3, Users, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, isClient } = useAuthGuard();
  const { user } = useAuthContext();

  const userRole = user?.role || "PUBLISHER";

  const {
    data: publisherNews,
    isLoading: isPublisherNewsLoading,
    error: publisherNewsError,
  } = useNews();
  const {
    data: adminNews,
    isLoading: isAdminNewsLoading,
    error: adminNewsError,
  } = useAdminNews();
  const { data: publicNews, isLoading: isPublicNewsLoading } = usePublicNews();
  const { data: categories = [] } = useCategories();

  const getNewsData = () => {
    if (userRole === "ADMIN") {
      if (adminNewsError || !adminNews) {
        return { news: publicNews || [], isLoading: isPublicNewsLoading };
      }
      return { news: adminNews || [], isLoading: isAdminNewsLoading };
    }

    if (publisherNewsError || !publisherNews) {
      return { news: publicNews || [], isLoading: isPublicNewsLoading };
    }
    return { news: publisherNews || [], isLoading: isPublisherNewsLoading };
  };

  const { news, isLoading: isNewsLoading } = getNewsData();

  if (!isClient || isLoading) {
    return <Loading message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const newsArray = Array.isArray(news) ? news : [];
  const recentNews = newsArray.slice(0, 3);

  // Calcular estatísticas dos dados reais
  const totalNews = newsArray.length;
  const totalCategories = categories.length;
  const approvedNews = newsArray.filter(
    (item) => item.status === "APPROVED"
  ).length;
  const pendingNews = newsArray.filter(
    (item) => item.status === "PENDING"
  ).length;

  // Calcular notícias por categoria
  const newsByCategory = categories
    .map((category) => {
      const count = newsArray.filter((item) =>
        item.categories?.some((cat) => cat.id === category.id)
      ).length;
      return { name: category.name, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo ao painel de controle do ELLP News
          </p>
        </div>
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Voltar ao Home
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total de Notícias
                </h3>
                <p className="text-2xl font-bold text-gray-900">{totalNews}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Categorias
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCategories}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Aprovadas</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedNews}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingNews}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="px-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Atividade Recente</h2>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
              <div>Título</div>
              <div>Categoria</div>
              <div>Autor</div>
              <div>Data de Publicação</div>
              <div>Status</div>
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-200">
            {isNewsLoading ? (
              <div className="px-6 py-8">
                <Loading message="Carregando atividades recentes..." />
              </div>
            ) : recentNews.length > 0 ? (
              recentNews.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {item.categories?.[0]?.name || "Sem categoria"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {user?.name || "Autor"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : item.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status === "APPROVED"
                          ? "Publicado"
                          : item.status === "PENDING"
                          ? "Pendente"
                          : "Rascunho"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">
                  Nenhuma atividade recente encontrada.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-6 py-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Estatísticas</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1 - Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Notícias por Categoria
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalNews}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-gray-600">
                    Total de notícias
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {newsByCategory.length > 0 ? (
                  newsByCategory.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                              ? "bg-green-500"
                              : index === 2
                              ? "bg-purple-500"
                              : "bg-orange-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Nenhuma categoria encontrada
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chart 2 - Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Status das Notícias
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalNews}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-gray-600">Total</span>
                </div>
              </div>

              {/* Simple bar chart for status */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Aprovadas</span>
                    <span className="text-sm font-medium">{approvedNews}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          totalNews > 0 ? (approvedNews / totalNews) * 100 : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pendentes</span>
                    <span className="text-sm font-medium">{pendingNews}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          totalNews > 0 ? (pendingNews / totalNews) * 100 : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rascunhos</span>
                    <span className="text-sm font-medium">
                      {totalNews - approvedNews - pendingNews}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{
                        width: `${
                          totalNews > 0
                            ? ((totalNews - approvedNews - pendingNews) /
                                totalNews) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
