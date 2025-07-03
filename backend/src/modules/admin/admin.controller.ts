import * as adminService from './admin.services';
import { RequestHandler } from 'express';

/**
 * Handles the request to get all pending changes for admin review.
 *
 * @param {RequestHandler} req - Express request object
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
  try {
    const pendingChanges = await adminService.getPendingChanges();
    res.status(200).json({
      message: 'Mudanças pendentes recuperadas com sucesso',
      data: pendingChanges,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the request to approve a specific pending change.
 *
 * @param {RequestHandler} req - Express request object containing the change ID and user information
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with the approval status
 *
 * @throws {500} When an internal server error occurs
 *
 * @example
 * ```typescript
 * const approvedChange = await approveChangeHandler(req, res, next);
 * ```
 */
export const approveChangeHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id: changeId } = req.params;
  const user = req.user;

  if (!user.email) {
    return next(new Error('Email do usuário não encontrado'));
  }

  try {
    const approvedChange = await adminService.approveChange(changeId, user.email);
    res.status(200).json({
      message: 'Mudança aprovada com sucesso',
      data: approvedChange,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the request to reject a specific pending change.
 *
 * @param {RequestHandler} req - Express request object containing the change ID, rejection reason, and user information
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with the rejection status
 *
 * @throws {500} When an internal server error occurs
 *
 * Expected request body:
 * - rejectionReason: string (reason for rejection)
 *
 * Success response (200):
 * - message: string (success message)
 * - data: object (rejected change record)
 *
 * @example
 * ```typescript
 * const rejectedChange = await rejectChangeHandler(req, res, next);
 * ```
 */
export const rejectChangeHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id: changeId } = req.params;
  const { rejectionReason } = req.body;
  const user = req.user;

  if (!user.email) {
    return next(new Error('Email do usuário não encontrado'));
  }

  try {
    const rejectedChange = await adminService.rejectChange(
      changeId,
      user.email,
      rejectionReason
    );
    res.status(200).json({
      message: 'Mudança rejeitada com sucesso',
      data: rejectedChange,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the request to get all news articles with optional filtering.
 *
 * @param {RequestHandler} req - Express request object containing query parameters
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with the news articles and pagination
 *
 * @throws {500} When an internal server error occurs
 *
 * Expected query parameters:
 * - status: string (optional, filter by news status)
 * - page: string (optional, page number for pagination)
 * - limit: string (optional, number of items per page)
 *
 * Success response (200):
 * - message: string (success message)
 * - data: object (news articles and pagination info)
 *
 * @example
 * ```typescript
 * const news = await getAllNewsHandler(req, res, next);
 * ```
 */
export const getAllNewsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const { status, page, limit } = req.query;

  try {
    const filters = {
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const result = await adminService.getAllNews(filters);
    res.status(200).json({
      message: 'Notícias recuperadas com sucesso',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the request to update a news article directly by an admin (hotfix).
 *
 * @param {RequestHandler} req - Express request object containing the news ID, update data, and user information
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Returns a JSON response with the updated news article
 *
 * @throws {500} When an internal server error occurs
 *
 * Expected request body:
 * - title: string (optional, updated title)
 * - text: string (optional, updated text)
 * - tagsKeywords: string[] (optional, updated tags)
 * - expirationDate: string (optional, updated expiration date)
 * - categoryIds: string[] (optional, updated category IDs)
 * - status: string (optional, updated status)
 * - published: boolean (optional, updated published status)
 * - publishedAt: string (optional, updated published date)
 * - mainPageDisplayDate: string (optional, updated main page display date)
 * - newsListPageDate: string (optional, updated news list page date)
 *
 * Success response (200):
 * - message: string (success message)
 * - data: object (updated news article)
 *
 * @example
 * ```typescript
 * const updatedNews = await updateNewsDirectlyHandler(req, res, next);
 * ```
 */
export const updateNewsDirectlyHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id: newsId } = req.params;
  const newsData = req.body;
  const user = req.user;

  if (!user.email) {
    return next(new Error('Email do usuário não encontrado'));
  }

  try {
    const updatedNews = await adminService.updateNewsDirectly(
      newsId,
      newsData,
      user.email
    );
    res.status(200).json({
      message: 'Notícia atualizada com sucesso',
      data: updatedNews,
    });
  } catch (error) {
    next(error);
  }
};