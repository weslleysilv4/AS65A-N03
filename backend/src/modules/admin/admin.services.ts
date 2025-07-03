import { Prisma } from "@prisma/client";
import prisma from "../../shared/lib/prisma";
import { InternalServerError } from "../../shared/errors/InternalServerError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

/**
 * Retrieves all pending changes in the system for admin review.
 *
 * @returns {Promise<Object[]>} Returns the list of pending changes
 * @throws {NotFoundError} Throws an error if no pending changes are found
 *
 * @example
 * ```typescript
 * const pendingChanges = await getPendingChanges();
 * ```
 */
export const getPendingChanges = async () => {
  const pendingChanges = await prisma.pendingChange.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      news: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!pendingChanges || pendingChanges.length === 0) {
    throw new NotFoundError('pendingChanges');
  }

  return pendingChanges;
};

/**
 * Approves a specific pending change and executes the creation/update logic.
 *
 * @param {string} changeId - The ID of the pending change to approve
 * @param {string} reviewerEmail - The email of the admin reviewing the change
 * @returns {Promise<Object>} Returns the updated pending change record
 * @throws {NotFoundError} Throws an error if the pending change is not found
 * @throws {InternalServerError} Throws an error if the approval process fails
 *
 * @example
 * ```typescript
 * const approvedChange = await approveChange('change-123', 'admin@example.com');
 * ```
 */
export const approveChange = async (changeId: string, reviewerEmail: string) => {
  const pendingChange = await prisma.pendingChange.findUnique({
    where: { id: changeId },
    include: {
      news: true,
    },
  });

  if (!pendingChange) {
    throw new NotFoundError('pendingChanges');
  }

  if (pendingChange.status !== 'PENDING') {
    throw new InternalServerError(
      new Error(),
      'Apenas mudanças pendentes podem ser aprovadas'
    );
  }

  const reviewer = await prisma.user.findUnique({
    where: { email: reviewerEmail },
  });

  if (!reviewer) {
    throw new InternalServerError(
      new Error(),
      'Usuário revisor não encontrado no sistema'
    );
  }

  try {
    // Update the pending change status first
    const updatedChange = await prisma.pendingChange.update({
      where: { id: changeId },
      data: {
        status: 'APPROVED',
        reviewerId: reviewer.id,
        updatedAt: new Date(),
      },
    });

    // Execute the change based on type
    if (pendingChange.type === 'CREATE') {
      const newsData = pendingChange.content as any;
      let validCategoryIds: string[] = [];
      if (newsData.categoryIds && newsData.categoryIds.length > 0) {
        const existingCategories = await prisma.category.findMany({
          where: { id: { in: newsData.categoryIds } },
        });
        validCategoryIds = existingCategories.map(cat => cat.id);
      }
      
      const newNews = await prisma.news.create({
        data: {
          title: newsData.title,
          text: newsData.text,
          tagsKeywords: newsData.tagsKeywords || [],
          expirationDate: newsData.expirationDate ? new Date(newsData.expirationDate) : null,
          status: 'APPROVED',
          published: true,
          publishedAt: new Date(),
          authorId: pendingChange.authorId,
          revisorId: reviewer.id,
          revisionDate: new Date(),
          categories: validCategoryIds.length > 0 ? {
            connect: validCategoryIds.map((id: string) => ({ id })),
          } : undefined,
          media: newsData.media && newsData.media.length > 0 ? {
            create: newsData.media.map((media: any) => ({
              url: media.url,
              path: media.path,
              alt: media.alt,
              title: media.title,
              description: media.description,
              caption: media.caption,
              copyright: media.copyright,
              type: media.type,
              order: media.order,
            })),
          } : undefined,
        },
      });

      await prisma.pendingChange.update({
        where: { id: changeId },
        data: { newsId: newNews.id },
      });

      return { ...updatedChange, createdNews: newNews };
    } else if (pendingChange.type === 'UPDATE') {
      const newsData = pendingChange.content as any;
      
      let validCategoryIds: string[] = [];
      if (newsData.categoryIds && newsData.categoryIds.length > 0) {
        const existingCategories = await prisma.category.findMany({
          where: { id: { in: newsData.categoryIds } },
        });
        validCategoryIds = existingCategories.map(cat => cat.id);
      }
      
      const updatedNews = await prisma.news.update({
        where: { id: pendingChange.newsId! },
        data: {
          title: newsData.title,
          text: newsData.text,
          tagsKeywords: newsData.tagsKeywords,
          expirationDate: newsData.expirationDate ? new Date(newsData.expirationDate) : null,
          status: 'APPROVED',
          revisorId: reviewer.id,
          revisionDate: new Date(),
          published: newsData.published !== undefined ? newsData.published : true,
          publishedAt: newsData.publishedAt ? new Date(newsData.publishedAt) : new Date(),
          mainPageDisplayDate: newsData.mainPageDisplayDate ? new Date(newsData.mainPageDisplayDate) : null,
          newsListPageDate: newsData.newsListPageDate ? new Date(newsData.newsListPageDate) : null,
          categories: validCategoryIds.length > 0 ? {
            set: [],
            connect: validCategoryIds.map((id: string) => ({ id })),
          } : undefined,
        },
      });

      return { ...updatedChange, updatedNews };
    }

    return updatedChange;
  } catch (error) {
    throw new InternalServerError(
      error as Error,
      'Falha ao aprovar a mudança'
    );
  }
};

