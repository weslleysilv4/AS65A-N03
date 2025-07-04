"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PublicNewsCard from "@/components/PublicNewsCard";
import PublicHeader from "@/components/PublicHeader";
import { useAdminNews } from "@/hooks/useNews";
import Loading from "@/components/Loading";
import Link from "next/link";
import type { NewsItem } from "@/types/api";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: adminNews = [], isLoading, error } = useAdminNews();

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtrar apenas notícias aprovadas e publicadas
  const publishedNews = Array.isArray(adminNews)
    ? adminNews.filter(
        (news: NewsItem) => news.status === "APPROVED" && news.published
      )
    : [];

  // Filtrar por busca
  const filteredNews = publishedNews.filter((news: NewsItem) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      news.title.toLowerCase().includes(searchLower) ||
      news.text.toLowerCase().includes(searchLower) ||
      news.tagsKeywords?.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      ) ||
      news.categories?.some((cat) =>
        cat.name.toLowerCase().includes(searchLower)
      )
    );
  });

  // Paginação
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Search Results</span>
        </nav>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Results
            {searchTerm && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                for &ldquo;{searchTerm}&rdquo;
              </span>
            )}
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Search by subject, category, or tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus:ring-0 focus:border-0 px-0 text-base"
              />
              <Button type="submit" className="m-2">
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        {isLoading && <Loading />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-medium text-lg mb-2">
              Erro ao carregar resultados
            </h3>
            <p className="text-red-600">
              Não foi possível carregar os resultados da busca. Tente novamente.
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredNews.length === 0
                  ? "No results found"
                  : `${filteredNews.length} result${
                      filteredNews.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>

            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No news articles found matching your search.
                </div>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or browse all news articles.
                </p>
                <Link href="/">
                  <Button variant="outline">Browse All News</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentNews.map((news) => (
                    <PublicNewsCard key={news.id} news={news} />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
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

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      // Show only a few pages around current page
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
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
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
