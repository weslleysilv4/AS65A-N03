import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { categorySchema } from './categories.schema';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './categories.service';

export const createCategoryHandler: RequestHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    if (!req.body) {
      res.status(400).json({ error: 'Dados não informados' });
    }

    const data = categorySchema.parse(req.body);
    const category = await createCategory(data);

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      category,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
};

export const getAllCategoriesHandler: RequestHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({
      message: 'Categorias encontradas com sucesso',
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

export const getCategoryByIdHandler: RequestHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.status(200).json({
      message: 'Categoria encontrada com sucesso',
      category,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
};

export const updateCategoryHandler: RequestHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = categorySchema.partial().parse(req.body);
    const category = await updateCategory(id, data);
    res.status(200).json({
      message: 'Categoria atualizada com sucesso',
      category,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

export const deleteCategoryHandler: RequestHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const category = await deleteCategory(id);

    res.status(200).json({
      message: 'Categoria deletada com sucesso',
      category,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir categoria' });
  }
};
