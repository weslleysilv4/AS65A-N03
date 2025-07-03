import prisma from '../../shared/lib/prisma';
import { NotFoundError } from '../../shared/errors/NotFoundError';

/**
 * Lista todas as notícias publicadas, com paginação.
 *
 * @param {Object} filters - Filtros opcionais de paginação
 * @param {number} [filters.page=1] - Página atual
 * @param {number} [filters.limit=10] - Limite de itens por página
 * @returns {Promise<Object>} Lista de notícias e paginação
 * @throws {NotFoundError} Se não houver notícias publicadas
 *
 * @example
 * const result = await getPublishedNews({ page: 1, limit: 10 });
 */
export const getPublishedNews = async (
  filters?: {
    page?: number;
    limit?: number
  }) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: {
        status: 'APPROVED',
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true
          }
        },
        media: {
          orderBy: {
            order: 'asc'
          }
        },
      },
      orderBy: {
        publishedAt: 'desc'
      },
      skip,
      take: limit,
    }),
    prisma.news.count({
      where: {
        status: 'APPROVED',
        published: true
      }
    }),
  ]);

  if (!news || news.length === 0) {
    throw new NotFoundError('news');
  }

  return {
    news,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Busca uma notícia publicada pelo ID.
 *
 * @param {string} id - ID da notícia
 * @returns {Promise<Object>} Notícia encontrada
 * @throws {NotFoundError} Se a notícia não existir ou não estiver publicada
 *
 * @example
 * const news = await getPublishedNewsById('uuid');
 */
export const getPublishedNewsById = async (id: string) => {
  const news = await prisma.news.findUnique({
    where: {
      id,
      status: 'APPROVED',
      published: true
    },
    include: {
      author: {
        select: {
          id: true,
          name: true
        }
      },
      categories: {
        select: {
          id: true,
          name: true
        }
      },
      media: {
        orderBy: {
          order: 'asc'
        }
      },
    },
  });

  if (!news) {
    throw new NotFoundError('news');
  }

  return news;
}; 