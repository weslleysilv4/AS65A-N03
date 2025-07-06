import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

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
      // Log dos dados recebidos para debug
      console.log("=== DADOS RECEBIDOS PARA VALIDAÇÃO ===");
      console.log("Body:", JSON.stringify(req.body, null, 2));
      console.log("Query:", JSON.stringify(req.query, null, 2));
      console.log("Params:", JSON.stringify(req.params, null, 2));
      console.log("=====================================");

      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("=== ERRO DE VALIDAÇÃO ===");
        console.log("Errors:", JSON.stringify(error.errors, null, 2));
        console.log("========================");

        res.status(400).json({
          message: "Erro de validação",
          errors: error.errors,
        });

        return;
      }

      next(error);
    }
  };
