"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PublicNewsCard from "@/components/PublicNewsCard";
import PublicHeader from "@/components/PublicHeader";
import { usePublicNews } from "@/hooks/useNews";
import Loading from "@/components/Loading";
import type { NewsItem } from "@/types/api";

const HOME_CONFIG = {
  ITEMS_PER_PAGE: 8,
  LATEST_NEWS_COUNT: 3,
  MAX_PAGINATION_BUTTONS: 3,
} as const;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: publicNews = [], isLoading, error } = usePublicNews();

  const getPublishedNews = () => {
    return Array.isArray(publicNews)
      ? publicNews.filter(
          (news: NewsItem) => news.status === "APPROVED" && news.published
        )
      : [];
  };

  const getFilteredNews = () => {
    const publishedNews = getPublishedNews();
    return publishedNews.filter(
      (news: NewsItem) =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const publishedNews = getPublishedNews();
  const filteredNews = getFilteredNews();
  const totalPages = Math.ceil(
    filteredNews.length / HOME_CONFIG.ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * HOME_CONFIG.ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(
    startIndex,
    startIndex + HOME_CONFIG.ITEMS_PER_PAGE
  );
  const latestNews = publishedNews.slice(0, HOME_CONFIG.LATEST_NEWS_COUNT);

  const hasSearchTerm = Boolean(searchTerm);
  const hasResults = filteredNews.length > 0;
  const showLatestNews = !hasSearchTerm && latestNews.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const renderErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <TrendingUp className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-red-800 font-semibold text-lg mb-2">
        Erro ao carregar notícias
      </h3>
      <p className="text-red-600">
        Não foi possível carregar as notícias. Tente novamente em alguns
        instantes.
      </p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <div className="text-xl font-semibold text-gray-900 mb-2">
        {hasSearchTerm
          ? "Nenhuma notícia encontrada"
          : "Nenhuma notícia publicada ainda"}
      </div>
      <p className="text-gray-500 max-w-md mx-auto">
        {hasSearchTerm
          ? "Tente buscar com termos diferentes ou limpe os filtros."
          : "Em breve teremos notícias interessantes para você!"}
      </p>
      {hasSearchTerm && (
        <Button onClick={clearSearch} variant="outline" className="mt-4">
          Limpar busca
        </Button>
      )}
    </div>
  );

  const renderSearchResultsBadge = () => {
    if (!hasSearchTerm) return null;

    return (
      <div className="mt-4 flex justify-center">
        <Badge variant="outline" className="text-sm px-4 py-2">
          {filteredNews.length} resultado{filteredNews.length !== 1 ? "s" : ""}{" "}
          para &ldquo;
          {searchTerm}&rdquo;
        </Badge>
      </div>
    );
  };

  const renderLatestNewsSection = () => {
    if (!showLatestNews) return null;

    return (
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-900">Últimas Notícias</h2>
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Recém Publicadas
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {latestNews.map((news, index) => (
            <div key={news.id} className={index === 0 ? "lg:col-span-2" : ""}>
              <PublicNewsCard news={news} featured={index === 0} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const shouldShowPage = (page: number) => {
      return (
        page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
      );
    };

    const shouldShowEllipsis = (page: number, position: "start" | "end") => {
      if (position === "start") return page === 2 && currentPage > 4;
      return page === totalPages - 1 && currentPage < totalPages - 3;
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-16">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 rounded-xl border-gray-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isCurrentPage = currentPage === page;

            if (shouldShowPage(page)) {
              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl ${
                    isCurrentPage
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </Button>
              );
            }

            if (
              shouldShowEllipsis(page, "start") ||
              shouldShowEllipsis(page, "end")
            ) {
              return (
                <span key={page} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            return null;
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 rounded-xl border-gray-300"
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Mantenha-se
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Atualizado
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Descubra as últimas notícias e atualizações do Projeto de Extensão
              ELLP. Informação de qualidade, sempre ao seu alcance.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar notícias por título, conteúdo ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 pl-12 pr-24 text-base border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                />
                {hasSearchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-16 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                )}
                <Button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  Buscar
                </Button>
              </div>
            </form>

            {renderSearchResultsBadge()}
          </div>
        </div>

        {renderLatestNewsSection()}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">
                {hasSearchTerm ? "Resultados da Busca" : "Todas as Notícias"}
              </h2>
            </div>

            {hasResults && (
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Página {currentPage} de {totalPages}
              </div>
            )}
          </div>

          {isLoading && <Loading />}
          {error && renderErrorState()}

          {!isLoading &&
            !error &&
            currentNews.length === 0 &&
            renderEmptyState()}

          {!isLoading && !error && currentNews.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {currentNews.map((news) => (
                  <PublicNewsCard key={news.id} news={news} />
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
