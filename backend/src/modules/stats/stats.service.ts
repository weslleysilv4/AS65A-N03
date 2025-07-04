import prisma from "../../shared/lib/prisma";

/**
 * Busca estatísticas gerais de notícias.
 *
 * @returns {Promise<Object>} Estatísticas de notícias
 */
export const getNewsStats = async () => {
  const [totalNews, publishedNews, pendingNews, rejectedNews, archivedNews] =
    await Promise.all([
      prisma.news.count(),
      prisma.news.count({
        where: {
          status: "APPROVED",
          published: true,
        },
      }),
      prisma.news.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.news.count({
        where: {
          status: "REJECTED",
        },
      }),
      prisma.news.count({
        where: {
          status: "ARCHIVED",
        },
      }),
    ]);

  return {
    totalNews,
    publishedNews,
    draftNews: pendingNews, // Mapeando para o esperado pelo frontend
    scheduledNews: 0, // Não implementado ainda
    expiredNews: archivedNews,
    pendingNews,
    rejectedNews,
  };
};

/**
 * Busca estatísticas de categorias.
 *
 * @returns {Promise<Object>} Estatísticas de categorias
 */
export const getCategoryStats = async () => {
  const totalCategories = await prisma.category.count();

  const categoriesWithCount = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          news: true,
        },
      },
    },
  });

  const newsPerCategory = categoriesWithCount.reduce((acc, category) => {
    acc[category.name] = category._count.news;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCategories,
    newsPerCategory,
  };
};
