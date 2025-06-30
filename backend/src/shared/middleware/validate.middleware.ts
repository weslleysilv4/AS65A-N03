import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware for request validation using a Zod schema.
 *
 * @param {AnyZodObject} schema - The Zod schema to be used for validation.
 * @returns {Function} Express middleware that validates request body, query, and params.
 *
 * If validation fails, returns status 400 with validation errors.
 * Otherwise, calls the next middleware.
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Erro de validação',
          errors: error.errors,
        });

        return;
      }

      next(error);
    }
  };
