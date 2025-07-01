import { Prisma } from '@prisma/client';
import prisma from '../../shared/lib/prisma';
import { InternalServerError } from '../../shared/errors/InternalServerError';
import { NotFoundError } from '../../shared/errors/NotFoundError';

/**
 * Retrieves all news articles that are published by a specific author.
 *
 * @param {string} authorId - The ID of the author to retrieve published news for
 * @returns {Promise<Object>} Returns the list of published news articles
 * @throws {NotFoundError} Throws an error if no published news is found
 *
 * @example
 * ```typescript
 * const publishedNews = await getPublishedNews('user-123');
 * ```
 */
export const getPublishedNews = async (authorId: string) => {
  const publishedNews = await prisma.news.findMany({
    where: {
      authorId,
      publishedAt: {
        lt: new Date(),
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  if (!publishedNews || publishedNews.length === 0) {
    throw new NotFoundError('news');
  }

  return publishedNews;
};

/**
 * Retrieves all pending changes for a specific author.
 *
 * @param {string} authorId - The ID of the author to retrieve pending changes for
 * @returns {Promise<Object>} Returns the list of pending changes
 * @throws {NotFoundError} Throws an error if no pending changes are found
 *
 * @example
 * ```typescript
 * const pendingChanges = await getPendingChanges('user-123');
 * ```
 */
export const getPendingChanges = async (authorId: string) => {
  const pendingChanges = await prisma.pendingChange.findMany({
    where: {
      authorId,
      status: 'PENDING',
    },
  });

  if (!pendingChanges || pendingChanges.length === 0) {
    throw new NotFoundError('pendingChanges');
  }

  return pendingChanges;
};

/**
 * Requests the creation of a new news article by creating a pending change record.
 *
 * @param {string} authorId - The ID of the user requesting the news creation
 * @param {Prisma.PendingChangeCreateInput['content']} newsData - The news data to be created
 * @returns {Promise<Object>} Returns the created pending change record
 * @throws {InternalServerError} Throws an error if the creation request fails
 *
 * @example
 * ```typescript
 * const creationRequest = await requestNewsCreation(
 *   'user-123',
 *   { title: 'New Article', text: 'Article content' }
 * );
 * ```
 */
export const requestNewsCreation = async (
  authorId: string,
  newsData: Prisma.PendingChangeCreateInput['content']
) => {
  const newsRequest = await prisma.pendingChange.create({
    data: {
      authorId,
      type: 'CREATE',
      status: 'PENDING',
      content: newsData,
    },
  });

  console.log(newsRequest);

  if (!newsRequest) {
    throw new InternalServerError(
      new Error(),
      'Falha ao solicitar criação de notícia'
    );
  }

  return newsRequest;
};

/**
 * Requests an update for an existing news article by creating a pending change record.
 *
 * @param {string} authorId - The ID of the user requesting the update
 * @param {string} newsId - The ID of the news article to be updated
 * @param {Prisma.PendingChangeCreateInput['content']} newsData - The updated news data to be applied
 * @returns {Promise<Object>} Returns the created pending change record
 * @throws {InternalServerError} Throws an error if the update request creation fails
 *
 * @example
 * ```typescript
 * const updateRequest = await requestNewsUpdate(
 *   'user-123',
 *   'news-456',
 *   { title: 'Updated Title', text: 'Updated content' }
 * );
 * ```
 */
export const requestNewsUpdate = async (
  authorId: string,
  newsId: string,
  newsData: Prisma.PendingChangeCreateInput['content']
) => {
  const newsUpdateRequest = await prisma.pendingChange.create({
    data: {
      authorId,
      newsId,
      type: 'UPDATE',
      status: 'PENDING',
      content: newsData,
    },
  });

  if (!newsUpdateRequest) {
    throw new InternalServerError(
      new Error(),
      'Falha ao solicitar atualização de notícia'
    );
  }

  return newsUpdateRequest;
};
