import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Acesso negado: Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res
      .status(401)
      .json({ message: 'Acesso negado: Token inválido ou expirado' });
  }

  (req as any).user = user;
  next();
};
