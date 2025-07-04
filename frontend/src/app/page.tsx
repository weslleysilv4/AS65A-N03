"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PublicNewsCard from "@/components/PublicNewsCard";
import PublicHeader from "@/components/PublicHeader";
import { useAdminNews } from "@/hooks/useNews";
import Loading from "@/components/Loading";
import type { NewsItem } from "@/types/api";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: adminNews = [], isLoading, error } = useAdminNews();

  const publishedNews = Array.isArray(adminNews)
    ? adminNews.filter(
        (news: NewsItem) => news.status === "APPROVED" && news.published
      )
    : [];

  const filteredNews = publishedNews.filter(
    (news: NewsItem) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Notícias</h1>
            <p className="text-lg text-gray-600 mb-8">
              Mantenha-se atualizado com as últimas notícias e atualizações do
              Projeto de Extensão ELLP.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
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
              </div>
            </form>
          </div>
        </div>

        {/* Latest News Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Últimas Notícias
          </h2>

          {isLoading && <Loading />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-medium text-lg mb-2">
                Erro ao carregar notícias
              </h3>
              <p className="text-red-600">
                Não foi possível carregar as notícias. Tente novamente.
              </p>
            </div>
          )}

          {!isLoading && !error && currentNews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {searchTerm
                  ? "Nenhuma notícia encontrada para sua busca."
                  : "Nenhuma notícia publicada ainda."}
              </div>
            </div>
          )}

          {!isLoading && !error && currentNews.length > 0 && (
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
        </div>
      </main>
    </div>
  );
}
