import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { categorySchema } from './categories.schema';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './categories.service';

export async function createCategoryHandler(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Dados não informados' });
    }

    const data = categorySchema.parse(req.body);
    const category = await createCategory(data);

    return res.status(201).json({
      message: 'Categoria criada com sucesso',
      category,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao criar categoria' });
  }
}

export async function getAllCategoriesHandler(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  try {
    const categories = await getAllCategories();
    return res.status(200).json({
      message: 'Categorias encontradas com sucesso',
      categories,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}

export async function getCategoryByIdHandler(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    return res.status(200).json({
      message: 'Categoria encontrada com sucesso',
      category,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
}

export async function updateCategoryHandler(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  try {
    const { id } = req.params;

    const data = categorySchema.partial().parse(req.body);
    const category = await updateCategory(id, data);
    return res.status(200).json({
      message: 'Categoria atualizada com sucesso',
      category,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
}

export async function deleteCategoryHandler(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  try {
    const { id } = req.params;

    const category = await deleteCategory(id);

    return res.status(200).json({
      message: 'Categoria deletada com sucesso',
      category,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir categoria' });
  }
}
