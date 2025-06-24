import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Formato de email inválido'),
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Formato de email inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  }),
});
