import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BaseError } from '../errors/BaseError';
import { InternalServerError } from '../errors/InternalServerError';

const normalizeError = (error: Error) => {
  if (error instanceof BaseError) {
    return error;
  }
  return new InternalServerError(error);
};

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(error);
  }

  const normalizedError = normalizeError(error);

  const statusCode = normalizedError.statusCode;
  const body = normalizedError.getBody();

  res.status(statusCode).json(body);
};
