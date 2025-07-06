"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PublicNewsCard from "@/components/PublicNewsCard";
import PublicHeader from "@/components/PublicHeader";
import { usePublicNews } from "@/hooks/useNews";
import Loading from "@/components/Loading";
import Link from "next/link";
import type { NewsItem } from "@/types/api";

const SEARCH_CONFIG = {
  ITEMS_PER_PAGE: 12,
  MAX_VISIBLE_PAGES: 2,
} as const;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: publicNews = [], isLoading, error } = usePublicNews();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const normalizeSearchTerm = (term: string) => {
    return term.toLowerCase().replace(/[#@]/g, "").trim();
  };

  const getFilteredNews = () => {
    const publishedNews = Array.isArray(publicNews)
      ? publicNews.filter(
          (news: NewsItem) => news.status === "APPROVED" && news.published
        )
      : [];

    const filteredNews = publishedNews.filter((news: NewsItem) => {
      const searchLower = normalizeSearchTerm(searchTerm);

      if (!searchLower) return true;

      return (
        normalizeSearchTerm(news.title).includes(searchLower) ||
        normalizeSearchTerm(news.text).includes(searchLower) ||
        news.tagsKeywords?.some((tag) => {
          const normalizedTag = normalizeSearchTerm(tag);
          return (
            normalizedTag.includes(searchLower) ||
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }) ||
        news.categories?.some((cat) =>
          normalizeSearchTerm(cat.name).includes(searchLower)
        )
      );
    });

    return filteredNews;
  };

  const filteredNews = getFilteredNews();
  const totalPages = Math.ceil(
    filteredNews.length / SEARCH_CONFIG.ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * SEARCH_CONFIG.ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(
    startIndex,
    startIndex + SEARCH_CONFIG.ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const shouldShowPage = (page: number) => {
      return (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - SEARCH_CONFIG.MAX_VISIBLE_PAGES &&
          page <= currentPage + SEARCH_CONFIG.MAX_VISIBLE_PAGES)
      );
    };

    const shouldShowEllipsis = (page: number) => {
      return page === currentPage - 3 || page === currentPage + 3;
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          if (shouldShowPage(page)) {
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            );
          } else if (shouldShowEllipsis(page)) {
            return (
              <span key={page} className="px-2 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg mb-4">
        Nenhuma notícia encontrada com os termos de busca.
      </div>
      <p className="text-gray-400 mb-6">
        Tente ajustar seus termos de busca ou navegue por todas as notícias.
      </p>
      <Link href="/">
        <Button variant="outline">Ver Todas as Notícias</Button>
      </Link>
    </div>
  );

  const renderResultsCount = () => (
    <div className="mb-6">
      <p className="text-gray-600">
        {filteredNews.length === 0
          ? "Nenhum resultado encontrado"
          : `${filteredNews.length} resultado${
              filteredNews.length === 1 ? "" : "s"
            } encontrado${filteredNews.length === 1 ? "" : "s"}`}
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-red-800 font-medium text-lg mb-2">
        Erro ao carregar resultados
      </h3>
      <p className="text-red-600">
        Não foi possível carregar os resultados da busca. Tente novamente.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">
            Início
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Resultados da Busca</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Resultados da Busca
            {searchTerm && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                para &ldquo;{searchTerm}&rdquo;
              </span>
            )}
          </h1>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Buscar por assunto, categoria ou tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus:ring-0 focus:border-0 px-0 text-base"
              />
              <Button type="submit" className="m-2">
                Buscar
              </Button>
            </div>
          </form>
        </div>

        {isLoading && <Loading />}
        {error && renderErrorState()}

        {!isLoading && !error && (
          <>
            {renderResultsCount()}

            {filteredNews.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentNews.map((news) => (
                    <PublicNewsCard key={news.id} news={news} />
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
