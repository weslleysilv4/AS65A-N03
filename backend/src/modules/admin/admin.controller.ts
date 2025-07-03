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