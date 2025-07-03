import { z } from 'zod';

const mediaSchema = z.object({
  url: z.string().url({ message: 'URL da mídia inválida.' }),
  path: z.string({
    required_error: 'O caminho do arquivo de mídia é obrigatório.',
  }),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  caption: z.string().optional(),
  copyright: z.string().optional(),
  type: z.enum(['IMAGE', 'VIDEO', 'EXTERNAL_LINK'], {
    required_error: 'O tipo da mídia é obrigatório.',
  }),
  order: z
    .number({ required_error: 'A ordem da mídia é obrigatória.' })
    .int()
    .positive(),
});

export const createNewsSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'O título é obrigatório.' })
      .min(1, 'O título não pode estar vazio.'),
    text: z
      .string({ required_error: 'O texto é obrigatório.' })
      .min(1, 'O texto não pode estar vazio.'),
    tagsKeywords: z.array(z.string()).optional().default([]),
    expirationDate: z
      .string()
      .datetime({ message: 'Formato de data de expiração inválido.' })
      .optional()
      .nullable(),
    categoryIds: z
      .array(z.string().uuid({ message: 'ID de categoria inválido.' }))
      .min(1, 'Pelo menos uma categoria é necessária.'),
    media: z.array(mediaSchema).optional().default([]),
    publishedAt: z.coerce.date().optional(),
    mainPageDisplayDate: z.coerce.date().optional(),
    newsListPageDate: z.coerce.date().optional(),
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
    media: z.array(mediaSchema).optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']).optional(),
    published: z.boolean().optional(),
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
