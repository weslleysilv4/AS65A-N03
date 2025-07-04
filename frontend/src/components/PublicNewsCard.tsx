"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";
import { Eye, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/types/api";

interface PublicNewsCardProps {
  news: NewsItem;
}

export default function PublicNewsCard({ news }: PublicNewsCardProps) {
  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-green-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-pink-600",
      "bg-gradient-to-br from-orange-500 to-red-600",
      "bg-gradient-to-br from-teal-500 to-cyan-600",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <Link href={`/news/${news.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        <div className="relative">
          {/* Imagem ou placeholder colorido */}
          <div className={`h-48 rounded-t-lg ${getRandomGradient()}`}>
            {news.imageUrl ? (
              <Image
                src={news.imageUrl}
                alt={news.title}
                width={400}
                height={200}
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-20">
                  {news.title.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Título */}
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {news.title}
            </h3>

            {/* Descrição */}
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {news.text.length > 150
                ? `${news.text.substring(0, 150)}...`
                : news.text}
            </p>

            {/* Metadados */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(news.createdAt)}</span>
              </div>

              {news.viewCount && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{news.viewCount}</span>
                </div>
              )}
            </div>

            {/* Categorias */}
            {news.categories && news.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {news.categories.slice(0, 2).map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {category.name}
                  </Badge>
                ))}
                {news.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{news.categories.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Botão de leitura */}
            <div className="pt-2">
              <div className="inline-flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
                Ler Mais
                <svg
                  className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
