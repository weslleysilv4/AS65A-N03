import { z } from "zod";

// Schema customizado para datas que podem ser strings vazias
const optionalDateString = z
  .string()
  .optional()
  .nullable()
  .transform((val) => {
    if (val === "" || val === null || val === undefined) {
      return null;
    }
    return val;
  })
  .pipe(
    z
      .string()
      .refine(
        (val) => {
          if (val === null) return true;
          const datetimeLocalRegex =
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{3}Z?)?$/;
          return datetimeLocalRegex.test(val);
        },
        { message: "Formato de data inválido. Use YYYY-MM-DDTHH:mm" }
      )
      .nullable()
  );

const mediaSchema = z.object({
  url: z.string().url({ message: "URL da mídia inválida." }),
  path: z.string({
    required_error: "O caminho do arquivo de mídia é obrigatório.",
  }),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  caption: z.string().optional(),
  copyright: z.string().optional(),
  type: z.enum(["IMAGE", "VIDEO", "EXTERNAL_LINK"], {
    required_error: "O tipo da mídia é obrigatório.",
  }),
  order: z
    .number({ required_error: "A ordem da mídia é obrigatória." })
    .int()
    .positive(),
});

export const createNewsSchema = z.object({
  body: z.object({
    type: z.literal("CREATE"),
    content: z.object({
      title: z
        .string({ required_error: "O título é obrigatório." })
        .min(1, "O título não pode estar vazio."),
      text: z
        .string({ required_error: "O texto é obrigatório." })
        .min(1, "O texto não pode estar vazio."),
      tagsKeywords: z.array(z.string()).optional().default([]),
      expirationDate: optionalDateString,
      categoryIds: z
        .array(z.string().uuid({ message: "ID de categoria inválido." }))
        .optional(),
      media: z.array(mediaSchema).optional().default([]),
      publishedAt: optionalDateString,
      mainPageDisplayDate: optionalDateString,
      newsListPageDate: optionalDateString,
    }),
  }),
});

export const updateNewsSchema = z.object({
  body: z.object({
    type: z.literal("UPDATE"),
    newsId: z.string().uuid({ message: "ID da notícia inválido." }),
    content: z.object({
      title: z.string().min(1, "O título não pode estar vazio.").optional(),
      text: z.string().min(1, "O texto não pode estar vazio.").optional(),
      tagsKeywords: z.array(z.string()).optional(),
      expirationDate: optionalDateString,
      categoryIds: z
        .array(z.string().uuid({ message: "ID de categoria inválido." }))
        .min(1, "Pelo menos uma categoria é necessária.")
        .optional(),
      media: z.array(mediaSchema).optional(),
      status: z
        .enum(["PENDING", "APPROVED", "REJECTED", "ARCHIVED"])
        .optional(),
      published: z.boolean().optional(),
      mainPageDisplayDate: optionalDateString,
      newsListPageDate: optionalDateString,
    }),
  }),
});
