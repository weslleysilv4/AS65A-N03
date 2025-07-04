"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";
import { Eye, Calendar, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/types/api";

interface PublicNewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

export default function PublicNewsCard({
  news,
  featured = false,
}: PublicNewsCardProps) {
  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-green-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-pink-600",
      "bg-gradient-to-br from-orange-500 to-red-600",
      "bg-gradient-to-br from-teal-500 to-cyan-600",
      "bg-gradient-to-br from-indigo-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-rose-600",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (featured) {
    return (
      <Link href={`/news/${news.id}`} className="group block">
        <Card className="group-hover:shadow-2xl transition-all duration-500 cursor-pointer h-full overflow-hidden border-0 shadow-lg bg-white">
          <div className="relative">
            {/* Featured Image */}
            <div
              className={`h-80 ${getRandomGradient()} relative overflow-hidden`}
            >
              {news.imageUrl ? (
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-white text-8xl font-bold opacity-20">
                    {news.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  ⭐ Destaque
                </Badge>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Categories */}
              {news.categories && news.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {news.categories.slice(0, 3).map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      {category.name}
                    </Badge>
                  ))}
                  {news.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{news.categories.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                {news.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 line-clamp-3 leading-relaxed text-base">
                {news.text.length > 200
                  ? `${news.text.substring(0, 200)}...`
                  : news.text}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                  {news.viewCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{news.viewCount}</span>
                    </div>
                  )}
                </div>

                {/* Read More Button */}
                <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Ler Mais
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.id}`} className="group block">
      <Card className="group-hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-0 shadow-md bg-white hover:-translate-y-1">
        <div className="relative">
          {/* Regular Image */}
          <div
            className={`h-48 ${getRandomGradient()} relative overflow-hidden rounded-t-xl`}
          >
            {news.imageUrl ? (
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-5xl font-bold opacity-30">
                  {news.title.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Categories */}
            {news.categories && news.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {news.categories.slice(0, 2).map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
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

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {news.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {news.text.length > 120
                ? `${news.text.substring(0, 120)}...`
                : news.text}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(news.createdAt)}</span>
                </div>
                {news.viewCount !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{news.viewCount}</span>
                  </div>
                )}
              </div>

              {/* Read More Button */}
              <div className="inline-flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
                Ler
                <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
