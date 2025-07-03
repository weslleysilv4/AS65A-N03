import { z } from 'zod';

export const listPublishedNewsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'Página deve ser um número.').optional(),
    limit: z.string().regex(/^\d+$/, 'Limite deve ser um número.').optional(),
  }),
}); 