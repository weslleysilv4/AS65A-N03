"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  label?: string;
  placeholder?: string;
  maxSelections?: number;
  required?: boolean;
}

export default function CategorySelector({
  selectedCategories,
  onCategoriesChange,
  label = "Categorias",
  placeholder = "Selecione as categorias",
  maxSelections,
  required = false,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories = [], isLoading } = useCategories();

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedCategories.includes(category.id)
  );

  const selectedCategoryObjects = categories.filter((category) =>
    selectedCategories.includes(category.id)
  );

  const handleCategorySelect = (categoryId: string) => {
    if (maxSelections && selectedCategories.length >= maxSelections) {
      return;
    }

    const newCategories = [...selectedCategories, categoryId];
    onCategoriesChange(newCategories);
    setSearchTerm("");
  };

  const handleCategoryRemove = (categoryId: string) => {
    const newCategories = selectedCategories.filter((id) => id !== categoryId);
    onCategoriesChange(newCategories);
  };

  const canSelectMore =
    !maxSelections || selectedCategories.length < maxSelections;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded border"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Selected Categories */}
      {selectedCategoryObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedCategoryObjects.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {category.name}
              <button
                type="button"
                onClick={() => handleCategoryRemove(category.id)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
          disabled={!canSelectMore}
        >
          <span className="text-gray-500">
            {selectedCategories.length === 0
              ? placeholder
              : `${selectedCategories.length} categoria${
                  selectedCategories.length !== 1 ? "s" : ""
                } selecionada${selectedCategories.length !== 1 ? "s" : ""}`}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>

        {isOpen && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
            <CardContent className="p-3">
              {/* Search Input */}
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder="Buscar categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Categories List */}
              <div className="space-y-1">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {searchTerm ? (
                      <>
                        <p>Nenhuma categoria encontrada</p>
                        <p className="text-xs mt-1">
                          Tente ajustar sua pesquisa
                        </p>
                      </>
                    ) : (
                      <>
                        <p>Todas as categorias já foram selecionadas</p>
                        <p className="text-xs mt-1">
                          ou nenhuma categoria disponível
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2 text-sm"
                    >
                      <Plus className="h-3 w-3 text-gray-400" />
                      {category.name}
                      {category.description && (
                        <span className="text-gray-500 text-xs ml-auto">
                          {category.description}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Info Text */}
              {maxSelections && (
                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  {selectedCategories.length} de {maxSelections} selecionadas
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-5" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
