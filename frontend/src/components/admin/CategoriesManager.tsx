"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewsCategory } from "@/types/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CategoryFormData {
  name: string;
  description?: string;
}

export default function CategoriesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(
    null
  );
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });

  const { data: categories = [], isLoading, error } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: { ...formData, id: editingCategory.id },
        });
        setEditingCategory(null);
      } else {
        await createCategoryMutation.mutateAsync(formData);
        setIsCreating(false);
      }

      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  const handleEdit = (category: NewsCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsCreating(false);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const isFormVisible = isCreating || editingCategory;
  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">
          Erro ao carregar categorias
        </h3>
        <p className="text-red-600 text-sm mt-1">
          Não foi possível carregar as categorias. Tente novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as categorias utilizadas nas notícias
          </p>
        </div>
        {!isFormVisible && (
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredCategories.length} categoria
            {filteredCategories.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Form */}
      {isFormVisible && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Categoria *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Digite o nome da categoria"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva brevemente esta categoria (opcional)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Salvando..."
                    : editingCategory
                    ? "Atualizar"
                    : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                {searchTerm ? (
                  <>
                    <h3 className="font-medium mb-2">
                      Nenhuma categoria encontrada
                    </h3>
                    <p className="text-sm">
                      Tente ajustar sua pesquisa ou criar uma nova categoria.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-medium mb-2">
                      Nenhuma categoria criada
                    </h3>
                    <p className="text-sm mb-4">
                      Comece criando sua primeira categoria para organizar as
                      notícias.
                    </p>
                    <Button
                      onClick={() => setIsCreating(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Criar Primeira Categoria
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 mt-1 text-sm">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          Criada em{" "}
                          {format(
                            new Date(category.createdAt),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </span>
                        {category.updatedAt !== category.createdAt && (
                          <span>
                            Atualizada em{" "}
                            {format(
                              new Date(category.updatedAt),
                              "dd/MM/yyyy 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deleteCategoryMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
