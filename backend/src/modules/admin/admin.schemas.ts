import { z } from 'zod';

export const rejectChangeSchema = z.object({
  body: z.object({
    rejectionReason: z
      .string({ required_error: 'O motivo da rejeição é obrigatório.' })
      .min(1, 'O motivo da rejeição não pode estar vazio.')
      .max(500, 'O motivo da rejeição não pode ter mais de 500 caracteres.'),
  }),
});

export const updateNewsSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título não pode estar vazio.').optional(),
    text: z.string().min(1, 'O texto não pode estar vazio.').optional(),
    tagsKeywords: z.array(z.string()).optional(),
    expirationDate: z
      .string()
      .datetime({ message: 'Formato de data de expiração inválido.' })
      .optional()
      .nullable(),
    categoryIds: z
      .array(z.string().uuid({ message: 'ID de categoria inválido.' }))
      .min(1, 'Pelo menos uma categoria é necessária.')
      .optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']).optional(),
    published: z.boolean().optional(),
    publishedAt: z
      .string()
      .datetime({ message: 'Formato de data de publicação inválido.' })
      .optional()
      .nullable(),
    mainPageDisplayDate: z
      .string()
      .datetime({
        message: 'Formato de data de exibição na página principal inválido.',
      })
      .optional()
      .nullable(),
    newsListPageDate: z
      .string()
      .datetime({
        message: 'Formato de data de exibição na lista de notícias inválido.',
      })
      .optional()
      .nullable(),
  }),
});

export const listNewsQuerySchema = z.object({
  query: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']).optional(),
    page: z.string().regex(/^\d+$/, 'Página deve ser um número.').optional(),
    limit: z.string().regex(/^\d+$/, 'Limite deve ser um número.').optional(),
  }),
});