/**
 * Rejects a specific pending change with a reason.
 *
 * @param {string} changeId - The ID of the pending change to reject
 * @param {string} reviewerEmail - The email of the admin reviewing the change
 * @param {string} rejectionReason - The reason for rejection
 * @returns {Promise<Object>} Returns the updated pending change record
 * @throws {NotFoundError} Throws an error if the pending change is not found
 * @throws {InternalServerError} Throws an error if the rejection process fails
 *
 * @example
 * ```typescript
 * const rejectedChange = await rejectChange('change-123', 'admin@example.com', 'Conteúdo inadequado');
 * ```
 */
export const rejectChange = async (
  changeId: string,
  reviewerEmail: string,
  rejectionReason: string
) => {
  const pendingChange = await prisma.pendingChange.findUnique({
    where: { id: changeId },
  });

  if (!pendingChange) {
    throw new NotFoundError('pendingChanges');
  }

  if (pendingChange.status !== 'PENDING') {
    throw new InternalServerError(
      new Error(),
      'Apenas mudanças pendentes podem ser rejeitadas'
    );
  }

  const reviewer = await prisma.user.findUnique({
    where: { email: reviewerEmail },
  });

  if (!reviewer) {
    throw new InternalServerError(
      new Error(),
      'Usuário revisor não encontrado no sistema'
    );
  }

  try {
    const rejectedChange = await prisma.pendingChange.update({
      where: { id: changeId },
      data: {
        status: 'REJECTED',
        rejectionReason,
        reviewerId: reviewer.id,
        updatedAt: new Date(),
      },
    });

    return rejectedChange;
  } catch (error) {
    throw new InternalServerError(
      error as Error,
      'Falha ao rejeitar a mudança'
    );
  }
};

/**
 * Retrieves all news articles in the system with optional filtering.
 *
 * @param {Object} filters - Optional filters for the news list
 * @param {string} filters.status - Filter by news status
 * @param {number} filters.page - Page number for pagination
 * @param {number} filters.limit - Number of items per page
 * @returns {Promise<Object>} Returns the list of news articles with pagination
 * @throws {NotFoundError} Throws an error if no news articles are found
 *
 * @example
 * ```typescript
 * const news = await getAllNews({ status: 'PENDING', page: 1, limit: 10 });
 * ```
 */
export const getAllNews = async (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.NewsWhereInput = {};
  if (filters?.status) {
    whereClause.status = filters.status as any;
  }

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        revisor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        media: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.news.count({ where: whereClause }),
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
 * Updates a news article directly by an admin (hotfix).
 *
 * @param {string} newsId - The ID of the news article to update
 * @param {Object} newsData - The updated news data
 * @param {string} adminEmail - The email of the admin making the update
 * @returns {Promise<Object>} Returns the updated news article
 * @throws {NotFoundError} Throws an error if the news article is not found
 * @throws {InternalServerError} Throws an error if the update process fails
 *
 * @example
 * ```typescript
 * const updatedNews = await updateNewsDirectly('news-123', { title: 'New Title' }, 'admin@example.com');
 * ```
 */
export const updateNewsDirectly = async (
  newsId: string,
  newsData: any,
  adminEmail: string
) => {
  const existingNews = await prisma.news.findUnique({
    where: { id: newsId },
  });

  if (!existingNews) {
    throw new NotFoundError('news');
  }

  // Find the admin user by email
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    throw new InternalServerError(
      new Error(),
      'Usuário administrador não encontrado no sistema'
    );
  }

  try {
    const updateData: Prisma.NewsUpdateInput = {
      title: newsData.title,
      text: newsData.text,
      tagsKeywords: newsData.tagsKeywords,
      expirationDate: newsData.expirationDate ? new Date(newsData.expirationDate) : null,
      status: newsData.status,
      published: newsData.published,
      publishedAt: newsData.publishedAt ? new Date(newsData.publishedAt) : null,
      mainPageDisplayDate: newsData.mainPageDisplayDate ? new Date(newsData.mainPageDisplayDate) : null,
      newsListPageDate: newsData.newsListPageDate ? new Date(newsData.newsListPageDate) : null,
      revisor: {
        connect: { id: admin.id },
      },
      revisionDate: new Date(),
    };

    // Handle categories update if provided
    if (newsData.categoryIds && newsData.categoryIds.length > 0) {
      // Validate categories exist before connecting
      const existingCategories = await prisma.category.findMany({
        where: { id: { in: newsData.categoryIds } },
      });
      
      if (existingCategories.length !== newsData.categoryIds.length) {
        throw new InternalServerError(
          new Error(),
          'Uma ou mais categorias não foram encontradas'
        );
      }

      updateData.categories = {
        set: [],
        connect: newsData.categoryIds.map((id: string) => ({ id })),
      };
    }

    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        revisor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        media: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return updatedNews;
  } catch (error) {
    throw new InternalServerError(
      error as Error,
      'Falha ao atualizar a notícia'
    );
  }
};