"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { Tag, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CategoryListProps {
  variant?: "compact" | "detailed";
  limit?: number;
  showStats?: boolean;
}

export default function CategoryList({
  variant = "compact",
  limit,
  showStats = false,
}: CategoryListProps) {
  const { data: categories = [], isLoading, error } = useCategories();

  const displayCategories = limit ? categories.slice(0, limit) : categories;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <Tag className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Erro ao carregar categorias</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <Tag className="h-12 w-12 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">
            Nenhuma categoria encontrada
          </h3>
          <p className="text-sm text-gray-500">
            {variant === "compact"
              ? "Não há categorias para exibir."
              : "Comece criando suas primeiras categorias para organizar as notícias."}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {displayCategories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tag className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {format(new Date(category.createdAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </div>
          </div>
        ))}
        {limit && categories.length > limit && (
          <div className="text-center pt-2">
            <Badge variant="secondary">
              +{categories.length - limit} categoria
              {categories.length - limit !== 1 ? "s" : ""}
            </Badge>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {displayCategories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              {showStats && (
                <Badge variant="secondary" className="ml-4">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Ativa
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Criada em{" "}
                {format(new Date(category.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </div>
              {category.updatedAt !== category.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Atualizada em{" "}
                  {format(
                    new Date(category.updatedAt),
                    "dd/MM/yyyy 'às' HH:mm",
                    { locale: ptBR }
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
