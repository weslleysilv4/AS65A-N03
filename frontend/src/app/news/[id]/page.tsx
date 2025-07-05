'use client';

import { useParams } from 'next/navigation';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PublicHeader from '@/components/PublicHeader';
import PublicNewsCard from '@/components/PublicNewsCard';
import { usePublicNewsById, usePublicNews } from '@/hooks/useNews';
import { formatDate } from '@/utils/format';
import Loading from '@/components/Loading';
import Link from 'next/link';
import Image from 'next/image';
import type { NewsItem } from '@/types/api';
import { useEffect } from 'react';
import { registerNewsView } from '@/services/api';

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;

  const { data: news, isLoading, error } = usePublicNewsById(newsId);
  const { data: publicNews = [] } = usePublicNews();

  // Registra a visualização da notícia apenas uma vez por sessão
  useEffect(() => {
    if (!newsId) return;
    if (typeof window === 'undefined') return;

    const STORAGE_KEY = 'viewedNewsIds';
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const viewedIds: string[] = stored ? JSON.parse(stored) : [];

    if (!viewedIds.includes(newsId)) {
      registerNewsView(newsId).catch((err) => {
        console.error('Erro ao registrar visualização da notícia:', err);
      });

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...viewedIds, newsId])
      );
    }
  }, [newsId]);

  // Filtrar notícias relacionadas (mesmo categoria, excluindo a atual)
  const relatedNews = Array.isArray(publicNews)
    ? publicNews
        .filter(
          (item: NewsItem) =>
            item.id !== newsId &&
            item.status === 'APPROVED' &&
            item.published &&
            item.categories?.some((cat) =>
              news?.categories?.some((newsCat) => newsCat.id === cat.id)
            )
        )
        .slice(0, 3)
    : [];

  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </main>
      </div>
    );
  }

  if (error || !news || news.status !== 'APPROVED' || !news.published) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-medium text-lg mb-2">
              Notícia não encontrada
            </h3>
            <p className="text-red-600 mb-4">
              A notícia que você está procurando não foi encontrada ou não está
              disponível.
            </p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">
            News
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {news.title.length > 50
              ? `${news.title.substring(0, 50)}...`
              : news.title}
          </span>
        </nav>

        <article className="space-y-8">
          {/* Título e metadados */}
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {news.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published on {formatDate(news.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Author: {news.author.name}</span>
              </div>
            </div>

            {/* Categorias */}
            {news.categories && news.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {news.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Imagem principal */}
          <div className="w-full">
            <Card className="overflow-hidden">
              <div className={`h-96 ${getRandomGradient()}`}>
                {news.imageUrl ? (
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-8xl font-bold opacity-20">
                      {news.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Conteúdo */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {news.text}
              </div>
            </div>
          </div>

          {/* Tags */}
          {news.tagsKeywords && news.tagsKeywords.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {news.tagsKeywords.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Notícias relacionadas */}
        {relatedNews.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relatedNewsItem) => (
                <PublicNewsCard
                  key={relatedNewsItem.id}
                  news={relatedNewsItem}
                />
              ))}
            </div>
          </section>
        )}

        {/* Botão de voltar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
