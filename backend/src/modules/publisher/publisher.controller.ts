import * as publisherService from './publisher.service';
import { RequestHandler } from 'express';

/**
 * Handles the request to get all published news for a specific author.
 *
 * @param {RequestHandler} req - Express request object containing the user information
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with the published news
 *
 * @throws {500} When an internal server error occurs
 *
 * @example
 * ```typescript
 * const news = await getPublishedNewsHandler(req, res, next);
 * ```
 */
export const getPublishedNewsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const user = req.user;

  try {
    const news = await publisherService.getPublishedNews(user.id);
    res.status(200).json({
      message: 'Notícias publicadas',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the request to get all pending changes for a specific author.
 *
 * @param {RequestHandler} req - Express request object containing the user information
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with the pending changes
 *
 * @throws {500} When an internal server error occurs
 *
 * @example
 * ```typescript
 * const pendingChanges = await getPendingChangesHandler(req, res, next);
 * ```
 */
export const getPendingChangesHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const user = req.user;

  try {
    const pendingChanges = await publisherService.getPendingChanges(user.id);
    res.status(200).json({
      message: 'Notícias pendentes',
      data: pendingChanges,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles news creation requests by creating a pending change record.
 *
 * @param {RequestHandler} req - Express request object containing news creation data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with creation request status
 *
 * @throws {500} When an internal server error occurs
 *
 * Expected request body:
 * - authorId: string (ID of the user requesting the news creation)
 * - newsData: object (news data to be created)
 *
 * Success response (201):
 * - message: string (success message)
 * - newsRequest: object (created pending change record)
 */
export const requestNewsCreationHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const user = req.user;
  const newsData = req.body;

  try {
    const newsRequest = await publisherService.requestNewsCreation(
      user.id,
      newsData
    );

    res.status(201).json({
      message:
        'Pedido de criação enviado com sucesso, aguarde a aprovação do administrador',
      data: newsRequest,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Handles news update requests by creating a pending change record.
 *
 * @param {RequestHandler} req - Express request object containing news update data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with update request status
 *
 * @throws {500} When an internal server error occurs
 *
 * Expected request body:
 * - authorId: string (ID of the user requesting the news update)
 * - newsId: string (ID of the news article to be updated)
 * - newsData: object (updated news data to be applied)
 *
 * Success response (201):
 * - message: string (success message)
 * - newsRequest: object (created pending change record)
 */
export const requestNewsUpdateHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const user = req.user;
  const newsData = req.body;
  const { id: newsId } = req.params;
  try {
    const newsRequest = await publisherService.requestNewsUpdate(
      user.id,
      newsId,
      newsData
    );

    res.status(201).json({
      message:
        'Pedido de atualização enviado com sucesso, aguarde a aprovação do administrador',
      newsRequest,
    });
  } catch (error: any) {
    next(error);
  }
};
