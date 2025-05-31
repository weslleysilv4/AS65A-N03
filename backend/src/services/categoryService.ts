import prisma from '../prisma/client'
import { Category } from "@prisma/client";

export async function createCategory(data: Pick<Category, 'name'>) {
  return prisma.category.create({data});
};

export async function getAllCategories() {
  return prisma.category.findMany();
};

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: {id} });
};

export async function updateCategory(id: string, data: Partial<Pick<Category, "name">>) {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: { id },
  });
};

